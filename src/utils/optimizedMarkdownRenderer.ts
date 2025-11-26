/**
 * Optimized Markdown Renderer
 *
 * Lightweight version with lazy loading and code splitting
 * Requirements: 4.2, 5.3 - Performance optimization
 */

import React from "react";

// Lazy imports for better code splitting
const lazyImports = {
  ReactMarkdown: () => import("react-markdown"),
  remarkGfm: () => import("remark-gfm"),
  remarkMath: () => import("remark-math"),
  rehypeKatex: () => import("rehype-katex"),
  rehypeRaw: () => import("rehype-raw"),
  rehypeSanitize: () => import("rehype-sanitize"),
};

// Cached imports to avoid repeated loading
const importCache = new Map<string, any>();

/**
 * Lazy import with caching
 */
async function lazyImport<T>(key: keyof typeof lazyImports): Promise<T> {
  if (importCache.has(key)) {
    return importCache.get(key);
  }

  const module = await lazyImports[key]();
  const result = module.default || module;
  importCache.set(key, result);
  return result;
}

/**
 * Minimal sanitization config for better performance
 */
const minimalSanitizeConfig = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "del",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "a",
    "img",
    "div",
    "span",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
  allowedAttributes: {
    "*": ["class", "id"],
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    div: ["class"],
    span: ["class"],
  },
  disallowedTagsMode: "discard" as const,
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"],
};

/**
 * Performance-optimized markdown rendering
 */
export class OptimizedMarkdownRenderer {
  private static instance: OptimizedMarkdownRenderer;
  private componentsCache: any = null;

  static getInstance(): OptimizedMarkdownRenderer {
    if (!OptimizedMarkdownRenderer.instance) {
      OptimizedMarkdownRenderer.instance = new OptimizedMarkdownRenderer();
    }
    return OptimizedMarkdownRenderer.instance;
  }

  /**
   * Render markdown with performance optimizations
   */
  async render(
    content: string,
    options: {
      enableHTML?: boolean;
      enableMath?: boolean;
      useMinimalConfig?: boolean;
    } = {}
  ): Promise<React.ReactElement> {
    const {
      enableHTML = true,
      enableMath = true,
      useMinimalConfig = false,
    } = options;

    try {
      // Load only required plugins
      const [ReactMarkdown, remarkGfm] = await Promise.all([
        lazyImport<any>("ReactMarkdown"),
        lazyImport<any>("remarkGfm"),
      ]);

      const remarkPlugins = [remarkGfm];
      const rehypePlugins = [];

      // Conditionally load math support
      if (enableMath && this.containsMath(content)) {
        const [remarkMath, rehypeKatex] = await Promise.all([
          lazyImport<any>("remarkMath"),
          lazyImport<any>("rehypeKatex"),
        ]);
        remarkPlugins.push(remarkMath);
        rehypePlugins.push(rehypeKatex);
      }

      // Conditionally load HTML support
      if (enableHTML && this.containsHTML(content)) {
        const [rehypeRaw, rehypeSanitize] = await Promise.all([
          lazyImport<any>("rehypeRaw"),
          lazyImport<any>("rehypeSanitize"),
        ]);

        rehypePlugins.unshift(rehypeRaw);

        const sanitizeConfig = useMinimalConfig
          ? minimalSanitizeConfig
          : await this.getFullSanitizeConfig();

        rehypePlugins.push([rehypeSanitize, sanitizeConfig]);
      }

      // Get cached components
      const components = await this.getComponents();

      return React.createElement(
        ReactMarkdown,
        {
          remarkPlugins,
          rehypePlugins,
          components,
        },
        content
      );
    } catch (error) {
      console.warn(
        "Optimized markdown rendering failed, using fallback:",
        error
      );
      return this.renderFallback(content);
    }
  }

  /**
   * Check if content contains mathematical expressions
   */
  private containsMath(content: string): boolean {
    return /\$\$[\s\S]*?\$\$|\$[^$\n]*\$|\\begin\{[^}]+\}/.test(content);
  }

  /**
   * Check if content contains HTML tags
   */
  private containsHTML(content: string): boolean {
    return /<[a-zA-Z][^>]*>/.test(content);
  }

  /**
   * Get full sanitize config with lazy loading
   */
  private async getFullSanitizeConfig() {
    const { sanitizeConfig } = await import("./sanitizeConfig");
    return sanitizeConfig;
  }

  /**
   * Get markdown components with caching
   */
  private async getComponents() {
    if (!this.componentsCache) {
      const { markdownComponents } = await import(
        "../components/MarkdownComponents"
      );
      this.componentsCache = markdownComponents;
    }
    return this.componentsCache;
  }

  /**
   * Simple fallback renderer
   */
  private renderFallback(content: string): React.ReactElement {
    // Strip HTML and render as plain text with basic formatting
    const plainText = content
      .replace(/<[^>]*>/g, "")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>");

    return React.createElement("div", {
      className: "prose max-w-none",
      dangerouslySetInnerHTML: { __html: plainText },
    });
  }
}

/**
 * Convenience function for optimized rendering
 */
export async function renderMarkdownOptimized(
  content: string,
  options?: Parameters<OptimizedMarkdownRenderer["render"]>[1]
): Promise<React.ReactElement> {
  const renderer = OptimizedMarkdownRenderer.getInstance();
  return renderer.render(content, options);
}

/**
 * Performance monitoring utilities
 */
export const performanceUtils = {
  /**
   * Measure rendering performance
   */
  async measureRenderTime<T>(
    renderFn: () => Promise<T>,
    label: string = "render"
  ): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await renderFn();
    const end = performance.now();
    const duration = end - start;

    return { result, duration };
  },

  /**
   * Memory usage monitoring
   */
  getMemoryUsage(): { used: number; total: number } | null {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
      };
    }
    return null;
  },

  /**
   * Bundle size estimation
   */
  estimateBundleImpact(features: string[]): number {
    const featureSizes = {
      html: 45000, // rehype-raw + rehype-sanitize
      math: 180000, // katex
      gfm: 25000, // remark-gfm
      components: 15000, // custom components
    };

    return features.reduce((total, feature) => {
      return total + (featureSizes[feature as keyof typeof featureSizes] || 0);
    }, 0);
  },
};
