#pragma once

#include <jsi/jsi.h>
#include "rn_basis_universal/transcoder/basisu_transcoder.h"
#include <vector>
#include <cstdint>

using namespace basist;
using namespace basisu;

namespace facebook::react {

class BasisFile : public jsi::NativeState {
public:
  BasisFile(jsi::Runtime &rt, const jsi::ArrayBuffer& buffer);
  
  void close();
  uint32_t getHasAlpha();
  uint32_t getNumImages();
  uint32_t getNumLevels(uint32_t image_index);
  uint32_t getImageWidth(uint32_t image_index, uint32_t level_index);
  uint32_t getImageHeight(uint32_t image_index, uint32_t level_index);
  uint32_t getImageTranscodedSizeInBytes(uint32_t image_index, uint32_t level_index, uint32_t format);
  bool isUASTC();
  bool isHDR();
  uint32_t startTranscoding();
  uint32_t transcodeImage(jsi::Runtime& rt,
                          jsi::Object& destination,
                          uint32_t image_index,
                          uint32_t level_index,
                          uint32_t format,
                          uint32_t unused,
                          uint32_t get_alpha_for_opaque_formats);
  
private:
  int m_magic;
  basisu_transcoder m_transcoder;
  basisu::vector<uint8_t> m_file;
};

}
