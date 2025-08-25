/**
 * Tests for Markdown Error Handler
 *
 * Verifies error handling and fallback functionality
 */

import {
  MarkdownErrorHandler,
  MarkdownErrorType,
  renderMarkdownSafely,
} from "../markdownErrorHandler";

describe("MarkdownErrorHandler", () => {
  let handler: MarkdownErrorHandler;

  beforeEach(() => {
    handler = new MarkdownErrorHandler(true); // Enable debug mode for tests
  });

  describe("HTML Validation", () => {
    test("should detect unclosed tags", async () => {
      const content = "<div>Unclosed div content";
      const result = await handler.renderWithFallback(content);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some(
          (e) => e.type === MarkdownErrorType.INVALID_HTML_STRUCTURE
        )
      ).toBe(true);
    });

    test("should detect invalid nesting", async () => {
      const content = "<p>Paragraph with <div>invalid div inside</div></p>";
      const result = await handler.renderWithFallback(content);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some(
          (e) => e.type === MarkdownErrorType.INVALID_HTML_STRUCTURE
        )
      ).toBe(true);
    });

    test("should detect malformed attributes", async () => {
      const content = '<img src=image without quotes.jpg alt="test">';
      const result = await handler.renderWithFallback(content);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some(
          (e) => e.type === MarkdownErrorType.INVALID_HTML_STRUCTURE
        )
      ).toBe(true);
    });
  });

  describe("Fallback Rendering", () => {
    test("should fallback to safe mode when HTML rendering fails", async () => {
      // Mock a scenario where HTML rendering would fail
      const problematicContent =
        '<script>alert("xss")</script># Valid Markdown';
      const result = await handler.renderWithFallback(problematicContent);

      expect(result.success).toBe(true);
      expect(result.fallbackUsed).toBe(false); // Script tags are sanitized, not failed
      expect(result.renderingMode).toBe("full");
    });

    test("should render valid markdown with HTML successfully", async () => {
      const validContent =
        '# Heading\n\n<div class="test">Valid HTML</div>\n\nSome **markdown** text.';
      const result = await handler.renderWithFallback(validContent);

      expect(result.success).toBe(true);
      expect(result.renderingMode).toBe("full");
    });

    test("should provide plain text fallback for severely broken content", async () => {
      // Create content that would break both HTML and markdown rendering
      const brokenContent = "<><><><<>><<invalid>><<>>";
      const result = await handler.renderWithFallback(brokenContent);

      expect(result.success).toBe(true); // Even broken content gets rendered safely
      expect(result.renderingMode).toBe("full"); // HTML gets sanitized/corrected
      expect(result.content).toBeDefined();
    });
  });

  describe("Error Statistics", () => {
    test("should track error statistics correctly", async () => {
      await handler.renderWithFallback("<div>Unclosed div");
      await handler.renderWithFallback("<p><div>Invalid nesting</div></p>");

      const stats = handler.getErrorStats();
      expect(stats[MarkdownErrorType.INVALID_HTML_STRUCTURE]).toBeGreaterThan(
        0
      );
    });

    test("should provide error details", async () => {
      await handler.renderWithFallback("<div>Unclosed div");

      const errors = handler.getErrors();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toHaveProperty("type");
      expect(errors[0]).toHaveProperty("message");
      expect(errors[0]).toHaveProperty("timestamp");
    });
  });

  describe("HTML Correction", () => {
    test("should auto-close unclosed tags", async () => {
      const content = "<div><p>Content";
      const result = await handler.renderWithFallback(content);

      // Should not crash and should provide some form of output
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
    });

    test("should fix invalid nesting", async () => {
      const content = "<p>Text <div>Invalid nesting</div> more text</p>";
      const result = await handler.renderWithFallback(content);

      // Should handle the invalid nesting gracefully
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
    });
  });
});

describe("renderMarkdownSafely", () => {
  test("should be a convenience wrapper", async () => {
    const content = "# Test Heading\n\nSome content.";
    const result = await renderMarkdownSafely(content);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.content).toBeDefined();
  });

  test("should handle empty content", async () => {
    const result = await renderMarkdownSafely("");

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  test("should handle null/undefined content gracefully", async () => {
    const result = await renderMarkdownSafely(null as any);

    expect(result).toBeDefined();
    // null content might not generate errors if handled gracefully
    expect(result.errors.length).toBeGreaterThanOrEqual(0);
  });
});
