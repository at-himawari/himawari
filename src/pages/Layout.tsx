import React from "react";
import type { PageContext } from "vike/types";
import "../styles/index.css";

export function Layout({
  children,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return <React.StrictMode>{children}</React.StrictMode>;
}
