# Why Next.js Is Moving from Webpack to Turbopack

Turbopack is a Rust-based bundler created by the original author of webpack and positioned as webpack’s successor, specifically tuned for Next.js. It’s tempting to summarize it as “webpack but faster,” but that undersells the design goals.

This note captures a more accurate story you can tell in a talk.

---

## What’s Actually Wrong with Webpack for Next.js?

Webpack is a great **general-purpose** bundler, but Next.js is not a general-purpose use case:

- **Performance ceiling on large apps**
  - For very large Next apps, dev builds and HMR with webpack hit a clear ceiling:
    - Cold start in the tens of seconds.
    - Rebuilds/HMR slow enough that developers feel the drag on every iteration.
  - Incremental compilation in webpack is not tuned for Next’s file and routing model.

- **Not tailored to Next’s multi-runtime world**
  - Next.js has to build for multiple targets **at the same time**:
    - Browser bundles for client components.
    - Node.js bundles for server components and APIs.
    - Edge runtime bundles for middleware and edge routes.
  - Webpack can target these runtimes, but its model and plugin ecosystem are **not designed around Next’s specific conventions**:
    - React Server Components.
    - `app/` directory routing and layouts.
    - Server/client boundary semantics.

The result is that Next.js ends up carrying a lot of framework-specific complexity *around* webpack, rather than having a bundler that “speaks Next” natively.

---

## What Turbopack Changes

Turbopack is designed as a **Next-aware bundler** rather than a general-purpose one:

- **Graph and invalidation model are Next-specific**
  - Its module graph understands:
    - The app router and route layout tree.
    - Server vs client components and their boundaries.
    - Multiple runtimes for the same project (browser / Node / Edge).
  - Invalidation and caching are built around these semantics, so Turbopack can rebuild **only the minimal set of modules** when a file changes.

- **Rust gives it headroom for aggressive incrementality**
  - Rust implementation + careful caching allow:
    - Much faster cold starts on large apps (Vercel’s launch blog shows ~35s → ~2s on a big Next app).
    - Extremely fast HMR / Fast Refresh loops (headline “up to 700× faster than webpack” on huge projects, with the caveat that this is a vendor benchmark).

In other words, Turbopack isn’t just faster webpack—it’s a bundler whose data structures and invalidation logic are built around **Next’s specific file structure and runtimes**, and Rust gives it the horsepower to actually exploit that design.

---

## How to Explain It in a Talk

A reasonable, accurate summary to say on a slide:

> Webpack is a fantastic general-purpose bundler, but Next.js lives in a weird world: it has to build for the browser, for Node, and for the Edge runtime at the same time, and it has a lot of framework-specific conventions (app router, layouts, server/client components).
> 
> Turbopack is a Rust bundler that bakes those Next.js assumptions into its graph and caching model. That lets it treat your Next app as more than just “a bunch of JS files,” simplify the effective dependency graph, and do much more aggressive incremental work than a generic webpack setup.

This framing keeps the emphasis on:

- **Next-specific graph & invalidation model**.
- **Multi-runtime awareness**.
- **Rust-powered incremental performance**.

…instead of just “Rust + some benchmarks”.

