/**
 * Content Security Utilities
 *
 * Additional security layer for validating and processing HTML content
 * Implements requirements 2.1, 2.2, and 2.3 for comprehensive security
 */

import { securityUtils, allowedIframeDomains } from "./sanitizeConfig";

/**
 * Security validation results
 */
export interface SecurityValidationResult {
  isValid: boolean;
  warnings: string[];
  sanitizedContent?: string;
}

/**
 * Content security validator class
 */
export class ContentSecurityValidator {
  private warnings: string[] = [];

  /**
   * Validates HTML content for security issues
   */
  validateContent(content: string): SecurityValidationResult {
    this.warnings = [];
    let isValid = true;

    // Check for dangerous script patterns
    if (this.containsScriptTags(content)) {
      this.addWarning("Script tags detected and will be removed");
      isValid = false;
    }

    // Check for dangerous event handlers
    if (this.containsEventHandlers(content)) {
      this.addWarning("Event handlers detected and will be removed");
      isValid = false;
    }

    // Check for javascript: protocols
    if (this.containsJavaScriptProtocol(content)) {
      this.addWarning("JavaScript protocols detected and will be removed");
      isValid = false;
    }

    // Check for dangerous CSS
    if (this.containsDangerousCSS(content)) {
      this.addWarning("Potentially dangerous CSS detected");
      isValid = false;
    }

    // Validate iframe sources
    this.validateIframeSources(content);

    return {
      isValid,
      warnings: [...this.warnings],
      sanitizedContent: this.preSanitizeContent(content),
    };
  }

  /**
   * Pre-sanitization processing before ReactMarkdown
   */
  private preSanitizeContent(content: string): string {
    let sanitized = content;

    // Remove script tags completely
    sanitized = sanitized.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    // Remove dangerous event handlers
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

    // Remove javascript: protocols
    sanitized = sanitized.replace(/javascript:/gi, "");

    // Sanitize style attributes
    sanitized = sanitized.replace(
      /style\s*=\s*["']([^"']*)["']/gi,
      (match, styleContent) => {
        const sanitizedStyle = securityUtils.sanitizeStyle(styleContent);
        return `style="${sanitizedStyle}"`;
      }
    );

    return sanitized;
  }

  /**
   * Check for script tags
   */
  private containsScriptTags(content: string): boolean {
    return /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(content);
  }

  /**
   * Check for event handlers
   */
  private containsEventHandlers(content: string): boolean {
    return /\s*on\w+\s*=\s*["'][^"']*["']/gi.test(content);
  }

  /**
   * Check for javascript: protocols
   */
  private containsJavaScriptProtocol(content: string): boolean {
    return /javascript:/gi.test(content);
  }

  /**
   * Check for dangerous CSS patterns
   */
  private containsDangerousCSS(content: string): boolean {
    const dangerousPatterns = [
      /expression\s*\(/gi,
      /url\s*\(\s*javascript:/gi,
      /behavior\s*:/gi,
      /-moz-binding/gi,
      /import/gi,
    ];

    return dangerousPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Validate iframe sources against allowed domains
   */
  private validateIframeSources(content: string): void {
    const iframeRegex = /<iframe[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/gi;
    let match;

    while ((match = iframeRegex.exec(content)) !== null) {
      const src = match[1];
      if (!securityUtils.isAllowedIframeDomain(src)) {
        this.addWarning(`Iframe source from untrusted domain: ${src}`);
      }
    }
  }

  /**
   * Add a security warning
   */
  private addWarning(message: string): void {
    this.warnings.push(message);
    securityUtils.logSecurityWarning(message);
  }
}

/**
 * Global content security validator instance
 */
export const contentSecurityValidator = new ContentSecurityValidator();

/**
 * Security middleware for processing markdown content
 */
export function secureMarkdownContent(content: string): {
  content: string;
  hasSecurityIssues: boolean;
  warnings: string[];
} {
  const validation = contentSecurityValidator.validateContent(content);

  return {
    content: validation.sanitizedContent || content,
    hasSecurityIssues: !validation.isValid,
    warnings: validation.warnings,
  };
}

/**
 * Security configuration constants
 */
export const SECURITY_CONFIG = {
  // Maximum content length to prevent DoS
  MAX_CONTENT_LENGTH: 1000000, // 1MB

  // Maximum number of HTML elements
  MAX_HTML_ELEMENTS: 10000,

  // Allowed iframe domains (exported from sanitizeConfig)
  ALLOWED_IFRAME_DOMAINS: allowedIframeDomains,

  // Security headers for iframe sandbox
  IFRAME_SANDBOX_ATTRIBUTES: [
    "allow-scripts",
    "allow-same-origin",
    "allow-presentation",
    "allow-forms",
  ],
} as const;
