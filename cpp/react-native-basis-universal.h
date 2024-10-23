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

using KTX2Header = NativeBasisUniversalKTX2Header<
    /* vkFormat */               uint32_t,
    /* typeSize */               uint32_t,
    /* pixelWidth */             uint32_t,
    /* pixelHeight */            uint32_t,
    /* pixelDepth */             uint32_t,
    /* layerCount */             uint32_t,
    /* faceCount */              uint32_t,
    /* levelCount */             uint32_t,
    /* supercompressionScheme */ uint32_t,
    /* dfdByteOffset */          uint32_t,
    /* dfdByteLength */          uint32_t,
    /* kvdByteOffset */          uint32_t,
    /* kvdByteLength */          uint32_t,
    /* sgdByteOffset */          uint32_t,
    /* sgdByteLength */          uint32_t
>;

template <>
struct Bridging<KTX2Header>
: NativeBasisUniversalKTX2HeaderBridging<KTX2Header> {};


using KTX2ImageLevelInfo = NativeBasisUniversalKTX2ImageLevelInfo<
    /* levelIndex */  uint32_t,
    /* layerIndex */  uint32_t,
    /* faceIndex */   uint32_t,
    /* origWidth */   uint32_t,
    /* origHeight */  uint32_t,
    /* width */       uint32_t,
    /* height: */     uint32_t,
    /* numBlocksX */  uint32_t,
    /* numBlocksY */  uint32_t,
    /* totalBlocks */ uint32_t,
    /* alphaFlag */   bool,
    /* iframeFlag */  bool
>;

template <>
struct Bridging<KTX2ImageLevelInfo>
: NativeBasisUniversalKTX2ImageLevelInfoBridging<KTX2ImageLevelInfo> {};

using namespace facebook;

class ReactNativeBasisUniversal : public NativeBasisUniversalCxxSpecJSI {
public:
  explicit ReactNativeBasisUniversal(std::shared_ptr<CallInvoker> jsInvoker);
  constexpr static auto kModuleName = "BasisUniversal";

  void initializeBasis(jsi::Runtime &rt) override;

  // Basis Encoder
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
  void setHDR(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setUASTCHDRQualityLevel(jsi::Runtime &rt, jsi::Object handle, int level) override;
  void setCheckForAlpha(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setForceAlpha(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setSwizzle(jsi::Runtime &rt, jsi::Object handle, int r, int g, int b, int a) override;
  void setRenormalize(jsi::Runtime &rt, jsi::Object handle, bool flag) override;
  void setMaxEndpointClusters(jsi::Runtime &rt, jsi::Object handle, int maxClusters) override;
  void setMaxSelectorClusters(jsi::Runtime &rt, jsi::Object handle, int maxClusters) override;
  void setSelectorRDOThresh(jsi::Runtime &rt, jsi::Object handle, double threshold) override;
  void setEndpointRDOThresh(jsi::Runtime &rt, jsi::Object handle, double threshold) override;

  // KTX2 File
  jsi::Object createKTX2FileHandle(jsi::Runtime &rt, jsi::Object data) override;
  bool isValid(jsi::Runtime &rt, jsi::Object handle) override;
  void close(jsi::Runtime &rt, jsi::Object handle) override;
  int getDFDSize(jsi::Runtime &rt, jsi::Object handle) override;
  int getDFD(jsi::Runtime &rt, jsi::Object handle, jsi::Object destination) override;
  jsi::Object getHeader(jsi::Runtime &rt, jsi::Object handle) override;
  bool hasKey(jsi::Runtime &rt, jsi::Object handle, jsi::String key) override;
  int getTotalKeys(jsi::Runtime &rt, jsi::Object handle) override;
  jsi::String getKey(jsi::Runtime &rt, jsi::Object handle, int index) override;
  int getKeyValueSize(jsi::Runtime &rt, jsi::Object handle, jsi::String key) override;
  int getKeyValue(jsi::Runtime &rt, jsi::Object handle, jsi::Object destination) override;
  int getWidth(jsi::Runtime &rt, jsi::Object handle) override;
  int getHeight(jsi::Runtime &rt, jsi::Object handle) override;
  int getFaces(jsi::Runtime &rt, jsi::Object handle) override;
  int getLayers(jsi::Runtime &rt, jsi::Object handle) override;
  int getLevels(jsi::Runtime &rt, jsi::Object handle) override;
  int getFormat(jsi::Runtime &rt, jsi::Object handle) override;
  bool isUASTC(jsi::Runtime &rt, jsi::Object handle) override;
  bool isHDR(jsi::Runtime &rt, jsi::Object handle) override;
  bool isETC1S(jsi::Runtime &rt, jsi::Object handle) override;
  bool getHasAlpha(jsi::Runtime &rt, jsi::Object handle) override;
  int getDFDColorModel(jsi::Runtime &rt, jsi::Object handle) override;
  int getDFDColorPrimaries(jsi::Runtime &rt, jsi::Object handle) override;
  int getDFDTransferFunc(jsi::Runtime &rt, jsi::Object handle) override;
  int getDFDFlags(jsi::Runtime &rt, jsi::Object handle) override;
  int getDFDTotalSamples(jsi::Runtime &rt, jsi::Object handle) override;
  int getDFDChannelID0(jsi::Runtime &rt, jsi::Object handle) override;
  int getDFDChannelID1(jsi::Runtime &rt, jsi::Object handle) override;
  bool isVideo(jsi::Runtime &rt, jsi::Object handle) override;
  int getETC1SImageDescImageFlags(jsi::Runtime &rt, jsi::Object handle, int levelIndex, int layerIndex, int faceIndex) override;
  jsi::Object getImageLevelInfo(jsi::Runtime &rt, jsi::Object handle, int level, int layerIndex, int faceIndex) override;
  int getImageTranscodedSizeInBytes(jsi::Runtime &rt, jsi::Object handle, int levelIndex, int layerIndex, int faceIndex, int format) override;
  bool startTranscoding(jsi::Runtime &rt, jsi::Object handle) override;
  int transcodeImage(jsi::Runtime &rt, jsi::Object handle, jsi::Object dst, int levelIndex, int layerIndex, int faceIndex, int format, int getAlphaForOpaqueFormats, int channel0, int channel1) override;

  // Basis file
  virtual jsi::Object createBasisFile(jsi::Runtime &rt, jsi::Object data) override;
  void closeBasisFile(jsi::Runtime &rt, jsi::Object handle) override;
  bool getHasAlphaBasisFile(jsi::Runtime &rt, jsi::Object handle) override;
  bool isUASTCBasisFile(jsi::Runtime &rt, jsi::Object handle) override;
  bool isHDRBasisFile(jsi::Runtime &rt, jsi::Object handle) override;
  int getNumImagesBasisFile(jsi::Runtime &rt, jsi::Object handle) override;
  int getNumLevels(jsi::Runtime &rt, jsi::Object handle, int imageIndex) override;
  int getImageWidthBasisFile(jsi::Runtime &rt, jsi::Object handle, int imageIndex, int levelIndex) override;
  int getImageHeightBasisFile(jsi::Runtime &rt, jsi::Object handle, int imageIndex, int levelIndex) override;
  int getImageTranscodedSizeInBytesBasisFile(jsi::Runtime &rt, jsi::Object handle, int imageIndex, int levelIndex, int format) override;
  bool startTranscodingBasisFile(jsi::Runtime &rt, jsi::Object handle) override;
  bool transcodeImageBasisFile(jsi::Runtime &rt, jsi::Object handle, jsi::Object dst, int imageIndex, int levelIndex, int format, int unused, int getAlphaForOpaqueFormats) override;
  jsi::Object getFileDescBasisFile(jsi::Runtime &rt, jsi::Object handle) override;
  jsi::Object getImageDescBasisFile(jsi::Runtime &rt, jsi::Object handle, int imageIndex) override;
  jsi::Object getImageLevelDescBasisFile(jsi::Runtime &rt, jsi::Object handle, int imageIndex, int levelIndex) override;

private:
  bool basis_initialized_flag;
};

} // namespace facebook::react
