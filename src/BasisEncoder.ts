import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import NativeBasisUniversal from './NativeBasisUniversal';
import type { OpaqueNativeBasisHandle } from './NativeBasisUniversal';

export class BasisEncoder {
  #nativeBasisHandle: OpaqueNativeBasisHandle | null = null;

  constructor() {
    if (this.#nativeBasisHandle == null) {
      this.#nativeBasisHandle = this.#createNativeBasis();
    }
  }

  #createNativeBasis(): OpaqueNativeBasisHandle | null {
    if (!NativeBasisUniversal) {
      return null;
    }

    return NativeBasisUniversal.createBasisHandle();
  }

  encode(basisFileData: Uint8Array): Int32 {
    if (this.#nativeBasisHandle == null) {
      return 0;
    }

    return NativeBasisUniversal.encode(
      this.#nativeBasisHandle,
      basisFileData.buffer
    );
  }

  setCreateKTX2File(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setCreateKTX2File(this.#nativeBasisHandle, flag);
  }

  setDebug(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setDebug(this.#nativeBasisHandle, flag);
  }

  setComputeStats(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setComputeStats(this.#nativeBasisHandle, flag);
  }

  setHDR(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setHDR(this.#nativeBasisHandle, flag);
  }

  setSliceSourceImageHDR(
    sliceIndex: Int32,
    imageArray: Uint8Array,
    width: Int32,
    height: Int32,
    imgType: Int32,
    ldrSrgbToLinear: boolean
  ): boolean {
    if (this.#nativeBasisHandle == null) {
      return false;
    }

    return NativeBasisUniversal.setSliceSourceImageHDR(
      this.#nativeBasisHandle,
      sliceIndex,
      imageArray.buffer,
      width,
      height,
      imgType,
      ldrSrgbToLinear
    );
  }

  setSliceSourceImage(
    sliceIndex: Int32,
    imageArray: Uint8Array,
    width: Int32,
    height: Int32,
    isPng: boolean
  ): boolean {
    if (this.#nativeBasisHandle == null) {
      return false;
    }

    return NativeBasisUniversal.setSliceSourceImage(
      this.#nativeBasisHandle,
      sliceIndex,
      imageArray.buffer,
      width,
      height,
      isPng
    );
  }

  setUASTC(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setUASTC(this.#nativeBasisHandle, flag);
  }

  setKTX2UASTCSupercompression(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setKTX2UASTCSupercompression(
      this.#nativeBasisHandle,
      flag
    );
  }

  setPackUASTCFlags(flag: number) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setPackUASTCFlags(this.#nativeBasisHandle, flag);
  }

  setQualityLevel(level: number) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setQualityLevel(this.#nativeBasisHandle, level);
  }

  setCompressionLevel(flag: number) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setCompressionLevel(this.#nativeBasisHandle, flag);
  }

  setPerceptual(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setPerceptual(this.#nativeBasisHandle, flag);
  }

  setMipSRGB(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setMipSRGB(this.#nativeBasisHandle, flag);
  }

  setKTX2SRGBTransferFunc(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setMipSRGB(this.#nativeBasisHandle, flag);
  }

  setNormalMap() {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setNormalMap(this.#nativeBasisHandle);
  }

  setMipRenormalize(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setMipRenormalize(this.#nativeBasisHandle, flag);
  }

  setYFlip(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setYFlip(this.#nativeBasisHandle, flag);
  }

  setMipGen(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setMipGen(this.#nativeBasisHandle, flag);
  }

  setUASTCHDRQualityLevel(level: number) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setUASTCHDRQualityLevel(
      this.#nativeBasisHandle,
      level
    );
  }

  setCheckForAlpha(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setCheckForAlpha(this.#nativeBasisHandle, flag);
  }

  setForceAlpha(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setForceAlpha(this.#nativeBasisHandle, flag);
  }

  setSwizzle(r: number, g: number, b: number, a: number) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setSwizzle(this.#nativeBasisHandle, r, g, b, a);
  }

  setRenormalize(flag: boolean) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setRenormalize(this.#nativeBasisHandle, flag);
  }

  setMaxEndpointClusters(maxClusters: number) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setMaxEndpointClusters(
      this.#nativeBasisHandle,
      maxClusters
    );
  }

  setMaxSelectorClusters(maxClusters: number) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setMaxSelectorClusters(
      this.#nativeBasisHandle,
      maxClusters
    );
  }

  setSelectorRDOThresh(threshold: number) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setSelectorRDOThresh(
      this.#nativeBasisHandle,
      threshold
    );
  }

  setEndpointRDOThresh(threshold: number) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setEndpointRDOThresh(
      this.#nativeBasisHandle,
      threshold
    );
  }

  delete() {
    this.#nativeBasisHandle = null;
  }
}
