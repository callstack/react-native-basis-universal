import { useEffect, useState } from 'react';
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
} from '@callstack/react-native-basis-universal';
import { getArrayBufferForBlob } from 'react-native-blob-jsi-helper';

function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes?.[i] ?? 0);
  }
  return btoa(binary);
}

const BlobImage = ({ arrayBuffer }: { arrayBuffer?: Uint8Array | null }) => {
  if (!arrayBuffer) {
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
  const [options, setOptions] = useState({
    uastc: false,
    mipmaps: false,
    srgb: false,
    normalMap: false,
    yFlip: false,
  });

  useEffect(() => {
    fetchImage();
  }, []);

  const toggleOption = (option: keyof typeof options) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const encode = async () => {
    try {
      const imageWidth = 644;
      const imageHeight = 874;

      if (!image) {
        Alert.alert('No image to encode');
        return;
      }

      initializeBasis();

      const basisEncoder = new BasisEncoder();
      basisEncoder.setCreateKTX2File(true);
      basisEncoder.setDebug(false);
      basisEncoder.setComputeStats(false);
      basisEncoder.setSliceSourceImage(
        0,
        image,
        imageWidth,
        imageHeight,
        false
      );
      basisEncoder.setUASTC(options.uastc);

      if (options.uastc) {
        basisEncoder.setKTX2UASTCSupercompression(true);
        basisEncoder.setPackUASTCFlags(2);
      } else {
        basisEncoder.setQualityLevel(128);
        basisEncoder.setCompressionLevel(2);
      }

      if (options.srgb) {
        basisEncoder.setPerceptual(true);
        basisEncoder.setMipSRGB(true);
        basisEncoder.setKTX2SRGBTransferFunc(true);
      }

      if (options.normalMap) {
        basisEncoder.setNormalMap();
        basisEncoder.setMipRenormalize(true);
      }

      if (options.yFlip) {
        basisEncoder.setYFlip(true);
      }

      basisEncoder.setMipGen(options.mipmaps);

      console.log(`Starting encode with ${imageWidth}x${imageHeight} image`);
      const t0 = performance.now();
      const basisFileData = new Uint8Array(imageWidth * imageHeight * 4);
      const numOutputBytes = basisEncoder.encode(basisFileData);
      const t1 = performance.now();

      console.log(
        `Call to basisEncoder.encode took ${(t1 - t0) / 1000} seconds.`
      );
      console.log('numOutputBytes', numOutputBytes);

      const actualKTX2FileData = new Uint8Array(
        basisFileData.buffer,
        0,
        numOutputBytes
      );

      console.log('actualKTX2FileData', actualKTX2FileData.buffer.byteLength);
    } catch (error) {
      console.error('Encoding failed:', error);
    }
  };

  const fetchImage = async () => {
    const response = await fetch(
      'https://github.com/BinomialLLC/basis_universal/raw/refs/heads/master/webgl/ktx2_encode_test/assets/desk.exr'
    );
    const blob = await response.blob();
    const arrayBuffer = getArrayBufferForBlob(blob);

    setImage(arrayBuffer);
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {Object.entries(options).map(([key, value]) => (
          <View key={key} style={styles.optionRow}>
            <Text>{key}</Text>
            {/* @ts-ignore */}
            <Switch value={value} onValueChange={() => toggleOption(key)} />
          </View>
        ))}
      </View>
      <Button title="Encode" onPress={encode} />
      <Button title="Fetch image" onPress={fetchImage} />
      <BlobImage arrayBuffer={image} />
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
