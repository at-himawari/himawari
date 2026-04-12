import type { Metadata } from "next";
import CancelPage from "../../../../../views/software/line_ai/account/cancel/+Page";

export const metadata: Metadata = {
  title: "決済キャンセル - Lineat AI",
  description: "決済がキャンセルされました。再度お試しいただけます。",
};

export default function Page() {
  return <CancelPage />;
}
