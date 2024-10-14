import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import {
  initializeBasis,
  BasisEncoder,
} from '@callstack/react-native-basis-universal';
import { getArrayBufferForBlob } from "react-native-blob-jsi-helper";

const fetchAndProcessFile = async (file: string): Promise<Uint8Array> => {
  const x = await fetch(file)
  const blob = await x.blob()

  return getArrayBufferForBlob(blob);
};

export default function App() {
  return (
    <View style={styles.container}>
      <Button title="Initialize Basis" onPress={initializeBasis} />
      <Button
        title="Encode"
        onPress={async () => {
          const data = await fetchAndProcessFile('https://github.com/BinomialLLC/basis_universal/raw/7c046f89b2c417c70742979204109fd91006c2f2/webgl/ktx2_encode_test/assets/desk.exr')

          const basisEncoder = new BasisEncoder();
          basisEncoder.setCreateKTX2File(true);
          basisEncoder.setDebug(true);
          basisEncoder.setComputeStats(true);
          basisEncoder.setSliceSourceImage(0, data.buffer, 100, 100, false);

          basisEncoder.setUASTC(true);
          basisEncoder.setKTX2UASTCSupercompression(true);
          basisEncoder.setPackUASTCFlags(0);
          basisEncoder.setQualityLevel(0);
          basisEncoder.setCompressionLevel(0);
          basisEncoder.setPerceptual(true);
          basisEncoder.setMipSRGB(true);
          basisEncoder.setKTX2SRGBTransferFunc(true);
          basisEncoder.setNormalMap();

          const basisFileData = new Uint8Array(100 * 100 * 4)
          const numOutputBytes = basisEncoder.encode(basisFileData);
          console.log('numOutputBytes', numOutputBytes);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
