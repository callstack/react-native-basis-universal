#pragma once

#include <jsi/jsi.h>
#include "rn_basis_universal/transcoder/basisu.h"
#include "rn_basis_universal/transcoder/basisu_transcoder.h"
#include <vector>
#include <string>
#include <cstdint>

#define KTX2_MAGIC 0xDEADBEE2

namespace facebook::react {

class KTX2File : public jsi::NativeState {
public:
  KTX2File(jsi::Runtime &rt, const jsi::ArrayBuffer& buffer);
  
  bool isValid();
  void close();
  uint32_t getDFDSize();
  bool hasKey(std::string key_name);
  uint32_t getTotalKeys();
  std::string getKey(uint32_t index);
  uint32_t getKeyValueSize(std::string key_name);
  uint32_t getWidth();
  uint32_t getHeight();
  uint32_t getFaces();
  uint32_t getLayers();
  uint32_t getLevels();
  uint32_t getFormat();
  bool isUASTC();
  bool isETC1S();
  bool isHDR();
  bool getHasAlpha();
  uint32_t getDFDColorModel();
  uint32_t getDFDColorPrimaries();
  uint32_t getDFDTransferFunc();
  uint32_t getDFDFlags();
  uint32_t getDFDTotalSamples();
  uint32_t getDFDChannelID0();
  uint32_t getDFDChannelID1();
  bool isVideo();
  uint32_t getETC1SImageDescImageFlags(uint32_t level_index, uint32_t layer_index, uint32_t face_index);
  basist::ktx2_image_level_info getImageLevelInfo(uint32_t level_index, uint32_t layer_index, uint32_t face_index);
  basist::ktx2_header getHeader();
  uint32_t getImageTranscodedSizeInBytes(uint32_t level_index, uint32_t layer_index, uint32_t face_index, uint32_t format);
  uint32_t startTranscoding();
  uint32_t transcodeImage(jsi::Runtime& rt,
                          jsi::Object& destination,
                          uint32_t level_index,
                          uint32_t layer_index,
                          uint32_t face_index,
                          uint32_t format,
                          uint32_t get_alpha_for_opaque_formats,
                          int channel0,
                          int channel1);
  uint32_t getDFD(jsi::Runtime &rt, jsi::Object& destination);
  
private:
  int m_magic;
  basist::ktx2_transcoder m_transcoder;
  basisu::vector<uint8_t> m_file;
  bool m_is_valid;
};
}
