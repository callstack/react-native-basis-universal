import { useEffect, useState } from 'react';

import { Picker } from '@react-native-picker/picker';
import {
  StyleSheet,
  View,
  Button,
  Switch,
  Text,
  Image,
  Alert,
} from 'react-native';
import {
  initializeBasis,
  BasisEncoder,
  KTX2File,
  BasisFile,
} from '@callstack/react-native-basis-universal';
import RNFetchBlob from 'react-native-blob-util';

function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes?.[i] ?? 0);
  }
  return btoa(binary);
}

function dumpKTX2FileDesc(ktx2File: KTX2File) {
  console.log('Width: ' + ktx2File.getWidth());
  console.log('Height: ' + ktx2File.getHeight());
  console.log('IsHDR: ' + ktx2File.isHDR());
  console.log('Faces: ' + ktx2File.getFaces());
  console.log('Layers: ' + ktx2File.getLayers());
  console.log('Levels: ' + ktx2File.getLevels());
  console.log('isUASTC: ' + ktx2File.isUASTC());
  console.log('isETC1S: ' + ktx2File.isETC1S());
  console.log('Format: ' + ktx2File.getFormat());
  console.log('Has alpha: ' + ktx2File.getHasAlpha());
  console.log('Total Keys: ' + ktx2File.getTotalKeys());
  console.log('DFD Size: ' + ktx2File.getDFDSize());
  console.log('DFD Color Model: ' + ktx2File.getDFDColorModel());
  console.log('DFD Color Primaries: ' + ktx2File.getDFDColorPrimaries());
  console.log('DFD Transfer Function: ' + ktx2File.getDFDTransferFunc());
  console.log('DFD Flags: ' + ktx2File.getDFDFlags());
  console.log('DFD Total Samples: ' + ktx2File.getDFDTotalSamples());
  console.log('DFD Channel0: ' + ktx2File.getDFDChannelID0());
  console.log('DFD Channel1: ' + ktx2File.getDFDChannelID1());
  console.log('Is Video: ' + ktx2File.isVideo());

  var dfdSize = ktx2File.getDFDSize();
  var dvdData = new Uint8Array(dfdSize);
  ktx2File.getDFD(dvdData);

  console.log('DFD bytes:' + dvdData.toString());
  console.log('--');

  console.log('--');
  console.log('Image level information:');
  let level_index;
  for (level_index = 0; level_index < ktx2File.getLevels(); level_index++) {
    var layer_index;
    for (
      layer_index = 0;
      layer_index < Math.max(1, ktx2File.getLayers());
      layer_index++
    ) {
      var face_index;
      for (face_index = 0; face_index < ktx2File.getFaces(); face_index++) {
        var imageLevelInfo = ktx2File.getImageLevelInfo(
          level_index,
          layer_index,
          face_index
        );

        if (!imageLevelInfo) {
          continue;
        }

        console.log(
          'level: ' +
            level_index +
            ' layer: ' +
            layer_index +
            ' face: ' +
            face_index
        );

        console.log('orig_width: ' + imageLevelInfo.origWidth);
        console.log('orig_height: ' + imageLevelInfo.origHeight);
        console.log('width: ' + imageLevelInfo.width);
        console.log('height: ' + imageLevelInfo.height);
        console.log('numBlocksX: ' + imageLevelInfo.numBlocksX);
        console.log('numBlocksY: ' + imageLevelInfo.numBlocksY);
        console.log('totalBlocks: ' + imageLevelInfo.totalBlocks);
        console.log('alphaFlag: ' + imageLevelInfo.alphaFlag);
        console.log('iframeFlag: ' + imageLevelInfo.iframeFlag);

        console.log('--');
      }
    }
  }

  console.log('KTX2 header:');
  var hdr = ktx2File.getHeader();
  if (hdr == null) {
    return;
  }

  console.log('vkFormat: ' + hdr.vkFormat);
  console.log('typeSize: ' + hdr.typeSize);
  console.log('pixelWidth: ' + hdr.pixelWidth);
  console.log('pixelHeight: ' + hdr.pixelHeight);
  console.log('pixelDepth: ' + hdr.pixelDepth);
  console.log('layerCount: ' + hdr.layerCount);
  console.log('faceCount: ' + hdr.faceCount);
  console.log('levelCount: ' + hdr.levelCount);
  console.log('superCompressionScheme: ' + hdr.supercompressionScheme);
  console.log('dfdByteOffset: ' + hdr.dfdByteOffset);
  console.log('dfdByteLength: ' + hdr.dfdByteLength);
  console.log('kvdByteOffset: ' + hdr.kvdByteOffset);
  console.log('kvdByteLength: ' + hdr.kvdByteLength);
  console.log('sgdByteOffset: ' + hdr.sgdByteOffset);
  console.log('sgdByteLength: ' + hdr.sgdByteLength);

  console.log('------');
}

const BlobImage = ({
  arrayBuffer,
  isTranscoding,
}: {
  arrayBuffer?: Uint8Array | null;
  isTranscoding: boolean;
}) => {
  if (!arrayBuffer || isTranscoding) {
    return null;
  }

  const base64 = arrayBufferToBase64(arrayBuffer);

  // Create data URI
  const dataUri = `data:image/jpeg;base64,${base64}`;

  return (
    <Image source={{ uri: dataUri }} style={{ width: 200, height: 200 }} />
  );
};

const BasisEncoderPlayground = () => {
  const [image, setImage] = useState<Uint8Array | null>(null);
  const [file, setFile] = useState<string>('desk.exr');
  const [options, setOptions] = useState({
    uastc: false,
    mipmaps: false,
    srgb: false,
    normalMap: false,
    yFlip: false,
  });

  useEffect(() => {
    const filePath = RNFetchBlob.fs.asset(file);
    RNFetchBlob.fs.readFile(filePath, 'base64').then((data) => {
      const byteCharacters = atob(data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      setImage(byteArray);
    });
  }, [file]);

  const toggleOption = (option: keyof typeof options) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const transcode = async () => {
    if (!image) {
      Alert.alert('No image to transcode');
      return;
    }
    initializeBasis();

    const t0 = performance.now();
    const basisFile = new BasisFile(new Uint8Array(image));

    const width = basisFile.getImageWidth(0, 0);
    const height = basisFile.getImageHeight(0, 0);
    const images = basisFile.getNumImages();
    const levels = basisFile.getNumLevels(0);
    const has_alpha = basisFile.getHasAlpha();
    const is_hdr = basisFile.isHDR();
    console.log({
      width,
      height,
      images,
      levels,
      has_alpha,
      is_hdr,
    });

    if (!basisFile.startTranscoding()) {
      console.log('startTranscoding failed');
      console.warn('startTranscoding failed');
      basisFile.close();
      basisFile.delete();
      return;
    }

    const format = 22; // cTFBC6H
    const dstSize = basisFile.getImageTranscodedSizeInBytes(0, 0, format);
    const dst = new Uint8Array(dstSize);

    console.log('Dst output', dst.slice(0, 100));
    console.log('Dst size: ', dstSize);

    if (!basisFile.transcodeImage(dst, 0, 0, format, 0, 0)) {
      console.log('basisFile.transcodeImage failed');
      console.warn('transcodeImage failed');
      basisFile.close();
      basisFile.delete();

      return;
    }

    const t1 = performance.now();
    console.log('Transcode took', (t1 - t0) / 1000, 'seconds');

    console.log('Dst output after', dst.slice(0, 100));
    console.log('Dst size: ', dstSize);

    basisFile.close();
    basisFile.delete();
  };

  const encode = async () => {
    try {
      if (!image) {
        Alert.alert('No image to encode');
        return;
      }

      initializeBasis();

      const basisEncoder = new BasisEncoder();
      basisEncoder.setCreateKTX2File(true);
      basisEncoder.setKTX2UASTCSupercompression(true);
      basisEncoder.setKTX2SRGBTransferFunc(true);

      let useHDR = false;

      if (file.endsWith('.exr')) {
        useHDR = true;
      }

      if (useHDR) {
        basisEncoder.setSliceSourceImageHDR(0, image, 0, 0, 3, true);
        basisEncoder.setHDR(true);
      } else {
        basisEncoder.setSliceSourceImage(0, new Uint8Array(image), 0, 0, true);
      }

      basisEncoder.setDebug(false);
      basisEncoder.setComputeStats(false);
      basisEncoder.setQualityLevel(255);
      basisEncoder.setMipSRGB(true);

      if (options.uastc) {
        basisEncoder.setPackUASTCFlags(2);
      } else {
        basisEncoder.setQualityLevel(128);
        basisEncoder.setCompressionLevel(2);
      }

      if (options.srgb) {
        basisEncoder.setPerceptual(true);
        basisEncoder.setMipSRGB(true);
      }

      if (options.normalMap) {
        basisEncoder.setNormalMap();
        basisEncoder.setMipRenormalize(true);
      }

      if (options.yFlip) {
        basisEncoder.setYFlip(true);
      }

      basisEncoder.setMipGen(options.mipmaps);

      // Create a destination buffer to hold the compressed .basis file data. If this buffer isn't large enough compression will fail.
      const ktx2FileData = new Uint8Array(1024 * 1024 * 24);
      const t0 = performance.now();
      console.log(
        'basisFileData byteLength before: ',
        ktx2FileData.buffer.byteLength
      );
      const numOutputBytes = basisEncoder.encode(ktx2FileData);
      const t1 = performance.now();

      basisEncoder.delete();

      console.log(
        `Call to basisEncoder.encode took ${(t1 - t0) / 1000} seconds.`
      );
      console.log('numOutputBytes', numOutputBytes);

      const actualKTX2FileData = new Uint8Array(
        ktx2FileData.buffer,
        0,
        numOutputBytes
      );

      const path = RNFetchBlob.fs.dirs.DocumentDir + '/output.ktx2';
      console.log(path);

      RNFetchBlob.fs.writeFile(path, Array.from(actualKTX2FileData), 'ascii');

      console.log('actualKTX2FileData', actualKTX2FileData.buffer.byteLength);

      console.log('----- KT2XFile -----');

      const t2 = performance.now();
      const ktx2File = new KTX2File(new Uint8Array(actualKTX2FileData));

      dumpKTX2FileDesc(ktx2File);

      if (!ktx2File.startTranscoding()) {
        console.log('startTranscoding failed');
        console.warn('startTranscoding failed');
        return;
      }

      const format = 22; // cTFBC6H
      const dstSize = ktx2File.getImageTranscodedSizeInBytes(0, 0, 0, format);
      const dst = new Uint8Array(dstSize);

      console.log('Dst output', dst.slice(0, 100));
      console.log('Dst size: ' + dstSize);

      if (!ktx2File.transcodeImage(dst, 0, 0, 0, format, 0, -1, -1)) {
        console.log('ktx2File.transcodeImage failed');
        console.warn('transcodeImage failed');
        ktx2File.close();
        ktx2File.delete();

        return;
      }

      const t3 = performance.now();
      console.log(
        `Call to ktx2File.transcodeImage took ${(t3 - t2) / 1000} seconds.`
      );

      console.log('Dst output after', dst.slice(0, 100));

      ktx2File.close();
      ktx2File.delete();
    } catch (error) {
      console.error('Encoding failed:', error);
    }
  };

  const isTranscoding = file.endsWith('.basis');

  return (
    <View style={styles.container}>
      <Picker
        style={{ width: '100%', height: 200 }}
        selectedValue={file}
        onValueChange={(itemValue) => setFile(itemValue)}
      >
        <Picker.Item label="desk.exr" value="desk.exr" />
        <Picker.Item label="CandleGlass.exr" value="CandleGlass.exr" />
        <Picker.Item label="kodim01.png" value="kodim01.png" />
        <Picker.Item label="desk.basis" value="desk.basis" />
      </Picker>
      <View style={styles.optionsContainer}>
        {Object.entries(options).map(([key, value]) => (
          <View key={key} style={styles.optionRow}>
            <Text>{key}</Text>
            {/* @ts-ignore */}
            <Switch value={value} onValueChange={() => toggleOption(key)} />
          </View>
        ))}
      </View>
      <Button
        title={isTranscoding ? 'Transcode' : 'Encode'}
        onPress={isTranscoding ? transcode : encode}
      />
      <View style={{ height: 200, width: 200 }}>
        <BlobImage arrayBuffer={image} isTranscoding={isTranscoding} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  optionsContainer: {
    marginVertical: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    width: 200,
  },
});

export default BasisEncoderPlayground;
