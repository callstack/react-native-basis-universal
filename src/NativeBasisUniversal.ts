import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type {
  UnsafeObject,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

export type OpaqueNativeBasisHandle = UnsafeObject;
export type OpaqueKTX2FileHandle = UnsafeObject;

export type KTX2Header = {
  vkFormat: Int32;
  typeSize: Int32;
  pixelWidth: Int32;
  pixelHeight: Int32;
  pixelDepth: Int32;
  layerCount: Int32;
  faceCount: Int32;
  levelCount: Int32;
  supercompressionScheme: Int32;
  dfdByteOffset: Int32;
  dfdByteLength: Int32;
  kvdByteOffset: Int32;
  kvdByteLength: Int32;
  sgdByteOffset: Int32;
  sgdByteLength: Int32;
};

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

  // KTX2File
  createKTX2FileHandle: (data: UnsafeObject) => OpaqueKTX2FileHandle;
  isValid: (handle: OpaqueKTX2FileHandle) => boolean;
  close: (handle: OpaqueKTX2FileHandle) => void;
  getDFDSize: (handle: OpaqueKTX2FileHandle) => Int32;
  getDFD: (handle: OpaqueKTX2FileHandle, destination: UnsafeObject) => Int32;
  getHeader: (handle: OpaqueKTX2FileHandle) => KTX2Header;
  hasKey: (handle: OpaqueKTX2FileHandle, key: string) => boolean;
  getTotalKeys: (handle: OpaqueKTX2FileHandle) => Int32;
  getKey: (handle: OpaqueKTX2FileHandle, index: Int32) => string;
  getKeyValueSize: (handle: OpaqueKTX2FileHandle, key: string) => Int32;
  getKeyValue: (handle: OpaqueKTX2FileHandle, key: string) => UnsafeObject;
  getWidth: (handle: OpaqueKTX2FileHandle) => Int32;
  getHeight: (handle: OpaqueKTX2FileHandle) => Int32;
  getFaces: (handle: OpaqueKTX2FileHandle) => Int32;
  getLayers: (handle: OpaqueKTX2FileHandle) => Int32;
  getLevels: (handle: OpaqueKTX2FileHandle) => Int32;
  getFormat: (handle: OpaqueKTX2FileHandle) => Int32;
  isUASTC: (handle: OpaqueKTX2FileHandle) => boolean;
  isHDR: (handle: OpaqueKTX2FileHandle) => boolean;
  isETC1S: (handle: OpaqueKTX2FileHandle) => boolean;
  getHasAlpha: (handle: OpaqueKTX2FileHandle) => boolean;
  getDFDColorModel: (handle: OpaqueKTX2FileHandle) => Int32;
  getDFDColorPrimaries: (handle: OpaqueKTX2FileHandle) => Int32;
  getDFDTransferFunc: (handle: OpaqueKTX2FileHandle) => Int32;
  getDFDFlags: (handle: OpaqueKTX2FileHandle) => Int32;
  getDFDTotalSamples: (handle: OpaqueKTX2FileHandle) => Int32;
  getDFDChannelID0: (handle: OpaqueKTX2FileHandle) => Int32;
  getDFDChannelID1: (handle: OpaqueKTX2FileHandle) => Int32;
  isVideo: (handle: OpaqueKTX2FileHandle) => boolean;
  getETC1SImageDescImageFlags: (handle: OpaqueKTX2FileHandle) => Int32;
  getImageLevelInfo: (
    handle: OpaqueKTX2FileHandle,
    level: Int32,
    layerIndex: Int32,
    faceIndex: Int32
  ) => UnsafeObject;
  getImageTranscodedSizeInBytes: (
    handle: OpaqueKTX2FileHandle,
    level: Int32,
    format: Int32
  ) => Int32;
  startTranscoding: (handle: OpaqueKTX2FileHandle) => boolean;
  transcodeImage: (
    handle: OpaqueKTX2FileHandle,
    dst: UnsafeObject,
    dstSize: Int32,
    level: Int32,
    format: Int32,
    decodeFlags: Int32,
    faceIndex: Int32,
    layerIndex: Int32
  ) => boolean;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BasisUniversal');
