"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plane,
  Luggage,
  Star,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  PackageCheck,
} from "lucide-react";
import { MOCK_TRAVELERS } from "@/lib/constants";

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const traveler =
    MOCK_TRAVELERS.find((t) => t.id === resolvedParams.id) || MOCK_TRAVELERS[0];

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-sm text-sage hover:text-charcoal"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Trip
          </Link>

          {/* Traveler Hero Card */}
          <Card className="border-warm-border bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Image
                  src={traveler.avatar}
                  alt={traveler.name}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover border-2 border-warm-border shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-charcoal">
                      {traveler.name}
                    </h1>
                    {traveler.verifiedKtp && (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-olive font-semibold mt-0.5">
                    {traveler.tripRole}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-sage">
                    <span className="flex items-center gap-0.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <strong className="text-charcoal">{traveler.rating}</strong>
                    </span>
                    <span>•</span>
                    <span>{traveler.reviewCount} ulasan jamaah</span>
                    <span>•</span>
                    <span>{traveler.completedTrips} trip berhasil</span>
                  </div>
                </div>
              </div>

              <Link href="/chat">
                <Button className="bg-olive hover:bg-olive-light text-white font-semibold py-5">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat & Ajukan Titipan
                </Button>
              </Link>
            </div>
          </Card>

          {/* Trip Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Route & Flight Info */}
            <Card className="border-warm-border bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-olive font-bold text-sm">
                <Plane className="h-4 w-4" />
                <span>Rute Penerbangan</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-sage block">Keberangkatan</span>
                  <span className="font-bold text-charcoal text-sm">{traveler.origin}</span>
                  <span className="text-sage block text-[11px] mt-0.5">{traveler.departureDate}</span>
                </div>
                <div className="border-t border-warm-border pt-2">
                  <span className="text-sage block">Kepulangan ke Tanah Air</span>
                  <span className="font-bold text-charcoal text-sm">{traveler.destination}</span>
                  <span className="text-emerald-700 font-semibold block text-[11px] mt-0.5">
                    Tiba: {traveler.returnDate}
                  </span>
                </div>
              </div>
            </Card>

            {/* Baggage Status */}
            <Card className="border-warm-border bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-olive font-bold text-sm">
                <Luggage className="h-4 w-4" />
                <span>Kapasitas Bagasi</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-extrabold text-olive">{traveler.remainingKg} kg</span>
                  <span className="text-xs text-sage">Tersisa dari {traveler.totalLuggageKg} kg</span>
                </div>
                <div className="w-full bg-sand h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-olive h-full rounded-full"
                    style={{
                      width: `${((traveler.totalLuggageKg - traveler.remainingKg) / traveler.totalLuggageKg) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-sage">
                  Disarankan mengajukan titipan sebelum kuota bagasi habis dipesan jamaah lain.
                </p>
              </div>
            </Card>

            {/* Escrow Guarantee */}
            <Card className="border-warm-border bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Proteksi Escrow 100%</span>
              </div>
              <p className="text-xs text-sage leading-relaxed">
                Uang Anda disimpan di Rekening Escrow Safara dan baru diteruskan ke traveler setelah paket oleh-oleh tiba di rumah Anda dan lulus inspeksi 48 jam.
              </p>
              <div className="text-[11px] text-olive font-semibold flex items-center gap-1">
                <PackageCheck className="h-3.5 w-3.5" />
                Garansi barang asli toko fisik
              </div>
            </Card>
          </div>

          {/* Traveler Requirements & FAQ */}
          <Card className="border-warm-border bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-charcoal">
              Ketentuan Titip Barang untuk Trip Ini
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-canvas border border-warm-border">
                <span className="font-bold text-charcoal block mb-1">✅ Barang yang Diterima</span>
                <ul className="text-sage space-y-1 list-disc list-inside">
                  <li>Parfum & Oud dalam kemasan segel toko</li>
                  <li>Sajadah, abaya, dan tekstil oleh-oleh</li>
                  <li>Kurma kemasan vakum, kacang-kacangan, dan cokelat</li>
                  <li>Turkish delight / Lokum kemasan asli toko</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-canvas border border-warm-border">
                <span className="font-bold text-charcoal block mb-1">❌ Tidak Menerima</span>
                <ul className="text-sage space-y-1 list-disc list-inside">
                  <li>Cairan aerosol atau barang mudah terbakar</li>
                  <li>Barang pecah belah tanpa pelindung ekstra</li>
                  <li>Barang berukuran melebihi dimensi koper standar</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
