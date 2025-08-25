#!/usr/bin/env node

/**
 * Bundle Analyzer Script
 *
 * Analyzes bundle size and provides optimization recommendations
 * Requirements: 4.2, 5.3 - Bundle size optimization
 */

import { readFileSync, statSync, readdirSync } from "fs";
import { join, extname } from "path";
import { execSync } from "child_process";

/**
 * Analyze bundle composition
 */
function analyzeBundleComposition() {
  console.log("📦 Analyzing bundle composition...\n");

  const distPath = "dist";
  const analysis = {
    chunks: [],
    totalSize: 0,
    categories: {
      vendor: 0,
      app: 0,
      css: 0,
      assets: 0,
    },
  };

  function analyzeFile(filePath, relativePath) {
    const stat = statSync(filePath);
    const size = stat.size;
    const ext = extname(filePath).toLowerCase();

    analysis.totalSize += size;

    const fileInfo = {
      path: relativePath,
      size,
      sizeFormatted: formatBytes(size),
      type: ext,
    };

    // Categorize files
    if (
      relativePath.includes("node_modules") ||
      relativePath.includes("vendor")
    ) {
      analysis.categories.vendor += size;
    } else if (ext === ".css") {
      analysis.categories.css += size;
    } else if ([".js", ".mjs", ".ts"].includes(ext)) {
      analysis.categories.app += size;
    } else {
      analysis.categories.assets += size;
    }

    // Track large chunks
    if (size > 50 * 1024) {
      // > 50KB
      analysis.chunks.push(fileInfo);
    }

    return fileInfo;
  }

  function walkDirectory(dirPath, relativePath = "") {
    try {
      const files = readdirSync(dirPath);

      for (const file of files) {
        const fullPath = join(dirPath, file);
        const relPath = join(relativePath, file);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          walkDirectory(fullPath, relPath);
        } else {
          analyzeFile(fullPath, relPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not analyze ${dirPath}:`, error.message);
    }
  }

  walkDirectory(distPath);

  // Sort chunks by size
  analysis.chunks.sort((a, b) => b.size - a.size);

  return analysis;
}

/**
 * Analyze dependencies impact
 */
function analyzeDependencies() {
  console.log("📋 Analyzing dependencies impact...\n");

  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const deps = packageJson.dependencies || {};

  // Estimate sizes of key dependencies
  const dependencySizes = {
    react: 42000,
    "react-dom": 130000,
    "react-markdown": 85000,
    "rehype-raw": 25000,
    "rehype-sanitize": 35000,
    "rehype-katex": 180000, // Includes KaTeX
    "remark-gfm": 45000,
    "remark-math": 15000,
    "react-icons": 120000,
    vike: 95000,
    "vike-react": 25000,
  };

  const analysis = {
    total: 0,
    breakdown: [],
    recommendations: [],
  };

  Object.keys(deps).forEach((dep) => {
    const estimatedSize = dependencySizes[dep] || 10000; // Default estimate
    analysis.total += estimatedSize;
    analysis.breakdown.push({
      name: dep,
      version: deps[dep],
      estimatedSize,
      sizeFormatted: formatBytes(estimatedSize),
    });
  });

  // Sort by size
  analysis.breakdown.sort((a, b) => b.estimatedSize - a.estimatedSize);

  // Generate recommendations
  if (deps["react-markdown"] && deps["@mdx-js/rollup"]) {
    analysis.recommendations.push({
      type: "duplicate",
      message: "Consider using either react-markdown OR MDX, not both",
      impact: "Could save ~85KB",
    });
  }

  if (deps["rehype-katex"]) {
    analysis.recommendations.push({
      type: "conditional",
      message: "Load KaTeX only when math content is detected",
      impact: "Could save ~180KB for pages without math",
    });
  }

  if (deps["react-icons"]) {
    analysis.recommendations.push({
      type: "tree-shaking",
      message: "Ensure only used icons are bundled",
      impact: "Could save 50-100KB with proper tree shaking",
    });
  }

  return analysis;
}

/**
 * Check for optimization opportunities
 */
function checkOptimizations() {
  console.log("🔍 Checking optimization opportunities...\n");

  const opportunities = [];

  // Check for code splitting opportunities
  try {
    const buildLog = execSync("npm run build 2>&1", { encoding: "utf8" });

    if (buildLog.includes("Large chunk sizes")) {
      opportunities.push({
        type: "code-splitting",
        priority: "high",
        description: "Large chunks detected - consider code splitting",
        action: "Implement dynamic imports for heavy components",
      });
    }
  } catch (e) {
    // Build log analysis failed
  }

  // Check vite config for optimizations
  try {
    const viteConfig = readFileSync("vite.config.ts", "utf8");

    if (!viteConfig.includes("rollupOptions")) {
      opportunities.push({
        type: "build-config",
        priority: "medium",
        description: "No custom rollup options found",
        action: "Add manual chunk splitting in vite.config.ts",
      });
    }

    if (!viteConfig.includes("minify")) {
      opportunities.push({
        type: "minification",
        priority: "medium",
        description: "Minification not explicitly configured",
        action: "Ensure terser minification is enabled",
      });
    }
  } catch (e) {
    // Vite config analysis failed
  }

  // Check for unused dependencies
  try {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    const deps = Object.keys(packageJson.dependencies || {});

    // Simple heuristic: check if dependency is imported in src/
    const srcFiles = getAllFiles("src/", [".ts", ".tsx", ".js", ".jsx"]);
    const srcContent = srcFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    const unusedDeps = deps.filter((dep) => {
      const importPatterns = [
        new RegExp(`from ['"]${dep}['"]`, "g"),
        new RegExp(`import ['"]${dep}['"]`, "g"),
        new RegExp(`require\\(['"]${dep}['"]\\)`, "g"),
      ];

      return !importPatterns.some((pattern) => pattern.test(srcContent));
    });

    if (unusedDeps.length > 0) {
      opportunities.push({
        type: "unused-deps",
        priority: "low",
        description: `Potentially unused dependencies: ${unusedDeps.join(
          ", "
        )}`,
        action: "Review and remove unused dependencies",
      });
    }
  } catch (e) {
    // Unused dependency analysis failed
  }

  return opportunities;
}

/**
 * Get all files with specific extensions
 */
function getAllFiles(dirPath, extensions, files = []) {
  try {
    const items = readdirSync(dirPath);

    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        getAllFiles(fullPath, extensions, files);
      } else if (extensions.includes(extname(item))) {
        files.push(fullPath);
      }
    }
  } catch (e) {
    // Directory read failed
  }

  return files;
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
 * Generate optimization report
 */
function generateOptimizationReport(
  bundleAnalysis,
  depAnalysis,
  opportunities
) {
  console.log("=".repeat(80));
  console.log("📊 BUNDLE OPTIMIZATION REPORT");
  console.log("=".repeat(80));

  // Bundle composition
  console.log("\n📦 BUNDLE COMPOSITION:");
  console.log(`   Total Size: ${formatBytes(bundleAnalysis.totalSize)}`);
  console.log(
    `   App Code: ${formatBytes(bundleAnalysis.categories.app)} (${(
      (bundleAnalysis.categories.app / bundleAnalysis.totalSize) *
      100
    ).toFixed(1)}%)`
  );
  console.log(
    `   Vendor: ${formatBytes(bundleAnalysis.categories.vendor)} (${(
      (bundleAnalysis.categories.vendor / bundleAnalysis.totalSize) *
      100
    ).toFixed(1)}%)`
  );
  console.log(
    `   CSS: ${formatBytes(bundleAnalysis.categories.css)} (${(
      (bundleAnalysis.categories.css / bundleAnalysis.totalSize) *
      100
    ).toFixed(1)}%)`
  );
  console.log(
    `   Assets: ${formatBytes(bundleAnalysis.categories.assets)} (${(
      (bundleAnalysis.categories.assets / bundleAnalysis.totalSize) *
      100
    ).toFixed(1)}%)`
  );

  // Large chunks
  if (bundleAnalysis.chunks.length > 0) {
    console.log("\n📄 LARGE CHUNKS (>50KB):");
    bundleAnalysis.chunks.slice(0, 10).forEach((chunk, i) => {
      console.log(`   ${i + 1}. ${chunk.path}: ${chunk.sizeFormatted}`);
    });
  }

  // Dependencies
  console.log("\n📋 TOP DEPENDENCIES BY SIZE:");
  depAnalysis.breakdown.slice(0, 10).forEach((dep, i) => {
    console.log(`   ${i + 1}. ${dep.name}: ${dep.sizeFormatted}`);
  });

  // Recommendations
  if (depAnalysis.recommendations.length > 0) {
    console.log("\n💡 DEPENDENCY RECOMMENDATIONS:");
    depAnalysis.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. [${rec.type.toUpperCase()}] ${rec.message}`);
      console.log(`      Impact: ${rec.impact}`);
    });
  }

  // Optimization opportunities
  if (opportunities.length > 0) {
    console.log("\n🔧 OPTIMIZATION OPPORTUNITIES:");
    opportunities.forEach((opp, i) => {
      const priority =
        opp.priority === "high"
          ? "🔴"
          : opp.priority === "medium"
          ? "🟡"
          : "🟢";
      console.log(
        `   ${i + 1}. ${priority} [${opp.type.toUpperCase()}] ${
          opp.description
        }`
      );
      console.log(`      Action: ${opp.action}`);
    });
  }

  // Overall assessment
  console.log("\n📈 PERFORMANCE ASSESSMENT:");
  const totalMB = bundleAnalysis.totalSize / (1024 * 1024);
  if (totalMB < 1) {
    console.log("   ✅ Bundle size is excellent (< 1MB)");
  } else if (totalMB < 2) {
    console.log("   ⚠️  Bundle size is good (1-2MB)");
  } else if (totalMB < 3) {
    console.log("   ⚠️  Bundle size is acceptable (2-3MB)");
  } else {
    console.log("   ❌ Bundle size needs optimization (> 3MB)");
  }

  console.log("\n" + "=".repeat(80));
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Starting bundle analysis...\n");

  // Ensure build exists
  try {
    statSync("dist");
  } catch (e) {
    console.log("📦 Building project first...");
    execSync("npm run build", { stdio: "inherit" });
    console.log("");
  }

  const bundleAnalysis = analyzeBundleComposition();
  const depAnalysis = analyzeDependencies();
  const opportunities = checkOptimizations();

  generateOptimizationReport(bundleAnalysis, depAnalysis, opportunities);
}

main().catch(console.error);
