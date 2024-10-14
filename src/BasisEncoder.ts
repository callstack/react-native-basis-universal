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

  encode() {
    console.log('encode');
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

  setSliceSourceImage(
    sliceIndex: Int32,
    imageArray: Uint8Array,
    width: Int32,
    height: Int32,
    isPng: boolean
  ) {
    console.log('setSliceSourceImage');

    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setSliceSourceImage(
      this.#nativeBasisHandle,
      sliceIndex,
      imageArray,
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

  setQualityLevel(flag: number) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setQualityLevel(this.#nativeBasisHandle, flag);
  }

  setCompressionLevel(flag: number) {
    if (this.#nativeBasisHandle == null) {
      return;
    }
    NativeBasisUniversal.setCompressionLevel(this.#nativeBasisHandle, flag);
  }

  setPerceptual(flag: boolean) {
    console.log('setPerceptual', flag);
  }

  setMipSRGB(flag: boolean) {
    console.log('setMipSRGB', flag);
  }

  setKTX2SRGBTransferFunc(flag: boolean) {
    console.log('setKTX2SRGBTransferFunc', flag);
  }

  setNormalMap() {
    console.log('setNormalMap');
  }

  setMipRenormalize(flag: boolean) {
    console.log('setMipRenormalize', flag);
  }

  setYFlip(flag: boolean) {
    console.log('setYFlip', flag);
  }

  setMipGen(flag: boolean) {
    console.log('setMipGen', flag);
  }

  delete() {
    console.log('delete');
  }
}
