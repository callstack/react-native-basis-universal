#include "react-native-basis-universal.h"

#define DEFINE_BASIS_ENCODER_PARAMS_SETTER(func_name, param_name, param_type) \
void ReactNativeBasisUniversal::func_name(jsi::Runtime &rt, jsi::Object handle, param_type flag) { \
  auto encoder = tryGetBasisEncoder(rt, handle); \
  encoder->m_params.param_name = flag; \
}


using namespace basist;
using namespace basisu;

namespace facebook::react {

class BasisEncoder : public jsi::NativeState {
public:
  basis_compressor_params m_params;
};

std::shared_ptr<BasisEncoder> tryGetBasisEncoder(jsi::Runtime& rt, jsi::Object& basisEncoderObj) {
  if (!basisEncoderObj.hasNativeState(rt)) {
    return nullptr;
  }
  
  auto encoder = std::dynamic_pointer_cast<BasisEncoder>(basisEncoderObj.getNativeState(rt));
  return encoder;
}

ReactNativeBasisUniversal::ReactNativeBasisUniversal(std::shared_ptr<CallInvoker> jsInvoker)
: NativeBasisUniversalCxxSpecJSI(jsInvoker), _callInvoker(jsInvoker) {}

void ReactNativeBasisUniversal::initializeBasis(jsi::Runtime &rt)
{
  if (basis_initialized_flag) {
    return;
  }
  
#if BASISU_SUPPORT_ENCODING
  basisu_encoder_init();
#endif
  
  basisu_transcoder_init();
  
  basis_initialized_flag = true;
}

jsi::Object ReactNativeBasisUniversal::createBasisHandle(jsi::Runtime &rt) {
  jsi::Object basisObject{rt};
  basisObject.setNativeState(rt, std::make_shared<BasisEncoder>());
  return basisObject;
}

int ReactNativeBasisUniversal::encode(jsi::Runtime &rt, jsi::Object handle, jsi::Object basisFileData) {
  auto encoder = tryGetBasisEncoder(rt, handle);
  
  if (!basisFileData.isArrayBuffer(rt)) {
    throw jsi::JSError(rt, "Image Array needs to be ArrayBuffer");
  }
  
  auto arrayBuffer = basisFileData.getArrayBuffer(rt);
  auto data = arrayBuffer.data(rt);
  
  if (!basis_initialized_flag)
  {
    assert(0);
    return 0;
  }
  
  // We don't use threading for now, but the compressor needs a job pool.
  job_pool jpool(1);
  
  // Initialize the compression parameters structure. This is the same structure that the command line tool fills in.
  basis_compressor_params &params = encoder->m_params;
  
  params.m_pJob_pool = &jpool;
  
  // Disabling multithreading for now, which sucks.
  params.m_multithreading = false;
  
  params.m_status_output = params.m_debug;
  
  params.m_read_source_images = false;
  params.m_write_output_basis_or_ktx2_files = false;
  
  basis_compressor comp;
  
  if (!comp.init(params))
  {
    return 0;
  }
  
  basis_compressor::error_code ec = comp.process();
  
  if (ec != basis_compressor::cECSuccess)
  {
    // Something failed during compression.
    return 0;
  }
  
  if (params.m_create_ktx2_file)
  {
    // Compression succeeded, so copy the .ktx2 file bytes to the caller's buffer.
    auto output = comp.get_output_basis_file();
    data = reinterpret_cast<uint8_t*>(output.data());
    
    if (!data) {
      return 0;
    }
    
    // Return the file size of the .basis file in bytes.
    return (uint32_t)comp.get_output_ktx2_file().size();
  }
  else
  {
    auto output = comp.get_output_basis_file();
    
    // Compression succeeded, so copy the .basis file bytes to the caller's buffer.
    data = reinterpret_cast<uint8_t*>(output.data());
    
    if (!data) {
      return 0;
    }
    
    // Return the file size of the .basis file in bytes.
    return (uint32_t)comp.get_output_basis_file().size();
  }
  
  return 0;
}

void ReactNativeBasisUniversal::setKTX2UASTCSupercompression(jsi::Runtime &rt, jsi::Object handle, bool flag) {
  auto encoder = tryGetBasisEncoder(rt, handle);
  encoder->m_params.m_ktx2_uastc_supercompression = flag ? basist::KTX2_SS_ZSTANDARD : basist::KTX2_SS_NONE;
}

void ReactNativeBasisUniversal::setQualityLevel(jsi::Runtime &rt, jsi::Object handle, int qualityLevel) {
  auto encoder = tryGetBasisEncoder(rt, handle);
  assert(qualityLevel >= -1 && qualityLevel <= BASISU_QUALITY_MAX);
  encoder->m_params.m_quality_level = qualityLevel;
}

bool ReactNativeBasisUniversal::setSliceSourceImage(jsi::Runtime &rt, jsi::Object handle, int sliceIndex, jsi::Object imageArray, int width, int height, bool isPng) {
  if (!imageArray.isArrayBuffer(rt)) {
    throw jsi::JSError(rt, "Image Array needs to be ArrayBuffer");
  }
  auto encoder = tryGetBasisEncoder(rt, handle);
  
  if (sliceIndex >= encoder->m_params.m_source_images.size())
    encoder->m_params.m_source_images.resize(sliceIndex + 1);
  
  auto arrayBuffer = imageArray.getArrayBuffer(rt);
  auto data = arrayBuffer.data(rt);
  
  image& src_img = encoder->m_params.m_source_images[sliceIndex];
  
  if (isPng)
  {
    // It's a PNG file, so try and parse it.
    if (!load_png(data, arrayBuffer.size(rt), src_img, nullptr))
    {
      return false;
    }
    
    width = src_img.get_width();
    height = src_img.get_height();
  }
  else
  {
//    auto arrayBufferSize = arrayBuffer.size(rt);
//    auto expectedSize = width * height * sizeof(uint32_t);
    // It's a raw image, so check the buffer's size.
//    if (arrayBuffer.size(rt) != width * height * sizeof(uint32_t))
//    {
//      return false;
//    }
    
    // Copy the raw image's data into our source image.
    src_img.resize(width, height);
    memcpy(src_img.get_ptr(), arrayBuffer.data(rt), width * height * sizeof(uint32_t));
  }
  
  return true;
}

void ReactNativeBasisUniversal::setPackUASTCFlags(jsi::Runtime &rt, jsi::Object handle, int flags) {
  auto encoder = tryGetBasisEncoder(rt, handle);
  assert((flags & cPackUASTCLevelMask) >= cPackUASTCLevelFastest);
  assert((flags & cPackUASTCLevelMask) <= cPackUASTCLevelVerySlow);
  encoder->m_params.m_pack_uastc_flags = flags;
}

void ReactNativeBasisUniversal::setCompressionLevel(jsi::Runtime &rt, jsi::Object handle, int level) {
  auto encoder = tryGetBasisEncoder(rt, handle);
  assert(level >= 0 && level <= BASISU_MAX_COMPRESSION_LEVEL);
  encoder->m_params.m_compression_level = level;
}

void ReactNativeBasisUniversal::setNormalMap(jsi::Runtime &rt, jsi::Object handle) {
  auto encoder = tryGetBasisEncoder(rt, handle);
  encoder->m_params.m_perceptual = false;
  encoder->m_params.m_mip_srgb = false;
  encoder->m_params.m_no_selector_rdo = true;
  encoder->m_params.m_no_endpoint_rdo = true;
}

DEFINE_BASIS_ENCODER_PARAMS_SETTER(setMipSRGB, m_mip_srgb, bool);
DEFINE_BASIS_ENCODER_PARAMS_SETTER(setMipRenormalize, m_mip_renormalize, bool);
DEFINE_BASIS_ENCODER_PARAMS_SETTER(setKTX2SRGBTransferFunc, m_ktx2_srgb_transfer_func, bool);
DEFINE_BASIS_ENCODER_PARAMS_SETTER(setYFlip, m_y_flip, bool);
DEFINE_BASIS_ENCODER_PARAMS_SETTER(setMipGen, m_mip_gen, bool);
DEFINE_BASIS_ENCODER_PARAMS_SETTER(setPerceptual, m_perceptual, bool);
DEFINE_BASIS_ENCODER_PARAMS_SETTER(setUASTC, m_uastc, bool);
DEFINE_BASIS_ENCODER_PARAMS_SETTER(setComputeStats, m_compute_stats, bool);
DEFINE_BASIS_ENCODER_PARAMS_SETTER(setCreateKTX2File, m_create_ktx2_file, bool);
DEFINE_BASIS_ENCODER_PARAMS_SETTER(setDebug, m_debug, bool);
}
