#include <jni.h>
#include "react-native-basis-universal.h"

extern "C"
JNIEXPORT jdouble JNICALL
Java_com_basisuniversal_BasisUniversalModule_nativeMultiply(JNIEnv *env, jclass type, jdouble a, jdouble b) {
    return basisuniversal::multiply(a, b);
}
