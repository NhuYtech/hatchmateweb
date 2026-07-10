"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#FFF8E8]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5B000]"></div>
    </div>
  );
}
