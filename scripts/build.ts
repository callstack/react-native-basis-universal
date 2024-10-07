const { $, cd } = require('zx');
const fs = require('fs');
const path = require('path');

const serializeCMakeArgs = (args: Record<string, string>) => {
  return Object.keys(args)
    .map((key) => `-D${key}=${args[key]}`)
    .join(' ');
};

const CMAKE_ARGS = {
  CMAKE_BUILD_TYPE: 'RELEASE',
  // CMAKE_TOOLCHAIN_FILE: `${__dirname}/apple.toolchain.cmake`,
};

const PLATFORM_MAP: Record<string, string> = {
  arm64_iphoneos: 'OS64',
  arm64_iphonesimulator: 'SIMULATORARM64',
  x86_64_iphonesimulator: 'SIMULATOR64',
};

const apple = {
  arm64: ['iphonesimulator', 'iphoneos'],
  x86_64: ['iphonesimulator'],
};

const buildStaticLibs = async (platform: string) => {
  const baseDir = 'externals/basis_universal/out';
  const dirPath = path.join(baseDir, platform);
  fs.mkdirSync(dirPath, { recursive: true });
  cd(`${__dirname}/../externals/basis_universal/out/${platform}`);
  await $`cmake -S ../.. -G Ninja -DPLATFORM=${PLATFORM_MAP[platform]} ${serializeCMakeArgs(CMAKE_ARGS)} && ninja`;
};

const copyHeaders = async () => {
  cd(`${__dirname}/..`);
  fs.mkdirSync('cpp/basisu/encoder', { recursive: true });
  fs.mkdirSync('cpp/basisu/transcoder', { recursive: true });
  $`cp -r externals/basis_universal/encoder/*.h cpp/basisu/encoder`;
  $`cp -r externals/basis_universal/transcoder/*.h cpp/basisu/transcoder`;
};

const main = () => {
  for (const [arch, platforms] of Object.entries(apple)) {
    for (const platform of platforms) {
      const platformName = `${arch}_${platform}`;
      buildStaticLibs(platformName);
    }
  }
  copyHeaders();
};

main();
