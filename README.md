# react-native-basis-universal

Basis Universal GPU Texture Codec.

This is a React Native wrapper around the [Basis Universal](https://github.com/BinomialLLC/basis_universal) library.

For documentation on the Basis Universal library, see the [official documentation](https://github.com/BinomialLLC/basis_universal).

## Installation

```sh
yarn add @callstack/react-native-basis-universal
```

## Usage


```js
import {
  initializeBasis,
  BasisEncoder,
  KTX2File,
  BasisFile,
} from '@callstack/react-native-basis-universal';

initializeBasis();

const basisFile = new BasisFile(new Uint8Array(image));

const width = basisFile.getImageWidth(0, 0);
const height = basisFile.getImageHeight(0, 0);
const images = basisFile.getNumImages();
const levels = basisFile.getNumLevels(0);
const has_alpha = basisFile.getHasAlpha();
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
