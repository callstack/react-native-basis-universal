import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type {
  UnsafeObject,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

export type OpaqueNativeBasisHandle = UnsafeObject;

export interface Spec extends TurboModule {
  // Basis
  initializeBasis: () => void;

  createBasisHandle: () => OpaqueNativeBasisHandle;

  // BasisEncoder
  setCreateKTX2File: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setDebug: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setComputeStats: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setUASTC: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setCompressionLevel: (handle: OpaqueNativeBasisHandle, level: Int32) => void;
  setSliceSourceImage: (
    handle: OpaqueNativeBasisHandle,
    sliceIndex: Int32,
    imageArray: UnsafeObject,
    width: Int32,
    height: Int32,
    isPng: boolean
  ) => boolean;
  setSliceSourceImageHDR: (
    handle: OpaqueNativeBasisHandle,
    sliceIndex: Int32,
    imageArray: UnsafeObject,
    width: Int32,
    height: Int32,
    imgType: Int32,
    ldrSrgbToLinear: boolean
  ) => boolean;
  encode: (
    handle: OpaqueNativeBasisHandle,
    basisFileData: UnsafeObject
  ) => Int32;
  setKTX2UASTCSupercompression: (
    handle: OpaqueNativeBasisHandle,
    flag: boolean
  ) => void;
  setPackUASTCFlags: (handle: OpaqueNativeBasisHandle, flags: Int32) => void;
  setQualityLevel: (
    handle: OpaqueNativeBasisHandle,
    qualityLevel: Int32
  ) => void;
  setPerceptual: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setMipSRGB: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setKTX2SRGBTransferFunc: (
    handle: OpaqueNativeBasisHandle,
    flag: boolean
  ) => void;

  setNormalMap: (handle: OpaqueNativeBasisHandle) => void;
  setMipRenormalize: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setYFlip: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setHDR: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setMipGen: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setUASTCHDRQualityLevel: (
    handle: OpaqueNativeBasisHandle,
    level: Int32
  ) => void;
  setCheckForAlpha: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setForceAlpha: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setSwizzle: (
    handle: OpaqueNativeBasisHandle,
    r: Int32,
    g: Int32,
    b: Int32,
    a: Int32
  ) => void;
  setRenormalize: (handle: OpaqueNativeBasisHandle, flag: boolean) => void;
  setMaxEndpointClusters: (
    handle: OpaqueNativeBasisHandle,
    maxClusters: Int32
  ) => void;
  setMaxSelectorClusters: (
    handle: OpaqueNativeBasisHandle,
    maxClusters: Int32
  ) => void;
  setSelectorRDOThresh: (
    handle: OpaqueNativeBasisHandle,
    threshold: number
  ) => void;
  setEndpointRDOThresh: (
    handle: OpaqueNativeBasisHandle,
    threshold: number
  ) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BasisUniversal');
