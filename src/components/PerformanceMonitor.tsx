/**
 * Performance Monitor Component
 *
 * Tracks and reports page loading performance metrics
 * Requirements: 4.2, 5.3 - Performance monitoring
 */

import React, { useEffect, useState } from "react";

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  renderTime: number;
  memoryUsage?: {
    used: number;
    total: number;
  };
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  showDebugInfo?: boolean;
  onMetricsCollected?: (metrics: PerformanceMetrics) => void;
}

/**
 * Performance Monitor Component
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === "development",
  showDebugInfo = false,
  onMetricsCollected,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let observer: PerformanceObserver | null = null;
    const startTime = performance.now();

    const collectMetrics = () => {
      setIsCollecting(true);

      try {
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType("paint");

        const metrics: PerformanceMetrics = {
          pageLoadTime:
            navigation?.loadEventEnd - navigation?.navigationStart || 0,
          domContentLoaded:
            navigation?.domContentLoadedEventEnd -
              navigation?.navigationStart || 0,
          firstContentfulPaint:
            paint.find((p) => p.name === "first-contentful-paint")?.startTime ||
            0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0,
          firstInputDelay: 0,
          renderTime: performance.now() - startTime,
          memoryUsage: getMemoryUsage(),
        };

        // Collect Web Vitals if available
        if ("PerformanceObserver" in window) {
          observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              switch (entry.entryType) {
                case "largest-contentful-paint":
                  metrics.largestContentfulPaint = entry.startTime;
                  break;
                case "layout-shift":
                  if (!(entry as any).hadRecentInput) {
                    metrics.cumulativeLayoutShift += (entry as any).value;
                  }
                  break;
                case "first-input":
                  metrics.firstInputDelay =
                    (entry as any).processingStart - entry.startTime;
                  break;
              }
            }
          });

          try {
            observer.observe({
              entryTypes: [
                "largest-contentful-paint",
                "layout-shift",
                "first-input",
              ],
            });
          } catch (e) {
            console.warn("Some performance metrics not supported:", e);
          }
        }

        setMetrics(metrics);
        onMetricsCollected?.(metrics);

        if (showDebugInfo) {
          console.group("🚀 Performance Metrics");
          console.log(
            "Page Load Time:",
            `${metrics.pageLoadTime.toFixed(2)}ms`
          );
          console.log(
            "DOM Content Loaded:",
            `${metrics.domContentLoaded.toFixed(2)}ms`
          );
          console.log(
            "First Contentful Paint:",
            `${metrics.firstContentfulPaint.toFixed(2)}ms`
          );
          console.log("Render Time:", `${metrics.renderTime.toFixed(2)}ms`);
          if (metrics.memoryUsage) {
            console.log(
              "Memory Usage:",
              `${formatBytes(metrics.memoryUsage.used)} / ${formatBytes(
                metrics.memoryUsage.total
              )}`
            );
          }
          console.groupEnd();
        }
      } catch (error) {
        console.warn("Failed to collect performance metrics:", error);
      } finally {
        setIsCollecting(false);
      }
    };

    // Collect metrics after page load
    if (document.readyState === "complete") {
      setTimeout(collectMetrics, 100);
    } else {
      window.addEventListener("load", () => setTimeout(collectMetrics, 100));
    }

    return () => {
      observer?.disconnect();
    };
  }, [enabled, showDebugInfo, onMetricsCollected]);

  // Get memory usage if available
  const getMemoryUsage = () => {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
      };
    }
    return undefined;
  };

  // Format bytes to human readable
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Performance score calculation
  const getPerformanceScore = (metrics: PerformanceMetrics): number => {
    let score = 100;

    // Deduct points for slow metrics
    if (metrics.pageLoadTime > 3000) score -= 20;
    if (metrics.firstContentfulPaint > 1800) score -= 15;
    if (metrics.largestContentfulPaint > 2500) score -= 15;
    if (metrics.cumulativeLayoutShift > 0.1) score -= 10;
    if (metrics.firstInputDelay > 100) score -= 10;

    return Math.max(0, score);
  };

  // Don't render anything in production unless debug info is requested
  if (!enabled || (!showDebugInfo && process.env.NODE_ENV === "production")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs p-3 rounded-lg font-mono z-50 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-green-400">⚡</span>
        <span className="font-semibold">Performance</span>
        {isCollecting && <span className="animate-pulse">📊</span>}
      </div>

      {metrics ? (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Score:</span>
            <span
              className={`font-bold ${
                getPerformanceScore(metrics) > 80
                  ? "text-green-400"
                  : getPerformanceScore(metrics) > 60
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {getPerformanceScore(metrics)}/100
            </span>
          </div>
          <div className="flex justify-between">
            <span>Load:</span>
            <span>{metrics.pageLoadTime.toFixed(0)}ms</span>
          </div>
          <div className="flex justify-between">
            <span>FCP:</span>
            <span>{metrics.firstContentfulPaint.toFixed(0)}ms</span>
          </div>
          <div className="flex justify-between">
            <span>Render:</span>
            <span>{metrics.renderTime.toFixed(0)}ms</span>
          </div>
          {metrics.memoryUsage && (
            <div className="flex justify-between">
              <span>Memory:</span>
              <span>{formatBytes(metrics.memoryUsage.used)}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-400">Collecting metrics...</div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
