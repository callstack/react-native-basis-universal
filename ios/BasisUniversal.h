#ifdef __cplusplus
#import "react-native-basis-universal.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNBasisUniversalSpec.h"

@interface BasisUniversal : NSObject <NativeBasisUniversalSpec>
#else
#import <React/RCTBridgeModule.h>

@interface BasisUniversal : NSObject <RCTBridgeModule>
#endif

@end
