import type { Metadata } from "next";
import type { ReactNode } from "react";

// Metadata updates on client navigation too, when the original document's
// no-referrer HTTP header would otherwise suppress PayHere's domain check.
export const metadata: Metadata = {
  referrer: "strict-origin-when-cross-origin",
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
