#include "react-native-basis-universal.h"

namespace facebook::react {

ReactNativeBasisUniversal::ReactNativeBasisUniversal(std::shared_ptr<CallInvoker> jsInvoker)
: NativeBasisUniversalCxxSpecJSI(jsInvoker), _callInvoker(jsInvoker) {}

double ReactNativeBasisUniversal::multiply(jsi::Runtime &rt, double a, double b) {
  return a * b;
}

}
