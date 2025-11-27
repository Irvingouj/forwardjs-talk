# Why Vite is Migrating to Rolldown

## High-Level Goals

- **Unification**  
  Vite today uses **esbuild** for dependency pre-bundling and **Rollup** for production builds. Rolldown’s goal is to unify these into a **single, high-performance bundler** that Vite can use for both dev and prod. This reduces complexity, avoids duplicated logic, and makes it easier to evolve the toolchain.

- **Performance**  
  Rolldown is implemented in **Rust**, giving it performance characteristics closer to esbuild than to JavaScript-based bundlers. While benchmarks vary with project size and shape, early tests show **significant speed improvements compared to Rollup**, especially on large bundles.

- **Additional Features**  
  Rolldown introduces features that are not available (or unlikely to be implemented) in Rollup or esbuild, including:

  - Advanced chunk-splitting control  
  - Built-in HMR support  
  - Module Federation (planned)

These are features that Vite needs for real-world applications but that don’t fit the scope or roadmap of Rollup/esbuild.

For more background and motivations, see the official “why Rolldown is being built” writeups from the Vite / VoidZero team.

---

## Rolldown’s Role in the Vite Stack

Rolldown is primarily designed to serve as the **underlying bundler in Vite**, with the explicit goal of replacing both **esbuild** and **Rollup** (currently used as dependencies) with a **single unified bundler**.

Key reasons for building a new bundler from scratch:

### 1. Performance

- Rolldown is written in **Rust**. In its own benchmarks:
  - It performs on roughly the **same performance level as esbuild** for many bundling workloads.
  - It is reported to be **10–30× faster than Rollup** on comparable tasks.
- Rolldown’s **WASM build** is significantly faster than esbuild’s WASM build, in part because Go’s WASM compilation is less optimal than Rust’s.

### 2. Ecosystem Compatibility

- Rolldown supports a **plugin API compatible with Rollup and Vite**.
- This means existing Vite/Rollup ecosystems can largely reuse their plugins and configuration patterns with minimal changes.
- For many projects, Rolldown can act as a **drop-in replacement for Rollup** when better performance and more advanced features are needed.

### 3. Feature Scope

Rolldown’s feature scope is closer to **esbuild** in terms of built-in functionality, while still offering Rollup-like flexibility:

- Platform presets  
- TypeScript / JSX / syntax-lowering transforms  
- Node.js-compatible module resolution  
- ESM / CJS interoperability  
- `define` support  
- `inject` support  
- CSS bundling (experimental)  
- Minification (work in progress)

Rolldown also introduces concepts that esbuild has but Rollup does not:

- **Module Types** (experimental)  
- **Plugin hook filters**

And finally, Rolldown offers a few features **neither esbuild nor Rollup currently provide**:

- Advanced chunk-splitting control (experimental)  
- HMR support (work in progress)  
- Module Federation (planned)

---

## Standalone Usage

Although Rolldown is being built first and foremost as **Vite’s core bundler**, it is also designed to work as a **standalone, general-purpose bundler**:

- It can serve as a **drop-in replacement for Rollup** in most library or application bundling scenarios.
- It can also be used as an **esbuild alternative** when more sophisticated chunking control or Rollup-compatible plugins are required.

---

## Credits

Rolldown is very explicit about its lineage:

> Rolldown wouldn't exist without all the lessons we learned from other bundlers like esbuild, Rollup, webpack, and Parcel. We have the utmost respect and appreciation towards the authors and maintainers of these important projects.

It’s best understood not as “yet another bundler,” but as a Rust-based evolution informed by the strengths and limitations of the tools that came before it.

