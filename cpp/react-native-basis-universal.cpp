#include "react-native-basis-universal.h"

using namespace basisu;

namespace facebook::react {

ReactNativeBasisUniversal::ReactNativeBasisUniversal(std::shared_ptr<CallInvoker> jsInvoker)
: NativeBasisUniversalCxxSpecJSI(jsInvoker), _callInvoker(jsInvoker) {}

double ReactNativeBasisUniversal::multiply(jsi::Runtime &rt, double a, double b) {
  basist::basisu_transcoder_init();
  return a * b;
}

}
