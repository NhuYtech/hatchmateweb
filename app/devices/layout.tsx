import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thiết bị",
};

export default function DevicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
