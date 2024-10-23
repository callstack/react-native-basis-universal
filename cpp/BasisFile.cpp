#include "BasisFile.h"
#include <vector>
#include <stdexcept>
#include <cstring>

#define BASIS_MAGIC 0xDEADBEE1

using namespace basist;
using namespace basisu;

namespace facebook::react {

BasisFile::BasisFile(jsi::Runtime &rt, const jsi::ArrayBuffer& buffer) : m_file([&]() {
  size_t byteLength = buffer.size(rt);
  return basisu::vector<uint8_t>(byteLength);
}()), m_magic(0) {
  size_t byteLength = buffer.size(rt);
  m_file.resize(byteLength);
  std::memcpy(m_file.data(), buffer.data(rt), byteLength);
  
  if (!m_transcoder.validate_header(m_file.data(), m_file.size())) {
    throw std::runtime_error("Invalid Basis file header");
  }
  
  // Initialized after validation
  m_magic = BASIS_MAGIC;
}

uint32_t BasisFile::getHasAlpha() {
  if (m_magic != BASIS_MAGIC) return 0;
  
  basist::basisu_image_level_info li;
  if (!m_transcoder.get_image_level_info(m_file.data(), m_file.size(), li, 0, 0))
    return 0;
  
  return li.m_alpha_flag;
}

uint32_t BasisFile::getNumImages() {
  if (m_magic != BASIS_MAGIC) return 0;
  return m_transcoder.get_total_images(m_file.data(), m_file.size());
}

uint32_t BasisFile::getNumLevels(uint32_t image_index)
{
  assert(m_magic == BASIS_MAGIC);
  if (m_magic != BASIS_MAGIC)
    return 0;
  
  basisu_image_info ii;
  if (!m_transcoder.get_image_info(m_file.data(), m_file.size(), ii, image_index))
    return 0;
  
  return ii.m_total_levels;
}

uint32_t BasisFile::getImageTranscodedSizeInBytes(uint32_t image_index, uint32_t level_index, uint32_t format) {
  if (m_magic != BASIS_MAGIC) return 0;
  if (format >= static_cast<uint32_t>(basist::transcoder_texture_format::cTFTotalTextureFormats)) return 0;
  
  uint32_t orig_width, orig_height, total_blocks;
  if (!m_transcoder.get_image_level_desc(m_file.data(), m_file.size(), image_index, level_index, orig_width, orig_height, total_blocks))
    return 0;
  
  const basist::transcoder_texture_format transcoder_format = static_cast<basist::transcoder_texture_format>(format);
  
  if (basist::basis_transcoder_format_is_uncompressed(transcoder_format)) {
    const uint32_t bytes_per_pixel = basist::basis_get_uncompressed_bytes_per_pixel(transcoder_format);
    return orig_width * orig_height * bytes_per_pixel;
  } else {
    const uint32_t bytes_per_block = basist::basis_get_bytes_per_block_or_pixel(transcoder_format);
    
    if (transcoder_format == basist::transcoder_texture_format::cTFPVRTC1_4_RGB ||
        transcoder_format == basist::transcoder_texture_format::cTFPVRTC1_4_RGBA) {
      const uint32_t width = (orig_width + 3) & ~3;
      const uint32_t height = (orig_height + 3) & ~3;
      return (std::max(8U, width) * std::max(8U, height) * 4 + 7) / 8;
    }
    
    return total_blocks * bytes_per_block;
  }
}

bool BasisFile::isUASTC() {
  if (m_magic != BASIS_MAGIC) return false;
  return m_transcoder.get_tex_format(m_file.data(), m_file.size()) == basist::basis_tex_format::cUASTC4x4;
}

bool BasisFile::isHDR() {
  if (m_magic != BASIS_MAGIC) return false;
  return m_transcoder.get_tex_format(m_file.data(), m_file.size()) == basist::basis_tex_format::cUASTC_HDR_4x4;
}

uint32_t BasisFile::startTranscoding() {
  if (m_magic != BASIS_MAGIC) return 0;
  return m_transcoder.start_transcoding(m_file.data(), m_file.size());
}

uint32_t BasisFile::transcodeImage(jsi::Runtime& rt,
                                   jsi::Object& destination,
                                   uint32_t image_index,
                                   uint32_t level_index,
                                   uint32_t format,
                                   uint32_t unused,
                                   uint32_t get_alpha_for_opaque_formats) {
  
  assert(m_magic == BASIS_MAGIC);
  if (m_magic != BASIS_MAGIC)
    return 0;
  
  if (format >= (int)transcoder_texture_format::cTFTotalTextureFormats)
    return 0;
  
  const transcoder_texture_format transcoder_format = static_cast<transcoder_texture_format>(format);
  
  uint32_t orig_width, orig_height, total_blocks;
  if (!m_transcoder.get_image_level_desc(m_file.data(), m_file.size(), image_index, level_index, orig_width, orig_height, total_blocks))
    return 0;
  
  basisu::vector<uint8_t> dst_data;
  
  uint32_t flags = get_alpha_for_opaque_formats ? cDecodeFlagsTranscodeAlphaDataToOpaqueFormats : 0;
  
  uint32_t status;
  
  if (basis_transcoder_format_is_uncompressed(transcoder_format))
  {
    const uint32_t bytes_per_pixel = basis_get_uncompressed_bytes_per_pixel(transcoder_format);
    const uint32_t bytes_per_line = orig_width * bytes_per_pixel;
    const uint32_t bytes_per_slice = bytes_per_line * orig_height;
    
    dst_data.resize(bytes_per_slice);
    
    status = m_transcoder.transcode_image_level(
                                                m_file.data(), m_file.size(), image_index, level_index,
                                                dst_data.data(), orig_width * orig_height,
                                                transcoder_format,
                                                flags,
                                                orig_width,
                                                nullptr,
                                                orig_height);
  }
  else
  {
    uint32_t bytes_per_block = basis_get_bytes_per_block_or_pixel(transcoder_format);
    
    uint32_t required_size = total_blocks * bytes_per_block;
    
    if (transcoder_format == transcoder_texture_format::cTFPVRTC1_4_RGB || transcoder_format == transcoder_texture_format::cTFPVRTC1_4_RGBA)
    {
      // For PVRTC1, Basis only writes (or requires) total_blocks * bytes_per_block. But GL requires extra padding for very small textures:
      // https://www.khronos.org/registry/OpenGL/extensions/IMG/IMG_texture_compression_pvrtc.txt
      // The transcoder will clear the extra bytes followed the used blocks to 0.
      const uint32_t width = (orig_width + 3) & ~3;
      const uint32_t height = (orig_height + 3) & ~3;
      required_size = (std::max(8U, width) * std::max(8U, height) * 4 + 7) / 8;
      assert(required_size >= total_blocks * bytes_per_block);
    }
    
    dst_data.resize(required_size);
    
    status = m_transcoder.transcode_image_level(
                                                m_file.data(), m_file.size(), image_index, level_index,
                                                dst_data.data(), dst_data.size() / bytes_per_block,
                                                static_cast<basist::transcoder_texture_format>(format),
                                                flags);
  }
  
  auto arrayBuffer = destination.getArrayBuffer(rt);
  
  auto outputBuffer = jsi::ArrayBuffer(std::move(arrayBuffer));
  memcpy(outputBuffer.data(rt), dst_data.data(), dst_data.size());
  destination.setProperty(rt, jsi::PropNameID::forAscii(rt, "buffer"), outputBuffer);
  
  return status;
}

uint32_t BasisFile::getImageHeight(uint32_t image_index, uint32_t level_index) {
  if (m_magic != BASIS_MAGIC) return 0;
  
  uint32_t orig_width, orig_height, total_blocks;
  if (!m_transcoder.get_image_level_desc(m_file.data(), m_file.size(), image_index, level_index, orig_width, orig_height, total_blocks))
    return 0;
  
  return orig_height;
}

uint32_t BasisFile::getImageWidth(uint32_t image_index, uint32_t level_index) {
  assert(m_magic == BASIS_MAGIC);
  if (m_magic != BASIS_MAGIC)
    return 0;
  
  uint32_t orig_width, orig_height, total_blocks;
  if (!m_transcoder.get_image_level_desc(m_file.data(), m_file.size(), image_index, level_index, orig_width, orig_height, total_blocks))
    return 0;
  
  return orig_width;
}

void BasisFile::close() {
  assert(m_magic == BASIS_MAGIC);
  if (m_magic != BASIS_MAGIC)
    return;
  
  m_file.clear();
}

} // namespace facebook::react
