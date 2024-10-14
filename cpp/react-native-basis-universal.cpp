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

void ReactNativeBasisUniversal::setSliceSourceImage(jsi::Runtime &rt, jsi::Object handle, int sliceIndex, jsi::Object imageArray, int width, int height, bool isPng) {
  if (imageArray.isArrayBuffer(rt)) {
    throw jsi::JSError(rt, "Image Array needs to be ArrayBuffer");
  }
  auto arrayBuffer = imageArray.getArrayBuffer(rt);
  auto data = arrayBuffer.data(rt);
}

void ReactNativeBasisUniversal::setPackUASTCFlags(jsi::Runtime &rt, jsi::Object handle, int flags) {
  
}

void ReactNativeBasisUniversal::setCompressionLevel(jsi::Runtime &rt, jsi::Object handle, int level) {
  
}

}
