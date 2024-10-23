#include "KTX2File.h"
#include <cstring>
#include <cassert>

using namespace basist;
using namespace basisu;

namespace facebook::react {

// Based on: https://github.com/BinomialLLC/basis_universal/blob/7c046f89b2c417c70742979204109fd91006c2f2/webgl/transcoder/basis_wrappers.cpp#L536
KTX2File::KTX2File(jsi::Runtime &rt, const jsi::ArrayBuffer& buffer)
: m_file([&]() {
  size_t byteLength = buffer.size(rt);
  return basisu::vector<uint8_t>(byteLength);
}()),
m_is_valid(false),
m_magic(0)
{
  size_t length = buffer.size(rt);

  // Copy data directly from the input buffer to m_file
  std::memcpy(m_file.data(), buffer.data(rt), length);

  if (!m_transcoder.init(m_file.data(), m_file.size()))
  {
#if BASISU_DEBUG_PRINTF
    printf("m_transcoder.init() failed!\n");
#endif
    assert(0);
    m_file.clear();
  }

  m_is_valid = true;

  // Initialized after validation
  m_magic = KTX2_MAGIC;
}

bool KTX2File::isValid()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return false;

  return m_is_valid;
}

void KTX2File::close()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return;

  m_file.clear();
  m_transcoder.clear();
}

uint32_t KTX2File::getDFDSize()
{
  return m_transcoder.get_dfd().size();
}

bool KTX2File::hasKey(std::string key_name)
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return false;

  return m_transcoder.find_key(key_name) != nullptr;
}

uint32_t KTX2File::getTotalKeys()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;

  return m_transcoder.get_key_values().size();
}

std::string KTX2File::getKey(uint32_t index)
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return std::string("");

  return std::string((const char*)m_transcoder.get_key_values()[index].m_key.data());
}

uint32_t KTX2File::getKeyValueSize(std::string key_name)
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;

  const uint8_vec* p = m_transcoder.find_key(key_name);
  return p ? p->size() : 0;
}

uint32_t KTX2File::getWidth()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_width();
}

uint32_t KTX2File::getHeight()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_height();
}

uint32_t KTX2File::getFaces()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_faces();
}

uint32_t KTX2File::getLayers()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_layers();
}

uint32_t KTX2File::getLevels()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_levels();
}

uint32_t KTX2File::getFormat()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return (uint32_t)m_transcoder.get_format();
}

bool KTX2File::isUASTC()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return false;
  return m_transcoder.is_uastc();
}

bool KTX2File::isETC1S()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return false;
  return m_transcoder.is_etc1s();
}

bool KTX2File::isHDR()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return false;
  return m_transcoder.is_hdr();
}

bool KTX2File::getHasAlpha()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return false;
  return m_transcoder.get_has_alpha();
}

uint32_t KTX2File::getDFDColorModel()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_dfd_color_model();
}

uint32_t KTX2File::getDFDColorPrimaries()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_dfd_color_primaries();
}

uint32_t KTX2File::getDFDTransferFunc()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_dfd_transfer_func();
}

uint32_t KTX2File::getDFDFlags()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_dfd_flags();
}

uint32_t KTX2File::getDFDTotalSamples()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_dfd_total_samples();
}

uint32_t KTX2File::getDFDChannelID0()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_dfd_channel_id0();
}

uint32_t KTX2File::getDFDChannelID1()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.get_dfd_channel_id1();
}

bool KTX2File::isVideo()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;
  return m_transcoder.is_video();
}

uint32_t KTX2File::getETC1SImageDescImageFlags(uint32_t level_index, uint32_t layer_index, uint32_t face_index)
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;

  return m_transcoder.get_etc1s_image_descs_image_flags(level_index, layer_index, face_index);
}

basist::ktx2_image_level_info KTX2File::getImageLevelInfo(uint32_t level_index, uint32_t layer_index, uint32_t face_index)
{
  basist::ktx2_image_level_info info;
  memset(&info, 0, sizeof(info));

  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return info;

  if (!m_transcoder.get_image_level_info(info, level_index, layer_index, face_index))
  {
    assert(0);
    return info;
  }

  return info;
}

uint32_t KTX2File::getImageTranscodedSizeInBytes(uint32_t level_index, uint32_t layer_index, uint32_t face_index, uint32_t format)
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;

  if (format >= (int)basist::transcoder_texture_format::cTFTotalTextureFormats)
    return 0;

  basist::ktx2_image_level_info info;
  if (!m_transcoder.get_image_level_info(info, level_index, layer_index, face_index))
    return 0;

  uint32_t orig_width = info.m_orig_width, orig_height = info.m_orig_height, total_blocks = info.m_total_blocks;

  const basist::transcoder_texture_format transcoder_format = static_cast<basist::transcoder_texture_format>(format);

  if (basist::basis_transcoder_format_is_uncompressed(transcoder_format))
  {
    const uint32_t bytes_per_pixel = basist::basis_get_uncompressed_bytes_per_pixel(transcoder_format);
    const uint32_t bytes_per_line = orig_width * bytes_per_pixel;
    const uint32_t bytes_per_slice = bytes_per_line * orig_height;
    return bytes_per_slice;
  }
  else
  {
    const uint32_t bytes_per_block = basist::basis_get_bytes_per_block_or_pixel(transcoder_format);

    if (transcoder_format == basist::transcoder_texture_format::cTFPVRTC1_4_RGB || transcoder_format == basist::transcoder_texture_format::cTFPVRTC1_4_RGBA)
    {
      const uint32_t width = (orig_width + 3) & ~3;
      const uint32_t height = (orig_height + 3) & ~3;
      const uint32_t size_in_bytes = (std::max(8U, width) * std::max(8U, height) * 4 + 7) / 8;
      return size_in_bytes;
    }

    return total_blocks * bytes_per_block;
  }
}

uint32_t KTX2File::startTranscoding()
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;

  return m_transcoder.start_transcoding();
}

uint32_t KTX2File::transcodeImage(jsi::Runtime& rt,
                                  jsi::Object& destination,
                                  uint32_t level_index,
                                  uint32_t layer_index,
                                  uint32_t face_index,
                                  uint32_t format,
                                  uint32_t get_alpha_for_opaque_formats,
                                  int channel0,
                                  int channel1)
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;

  if (format >= (int)basist::transcoder_texture_format::cTFTotalTextureFormats)
    return 0;

  const basist::transcoder_texture_format transcoder_format = static_cast<basist::transcoder_texture_format>(format);

  basist::ktx2_image_level_info info;
  if (!m_transcoder.get_image_level_info(info, level_index, layer_index, face_index))
    return 0;

  uint32_t orig_width = info.m_orig_width, orig_height = info.m_orig_height, total_blocks = info.m_total_blocks;

  basisu::vector<uint8_t> dst_data;

  uint32_t flags = get_alpha_for_opaque_formats ? basist::cDecodeFlagsTranscodeAlphaDataToOpaqueFormats : 0;

  uint32_t status;

  if (basist::basis_transcoder_format_is_uncompressed(transcoder_format))
  {
    const uint32_t bytes_per_pixel = basist::basis_get_uncompressed_bytes_per_pixel(transcoder_format);
    const uint32_t bytes_per_line = orig_width * bytes_per_pixel;
    const uint32_t bytes_per_slice = bytes_per_line * orig_height;

    dst_data.resize(bytes_per_slice);

    status = m_transcoder.transcode_image_level(
                                                level_index, layer_index, face_index,
                                                dst_data.data(), orig_width * orig_height,
                                                transcoder_format,
                                                flags,
                                                orig_width,
                                                orig_height,
                                                channel0, channel1,
                                                nullptr);
  }
  else
  {
    uint32_t bytes_per_block = basist::basis_get_bytes_per_block_or_pixel(transcoder_format);

    uint32_t required_size = total_blocks * bytes_per_block;

    if (transcoder_format == basist::transcoder_texture_format::cTFPVRTC1_4_RGB || transcoder_format == basist::transcoder_texture_format::cTFPVRTC1_4_RGBA)
    {
      const uint32_t width = (orig_width + 3) & ~3;
      const uint32_t height = (orig_height + 3) & ~3;
      required_size = (std::max(8U, width) * std::max(8U, height) * 4 + 7) / 8;
      assert(required_size >= total_blocks * bytes_per_block);
    }

    dst_data.resize(required_size);

    status = m_transcoder.transcode_image_level(
                                                level_index, layer_index, face_index,
                                                dst_data.data(), dst_data.size() / bytes_per_block,
                                                transcoder_format,
                                                flags,
                                                0,
                                                0,
                                                channel0, channel1,
                                                nullptr);
  }

  auto arrayBuffer = destination.getArrayBuffer(rt);

  auto outputBuffer = jsi::ArrayBuffer(std::move(arrayBuffer));
  memcpy(outputBuffer.data(rt), dst_data.data(), dst_data.size());
  destination.setProperty(rt, jsi::PropNameID::forAscii(rt, "buffer"), outputBuffer);

  return status;
}

uint32_t KTX2File::getDFD(jsi::Runtime &rt, jsi::Object& destination)
{
  assert(m_magic == KTX2_MAGIC);
  if (m_magic != KTX2_MAGIC)
    return 0;

  auto arrayBuffer = destination.getArrayBuffer(rt);

  const uint8_vec &dst_data = m_transcoder.get_dfd();

  if (dst_data.size()) {
    auto outputBuffer = jsi::ArrayBuffer(std::move(arrayBuffer));
    memcpy(outputBuffer.data(rt), dst_data.data(), dst_data.size());
    destination.setProperty(rt, jsi::PropNameID::forAscii(rt, "buffer"), outputBuffer);
  }

  return 1;
}

basist::ktx2_header KTX2File::getHeader() {
  return m_transcoder.get_header();
}

}
