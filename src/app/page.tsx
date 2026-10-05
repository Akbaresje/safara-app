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
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-olive/10 text-olive text-xs font-bold mb-4 border border-olive/20 shadow-2xs">
                    <ShieldCheck className="h-4 w-4 text-olive" />
                    <span>Garansi Keamanan Rekening Bersama (Escrow) 100%</span>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-charcoal sm:text-5xl lg:text-6xl leading-[1.15]">
                    Oleh-Oleh Autentik dari Tanah Suci &amp; Turki
                  </h1>
                  <p className="mt-4 text-base sm:text-lg text-sage leading-relaxed max-w-xl font-normal">
                    Platform jastip terpercaya dengan proteksi dana escrow 100%
                    dan traveler terverifikasi identitas resmi.
                  </p>
                </motion.div>

                {/* Floating Search Bar with Tabs */}
                <motion.div variants={fadeUp}>
                  <Card className="border-warm-border bg-white shadow-lg rounded-2xl overflow-hidden">
                    {/* Tab Toggle with animated indicator */}
                    <div className="grid grid-cols-2 border-b border-warm-border relative bg-sand/30">
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
                        className={`flex min-h-[48px] items-center justify-center gap-2 py-3.5 font-bold text-sm transition-all cursor-pointer ${
                          searchMode === "buy"
                            ? "bg-white text-olive"
                            : "text-sage hover:bg-sand/60 hover:text-charcoal"
                        }`}
                      >
                        <ShoppingBag className="h-4.5 w-4.5" />
                        Mau Beli Titipan
                      </button>

                      <button
                        type="button"
                        onClick={() => setSearchMode("jastip")}
                        className={`flex min-h-[48px] items-center justify-center gap-2 py-3.5 font-bold text-sm transition-all cursor-pointer ${
                          searchMode === "jastip"
                            ? "bg-white text-olive"
                            : "text-sage hover:bg-sand/60 hover:text-charcoal"
                        }`}
                      >
                        <Plane className="h-4.5 w-4.5" />
                        Mau Jadi Jastiper
                      </button>
                    </div>

                    {/* Search Input — animates placeholder text on tab switch */}
                    <div className="p-3.5 sm:p-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={searchMode}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
                        >
                          <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-sage" />
                            <Input
                              type="text"
                              placeholder={
                                searchMode === "buy"
                                  ? "Cari parfum, sajadah, kurma, Turkish delight..."
                                  : "Cari traveler ke Makkah, Madinah, Istanbul..."
                              }
                              className="pl-10 h-12 text-sm border-warm-border focus-visible:ring-olive/30 shadow-2xs"
                            />
                          </div>
                          <Button className="h-12 px-6 rounded-xl bg-olive hover:bg-olive-light text-white font-bold text-sm shadow-xs hover:shadow-sm active:scale-[0.98]">
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
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="text-xs font-semibold text-sage mr-1">Populer:</span>
                  {[
                    { label: "Makkah & Madinah", href: "/listings?origin=makkah" },
                    { label: "Istanbul", href: "/listings?origin=istanbul" },
                    { label: "Parfum Attar", href: "/listings?category=parfum_attar" },
                    { label: "Sajadah Kiswah", href: "/listings?category=sajadah_karpet" },
                  ].map((chip) => (
                    <Link key={chip.label} href={chip.href}>
                      <span className="inline-flex items-center min-h-[36px] px-3.5 py-1.5 rounded-full border border-warm-border bg-white text-xs font-semibold text-charcoal shadow-2xs hover:border-olive hover:text-olive hover:bg-sand/60 active:scale-95 transition-all cursor-pointer">
                        {chip.label}
                      </span>
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
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-warm-border/60">
                  <Image
                    src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&auto=format&fit=crop&q=80"
                    alt="Masjidil Haram Makkah"
                    width={800}
                    height={500}
                    unoptimized
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    priority
                  />

                  {/* Glassmorphism Badge with high readability */}
                  <motion.div
                    className="absolute top-6 right-6 backdrop-blur-md bg-white/90 border border-white/80 rounded-2xl px-4 py-3 shadow-lg"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="bg-emerald-600 rounded-full p-1.5 text-white shadow-2xs">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-charcoal">
                          100% Proteksi Escrow
                        </div>
                        <div className="text-[11px] font-medium text-emerald-700">
                          Dana aman terjamin
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Trust Banner ──────────────────────────────────────────────── */}
        <section className="border-y border-warm-border bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Shield,
                  bg: "bg-emerald-50 border border-emerald-200",
                  color: "text-emerald-700",
                  title: "Rekening Bersama Escrow",
                  desc: "Dana dikunci aman sampai barang tiba di tangan Anda",
                },
                {
                  icon: CheckCircle2,
                  bg: "bg-blue-50 border border-blue-200",
                  color: "text-blue-700",
                  title: "Traveler Terverifikasi",
                  desc: "KTP, Paspor RI & Tiket penerbangan diverifikasi resmi",
                },
                {
                  icon: TrendingUp,
                  bg: "bg-amber-50 border border-amber-200",
                  color: "text-amber-700",
                  title: "Garansi Inspeksi 48 Jam",
                  desc: "Periksa keaslian oleh-oleh sebelum pencairan dana",
                },
              ].map(({ icon: Icon, bg, color, title, desc }) => (
                <motion.div
                  key={title}
                  variants={cardVariant}
                  className="flex items-center gap-3.5 p-3 rounded-2xl transition-colors hover:bg-sand/40"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${bg}`}
                  >
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-charcoal">
                      {title}
                    </div>
                    <div className="text-xs text-sage mt-0.5 leading-relaxed">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatedSection>
          </div>
        </section>

        {/* ── Active Travelers ──────────────────────────────────────────── */}
        <section className="bg-sand/60 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-olive">
                  Komunitas Terpercaya
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
                  Traveler Siap Bawa Titipan
                </h2>
              </div>
              <Link
                href="/trips"
                className="inline-flex items-center gap-1 text-sm font-bold text-olive hover:underline"
              >
                Lihat Semua Trip <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <AnimatedSection className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_TRAVELERS.slice(0, 3).map((traveler) => (
                <motion.div key={traveler.id} variants={cardVariant}>
                  <Card className="border-warm-border bg-white p-5 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start gap-3.5">
                        <Image
                          src={traveler.avatar}
                          alt={traveler.name}
                          width={52}
                          height={52}
                          className="h-13 w-13 rounded-2xl object-cover border border-warm-border shrink-0 shadow-2xs"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-charcoal text-sm truncate">
                              {traveler.name}
                            </span>
                            {traveler.verifiedKtp && traveler.verifiedPassport && (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5 font-bold">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="mt-0.5 text-xs text-olive font-semibold">
                            {traveler.tripRole}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-sage">
                            <MapPin className="h-3.5 w-3.5 text-olive shrink-0" />
                            <span>{traveler.origin} → {traveler.destination}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-warm-border/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-sage">Kepulangan:</span>
                          <span className="font-semibold text-charcoal">{traveler.returnDate}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-sage">Sisa Kuota Bagasi:</span>
                          <span className="font-bold text-olive">{traveler.remainingKg} kg</span>
                        </div>
                        {traveler.statusBadge && (
                          <div className="pt-1">
                            <span className="inline-block rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                              {traveler.statusBadge}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-warm-border/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 text-xs text-sage font-medium">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-charcoal">{traveler.rating}</span>
                        <span>({traveler.reviewCount} ulasan)</span>
                      </div>
                      <Link href={`/trips/${traveler.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 px-3.5 rounded-xl border-olive/30 text-olive hover:bg-olive hover:text-white font-bold text-xs"
                        >
                          Lihat Trip
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatedSection>
          </div>
        </section>

        {/* ── Categories Grid ────────────────────────────────────────────── */}
        <section className="bg-canvas py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-olive">
                Katalog Titipan
              </span>
              <h2 className="text-3xl font-extrabold text-charcoal mt-1">
                Kategori Oleh-Oleh Populer
              </h2>
              <p className="mt-2 text-sage text-sm max-w-xl mx-auto leading-relaxed">
                Pilihan kurasi titipan autentik langsung dari pasar lokal
                Makkah, Madinah, dan Istanbul
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
                        <Card className="group relative overflow-hidden border-warm-border bg-white p-6 rounded-2xl shadow-xs transition-all duration-200 hover:border-olive/50 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col justify-between cursor-pointer">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-olive/10 text-olive group-hover:bg-olive group-hover:text-white transition-all duration-200 shadow-2xs">
                                <IconComponent className="h-6 w-6" aria-hidden="true" />
                              </div>
                              <span className="text-xs font-bold text-olive/80 uppercase tracking-wider">
                                Autentik
                              </span>
                            </div>
                            <div className="font-bold text-charcoal group-hover:text-olive text-base transition-colors">
                              {cat.labelId}
                            </div>
                            <p className="mt-1.5 text-xs text-sage line-clamp-2 leading-relaxed">
                              {cat.description}
                            </p>
                          </div>
                          <div className="mt-5 pt-3.5 border-t border-warm-border/60 flex items-center justify-between text-xs font-bold text-olive">
                            <span>Jelajahi Titipan</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
        <section className="bg-sand/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive/10 text-olive text-xs font-bold border border-olive/20 mb-3 shadow-2xs">
                    Transparansi Penuh 100%
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal leading-[1.2]">
                    Sistem Rekening Bersama (Escrow), Belanja Bebas Was-Was
                  </h2>
                  <p className="mt-4 text-sage text-base sm:text-lg leading-relaxed">
                    Uang titipan Anda tidak langsung diterima oleh traveler.
                    Dana aman tersimpan di Rekening Escrow Safara dan baru
                    dicairkan setelah barang tiba di tangan Anda dengan kondisi
                    sesuai dan terbukti autentik.
                  </p>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      n: "01",
                      title: "Pilih Barang / Ajukan Titip",
                      desc: "Diskusikan estimasi harga toko dan fee jastip secara transparan di ruang obrolan aman Safara.",
                    },
                    {
                      n: "02",
                      title: "Kunci Dana di Rekening Escrow Safara",
                      desc: "Bayar via QRIS atau Virtual Account bank nasional. Traveler mulai membelikan barang di toko fisik resmi.",
                    },
                    {
                      n: "03",
                      title: "Inspeksi 48 Jam & Pencairan Dana",
                      desc: "Barang tiba di rumah Anda. Cek keaslian dan kondisi dalam 48 jam sebelum dana diteruskan ke traveler.",
                    },
                  ].map(({ n, title, desc }) => (
                    <div key={n} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-warm-border/80 shadow-2xs">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-olive text-white font-extrabold text-sm shadow-2xs">
                        {n}
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal text-base">
                          {title}
                        </h4>
                        <p className="text-xs text-sage mt-1 leading-relaxed">{desc}</p>
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
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Dipercaya Jamaah &amp; Traveler
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mt-3">
                Cerita Sukses Komunitas Safara
              </h2>
              <p className="mt-2 text-sage text-base max-w-lg mx-auto leading-relaxed">
                Pengalaman nyata dari pembeli dan pembimbing jamaah yang telah
                menggunakan sistem escrow Safara.
              </p>
            </div>

            <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_TESTIMONIALS.map((testi) => (
                <motion.div key={testi.id} variants={cardVariant}>
                  <Card className="border-warm-border p-6 rounded-2xl flex flex-col justify-between bg-canvas/70 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 h-full">
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-4">
                        {[...Array(testi.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-charcoal italic leading-relaxed">
                        &ldquo;{testi.quote}&rdquo;
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-warm-border/80 flex items-center gap-3.5">
                      <Image
                        src={testi.avatar}
                        alt={testi.name}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover border border-warm-border shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-charcoal truncate">
                          {testi.name}
                        </div>
                        <div className="text-xs text-sage truncate">
                          {testi.city} • {testi.role}
                        </div>
                        <div className="text-xs text-olive font-semibold mt-0.5 truncate">
                          {testi.itemPurchased}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatedSection>

            {/* Platform Stats Bar */}
            <div className="mt-16 rounded-3xl bg-olive p-8 sm:p-12 text-white shadow-xl border border-olive-light">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gold tracking-tight tabular-nums">
                    {PLATFORM_STATS.totalEscrowDisbursedIdr}
                  </div>
                  <div className="text-xs sm:text-sm text-sand/80 font-medium mt-1.5">
                    Total Dana Escrow Terlindungi
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight tabular-nums">
                    {PLATFORM_STATS.successfulTransactions}
                  </div>
                  <div className="text-xs sm:text-sm text-sand/80 font-medium mt-1.5">
                    Transaksi Jastip Sukses
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight tabular-nums">
                    {PLATFORM_STATS.activeVerifiedTravelers}
                  </div>
                  <div className="text-xs sm:text-sm text-sand/80 font-medium mt-1.5">
                    Traveler Terverifikasi Resmi
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-400 tracking-tight tabular-nums">
                    {PLATFORM_STATS.disputeRate}
                  </div>
                  <div className="text-xs sm:text-sm text-sand/80 font-medium mt-1.5">
                    Tingkat Sengketa Sangat Rendah
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ────────────────────────────────────────────────── */}
        <section className="bg-olive py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
              Mau Jadi Traveler Safara?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-sand/90 max-w-2xl mx-auto leading-relaxed">
              Buka trip perjalanan Anda dan mulai hasilkan penghasilan tambahan halal dari kuota bagasi umrah atau liburan ke Turki.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white text-olive hover:bg-sand font-bold shadow-md active:scale-[0.98]">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-8 rounded-xl border-white/80 bg-transparent text-white hover:bg-white/10 font-bold active:scale-[0.98]"
                >
                  Pelajari Cara Kerja
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
