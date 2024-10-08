load("@rules_apple//apple:apple.bzl", "apple_static_xcframework")

apple_static_xcframework(
    name = "rn_basis_universal",
    deps = ["@basis_universal"],
    ios = {
        "simulator": ["x86_64", "arm64"],
        "device": ["arm64"]
    },
    minimum_os_versions = {
        "ios": "11.0"
    }
)