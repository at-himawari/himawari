#!/usr/bin/env node

/**
 * Performance Benchmark Script
 * Measures build time and bundle size impact of HTML support in markdown
 * Requirements: 4.2, 5.3 - Performance optimization
 */

import { execSync } from "child_process";
import { readFileSync, statSync, readdirSync } from "fs";
import { join } from "path";

const BENCHMARK_RUNS = 3;

/**
 * Measure build time
 */
function measureBuildTime() {
  console.log("📊 Measuring build time...");
  const times = [];

  for (let i = 0; i < BENCHMARK_RUNS; i++) {
    console.log(`  Run ${i + 1}/${BENCHMARK_RUNS}...`);

    // Clean previous build
    try {
      execSync("rm -rf dist", { stdio: "pipe" });
    } catch (e) {
      // Ignore if dist doesn't exist
    }

    const startTime = Date.now();
    try {
      execSync("npm run build", { stdio: "pipe" });
      const endTime = Date.now();
      const buildTime = endTime - startTime;
      times.push(buildTime);
      console.log(`    Build time: ${buildTime}ms`);
    } catch (error) {
      console.error(`    Build failed: ${error.message}`);
      return null;
    }
  }

  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  return {
    average: avgTime,
    min: minTime,
    max: maxTime,
    runs: times,
  };
}

/**
 * Analyze bundle size
 */
function analyzeBundleSize() {
  console.log("📦 Analyzing bundle size...");

  const distPath = "dist";
  if (!statSync(distPath).isDirectory()) {
    console.error("❌ dist directory not found. Run build first.");
    return null;
  }

  const sizes = {
    total: 0,
    js: 0,
    css: 0,
    html: 0,
    assets: 0,
  };

  function analyzeDirectory(dirPath, relativePath = "") {
    const files = readdirSync(dirPath);

    for (const file of files) {
      const fullPath = join(dirPath, file);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        analyzeDirectory(fullPath, join(relativePath, file));
      } else {
        const size = stat.size;
        sizes.total += size;

        const ext = file.split(".").pop()?.toLowerCase();
        switch (ext) {
          case "js":
          case "mjs":
            sizes.js += size;
            break;
          case "css":
            sizes.css += size;
            break;
          case "html":
            sizes.html += size;
            break;
          default:
            sizes.assets += size;
        }

        // Log large files
        if (size > 100 * 1024) {
          // > 100KB
          console.log(
            `    📄 ${join(relativePath, file)}: ${formatBytes(size)}`
          );
        }
      }
    }
  }

  analyzeDirectory(distPath);

  return sizes;
}

/**
 * Check for potential optimizations
 */
function checkOptimizations() {
  console.log("🔍 Checking for optimization opportunities...");

  const suggestions = [];

  // Check if rehype plugins are tree-shaken properly
  try {
    const buildOutput = execSync("npm run build", {
      encoding: "utf8",
      stdio: "pipe",
    });

    // Look for large chunks in build output
    if (buildOutput.includes("Large chunk sizes")) {
      suggestions.push("Consider code splitting for large chunks");
    }
  } catch (e) {
    // Build output analysis failed
  }

  // Check package.json for potential optimizations
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  // Check for unused rehype/remark plugins
  const markdownPlugins = Object.keys(deps).filter(
    (dep) => dep.startsWith("rehype-") || dep.startsWith("remark-")
  );

  if (markdownPlugins.length > 5) {
    suggestions.push(
      `Consider reviewing ${markdownPlugins.length} markdown plugins for necessity`
    );
  }

  // Check for duplicate functionality
  if (deps["react-markdown"] && deps["@mdx-js/rollup"]) {
    suggestions.push("Consider if both react-markdown and MDX are needed");
  }

  return suggestions;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Generate performance report
 */
function generateReport(buildTime, bundleSize, optimizations) {
  console.log("\n" + "=".repeat(60));
  console.log("📊 PERFORMANCE BENCHMARK REPORT");
  console.log("=".repeat(60));

  if (buildTime) {
    console.log("\n🏗️  BUILD TIME ANALYSIS:");
    console.log(`   Average: ${buildTime.average.toFixed(0)}ms`);
    console.log(`   Range: ${buildTime.min}ms - ${buildTime.max}ms`);
    console.log(`   Runs: ${buildTime.runs.map((t) => `${t}ms`).join(", ")}`);

    // Performance assessment
    if (buildTime.average < 5000) {
      console.log("   ✅ Build time is excellent (< 5s)");
    } else if (buildTime.average < 10000) {
      console.log("   ⚠️  Build time is acceptable (5-10s)");
    } else {
      console.log("   ❌ Build time needs optimization (> 10s)");
    }
  }

  if (bundleSize) {
    console.log("\n📦 BUNDLE SIZE ANALYSIS:");
    console.log(`   Total: ${formatBytes(bundleSize.total)}`);
    console.log(`   JavaScript: ${formatBytes(bundleSize.js)}`);
    console.log(`   CSS: ${formatBytes(bundleSize.css)}`);
    console.log(`   HTML: ${formatBytes(bundleSize.html)}`);
    console.log(`   Assets: ${formatBytes(bundleSize.assets)}`);

    // Size assessment
    const totalMB = bundleSize.total / (1024 * 1024);
    if (totalMB < 1) {
      console.log("   ✅ Bundle size is excellent (< 1MB)");
    } else if (totalMB < 3) {
      console.log("   ⚠️  Bundle size is acceptable (1-3MB)");
    } else {
      console.log("   ❌ Bundle size needs optimization (> 3MB)");
    }
  }

  if (optimizations && optimizations.length > 0) {
    console.log("\n🔧 OPTIMIZATION SUGGESTIONS:");
    optimizations.forEach((suggestion, i) => {
      console.log(`   ${i + 1}. ${suggestion}`);
    });
  } else {
    console.log("\n✅ No obvious optimization opportunities found");
  }

  console.log("\n" + "=".repeat(60));
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Starting performance benchmark...\n");

  const buildTime = measureBuildTime();
  const bundleSize = buildTime ? analyzeBundleSize() : null;
  const optimizations = checkOptimizations();

  generateReport(buildTime, bundleSize, optimizations);
}

main().catch(console.error);
