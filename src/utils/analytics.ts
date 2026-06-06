export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-S8J4Z721EH";

type GtagCommand = "config" | "event" | "js";

type Gtag = (
  command: GtagCommand,
  target: string | Date,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export function sendGAEvent(
  eventName: string,
  params: Record<string, unknown> = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}

export function trackSelectContent(
  contentType: string,
  itemId: string,
  itemName?: string,
) {
  sendGAEvent("select_content", {
    content_type: contentType,
    item_id: itemId,
    item_name: itemName,
  });
}

export function trackOutboundClick(label: string, url: string) {
  sendGAEvent("click", {
    link_url: url,
    link_text: label,
    outbound: true,
  });
}

export function trackLead(method: string, url?: string) {
  sendGAEvent("generate_lead", {
    method,
    link_url: url,
  });
}
