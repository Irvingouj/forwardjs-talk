# Why Rspack Exists (and When to Use It)

Rspack is a high-performance bundler written in Rust, created by ByteDance. Unlike Turbopack (which is Next-first) or Rolldown (Vite-first), Rspack is **Webpack-first**: it aims to be a faster, mostly compatible drop-in replacement for webpack.

This note explains the motivation and positioning so you can talk about Rspack precisely.

---

## Design Goal: “Webpack, but Faster”

Rspack’s primary goal is to keep the **Webpack mental model and ecosystem** while dramatically improving performance:

- **Config compatibility**
  - Rspack exposes a webpack-like configuration surface (entry, loaders, plugins, optimization options).
  - Many projects can migrate by adjusting `webpack.config.js` to `rspack.config.js` with minimal changes.

- **Loader / plugin ecosystem**
  - Rspack implements many of webpack’s core features (HMR, code splitting, asset handling).
  - It supports a subset of webpack loaders and plugins out of the box, with compatibility improving over time.

This makes Rspack especially attractive for teams heavily invested in webpack and its plugin ecosystem.

---

## How Rspack Speeds Up the Webpack Model

Rspack doesn’t try to reinvent the bundler graph model; instead, it focuses on a more efficient implementation of the **module graph**:

- **Rust implementation**
  - CPU-intensive work (parsing, transforms, graph walking) is implemented in Rust, giving a significant raw speed advantage over JavaScript-based webpack.

- **Incremental module-graph algorithm**
  - Rspack uses an incremental algorithm at the **module graph level**:
    - Even when `unsafeCache` is “off”, it still caches the association between `Dependency` and `Module`.
    - This allows faster rebuilds and HMR than webpack on the same config.

In short: Rspack keeps the webpack shape, but executes it much more efficiently.

---

## Benchmarks at a Glance

Rspack’s performance varies with project shape and settings, but published numbers show large gains over webpack:

- **js-bundler-benchmark (React synthetic apps)**
  - On large synthetic React apps, Rspack (with SWC) has been reported at roughly **4× faster than webpack(esbuild)** and **~6× faster than Rollup(esbuild)** for production builds.

- **Rspack’s own “50k modules” benchmark**
  - Dev cold start:
    - Rspack(SWC): ~3.8 s
    - webpack(SWC/Babel): 31–42 s
  - Prod build:
    - Rspack(SWC): ~22 s
    - webpack(SWC): ~75 s
    - webpack(Babel): ~160 s

These numbers should be treated as indicative, not absolute—but they consistently show Rspack as a big upgrade over webpack in both dev and prod on large projects.

---

## Integration with Frameworks (e.g., Next.js)

Rspack integrates with existing frameworks largely through **webpack-compatible interfaces**:

- **Next.js**
  - Rspack support comes via the `next-rspack` plugin.
  - You wrap your Next config with `withRspack(...)`, and keep thinking in terms of `webpack` configuration; Rspack satisfies that contract under the hood.

- **Other tooling**
  - CLI wrappers like Rsbuild build on Rspack to provide a higher-level DX while still leveraging its performance.

This is a key distinction vs Turbopack:

- Turbopack is built into Next.js and can evolve together with Next’s runtime model.
- Rspack plugs into frameworks via a webpack-compatible surface.

---

## When Rspack Makes Sense

Rspack is a good fit when:

- You have a **large webpack-based app** and webpack is now the bottleneck (slow dev boot / HMR / builds).
- You want big performance gains without rewriting your bundler config or abandoning webpack’s ecosystem.
- You are comfortable with webpack concepts and want a **“drop-in” performance upgrade**.

Rspack is not primarily about:

- Redesigning the bundler graph around a specific framework (like Turbopack for Next or Rolldown for Vite).
- Being the most framework-aware dev server; instead, it focuses on the **Webpack compatibility + Rust speed** axis.

---

## How to Summarize Rspack in a Talk

A concise, accurate way to describe it:

> “Rspack is a Rust reimplementation of webpack from ByteDance. Its goal is to keep the webpack mental model and ecosystem, but execute it much faster. If you’re deep in webpack—custom loaders, complex configs—and want 3–10× better build and HMR speeds without rethinking your setup, Rspack is the ‘Webpack, but fast’ option.”

Contrasting with other bundlers:

- **Turbopack**: Next-native, tailored to Next’s multi-runtime and app router.
- **Rolldown**: Vite-native, designed to unify Vite’s bundling story and add features Rollup/esbuild lack.
- **Rspack**: Webpack-native, designed to speed up existing webpack-style projects.

