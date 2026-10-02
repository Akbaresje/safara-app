"use client";

import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Shield,
  Plane,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Star,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import {
  CATEGORIES,
  MOCK_TRAVELERS,
  MOCK_TESTIMONIALS,
  PLATFORM_STATS,
} from "@/lib/constants";
import { EscrowCalculator } from "@/components/marketplace/escrow-calculator";

// ── Animation variants ─────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

// ── Animated Section Wrapper (triggers only when in viewport) ──────────────

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [searchMode, setSearchMode] = useState<"buy" | "jastip">("buy");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-canvas py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column */}
              <motion.div
                className="lg:col-span-7 space-y-8"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={fadeUp}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive/10 text-olive text-xs font-semibold mb-4">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Garansi Keamanan Rekening Bersama (Escrow)</span>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-charcoal sm:text-5xl lg:text-6xl leading-tight">
                    Oleh-Oleh Autentik dari Tanah Suci &amp; Turki
                  </h1>
                  <p className="mt-4 text-lg text-sage max-w-xl">
                    Platform jastip terpercaya dengan proteksi dana escrow 100%
                    dan traveler terverifikasi identitas resmi.
                  </p>
                </motion.div>

                {/* Floating Search Bar with Tabs */}
                <motion.div variants={fadeUp}>
                  <Card className="border-warm-border bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Tab Toggle with animated indicator */}
                    <div className="grid grid-cols-2 border-b border-warm-border relative">
                      {/* Sliding background indicator */}
                      <motion.div
                        className="absolute bottom-0 h-0.5 bg-olive"
                        style={{ width: "50%" }}
                        animate={{
                          x: searchMode === "buy" ? "0%" : "100%",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => setSearchMode("buy")}
                        className={`flex items-center justify-center gap-2 py-4 font-semibold text-sm transition-colors ${
                          searchMode === "buy"
                            ? "bg-olive/5 text-olive"
                            : "text-sage hover:bg-sand"
                        }`}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Mau Beli
                      </button>

                      <button
                        type="button"
                        onClick={() => setSearchMode("jastip")}
                        className={`flex items-center justify-center gap-2 py-4 font-semibold text-sm transition-colors ${
                          searchMode === "jastip"
                            ? "bg-olive/5 text-olive"
                            : "text-sage hover:bg-sand"
                        }`}
                      >
                        <Plane className="h-4 w-4" />
                        Mau Jastip
                      </button>
                    </div>

                    {/* Search Input — animates placeholder text on tab switch */}
                    <div className="p-3">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={searchMode}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-2 sm:flex-row sm:items-center"
                        >
                          <Input
                            type="text"
                            placeholder={
                              searchMode === "buy"
                                ? "Cari parfum, sajadah, kurma, Turkish delight..."
                                : "Cari traveler ke Makkah, Madinah, Istanbul..."
                            }
                            className="flex-1 border-warm-border focus-visible:ring-olive"
                          />
                          <Button className="bg-olive hover:bg-olive-light text-white font-semibold">
                            <Search className="mr-2 h-4 w-4" />
                            {searchMode === "buy"
                              ? "Cari Titipan"
                              : "Cari Traveler"}
                          </Button>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>

                {/* Category Chips */}
                <motion.div
                  variants={fadeUp}
                  className="flex flex-wrap gap-2"
                >
                  {[
                    { label: "Makkah & Madinah", href: "/listings?origin=makkah" },
                    { label: "Istanbul", href: "/listings?origin=istanbul" },
                    { label: "Parfum Attar", href: "/listings?category=parfum_attar" },
                    { label: "Sajadah Kiswah", href: "/listings?category=sajadah_karpet" },
                  ].map((chip) => (
                    <Link key={chip.label} href={chip.href}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer border-warm-border text-charcoal hover:border-olive hover:text-olive hover:bg-sand px-4 py-2 rounded-full text-xs font-medium transition-colors"
                      >
                        {chip.label}
                      </Badge>
                    </Link>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Column — Hero Image */}
              <motion.div
                className="lg:col-span-5 relative"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" as const }}
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&auto=format&fit=crop&q=80"
                    alt="Masjidil Haram Makkah"
                    width={800}
                    height={500}
                    unoptimized
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    priority
                  />

                  {/* Glassmorphism Badge */}
                  <motion.div
                    className="absolute top-6 right-6 backdrop-blur-md bg-white/40 border border-white/50 rounded-2xl px-4 py-3 shadow-lg"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-500 rounded-full p-1.5">
                        <ShieldCheck className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-bold text-sm text-slate-900">
                        100% Escrow Protected
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Trust Banner ──────────────────────────────────────────────── */}
        <section className="border-y border-warm-border bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Shield,
                  bg: "bg-emerald-100",
                  color: "text-emerald-700",
                  title: "Escrow Aman",
                  desc: "Dana dikunci sampai barang diterima",
                },
                {
                  icon: CheckCircle2,
                  bg: "bg-blue-100",
                  color: "text-blue-700",
                  title: "Traveler Terverifikasi",
                  desc: "KTP, Passport & Tiket diverifikasi",
                },
                {
                  icon: TrendingUp,
                  bg: "bg-amber-100",
                  color: "text-amber-700",
                  title: "Inspeksi 48 Jam",
                  desc: "Garansi cek keaslian barang",
                },
              ].map(({ icon: Icon, bg, color, title, desc }) => (
                <motion.div
                  key={title}
                  variants={cardVariant}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-charcoal">
                      {title}
                    </div>
                    <div className="text-xs text-sage">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatedSection>
          </div>
        </section>

        {/* ── Active Travelers ──────────────────────────────────────────── */}
        <section className="bg-sand py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-charcoal">
                Traveler yang Tersedia
              </h2>
              <Link
                href="/trips"
                className="text-sm font-medium text-olive hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <AnimatedSection className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_TRAVELERS.slice(0, 3).map((traveler) => (
                <motion.div key={traveler.id} variants={cardVariant}>
                  <Card className="border-warm-border bg-white p-4 transition-shadow hover:shadow-md h-full">
                    <div className="flex items-start gap-3">
                      <Image
                        src={traveler.avatar}
                        alt={traveler.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-charcoal text-sm">
                            {traveler.name}
                          </div>
                          {traveler.verifiedKtp && traveler.verifiedPassport && (
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="mt-0.5 text-[11px] text-olive font-medium">
                          {traveler.tripRole}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-sage">
                          <MapPin className="h-3 w-3" />
                          {traveler.origin} → {traveler.destination}
                        </div>
                        <div className="mt-2 text-xs text-sage">
                          Kembali: {traveler.returnDate} • Tersisa:{" "}
                          {traveler.remainingKg}kg
                        </div>
                        {traveler.statusBadge && (
                          <Badge
                            variant="outline"
                            className="mt-2 border-amber-300 bg-amber-50 text-amber-700 text-[10px]"
                          >
                            {traveler.statusBadge}
                          </Badge>
                        )}
                        <div className="mt-3 flex items-center gap-2 text-xs text-sage">
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-charcoal">
                              {traveler.rating}
                            </span>
                            <span>({traveler.reviewCount})</span>
                          </div>
                          <span>•</span>
                          <span>{traveler.completedTrips} trip</span>
                        </div>
                        <div className="mt-3">
                          <Link href={`/trips/${traveler.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-full border-olive/30 text-olive hover:bg-olive/5"
                            >
                              Lihat Trip
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatedSection>
          </div>
        </section>

        {/* ── Categories Grid ────────────────────────────────────────────── */}
        <section className="bg-canvas py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-charcoal">
                Kategori Oleh-Oleh Populer
              </h2>
              <p className="mt-2 text-sage text-sm max-w-xl mx-auto">
                Pilihan kurasi titipan autentik langsung dari pasar lokal
                Makkah, Madinah, dan Turki
              </p>
            </div>

            <AnimatedSection className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Object.entries(CATEGORIES)
                .slice(0, 8)
                .map(([key, cat]) => {
                  const IconComponent = cat.icon;
                  return (
                    <motion.div key={key} variants={cardVariant}>
                      <Link href={`/listings?category=${key}`}>
                        <Card className="group relative overflow-hidden border-warm-border bg-white p-5 transition-all hover:border-olive hover:shadow-lg h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-olive/10 text-olive group-hover:bg-olive group-hover:text-white transition-colors">
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <span className="text-[10px] font-semibold text-olive/80 uppercase tracking-wider">
                                Autentik
                              </span>
                            </div>
                            <div className="font-bold text-charcoal group-hover:text-olive text-sm">
                              {cat.labelId}
                            </div>
                            <p className="mt-1 text-xs text-sage line-clamp-2">
                              {cat.description}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-warm-border/60 flex items-center justify-between text-xs font-semibold text-olive">
                            <span>Lihat Titipan</span>
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
            </AnimatedSection>
          </div>
        </section>

        {/* ── Escrow Calculator & How It Works ─────────────────────────── */}
        <section className="bg-sand py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <Badge className="bg-olive/10 text-olive border-olive/20 mb-3">
                    Transparansi Penuh
                  </Badge>
                  <h2 className="text-3xl font-extrabold text-charcoal sm:text-4xl leading-tight">
                    Sistem Escrow Terjamin, Bebas Was-Was
                  </h2>
                  <p className="mt-4 text-sage text-base">
                    Uang titipan Anda tidak langsung diterima oleh traveler.
                    Dana aman tersimpan di Rekening Escrow Safara dan baru
                    dicairkan setelah barang tiba di tangan Anda dengan kondisi
                    sesuai.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      n: 1,
                      title: "Pilih Barang / Ajukan Titip",
                      desc: "Diskusikan harga toko dan komisi jastip secara transparan di ruang obrolan aman.",
                    },
                    {
                      n: 2,
                      title: "Kunci Dana di Escrow Safara",
                      desc: "Bayar via QRIS / Virtual Account bank nasional. Traveler mulai membelikan barang di toko fisik.",
                    },
                    {
                      n: 3,
                      title: "Inspeksi 48 Jam & Pencairan",
                      desc: "Paket tiba di rumah Anda. Cek keaslian dalam waktu 48 jam sebelum dana diteruskan ke traveler.",
                    },
                  ].map(({ n, title, desc }) => (
                    <div key={n} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive text-white font-bold text-xs">
                        {n}
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal text-sm">
                          {title}
                        </h4>
                        <p className="text-xs text-sage mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6">
                <EscrowCalculator />
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────────── */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 mb-2">
                Dipercaya Jamaah &amp; Traveler
              </Badge>
              <h2 className="text-3xl font-bold text-charcoal">
                Cerita Sukses Komunitas Safara
              </h2>
              <p className="mt-2 text-sage text-sm max-w-lg mx-auto">
                Pengalaman nyata dari pembeli dan pembimbing jamaah yang telah
                menggunakan sistem escrow Safara.
              </p>
            </div>

            <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_TESTIMONIALS.map((testi) => (
                <motion.div key={testi.id} variants={cardVariant}>
                  <Card className="border-warm-border p-6 flex flex-col justify-between bg-canvas/40 shadow-sm h-full">
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-3">
                        {[...Array(testi.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-charcoal italic leading-relaxed">
                        &ldquo;{testi.quote}&rdquo;
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-warm-border flex items-center gap-3">
                      <Image
                        src={testi.avatar}
                        alt={testi.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-xs text-charcoal">
                          {testi.name}
                        </div>
                        <div className="text-[11px] text-sage">
                          {testi.city} • {testi.role}
                        </div>
                        <div className="text-[10px] text-olive font-medium mt-0.5">
                          {testi.itemPurchased}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatedSection>

            {/* Platform Stats Bar */}
            <div className="mt-12 rounded-2xl bg-olive p-8 text-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-gold">
                    {PLATFORM_STATS.totalEscrowDisbursedIdr}
                  </div>
                  <div className="text-xs text-sand/80 mt-1">
                    Total Dana Escrow Terlindungi
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {PLATFORM_STATS.successfulTransactions}
                  </div>
                  <div className="text-xs text-sand/80 mt-1">
                    Transaksi Jastip Sukses
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {PLATFORM_STATS.activeVerifiedTravelers}
                  </div>
                  <div className="text-xs text-sand/80 mt-1">
                    Traveler Terverifikasi
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    {PLATFORM_STATS.disputeRate}
                  </div>
                  <div className="text-xs text-sand/80 mt-1">
                    Tingkat Sengketa Rendah
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ────────────────────────────────────────────────── */}
        <section className="bg-olive py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Mau Jadi Traveler Safara?
            </h2>
            <p className="mt-4 text-lg text-sand">
              Daftar tripmu dan mulai hasilkan uang dari perjalanan umrah atau
              liburan ke Turki
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-olive hover:bg-sand">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
