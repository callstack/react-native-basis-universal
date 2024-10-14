import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import {
  initializeBasis,
  BasisEncoder,
} from '@callstack/react-native-basis-universal';

export default function App() {
  return (
    <View style={styles.container}>
      <Button title="Initialize Basis" onPress={initializeBasis} />
      <Button
        title="Encode"
        onPress={() => {
          const basisEncoder = new BasisEncoder();
          basisEncoder.setCreateKTX2File(true);
          basisEncoder.setDebug(true);
          basisEncoder.setComputeStats(true);
          // basisEncoder.setSliceSourceImage(0, new Uint8Array(), 0, 0, false);
          // basisEncoder.setUASTC(true);
          // basisEncoder.setKTX2UASTCSupercompression(true);
          // basisEncoder.setPackUASTCFlags(0);
          // basisEncoder.setQualityLevel(0);
          // basisEncoder.setCompressionLevel(0);
          // basisEncoder.setPerceptual(true);
          // basisEncoder.setMipSRGB(true);
          // basisEncoder.setKTX2SRGBTransferFunc(true);
          // basisEncoder.setNormalMap();
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
