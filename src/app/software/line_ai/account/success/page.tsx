import type { Metadata } from "next";
import SuccessPage from "../../../../../views/software/line_ai/account/success/+Page";
import { createPageMetadata } from "../../../../../utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "決済完了 - Lineat AI",
  description: "決済が正常に完了しました。ご利用ありがとうございます。",
  path: "/software/line_ai/account/success",
  noIndex: true,
});

export default function Page() {
  return <SuccessPage />;
}
