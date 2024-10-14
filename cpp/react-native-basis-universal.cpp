#include "react-native-basis-universal.h"

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

void ReactNativeBasisUniversal::setDebug(jsi::Runtime &rt, jsi::Object handle, bool flag) {
  auto encoder = tryGetBasisEncoder(rt, handle);
  encoder->m_params.m_debug = flag;
}

void ReactNativeBasisUniversal::setCreateKTX2File(jsi::Runtime &rt, jsi::Object handle, bool flag) {
  auto encoder = tryGetBasisEncoder(rt, handle);
  encoder->m_params.m_create_ktx2_file = flag;
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
//    if (!copy_to_jsbuffer(dst_basis_file_js_val, comp.get_output_basis_file()))
//      return 0;
    
    // Return the file size of the .basis file in bytes.
    return (uint32_t)comp.get_output_basis_file().size();
  }
  
  return 0;
}

void ReactNativeBasisUniversal::setComputeStats(jsi::Runtime &rt, jsi::Object handle, bool flag) {
  auto encoder = tryGetBasisEncoder(rt, handle);
  encoder->m_params.m_compute_stats = flag;
}

void ReactNativeBasisUniversal::setUASTC(jsi::Runtime &rt, jsi::Object handle, bool flag) {
  auto encoder = tryGetBasisEncoder(rt, handle);
  encoder->m_params.m_uastc = flag;
}

void ReactNativeBasisUniversal::setKTX2UASTCSupercompression(jsi::Runtime &rt, jsi::Object handle, bool flag) {
  auto encoder = tryGetBasisEncoder(rt, handle);
  encoder->m_params.m_ktx2_uastc_supercompression = flag ? basist::KTX2_SS_ZSTANDARD : basist::KTX2_SS_NONE;;
}

void ReactNativeBasisUniversal::setQualityLevel(jsi::Runtime &rt, jsi::Object handle, int qualityLevel) {
  
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
    // It's a raw image, so check the buffer's size.
    if (arrayBuffer.size(rt) != width * height * sizeof(uint32_t))
    {
      return false;
    }
    
    // Copy the raw image's data into our source image.
    src_img.resize(width, height);
    memcpy(src_img.get_ptr(), arrayBuffer.data(rt), width * height * sizeof(uint32_t));
  }
  
  return true;
}

void ReactNativeBasisUniversal::setPackUASTCFlags(jsi::Runtime &rt, jsi::Object handle, int flags) {
  
}

void ReactNativeBasisUniversal::setCompressionLevel(jsi::Runtime &rt, jsi::Object handle, int level) {
  
}

}
