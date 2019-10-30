<div align="center">

  <h1><code>wasm_game_of_life</code></h1>

  <strong>A mini-project sampling Rust and WebAssembly.</strong>

  <!-- <p>
    <a href="https://travis-ci.org/rustwasm/wasm-pack-template"><img src="https://img.shields.io/travis/rustwasm/wasm-pack-template.svg?style=flat-square" alt="Build Status" /></a>
  </p> -->

  <sub>Many thanks to the efforts of the The Rust and WebAssembly Working Group 🦀</sub>
</div>

## About

This project is designed to use Conway's Game of Life for sampling the process from developing and compiling Rust libraries into WebAssembly and publishing the resulting package to NPM.

___WARNING: This program features flashing lights and patterns. Viewer discretion is advised.___

## 🚴 Usage

<!-- ### 🐑 Use `cargo generate` to Clone this Template

[Learn more about `cargo generate` here.](https://github.com/ashleygwilliams/cargo-generate)

```
cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name my-project
cd my-project
``` -->

### 🌲 Run on localhost:8080 with `npm run start`
```
cd www
npm run start
```

### 🛠️ Build with `wasm-pack build`

```
wasm-pack build
```

### 🔬 Test in Headless Browsers with `wasm-pack test`

```
wasm-pack test --headless --firefox
```

### 🎁 Publish to NPM with `wasm-pack publish`

```
wasm-pack publish
```

## Acknowledgements
* [https://github.com/rustwasm/wasm-pack-template](wasm-pack-template)