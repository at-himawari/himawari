/**
 * Safe Markdown Renderer Component
 *
 * React component wrapper for markdown rendering with comprehensive error handling
 * Requirements: 2.1, 4.2 - Error handling and fallback functionality
 */

import React, { useEffect, useState } from "react";
import {
  renderMarkdownSafely,
  MarkdownRenderResult,
  MarkdownErrorType,
} from "../utils/markdownErrorHandler";
import {
  renderMarkdownOptimized,
  performanceUtils,
} from "../utils/optimizedMarkdownRenderer";

interface SafeMarkdownRendererProps {
  content: string;
  onError?: (errors: MarkdownRenderResult["errors"]) => void;
  onFallback?: (mode: MarkdownRenderResult["renderingMode"]) => void;
  showErrorDetails?: boolean;
  className?: string;
}

/**
 * Error display component for development/debugging
 */
const ErrorDetails: React.FC<{
  errors: MarkdownRenderResult["errors"];
  renderingMode: MarkdownRenderResult["renderingMode"];
  fallbackUsed: boolean;
}> = ({ errors, renderingMode, fallbackUsed }) => {
  if (errors.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <span className="text-yellow-600 font-medium">
          ⚠️ Markdown Rendering Issues Detected
        </span>
        {fallbackUsed && (
          <span className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded">
            Fallback Mode: {renderingMode}
          </span>
        )}
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-yellow-700 hover:text-yellow-900">
          View Details ({errors.length} issues)
        </summary>
        <div className="mt-2 space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="bg-white p-2 rounded border">
              <div className="font-medium text-red-600">{error.type}</div>
              <div className="text-gray-700">{error.message}</div>
              <div className="text-xs text-gray-500">
                {error.timestamp.toLocaleString()}
              </div>
              {error.content && (
                <details className="mt-1">
                  <summary className="text-xs text-gray-600 cursor-pointer">
                    Content Preview
                  </summary>
                  <pre className="text-xs bg-gray-100 p-1 rounded mt-1 overflow-x-auto">
                    {error.content}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

/**
 * Fallback indicator component
 */
const FallbackIndicator: React.FC<{
  mode: MarkdownRenderResult["renderingMode"];
  show: boolean;
}> = ({ mode, show }) => {
  if (!show || mode === "full") return null;

  const modeLabels = {
    safe: "Safe Mode (HTML stripped)",
    plain: "Plain Text Mode",
  };

  const modeColors = {
    safe: "bg-blue-50 border-blue-200 text-blue-700",
    plain: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded text-xs border ${modeColors[mode]} mb-2`}
    >
      <span className="mr-1">🛡️</span>
      {modeLabels[mode]}
    </div>
  );
};

/**
 * Safe Markdown Renderer Component
 */
export const SafeMarkdownRenderer: React.FC<SafeMarkdownRendererProps> = ({
  content,
  onError,
  onFallback,
  showErrorDetails = process.env.NODE_ENV === "development",
  className = "",
}) => {
  const [renderResult, setRenderResult] = useState<MarkdownRenderResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const renderContent = async () => {
      console.log("SafeMarkdownRenderer: Starting render process");
      setIsLoading(true);

      try {
        console.log("SafeMarkdownRenderer: Trying optimized rendering");
        // Try optimized rendering first for better performance
        const { result: optimizedContent, duration } =
          await performanceUtils.measureRenderTime(
            () =>
              renderMarkdownOptimized(content, {
                enableHTML: true,
                enableMath: true,
                useMinimalConfig: process.env.NODE_ENV === "production",
              }),
            "optimized-render"
          );

        console.log(
          "SafeMarkdownRenderer: Optimized rendering succeeded",
          optimizedContent
        );

        if (isMounted) {
          // Create successful result
          setRenderResult({
            success: true,
            content: optimizedContent,
            errors: [],
            fallbackUsed: false,
            renderingMode: "full",
          });
        }
      } catch (optimizedError) {
        console.warn(
          "Optimized rendering failed, falling back to safe rendering:",
          optimizedError
        );

        try {
          console.log("SafeMarkdownRenderer: Trying safe rendering fallback");
          // Fallback to comprehensive error handling
          const result = await renderMarkdownSafely(content);

          console.log("SafeMarkdownRenderer: Safe rendering result", result);

          if (isMounted) {
            setRenderResult(result);

            // Call callbacks if provided
            if (result.errors.length > 0 && onError) {
              onError(result.errors);
            }

            if (result.fallbackUsed && onFallback) {
              onFallback(result.renderingMode);
            }
          }
        } catch (error) {
          console.error(
            "SafeMarkdownRenderer: All rendering methods failed:",
            error
          );

          if (isMounted) {
            // Create a minimal error result
            setRenderResult({
              success: false,
              content: "Error: Unable to render content",
              errors: [
                {
                  type: MarkdownErrorType.UNKNOWN_ERROR,
                  message: "All rendering methods failed",
                  originalError: error as Error,
                  timestamp: new Date(),
                },
              ],
              fallbackUsed: true,
              renderingMode: "plain",
            });
          }
        }
      } finally {
        if (isMounted) {
          console.log("SafeMarkdownRenderer: Render process completed");
          setIsLoading(false);
        }
      }
    };

    renderContent();

    return () => {
      isMounted = false;
    };
  }, [content, onError, onFallback]);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (!renderResult) {
    return (
      <div className={`text-red-600 ${className}`}>
        Error: Failed to render content
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Error details for development */}
      {showErrorDetails && (
        <ErrorDetails
          errors={renderResult.errors}
          renderingMode={renderResult.renderingMode}
          fallbackUsed={renderResult.fallbackUsed}
        />
      )}

      {/* Fallback mode indicator */}
      <FallbackIndicator
        mode={renderResult.renderingMode}
        show={renderResult.fallbackUsed}
      />

      {/* Rendered content */}
      <div className="markdown-content">
        {typeof renderResult.content === "string" ? (
          <pre className="whitespace-pre-wrap font-sans">
            {renderResult.content}
          </pre>
        ) : (
          renderResult.content
        )}
      </div>
    </div>
  );
};

export default SafeMarkdownRenderer;
