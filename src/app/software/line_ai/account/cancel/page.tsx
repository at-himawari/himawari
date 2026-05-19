import type { Metadata } from "next";
import CancelPage from "../../../../../views/software/line_ai/account/cancel/+Page";
import { createPageMetadata } from "../../../../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "決済キャンセル - Lineat AI",
  description: "決済がキャンセルされました。再度お試しいただけます。",
  path: "/software/line_ai/account/cancel",
  noIndex: true,
});

export default function Page() {
  return <CancelPage />;
}
