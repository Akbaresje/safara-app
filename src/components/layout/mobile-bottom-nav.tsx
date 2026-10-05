"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Search,
  PlusCircle,
  MessageCircle,
  User as UserIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function MobileBottomNav() {
  const pathname = usePathname();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const sessionAdmin =
        typeof window !== "undefined" &&
        (localStorage.getItem("safara_admin_session") === "adminsafara@gmail.com" ||
          sessionStorage.getItem("safara_admin_session") === "adminsafara@gmail.com" ||
          document.cookie.includes("safara_admin_session=adminsafara@gmail.com"));

      setIsLoggedIn(!!user || sessionAdmin);
    }
    checkAuth();
  }, [supabase]);

  // Hide mobile bottom nav on full-screen chat interface or admin pages to avoid layout clashes
  if (pathname === "/chat" || pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      href: "/",
      label: "Beranda",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/listings",
      label: "Jelajahi",
      icon: Search,
      isActive: pathname.startsWith("/listings") && pathname !== "/listings/new",
    },
    {
      href: isLoggedIn ? "/listings/new" : "/login",
      label: "Titip Baru",
      icon: PlusCircle,
      isActive: pathname === "/listings/new" || pathname === "/trips/new",
      isPrimaryAction: true,
    },
    {
      href: "/chat",
      label: "Chat",
      icon: MessageCircle,
      isActive: pathname === "/chat",
    },
    {
      href: isLoggedIn ? "/dashboard" : "/login",
      label: isLoggedIn ? "Akun" : "Masuk",
      icon: UserIcon,
      isActive: pathname === "/dashboard" || pathname === "/profile" || pathname === "/login",
    },
  ];

  return (
    <nav
      aria-label="Navigasi Utama Mobile"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-warm-border bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden shadow-lg"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isPrimaryAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5 group"
                aria-label={item.label}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-olive text-white shadow-md transition-all duration-200 group-hover:scale-105 group-active:scale-95 group-hover:bg-olive-light">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="mt-1 text-[11px] font-semibold text-charcoal">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center rounded-xl px-2 py-1 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                item.isActive
                  ? "text-olive font-bold"
                  : "text-sage hover:text-charcoal"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform duration-150 ${
                    item.isActive ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-olive" />
                )}
              </div>
              <span className="mt-1 text-[11px] leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
