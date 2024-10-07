#pragma once

#include <ReactCommon/TurboModule.h>
#include <RNBasisUniversalSpecJSI.h>

namespace facebook::react {

using namespace facebook;

class ReactNativeBasisUniversal : public NativeBasisUniversalCxxSpecJSI {
public:
  explicit ReactNativeBasisUniversal(std::shared_ptr<CallInvoker> jsInvoker);

public:
  double multiply(jsi::Runtime &rt, double a, double b) override;
  constexpr static auto kModuleName = "BasisUniversal";

private:
  std::shared_ptr<CallInvoker> _callInvoker;
};

} // namespace facebook::react
