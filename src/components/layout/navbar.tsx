"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  Search,
  MessageCircle,
  ShoppingBag,
  User,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/listings", label: "Jelajahi", icon: Search },
  { href: "/trips/new", label: "Buat Trip", icon: Plane },
  { href: "/listings/new", label: "Jual Barang", icon: ShoppingBag },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

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
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-sage transition-colors hover:bg-sand hover:text-charcoal"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth & Mobile */}
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              className="text-sage hover:text-charcoal"
            >
              Masuk
            </Button>
          </Link>
          <Link href="/register" className="hidden md:block">
            <Button
              size="sm"
              className="bg-olive text-white hover:bg-olive-light"
            >
              Daftar
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-canvas">
              <div className="flex flex-col gap-1 pt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sage transition-colors hover:bg-sand hover:text-charcoal"
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
                <div className="my-4 border-t border-warm-border" />
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sage hover:bg-sand hover:text-charcoal"
                >
                  <User className="h-5 w-5" />
                  Masuk
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="mx-4 w-[calc(100%-2rem)] bg-olive text-white hover:bg-olive-light">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
