# Security Features Documentation

This document describes the comprehensive security implementation for HTML content in Markdown rendering.

## Overview

The security system implements a multi-layered approach to prevent XSS attacks and other security vulnerabilities while allowing rich HTML content in Markdown posts.

## Security Layers

### 1. Pre-sanitization (contentSecurity.ts)

Before content reaches ReactMarkdown, it goes through pre-sanitization:

- **Script Tag Removal**: All `<script>` tags are completely removed
- **Event Handler Removal**: All `on*` event handlers are stripped
- **JavaScript Protocol Removal**: `javascript:` protocols are removed from URLs
- **CSS Sanitization**: Dangerous CSS patterns are removed from style attributes

### 2. ReactMarkdown + rehype-sanitize

The main sanitization layer using rehype-sanitize with comprehensive configuration:

- **Allowed Tags**: Comprehensive whitelist of safe HTML tags
- **Allowed Attributes**: Specific attributes allowed per tag type
- **Protocol Whitelist**: Only `http`, `https`, `mailto`, and `tel` protocols allowed
- **Tag Mode**: Dangerous tags are discarded entirely

### 3. Runtime Validation

Additional security checks during content processing:

- **Iframe Domain Validation**: Only trusted domains allowed for iframe embeds
- **Content Length Limits**: Protection against DoS attacks
- **Security Warning Logging**: Suspicious content is logged for monitoring

## Allowed HTML Elements

### Text Formatting

- `p`, `br`, `strong`, `em`, `u`, `del`, `s`, `ins`, `mark`, `small`, `sub`, `sup`

### Headings

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6`

### Lists

- `ul`, `ol`, `li`, `dl`, `dt`, `dd`

### Code and Quotes

- `blockquote`, `code`, `pre`, `kbd`, `samp`, `var`

### Media

- `img`, `video`, `audio`, `source`, `track`
- `iframe` (with domain restrictions)

### Tables

- `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, `caption`, `colgroup`, `col`

### Layout Containers

- `div`, `span`, `section`, `article`, `aside`, `header`, `footer`, `main`, `nav`

### Interactive Elements (Limited)

- `button`, `details`, `summary`

### Forms (Basic)

- `form`, `input`, `textarea`, `select`, `option`, `optgroup`, `label`, `fieldset`, `legend`

## Trusted Iframe Domains

The following domains are whitelisted for iframe embeds:

### Video Platforms

- `youtube.com`, `www.youtube.com`, `youtu.be`
- `vimeo.com`, `player.vimeo.com`

### Development Platforms

- `codepen.io`
- `codesandbox.io`
- `jsfiddle.net`
- `github.com`, `gist.github.com`

## Security Configuration Examples

### Basic Usage

```typescript
import { sanitizeConfig } from "../utils/sanitizeConfig";
import { secureMarkdownContent } from "../utils/contentSecurity";

// Pre-process content for security
const securityResult = secureMarkdownContent(content);

// Use with ReactMarkdown
<ReactMarkdown rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeConfig]]}>
  {securityResult.content}
</ReactMarkdown>;
```

### Strict Mode

For high-security contexts, use the strict configuration:

```typescript
import { strictSanitizeConfig } from "../utils/sanitizeConfig";

<ReactMarkdown
  rehypePlugins={[rehypeRaw, [rehypeSanitize, strictSanitizeConfig]]}
>
  {content}
</ReactMarkdown>;
```

## Security Warnings

The system logs security warnings when potentially dangerous content is detected:

```
[Security Warning] Script tags detected and will be removed
[Security Warning] Event handlers detected and will be removed
[Security Warning] Iframe source from untrusted domain: https://evil.com
```

## Blocked Content Examples

### Dangerous Scripts

```html
<!-- BLOCKED -->
<script>
  alert("XSS");
</script>
<img src="x" onerror="alert('XSS')" />
<a href="javascript:alert('XSS')">Click</a>
```

### Dangerous CSS

```html
<!-- BLOCKED -->
<div style="background: url(javascript:alert(1))">Content</div>
<div style="expression(alert(1))">Content</div>
```

### Untrusted Iframes

```html
<!-- BLOCKED -->
<iframe src="https://malicious-site.com/evil"></iframe>
```

## Safe Content Examples

### Rich Text Formatting

```html
<!-- ALLOWED -->
<div class="highlight">
  <h2>Title</h2>
  <p>This is <strong>bold</strong> and <em>italic</em> text.</p>
  <blockquote>This is a quote</blockquote>
</div>
```

### Media Embeds

```html
<!-- ALLOWED -->
<img src="image.jpg" alt="Description" width="500" height="300" />
<video src="video.mp4" controls width="640" height="480"></video>
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  width="560"
  height="315"
></iframe>
```

### Tables and Lists

```html
<!-- ALLOWED -->
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>

<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

## Monitoring and Maintenance

### Security Logs

- All security warnings are logged to the console
- In production, consider sending logs to a monitoring service
- Regular review of security warnings helps identify attack attempts

### Configuration Updates

- Regularly review and update the allowed domains list
- Monitor for new attack vectors and update sanitization rules
- Test security configuration with various content types

### Performance Considerations

- Pre-sanitization adds minimal overhead
- rehype-sanitize processing is efficient for typical content sizes
- Large content (>1MB) may require additional optimization

## Implementation Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 2.1**: HTML content is sanitized to remove dangerous tags and attributes
- **Requirement 2.2**: Script tags and dangerous elements are automatically removed
- **Requirement 2.3**: All input is validated and sanitized before rendering

The security system provides comprehensive protection while maintaining the flexibility needed for rich content creation.
