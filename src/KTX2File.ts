import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import NativeBasisUniversal from './NativeBasisUniversal';
import type { OpaqueKTX2FileHandle } from './NativeBasisUniversal';

export class KTX2File {
  #nativeKTX2FileHandle: OpaqueKTX2FileHandle | null = null;

  constructor(fileData: Uint8Array) {
    if (this.#nativeKTX2FileHandle == null) {
      this.#nativeKTX2FileHandle = this.#createNativeBasis(fileData);
    }
  }

  #createNativeBasis(fileData: Uint8Array): OpaqueKTX2FileHandle | null {
    if (!NativeBasisUniversal) {
      return null;
    }

    return NativeBasisUniversal.createKTX2FileHandle(fileData.buffer);
  }

  isValid(): boolean {
    return (
      this.#nativeKTX2FileHandle !== null &&
      NativeBasisUniversal.isValid(this.#nativeKTX2FileHandle)
    );
  }

  close(): void {
    if (this.#nativeKTX2FileHandle !== null) {
      NativeBasisUniversal.close(this.#nativeKTX2FileHandle);
      this.#nativeKTX2FileHandle = null;
    }
  }

  delete(): void {
    this.#nativeKTX2FileHandle = null;
  }

  getDFDSize(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getDFDSize(this.#nativeKTX2FileHandle)
      : 0;
  }

  getDFD(): Object | null {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getDFD(this.#nativeKTX2FileHandle)
      : null;
  }

  getHeader(): Object | null {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getHeader(this.#nativeKTX2FileHandle)
      : null;
  }

  hasKey(key: string): boolean {
    return (
      this.#nativeKTX2FileHandle !== null &&
      NativeBasisUniversal.hasKey(this.#nativeKTX2FileHandle, key)
    );
  }

  getTotalKeys(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getTotalKeys(this.#nativeKTX2FileHandle)
      : 0;
  }

  getKey(index: Int32): string | null {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getKey(this.#nativeKTX2FileHandle, index)
      : null;
  }

  getKeyValueSize(key: string): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getKeyValueSize(this.#nativeKTX2FileHandle, key)
      : 0;
  }

  getKeyValue(key: string): Object | null {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getKeyValue(this.#nativeKTX2FileHandle, key)
      : null;
  }

  getWidth(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getWidth(this.#nativeKTX2FileHandle)
      : 0;
  }

  getHeight(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getHeight(this.#nativeKTX2FileHandle)
      : 0;
  }

  getFaces(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getFaces(this.#nativeKTX2FileHandle)
      : 0;
  }

  getLayers(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getLayers(this.#nativeKTX2FileHandle)
      : 0;
  }

  getLevels(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getLevels(this.#nativeKTX2FileHandle)
      : 0;
  }

  getFormat(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getFormat(this.#nativeKTX2FileHandle)
      : 0;
  }

  isUASTC(): boolean {
    return (
      this.#nativeKTX2FileHandle !== null &&
      NativeBasisUniversal.isUASTC(this.#nativeKTX2FileHandle)
    );
  }

  isHDR(): boolean {
    return (
      this.#nativeKTX2FileHandle !== null &&
      NativeBasisUniversal.isHDR(this.#nativeKTX2FileHandle)
    );
  }

  isETC1S(): boolean {
    return (
      this.#nativeKTX2FileHandle !== null &&
      NativeBasisUniversal.isETC1S(this.#nativeKTX2FileHandle)
    );
  }

  getHasAlpha(): boolean {
    return (
      this.#nativeKTX2FileHandle !== null &&
      NativeBasisUniversal.getHasAlpha(this.#nativeKTX2FileHandle)
    );
  }

  getDFDColorModel(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getDFDColorModel(this.#nativeKTX2FileHandle)
      : 0;
  }

  getDFDColorPrimaries(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getDFDColorPrimaries(this.#nativeKTX2FileHandle)
      : 0;
  }

  getDFDTransferFunc(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getDFDTransferFunc(this.#nativeKTX2FileHandle)
      : 0;
  }

  getDFDFlags(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getDFDFlags(this.#nativeKTX2FileHandle)
      : 0;
  }

  getDFDTotalSamples(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getDFDTotalSamples(this.#nativeKTX2FileHandle)
      : 0;
  }

  getDFDChannelID0(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getDFDChannelID0(this.#nativeKTX2FileHandle)
      : 0;
  }

  getDFDChannelID1(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getDFDChannelID1(this.#nativeKTX2FileHandle)
      : 0;
  }

  isVideo(): boolean {
    return (
      this.#nativeKTX2FileHandle !== null &&
      NativeBasisUniversal.isVideo(this.#nativeKTX2FileHandle)
    );
  }

  getETC1SImageDescImageFlags(): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getETC1SImageDescImageFlags(
          this.#nativeKTX2FileHandle
        )
      : 0;
  }

  getImageLevelInfo(
    level: Int32,
    layerIndex: Int32,
    faceIndex: Int32
  ): Object | null {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getImageLevelInfo(
          this.#nativeKTX2FileHandle,
          level,
          layerIndex,
          faceIndex
        )
      : null;
  }

  getImageTranscodedSizeInBytes(level: Int32, format: Int32): Int32 {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.getImageTranscodedSizeInBytes(
          this.#nativeKTX2FileHandle,
          level,
          format
        )
      : 0;
  }

  startTranscoding(): boolean {
    return (
      this.#nativeKTX2FileHandle !== null &&
      NativeBasisUniversal.startTranscoding(this.#nativeKTX2FileHandle)
    );
  }

  transcodeImage(
    dst: Uint8Array,
    dstSize: Int32,
    level: Int32,
    format: Int32,
    decodeFlags: Int32,
    faceIndex: Int32,
    layerIndex: Int32
  ): boolean {
    return this.#nativeKTX2FileHandle !== null
      ? NativeBasisUniversal.transcodeImage(
          this.#nativeKTX2FileHandle,
          dst.buffer,
          dstSize,
          level,
          format,
          decodeFlags,
          faceIndex,
          layerIndex
        )
      : false;
  }
}
