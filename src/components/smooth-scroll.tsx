"use client";

import { ReactNode, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ScrollRestorationHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Reset scroll to top immediately on route/param transition with native instant behavior
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, searchParams]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <ScrollRestorationHandler />
      </Suspense>
      {children}
    </>
  );
}