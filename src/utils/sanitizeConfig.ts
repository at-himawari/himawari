/**
 * HTML Sanitization Configuration for ReactMarkdown
 *
 * This configuration defines security settings for HTML content in Markdown,
 * implementing requirements 2.1, 2.2, and 2.3 for safe HTML rendering.
 */

import { Options as SanitizeOptions } from "rehype-sanitize";

/**
 * Custom sanitization configuration for HTML content
 * Allows safe HTML tags while preventing XSS attacks
 */
export const sanitizeConfig: SanitizeOptions = {
  // Allowed HTML tags - comprehensive list for rich content creation
  allowedTags: [
    // Text formatting
    "p",
    "br",
    "strong",
    "em",
    "u",
    "del",
    "s",
    "ins",
    "mark",
    "small",
    "sub",
    "sup",

    // Headings
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",

    // Lists
    "ul",
    "ol",
    "li",
    "dl",
    "dt",
    "dd",

    // Quotes and code
    "blockquote",
    "code",
    "pre",
    "kbd",
    "samp",
    "var",

    // Links and media
    "a",
    "img",
    "video",
    "audio",
    "source",
    "track",

    // Tables
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "caption",
    "colgroup",
    "col",

    // Containers and layout
    "div",
    "span",
    "section",
    "article",
    "aside",
    "header",
    "footer",
    "main",
    "nav",

    // Interactive elements (limited)
    "button",
    "details",
    "summary",

    // Forms (basic elements only)
    "form",
    "input",
    "textarea",
    "select",
    "option",
    "optgroup",
    "label",
    "fieldset",
    "legend",

    // HTML5 semantic elements
    "figure",
    "figcaption",
    "time",
    "address",

    // Embedded content (with restrictions)
    "iframe",

    // Line breaks and separators
    "hr",
    "wbr",
  ],

  // Allowed attributes per tag
  allowedAttributes: {
    // Global attributes allowed on all elements
    "*": [
      "class",
      "id",
      "title",
      "lang",
      "dir",
      // Data attributes for custom functionality
      "data-*",
    ],

    // Link attributes
    a: ["href", "target", "rel", "download", "hreflang"],

    // Image attributes
    img: [
      "src",
      "alt",
      "width",
      "height",
      "loading",
      "decoding",
      "sizes",
      "srcset",
    ],

    // Video attributes
    video: [
      "src",
      "controls",
      "width",
      "height",
      "poster",
      "preload",
      "autoplay",
      "loop",
      "muted",
      "playsinline",
    ],

    // Audio attributes
    audio: ["src", "controls", "preload", "autoplay", "loop", "muted"],

    // Source element for media
    source: ["src", "type", "media", "sizes", "srcset"],

    // Track element for video/audio
    track: ["src", "kind", "srclang", "label", "default"],

    // Iframe attributes (restricted)
    iframe: [
      "src",
      "width",
      "height",
      "frameborder",
      "allowfullscreen",
      "sandbox",
      "loading",
      "referrerpolicy",
    ],

    // Table attributes
    table: ["border", "cellpadding", "cellspacing"],
    th: ["scope", "colspan", "rowspan", "headers"],
    td: ["colspan", "rowspan", "headers"],
    col: ["span"],
    colgroup: ["span"],

    // Form attributes (basic)
    form: ["action", "method", "enctype", "target", "novalidate"],
    input: [
      "type",
      "name",
      "value",
      "placeholder",
      "required",
      "disabled",
      "readonly",
      "maxlength",
      "minlength",
      "min",
      "max",
      "step",
      "pattern",
      "autocomplete",
      "multiple",
      "accept",
    ],
    textarea: [
      "name",
      "placeholder",
      "required",
      "disabled",
      "readonly",
      "rows",
      "cols",
    ],
    select: ["name", "required", "disabled", "multiple", "size"],
    option: ["value", "selected", "disabled"],
    optgroup: ["label", "disabled"],
    label: ["for"],
    button: ["type", "name", "value", "disabled"],

    // Time element
    time: ["datetime"],

    // Details/summary
    details: ["open"],

    // Ordered list
    ol: ["start", "reversed", "type"],
    li: ["value"],

    // Blockquote
    blockquote: ["cite"],
  },

  // Protocol whitelist for URLs
  allowedSchemes: ["http", "https", "mailto", "tel"],

  // How to handle disallowed tags
  disallowedTagsMode: "discard",

  // Remove empty elements
  allowedEmptyTags: [
    "br",
    "hr",
    "img",
    "input",
    "area",
    "base",
    "col",
    "embed",
    "link",
    "meta",
    "source",
    "track",
    "wbr",
  ],

  // Strip dangerous attributes
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style", "noscript"],

  // Additional security measures
  allowProtocolRelative: false,
  enforceHtmlBoundary: true,
};

/**
 * Strict sanitization configuration for high-security contexts
 * Use this for user-generated content or untrusted sources
 */
export const strictSanitizeConfig: SanitizeOptions = {
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
  ],

  allowedAttributes: {
    a: ["href", "rel"],
    img: ["src", "alt", "width", "height"],
  },

  allowedSchemes: ["https"],
  disallowedTagsMode: "discard",
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style", "noscript"],
  allowProtocolRelative: false,
  enforceHtmlBoundary: true,
};

/**
 * Validates and sanitizes iframe src URLs
 * Only allows trusted domains for embedded content
 */
export const allowedIframeDomains = [
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "vimeo.com",
  "player.vimeo.com",
  "codepen.io",
  "codesandbox.io",
  "jsfiddle.net",
  "github.com",
  "gist.github.com",
];

/**
 * Security utility functions
 */
export const securityUtils = {
  /**
   * Validates if an iframe URL is from an allowed domain
   */
  isAllowedIframeDomain(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return allowedIframeDomains.some(
        (domain) =>
          urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  },

  /**
   * Sanitizes CSS style attributes to prevent CSS injection
   */
  sanitizeStyle(style: string): string {
    // Remove potentially dangerous CSS properties
    const dangerousPatterns = [
      /javascript:/gi,
      /expression\s*\(/gi,
      /url\s*\(\s*javascript:/gi,
      /behavior\s*:/gi,
      /-moz-binding/gi,
      /import/gi,
    ];

    let sanitized = style;
    dangerousPatterns.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, "");
    });

    return sanitized;
  },

  /**
   * Logs security warnings for monitoring
   */
  logSecurityWarning(message: string, context?: unknown): void {
    console.warn(`[Security Warning] ${message}`, context);
    // In production, you might want to send this to a logging service
  },
};
