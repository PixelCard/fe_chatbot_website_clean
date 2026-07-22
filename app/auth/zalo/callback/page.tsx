"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { APP_ROUTES } from "@/app/config/routes";

function ZaloCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      router.replace(`${APP_ROUTES.Auth.LOGIN}?mode=login&error=zalo_missing_code`);
      return;
    }

    const nextSearch = searchParams.toString();
    const destination = nextSearch
      ? `${APP_ROUTES.Auth.LOGIN}?${nextSearch}`
      : APP_ROUTES.Auth.LOGIN;

    router.replace(destination);
  }, [router, searchParams]);

  return (
    <main style={{ padding: 24 }}>
      <p>Dang chuyen huong dang nhap Zalo...</p>
    </main>
  );
}

export default function ZaloCallbackPage() {
  return (
    <Suspense fallback={<main style={{ padding: 24 }}>Dang tai...</main>}>
      <ZaloCallbackContent />
    </Suspense>
  );
}
