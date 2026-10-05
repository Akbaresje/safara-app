"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  Search,
  MessageCircle,
  ShoppingBag,
  Plane,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Shield,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/listings", label: "Jelajahi", icon: Search },
  { href: "/trips/new", label: "Buat Trip", icon: Plane },
  { href: "/listings/new", label: "Jual Barang", icon: ShoppingBag },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{
    full_name: string;
    avatar_url?: string | null;
    system_role?: string;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check auth state & profile
  useEffect(() => {
    async function getUserData() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);

      if (currentUser) {
        // Fetch profile
        const { data } = await (supabase.from("profiles") as unknown as {
          select: (columns: string) => {
            eq: (col: string, val: string) => {
              single: () => Promise<{
                data: { full_name?: string; avatar_url?: string | null; system_role?: string } | null;
              }>;
            };
          };
        })
          .select("full_name, avatar_url, system_role")
          .eq("id", currentUser.id)
          .single();

        if (data) {
          setProfile({
            full_name:
              data.full_name ||
              currentUser.user_metadata?.full_name ||
              currentUser.email?.split("@")[0] ||
              "Akun Saya",
            avatar_url: data.avatar_url,
            system_role: data.system_role,
          });
        } else {
          // Fallback from metadata or email
          setProfile({
            full_name:
              currentUser.user_metadata?.full_name ||
              currentUser.user_metadata?.name ||
              currentUser.email?.split("@")[0] ||
              "Akun Saya",
            avatar_url:
              currentUser.user_metadata?.avatar_url ||
              currentUser.user_metadata?.picture ||
              null,
            system_role: "user",
          });
        }
      } else {
        setProfile(null);
      }
    }

    getUserData();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await (supabase.from("profiles") as unknown as {
          select: (columns: string) => {
            eq: (col: string, val: string) => {
              single: () => Promise<{
                data: { full_name?: string; avatar_url?: string | null; system_role?: string } | null;
              }>;
            };
          };
        })
          .select("full_name, avatar_url, system_role")
          .eq("id", session.user.id)
          .single();

        if (data) {
          setProfile({
            full_name:
              data.full_name ||
              session.user.user_metadata?.full_name ||
              session.user.email?.split("@")[0] ||
              "Akun Saya",
            avatar_url: data.avatar_url,
            system_role: data.system_role,
          });
        } else {
          setProfile({
            full_name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "Akun Saya",
            avatar_url:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture ||
              null,
            system_role: "user",
          });
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("safara_admin_session");
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push("/login");
  };

  const hasAdminSession =
    typeof window !== "undefined" &&
    (localStorage.getItem("safara_admin_session") === "adminsafara@gmail.com" ||
      sessionStorage.getItem("safara_admin_session") === "adminsafara@gmail.com" ||
      document.cookie.includes("safara_admin_session=adminsafara@gmail.com"));

  const isAdmin = user?.email === "adminsafara@gmail.com" || hasAdminSession;

  const displayName =
    hasAdminSession && !user
      ? "Admin Safara"
      : profile?.full_name || user?.email?.split("@")[0] || "Akun Saya";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-warm-border bg-canvas/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-olive text-white font-bold text-lg">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-charcoal">
            Safara
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-sage transition-all duration-150 hover:bg-sand hover:text-charcoal focus-visible:ring-2 focus-visible:ring-olive/30 focus-visible:outline-none active:scale-95"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth State & Mobile Menu */}
        <div className="flex items-center gap-3">
          {user || hasAdminSession ? (
            /* Logged In User Dropdown */
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-warm-border bg-white px-3.5 py-1.5 shadow-2xs transition-all duration-150 hover:border-olive/60 hover:shadow-xs focus-visible:ring-2 focus-visible:ring-olive/30 focus-visible:outline-none active:scale-95 cursor-pointer"
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={displayName}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover border border-warm-border"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-olive text-xs font-bold text-white shadow-2xs">
                    {initial}
                  </div>
                )}
                <span className="max-w-[140px] truncate text-xs font-bold text-charcoal">
                  {displayName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-sage transition-transform duration-200" />
              </button>

              {/* Dropdown Menu Popup */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-warm-border bg-white p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
                  <div className="border-b border-warm-border px-3 py-2.5">
                    <p className="text-xs font-bold text-charcoal truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-sage truncate mt-0.5">
                      {user?.email || user?.phone || "adminsafara@gmail.com"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-charcoal hover:bg-sand"
                    >
                      <Settings className="h-4 w-4 text-sage" />
                      Atur Profil Akun
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-charcoal hover:bg-sand"
                    >
                      <LayoutDashboard className="h-4 w-4 text-sage" />
                      Dashboard Titipan &amp; Trip
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-charcoal hover:bg-sand"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-olive" />
                          Admin Dashboard
                        </div>
                        <span className="rounded bg-olive/10 px-1.5 py-0.5 text-[9px] font-bold text-olive">
                          Admin
                        </span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-warm-border pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest Buttons */
            <>
              <Link href="/login" className="hidden md:block">
                <Button
                  variant="ghost"
                  className="text-sage hover:text-charcoal font-semibold text-sm h-10 px-4"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/register" className="hidden md:block">
                <Button
                  className="bg-olive text-white hover:bg-olive-light font-semibold text-sm h-10 px-5 shadow-xs hover:shadow-sm"
                >
                  Daftar
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Hamburger Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Buka menu navigasi"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-warm-border bg-white text-charcoal shadow-2xs hover:bg-sand hover:border-olive/40 active:scale-95 transition-all md:hidden cursor-pointer"
                >
                  <Menu className="h-5 w-5" />
                </button>
              }
            />
            <SheetContent side="right" className="w-80 bg-canvas p-6">
              <div className="flex flex-col gap-1.5 pt-4">
                {(user || hasAdminSession) && (
                  <div className="mb-4 rounded-2xl border border-warm-border bg-white p-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      {profile?.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt={displayName}
                          width={44}
                          height={44}
                          className="h-11 w-11 rounded-full object-cover border border-warm-border"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-olive text-base font-bold text-white shadow-2xs">
                          {initial}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-bold text-charcoal">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-sage mt-0.5">
                          {user?.email || user?.phone || "adminsafara@gmail.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-sage transition-all duration-150 hover:bg-sand hover:text-charcoal active:scale-95"
                  >
                    <link.icon className="h-4.5 w-4.5" />
                    {link.label}
                  </Link>
                ))}

                <div className="my-3 border-t border-warm-border" />

                {user || hasAdminSession ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-sage hover:bg-sand hover:text-charcoal active:scale-95"
                    >
                      <Settings className="h-4.5 w-4.5" />
                      Atur Profil Akun
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-sage hover:bg-sand hover:text-charcoal active:scale-95"
                    >
                      <LayoutDashboard className="h-4.5 w-4.5" />
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-olive hover:bg-sand active:scale-95"
                      >
                        <Shield className="h-4.5 w-4.5" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 text-left active:scale-95 cursor-pointer"
                    >
                      <LogOut className="h-4.5 w-4.5" />
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-sage hover:bg-sand hover:text-charcoal active:scale-95"
                    >
                      <UserIcon className="h-4.5 w-4.5" />
                      Masuk
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="mt-3"
                    >
                      <Button className="w-full bg-olive hover:bg-olive-light text-white h-11 text-sm font-semibold shadow-xs">
                        Daftar Akun Baru
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
