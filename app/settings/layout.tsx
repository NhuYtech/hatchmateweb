import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cấu hình ấp",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
