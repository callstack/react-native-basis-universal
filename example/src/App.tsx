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

const file = 'kodim01.png';

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
  }, []);

  const toggleOption = (option: keyof typeof options) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
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

      basisEncoder.setDebug(true);
      basisEncoder.setComputeStats(false);
      basisEncoder.setQualityLevel(255);
      basisEncoder.setPerceptual(true);
      basisEncoder.setMipSRGB(true);
      basisEncoder.setCompressionLevel(2);
      basisEncoder.setPackUASTCFlags(1);
      // basisEncoder.setUASTC(options.uastc);

      // if (options.uastc) {
      //   basisEncoder.setPackUASTCFlags(2);
      // } else {
      //   basisEncoder.setQualityLevel(128);
      //   basisEncoder.setCompressionLevel(2);
      // }
      //
      // if (options.srgb) {
      //   basisEncoder.setPerceptual(true);
      //   basisEncoder.setMipSRGB(true);
      // }
      //
      // if (options.normalMap) {
      //   basisEncoder.setNormalMap();
      //   basisEncoder.setMipRenormalize(true);
      // }
      //
      // if (options.yFlip) {
      //   basisEncoder.setYFlip(true);
      // }

      // basisEncoder.setMipGen(options.mipmaps);

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
    } catch (error) {
      console.error('Encoding failed:', error);
    }
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
