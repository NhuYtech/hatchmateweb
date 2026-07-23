import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Camera & AI",
};

export default function CameraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
