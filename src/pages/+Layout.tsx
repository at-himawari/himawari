import React from "react";
import "../styles/index.css";

export function Layout({ children }: { children: React.ReactNode }) {
  // React 19 compatible StrictMode usage
  if (process.env.NODE_ENV === "development") {
    return <React.StrictMode>{children}</React.StrictMode>;
  }
  return <>{children}</>;
}
