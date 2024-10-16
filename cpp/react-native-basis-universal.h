#pragma once

#include <ReactCommon/TurboModule.h>
#include <RNBasisUniversalSpecJSI.h>
#include "rn_basis_universal/transcoder/basisu.h"
#include "rn_basis_universal/transcoder/basisu_transcoder.h"

#include "rn_basis_universal/encoder/basisu_comp.h"

#ifndef BASISU_SUPPORT_ENCODING
#define BASISU_SUPPORT_ENCODING 1
#endif

namespace facebook::react {

using namespace facebook;

class ReactNativeBasisUniversal : public NativeBasisUniversalCxxSpecJSI {
public:
  explicit ReactNativeBasisUniversal(std::shared_ptr<CallInvoker> jsInvoker);
  constexpr static auto kModuleName = "BasisUniversal";

  void initializeBasis(jsi::Runtime &rt) override;
  jsi::Object createBasisHandle(jsi::Runtime &rt) override;
  void setCreateKTX2File(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setDebug(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setComputeStats(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setUASTC(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setCompressionLevel(jsi::Runtime &rt, jsi::Object handle, int level) override;
  void setKTX2UASTCSupercompression(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  bool setSliceSourceImage(jsi::Runtime &rt, jsi::Object handle, int sliceIndex, jsi::Object imageArray, int width, int height, bool isPng) override;
  void setPackUASTCFlags(jsi::Runtime &rt, jsi::Object handle, int flags) override;
  void setQualityLevel(jsi::Runtime &rt, jsi::Object handle, int qualityLevel) override;
  int encode(jsi::Runtime &rt, jsi::Object handle, jsi::Object basisFileData) override;
  void setPerceptual(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setYFlip(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setMipGen(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setNormalMap(jsi::Runtime &rt, jsi::Object handle) override;
  void setKTX2SRGBTransferFunc(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setMipSRGB(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setMipRenormalize(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  bool setSliceSourceImageHDR(jsi::Runtime &rt, jsi::Object handle, int sliceIndex, jsi::Object imageArray, int width, int height, int imgType, bool ldrSrgbToLinear) override;
  

private:
  std::shared_ptr<CallInvoker> _callInvoker;
  bool basis_initialized_flag;
};

} // namespace facebook::react
