#import "BasisUniversal.h"
#include <ReactCommon/CxxTurboModuleUtils.h>

@implementation BasisUniversal

+ (void)load {
  facebook::react::registerCxxModuleToGlobalModuleMap(
  std::string(facebook::react::ReactNativeBasisUniversal::kModuleName),
  [&](std::shared_ptr<facebook::react::CallInvoker> jsInvoker) {
  return std::make_shared<facebook::react::ReactNativeBasisUniversal>(jsInvoker);
});
}

@end
