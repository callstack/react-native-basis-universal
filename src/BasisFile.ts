import { Int32, UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';
import NativeBasisUniversal from './NativeBasisUniversal';
import type { OpaqueNativeBasisFileHandle } from './NativeBasisUniversal';

export class BasisFile {
  #nativeBasisFileHandle: OpaqueNativeBasisFileHandle | null = null;

  constructor(fileData: Uint8Array) {
    if (this.#nativeBasisFileHandle == null) {
      this.#nativeBasisFileHandle = this.#createNativeBasis(fileData);
    }
  }

  #createNativeBasis(fileData: Uint8Array): OpaqueNativeBasisFileHandle | null {
    if (!NativeBasisUniversal) {
      return null;
    }

    return NativeBasisUniversal.createBasisFile(fileData.buffer);
  }

  close(): void {
    if (this.#nativeBasisFileHandle) {
      NativeBasisUniversal.closeBasisFile(this.#nativeBasisFileHandle);
    }
  }

  delete(): void {
    this.#nativeBasisFileHandle = null;
  }

  getHasAlpha(): boolean {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.getHasAlphaBasisFile(this.#nativeBasisFileHandle)
      : false;
  }

  isUASTC(): boolean {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.isUASTCBasisFile(this.#nativeBasisFileHandle)
      : false;
  }

  isHDR(): boolean {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.isHDRBasisFile(this.#nativeBasisFileHandle)
      : false;
  }

  getNumImages(): Int32 {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.getNumImagesBasisFile(this.#nativeBasisFileHandle)
      : 0;
  }

  getNumLevels(imageIndex: Int32): Int32 {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.getNumLevels(
          this.#nativeBasisFileHandle,
          imageIndex
        )
      : 0;
  }

  getImageWidth(imageIndex: Int32, levelIndex: Int32): Int32 {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.getImageWidthBasisFile(
          this.#nativeBasisFileHandle,
          imageIndex,
          levelIndex
        )
      : 0;
  }

  getImageHeight(imageIndex: Int32, levelIndex: Int32): Int32 {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.getImageHeightBasisFile(
          this.#nativeBasisFileHandle,
          imageIndex,
          levelIndex
        )
      : 0;
  }

  getImageTranscodedSizeInBytes(
    imageIndex: Int32,
    levelIndex: Int32,
    format: Int32
  ): Int32 {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.getImageTranscodedSizeInBytesBasisFile(
          this.#nativeBasisFileHandle,
          imageIndex,
          levelIndex,
          format
        )
      : 0;
  }

  startTranscoding(): boolean {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.startTranscodingBasisFile(
          this.#nativeBasisFileHandle
        )
      : false;
  }

  transcodeImage(
    dst: Uint8Array,
    imageIndex: Int32,
    levelIndex: Int32,
    format: Int32,
    unused: Int32,
    getAlphaForOpaqueFormats: Int32
  ): boolean {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.transcodeImageBasisFile(
          this.#nativeBasisFileHandle,
          dst.buffer,
          imageIndex,
          levelIndex,
          format,
          unused,
          getAlphaForOpaqueFormats
        )
      : false;
  }

  getFileDesc(): UnsafeObject | null {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.getFileDescBasisFile(this.#nativeBasisFileHandle)
      : null;
  }

  getImageDesc(imageIndex: Int32): UnsafeObject | null {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.getImageDescBasisFile(
          this.#nativeBasisFileHandle,
          imageIndex
        )
      : null;
  }

  getImageLevelDesc(imageIndex: Int32, levelIndex: Int32): UnsafeObject | null {
    return this.#nativeBasisFileHandle
      ? NativeBasisUniversal.getImageLevelDescBasisFile(
          this.#nativeBasisFileHandle,
          imageIndex,
          levelIndex
        )
      : null;
  }
}
