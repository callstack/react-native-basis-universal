const { $, cd } = require('zx');

const main = () => {
  cd(`${__dirname}/..`);
  $`rm -rf ios/libs`;
  $`bazel build //:rn_basis_universal`;
  $`mkdir -p ios/libs`;
  $`unzip bazel-bin/rn_basis_universal.xcframework.zip -d ios/libs`;
};

main();
