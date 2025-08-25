/**
 * Markdown Error Handler and Fallback System
 *
 * Implements comprehensive error handling for HTML+Markdown rendering
 * Requirements: 2.1, 4.2 - Error handling and fallback functionality
 */

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { markdownComponents } from "../components/MarkdownComponents";
import { logger } from "./errorLogger";

/**
 * Error types for markdown rendering
 */
export enum MarkdownErrorType {
  HTML_PARSING_ERROR = "HTML_PARSING_ERROR",
  SANITIZATION_ERROR = "SANITIZATION_ERROR",
  RENDERING_ERROR = "RENDERING_ERROR",
  INVALID_HTML_STRUCTURE = "INVALID_HTML_STRUCTURE",
  PLUGIN_ERROR = "PLUGIN_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Error details interface
 */
export interface MarkdownError {
  type: MarkdownErrorType;
  message: string;
  originalError?: Error;
  content?: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

/**
 * Rendering result interface
 */
export interface MarkdownRenderResult {
  success: boolean;
  content: React.ReactElement | string;
  errors: MarkdownError[];
  fallbackUsed: boolean;
  renderingMode: "full" | "safe" | "plain";
}

/**
 * HTML validation result
 */
export interface HTMLValidationResult {
  isValid: boolean;
  errors: string[];
  correctedHTML?: string;
  hasUnclosedTags: boolean;
  hasInvalidNesting: boolean;
}

/**
 * Markdown Error Handler Class
 */
export class MarkdownErrorHandler {
  private errors: MarkdownError[] = [];
  private debugMode: boolean;

  constructor(debugMode = process.env.NODE_ENV === "development") {
    this.debugMode = debugMode;
  }

  /**
   * Main rendering method with comprehensive error handling
   */
  async renderWithFallback(content: string): Promise<MarkdownRenderResult> {
    this.clearErrors();

    // Step 1: Validate and correct HTML structure
    const htmlValidation = this.validateAndCorrectHTML(content);
    let processedContent = htmlValidation.correctedHTML || content;

    if (!htmlValidation.isValid) {
      this.logError({
        type: MarkdownErrorType.INVALID_HTML_STRUCTURE,
        message: `HTML structure issues detected: ${htmlValidation.errors.join(
          ", "
        )}`,
        content: content.substring(0, 200) + "...",
        timestamp: new Date(),
        context: { validationErrors: htmlValidation.errors },
      });
    }

    // Step 2: Try full HTML+Markdown rendering
    try {
      const fullRenderResult = await this.tryFullRendering(processedContent);
      if (fullRenderResult.success) {
        return {
          success: true,
          content: fullRenderResult.content,
          errors: [...this.errors],
          fallbackUsed: false,
          renderingMode: "full",
        };
      }
    } catch (error) {
      this.logError({
        type: MarkdownErrorType.RENDERING_ERROR,
        message: "Full HTML+Markdown rendering failed",
        originalError: error as Error,
        content: processedContent.substring(0, 200) + "...",
        timestamp: new Date(),
      });
    }

    // Step 3: Try safe rendering (Markdown only, HTML stripped)
    try {
      const safeRenderResult = await this.trySafeRendering(content);
      if (safeRenderResult.success) {
        return {
          success: true,
          content: safeRenderResult.content,
          errors: [...this.errors],
          fallbackUsed: true,
          renderingMode: "safe",
        };
      }
    } catch (error) {
      this.logError({
        type: MarkdownErrorType.RENDERING_ERROR,
        message: "Safe Markdown rendering failed",
        originalError: error as Error,
        content: content.substring(0, 200) + "...",
        timestamp: new Date(),
      });
    }

    // Step 4: Final fallback - plain text
    return {
      success: false,
      content: this.renderPlainText(content),
      errors: [...this.errors],
      fallbackUsed: true,
      renderingMode: "plain",
    };
  }

  /**
   * Validate and correct HTML structure
   */
  private validateAndCorrectHTML(content: string): HTMLValidationResult {
    const errors: string[] = [];
    let correctedHTML = content;
    let hasUnclosedTags = false;
    let hasInvalidNesting = false;

    // Check for unclosed tags
    const unclosedTags = this.findUnclosedTags(content);
    if (unclosedTags.length > 0) {
      hasUnclosedTags = true;
      errors.push(`Unclosed tags found: ${unclosedTags.join(", ")}`);
      correctedHTML = this.autoCloseUnclosedTags(correctedHTML, unclosedTags);
    }

    // Check for invalid nesting
    const nestingIssues = this.findInvalidNesting(correctedHTML);
    if (nestingIssues.length > 0) {
      hasInvalidNesting = true;
      errors.push(`Invalid nesting found: ${nestingIssues.join(", ")}`);
      correctedHTML = this.fixInvalidNesting(correctedHTML);
    }

    // Check for malformed attributes
    const malformedAttrs = this.findMalformedAttributes(correctedHTML);
    if (malformedAttrs.length > 0) {
      errors.push(`Malformed attributes: ${malformedAttrs.join(", ")}`);
      correctedHTML = this.fixMalformedAttributes(correctedHTML);
    }

    return {
      isValid: errors.length === 0,
      errors,
      correctedHTML: correctedHTML !== content ? correctedHTML : undefined,
      hasUnclosedTags,
      hasInvalidNesting,
    };
  }

  /**
   * Find unclosed HTML tags
   */
  private findUnclosedTags(content: string): string[] {
    const openTags: string[] = [];
    const unclosedTags: string[] = [];

    // Self-closing tags that don't need closing
    const selfClosingTags = new Set([
      "img",
      "br",
      "hr",
      "input",
      "meta",
      "link",
      "area",
      "base",
      "col",
      "embed",
      "source",
      "track",
      "wbr",
    ]);

    // Find all HTML tags
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
    let match;

    while ((match = tagRegex.exec(content)) !== null) {
      const fullTag = match[0];
      const tagName = match[1].toLowerCase();

      if (selfClosingTags.has(tagName) || fullTag.endsWith("/>")) {
        continue; // Skip self-closing tags
      }

      if (fullTag.startsWith("</")) {
        // Closing tag
        const lastOpenIndex = openTags.lastIndexOf(tagName);
        if (lastOpenIndex !== -1) {
          openTags.splice(lastOpenIndex, 1);
        }
      } else {
        // Opening tag
        openTags.push(tagName);
      }
    }

    return [...new Set(openTags)]; // Remove duplicates
  }

  /**
   * Auto-close unclosed tags
   */
  private autoCloseUnclosedTags(
    content: string,
    unclosedTags: string[]
  ): string {
    let corrected = content;

    // Add closing tags at the end
    unclosedTags.forEach((tag) => {
      corrected += `</${tag}>`;
    });

    return corrected;
  }

  /**
   * Find invalid HTML nesting
   */
  private findInvalidNesting(content: string): string[] {
    const issues: string[] = [];

    // Check for common invalid nesting patterns
    const invalidPatterns = [
      { pattern: /<p[^>]*>[\s\S]*?<div/gi, issue: "div inside p tag" },
      { pattern: /<p[^>]*>[\s\S]*?<h[1-6]/gi, issue: "heading inside p tag" },
      { pattern: /<a[^>]*>[\s\S]*?<a/gi, issue: "nested anchor tags" },
      {
        pattern: /<button[^>]*>[\s\S]*?<button/gi,
        issue: "nested button tags",
      },
    ];

    invalidPatterns.forEach(({ pattern, issue }) => {
      if (pattern.test(content)) {
        issues.push(issue);
      }
    });

    return issues;
  }

  /**
   * Fix invalid nesting by restructuring HTML
   */
  private fixInvalidNesting(content: string): string {
    let fixed = content;

    // Fix div inside p tags by closing p before div
    fixed = fixed.replace(/<p([^>]*)>([\s\S]*?)<div/gi, "<p$1>$2</p><div");

    // Fix headings inside p tags
    fixed = fixed.replace(/<p([^>]*)>([\s\S]*?)<h([1-6])/gi, "<p$1>$2</p><h$3");

    // Remove nested anchor tags (keep outer)
    fixed = fixed.replace(
      /<a([^>]*)>([\s\S]*?)<a[^>]*>([\s\S]*?)<\/a>([\s\S]*?)<\/a>/gi,
      "<a$1>$2$3$4</a>"
    );

    return fixed;
  }

  /**
   * Find malformed attributes
   */
  private findMalformedAttributes(content: string): string[] {
    const issues: string[] = [];

    // Check for unquoted attribute values with spaces
    const unquotedWithSpaces = /\s+(\w+)=([^"'\s>]+\s+[^"'\s>]*)/g;
    if (unquotedWithSpaces.test(content)) {
      issues.push("unquoted attributes with spaces");
    }

    // Check for unclosed quotes in attributes
    const unclosedQuotes = /\s+\w+="[^"]*$/gm;
    if (unclosedQuotes.test(content)) {
      issues.push("unclosed attribute quotes");
    }

    return issues;
  }

  /**
   * Fix malformed attributes
   */
  private fixMalformedAttributes(content: string): string {
    let fixed = content;

    // Quote unquoted attribute values with spaces
    fixed = fixed.replace(/(\s+\w+)=([^"'\s>]+\s+[^"'\s>]*)/g, '$1="$2"');

    // Close unclosed quotes (simple heuristic)
    fixed = fixed.replace(/(\s+\w+="[^"]*$)/gm, '$1"');

    return fixed;
  }

  /**
   * Try full HTML+Markdown rendering
   */
  private async tryFullRendering(
    content: string
  ): Promise<{ success: boolean; content: React.ReactElement }> {
    try {
      // Import plugins dynamically to catch import errors
      const [{ default: rehypeRaw }, { default: rehypeSanitize }] =
        await Promise.all([import("rehype-raw"), import("rehype-sanitize")]);

      const { sanitizeConfig } = await import("./sanitizeConfig");

      const element = React.createElement(
        ReactMarkdown,
        {
          rehypePlugins: [
            rehypeRaw,
            rehypeKatex,
            [rehypeSanitize, sanitizeConfig],
          ],
          remarkPlugins: [remarkGfm, remarkMath],
          components: markdownComponents,
        },
        content
      );

      return { success: true, content: element };
    } catch (error) {
      this.logError({
        type: MarkdownErrorType.PLUGIN_ERROR,
        message: "Failed to load or execute rehype plugins",
        originalError: error as Error,
        timestamp: new Date(),
      });
      return { success: false, content: React.createElement("div") };
    }
  }

  /**
   * Try safe rendering (Markdown only, HTML stripped)
   */
  private async trySafeRendering(
    content: string
  ): Promise<{ success: boolean; content: React.ReactElement }> {
    try {
      // Strip HTML tags for safe rendering
      const markdownOnly = this.stripHTMLTags(content);

      const element = React.createElement(
        ReactMarkdown,
        {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeKatex],
          components: markdownComponents,
        },
        markdownOnly
      );

      return { success: true, content: element };
    } catch (error) {
      this.logError({
        type: MarkdownErrorType.RENDERING_ERROR,
        message: "Safe Markdown rendering failed",
        originalError: error as Error,
        timestamp: new Date(),
      });
      return { success: false, content: React.createElement("div") };
    }
  }

  /**
   * Strip HTML tags from content
   */
  private stripHTMLTags(content: string): string {
    return content.replace(/<[^>]*>/g, "");
  }

  /**
   * Render as plain text (final fallback)
   */
  private renderPlainText(content: string): string {
    // Remove HTML tags and markdown syntax
    let plainText = content
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/[#*_`~\[\]()]/g, "") // Remove markdown syntax
      .replace(/\n{3,}/g, "\n\n") // Normalize line breaks
      .trim();

    return plainText;
  }

  /**
   * Log error with debugging information
   */
  private logError(error: MarkdownError): void {
    this.errors.push(error);

    // Use centralized error logger
    logger.markdownError(
      error.type,
      error.message,
      error.content,
      error.originalError
    );

    // Additional context logging
    if (error.context) {
      logger.debug("Markdown error context", error.context);
    }

    if (this.debugMode) {
      console.group(`🚨 Markdown Error: ${error.type}`);
      console.error("Message:", error.message);
      console.error("Timestamp:", error.timestamp.toISOString());

      if (error.originalError) {
        console.error("Original Error:", error.originalError);
        console.error("Stack:", error.originalError.stack);
      }

      if (error.content) {
        console.error("Content Preview:", error.content);
      }

      if (error.context) {
        console.error("Context:", error.context);
      }

      console.groupEnd();
    }
  }

  /**
   * Clear accumulated errors
   */
  private clearErrors(): void {
    this.errors = [];
  }

  /**
   * Get all accumulated errors
   */
  public getErrors(): MarkdownError[] {
    return [...this.errors];
  }

  /**
   * Get error statistics
   */
  public getErrorStats(): Record<MarkdownErrorType, number> {
    const stats = Object.values(MarkdownErrorType).reduce((acc, type) => {
      acc[type] = 0;
      return acc;
    }, {} as Record<MarkdownErrorType, number>);

    this.errors.forEach((error) => {
      stats[error.type]++;
    });

    return stats;
  }
}

/**
 * Global error handler instance
 */
export const markdownErrorHandler = new MarkdownErrorHandler();

/**
 * Convenience function for rendering markdown with error handling
 */
export async function renderMarkdownSafely(
  content: string
): Promise<MarkdownRenderResult> {
  return markdownErrorHandler.renderWithFallback(content);
}
