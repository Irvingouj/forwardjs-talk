#!/bin/bash

# ForwardJS Talk - Photography Website Benchmarking Script
# Compares build performance across bundler and tooling combinations

set -e

EXAMPLES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/examples" && pwd)"
RESULTS_FILE="benchmark-results.txt"

echo "==================================="
echo "ForwardJS Talk - Build Benchmarks"
echo "==================================="
echo ""

# Array of project directories
PROJECTS=(
  "photography-website-turbopack-biome"
  "photography-website-turbopack-eslint"
  "photography-website-webpack-biome"
  "photography-website-webpack-eslint"
)

# Clear previous results
> "$RESULTS_FILE"

echo "Starting benchmark run at $(date)" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

for project in "${PROJECTS[@]}"; do
  PROJECT_DIR="$EXAMPLES_DIR/$project"
  
  if [ ! -d "$PROJECT_DIR" ]; then
    echo "⚠️  Skipping $project (directory not found)" | tee -a "$RESULTS_FILE"
    continue
  fi
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$RESULTS_FILE"
  echo "📦 Testing: $project" | tee -a "$RESULTS_FILE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$RESULTS_FILE"
  
  cd "$PROJECT_DIR"
  
  # Clean previous build
  echo "🧹 Cleaning .next directory..." | tee -a "$RESULTS_FILE"
  rm -rf .next
  
  # Run build with timing
  echo "🔨 Building..." | tee -a "$RESULTS_FILE"
  echo "" | tee -a "$RESULTS_FILE"
  
  START_TIME=$(date +%s.%N)
  npm run build 2>&1 | tee -a "$RESULTS_FILE"
  END_TIME=$(date +%s.%N)
  
  DURATION=$(echo "$END_TIME - $START_TIME" | bc)
  
  echo "" | tee -a "$RESULTS_FILE"
  echo "⏱️  Build completed in: ${DURATION}s" | tee -a "$RESULTS_FILE"
  echo "" | tee -a "$RESULTS_FILE"
  
  # Run check/lint
  echo "🔍 Running code quality checks..." | tee -a "$RESULTS_FILE"
  CHECK_START=$(date +%s.%N)
  npm run check 2>&1 | tail -20 | tee -a "$RESULTS_FILE"
  CHECK_END=$(date +%s.%N)
  CHECK_DURATION=$(echo "$CHECK_END - $CHECK_START" | bc)
  
  echo "" | tee -a "$RESULTS_FILE"
  echo "⏱️  Check completed in: ${CHECK_DURATION}s" | tee -a "$RESULTS_FILE"
  echo "" | tee -a "$RESULTS_FILE"
  
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$RESULTS_FILE"
echo "✅ Benchmark complete!" | tee -a "$RESULTS_FILE"
echo "Results saved to: $RESULTS_FILE" | tee -a "$RESULTS_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$RESULTS_FILE"
