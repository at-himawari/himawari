import type { Metadata } from "next";
import SuccessPage from "../../../../../views/software/line_ai/account/success/+Page";

export const metadata: Metadata = {
  title: "決済完了 - Lineat AI",
  description: "決済が正常に完了しました。ご利用ありがとうございます。",
};

export default function Page() {
  return <SuccessPage />;
}
