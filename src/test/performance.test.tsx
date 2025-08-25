/**
 * Performance Tests
 *
 * Tests for page loading speed and rendering performance
 * Requirements: 4.2, 5.3 - Performance optimization verification
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// Mock performance API for testing
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
};

// Mock window.performance
Object.defineProperty(window, "performance", {
  value: mockPerformance,
  writable: true,
});

describe("Performance Tests", () => {
  beforeAll(() => {
    // Mock console methods to avoid noise in tests
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("Markdown Rendering Performance", () => {
    it("should render simple markdown content quickly", async () => {
      const { renderMarkdownOptimized } = await import(
        "../utils/optimizedMarkdownRenderer"
      );

      const simpleContent = `
# Test Heading
This is a simple paragraph with **bold** and *italic* text.
- List item 1
- List item 2
      `;

      const startTime = performance.now();
      const result = await renderMarkdownOptimized(simpleContent, {
        enableHTML: false,
        enableMath: false,
        useMinimalConfig: true,
      });
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(result).toBeDefined();
      expect(renderTime).toBeLessThan(500); // Should render in under 500ms (more realistic)
    });

    it("should handle HTML content efficiently", async () => {
      const { renderMarkdownOptimized } = await import(
        "../utils/optimizedMarkdownRenderer"
      );

      const htmlContent = `
# Test with HTML
<div class="custom-container">
  <p>This is HTML content</p>
  <img src="/test.jpg" alt="Test image" />
</div>
      `;

      const startTime = performance.now();
      const result = await renderMarkdownOptimized(htmlContent, {
        enableHTML: true,
        enableMath: false,
        useMinimalConfig: true,
      });
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(result).toBeDefined();
      expect(renderTime).toBeLessThan(200); // Should render in < 200ms
    });

    it("should conditionally load math support", async () => {
      const { renderMarkdownOptimized } = await import(
        "../utils/optimizedMarkdownRenderer"
      );

      const mathContent = `
# Math Test
This is a formula: $E = mc^2$

And a block formula:
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$
      `;

      const contentWithoutMath = `
# No Math
Just regular content here.
      `;

      // Test with math content
      const startTime1 = performance.now();
      const resultWithMath = await renderMarkdownOptimized(mathContent, {
        enableHTML: false,
        enableMath: true,
        useMinimalConfig: true,
      });
      const endTime1 = performance.now();
      const mathRenderTime = endTime1 - startTime1;

      // Test without math content
      const startTime2 = performance.now();
      const resultWithoutMath = await renderMarkdownOptimized(
        contentWithoutMath,
        {
          enableHTML: false,
          enableMath: true,
          useMinimalConfig: true,
        }
      );
      const endTime2 = performance.now();
      const noMathRenderTime = endTime2 - startTime2;

      expect(resultWithMath).toBeDefined();
      expect(resultWithoutMath).toBeDefined();

      // Math content should take longer but still be reasonable
      expect(mathRenderTime).toBeLessThan(500);
      expect(noMathRenderTime).toBeLessThan(100);
    });
  });

  describe("Component Performance", () => {
    it("should render SafeMarkdownRenderer without performance issues", async () => {
      const SafeMarkdownRenderer = (
        await import("../components/SafeMarkdownRenderer")
      ).default;

      const testContent = `
# Performance Test
This is test content for performance measurement.

## Features
- **Bold text**
- *Italic text*
- \`Code snippets\`

### Code Block
\`\`\`javascript
function test() {
  return "Hello World";
}
\`\`\`
      `;

      const startTime = performance.now();

      render(
        <SafeMarkdownRenderer content={testContent} showErrorDetails={false} />
      );

      // Wait for content to be rendered
      await waitFor(
        () => {
          expect(screen.getByText("Performance Test")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1000); // Should render in < 1 second
    });

    it("should handle large content efficiently", async () => {
      const SafeMarkdownRenderer = (
        await import("../components/SafeMarkdownRenderer")
      ).default;

      // Generate large content
      const largeContent = Array.from(
        { length: 100 },
        (_, i) => `
## Section ${i + 1}
This is section ${
          i + 1
        } with some content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

### Subsection ${i + 1}.1
More content here with **bold** and *italic* text.

\`\`\`javascript
function section${i + 1}() {
  return "Section ${i + 1} code";
}
\`\`\`
      `
      ).join("\n");

      const startTime = performance.now();

      render(
        <SafeMarkdownRenderer content={largeContent} showErrorDetails={false} />
      );

      // Wait for first section to be rendered
      await waitFor(
        () => {
          expect(screen.getByText("Section 1")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(2000); // Should render large content in < 2 seconds
    });
  });

  describe("Bundle Size Impact", () => {
    it("should lazy load heavy dependencies", async () => {
      const { performanceUtils } = await import(
        "../utils/optimizedMarkdownRenderer"
      );

      // Test bundle size estimation
      const htmlFeatures = ["html"];
      const mathFeatures = ["math"];
      const allFeatures = ["html", "math", "gfm", "components"];

      const htmlImpact = performanceUtils.estimateBundleImpact(htmlFeatures);
      const mathImpact = performanceUtils.estimateBundleImpact(mathFeatures);
      const allImpact = performanceUtils.estimateBundleImpact(allFeatures);

      expect(htmlImpact).toBeGreaterThan(0);
      expect(mathImpact).toBeGreaterThan(htmlImpact); // Math should be heavier
      expect(allImpact).toBeGreaterThan(mathImpact);

      // Reasonable size expectations
      expect(htmlImpact).toBeLessThan(100000); // < 100KB
      expect(mathImpact).toBeLessThan(200000); // < 200KB
      expect(allImpact).toBeLessThan(300000); // < 300KB
    });

    it("should provide memory usage information", async () => {
      const { performanceUtils } = await import(
        "../utils/optimizedMarkdownRenderer"
      );

      const memoryUsage = performanceUtils.getMemoryUsage();

      if (memoryUsage) {
        expect(memoryUsage.used).toBeGreaterThan(0);
        expect(memoryUsage.total).toBeGreaterThan(memoryUsage.used);
      } else {
        // Memory API not available in test environment
        expect(memoryUsage).toBeNull();
      }
    });
  });

  describe("Performance Monitoring", () => {
    it("should measure render time accurately", async () => {
      const { performanceUtils } = await import(
        "../utils/optimizedMarkdownRenderer"
      );

      const testFunction = async () => {
        // Simulate some async work
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "test result";
      };

      const { result, duration } = await performanceUtils.measureRenderTime(
        testFunction,
        "test-render"
      );

      expect(result).toBe("test result");
      expect(duration).toBeGreaterThan(40); // Should be at least 40ms
      expect(duration).toBeLessThan(100); // Should be less than 100ms
    });
  });

  describe("Error Handling Performance", () => {
    it("should handle errors efficiently without blocking", async () => {
      const SafeMarkdownRenderer = (
        await import("../components/SafeMarkdownRenderer")
      ).default;

      // Content that might cause issues
      const problematicContent = `
# Test
<div unclosed tag
<script>alert('xss')</script>
<img src="invalid" onerror="alert('xss')">
      `;

      const startTime = performance.now();

      render(
        <SafeMarkdownRenderer
          content={problematicContent}
          showErrorDetails={false}
        />
      );

      // Should still render something
      await waitFor(
        () => {
          expect(screen.getByText("Test")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should handle errors quickly
      expect(renderTime).toBeLessThan(1000);
    });
  });
});
