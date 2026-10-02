"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Star,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  Share2,
} from "lucide-react";
import { CATEGORIES, DESTINATIONS, formatRupiah } from "@/lib/constants";
import type { ItemCategory, TravelDestination } from "@/types/database";

interface ListingDetail {
  id: string;
  type: string;
  title: string;
  description: string;
  creator_name: string;
  creator_role: string;
  creator_avatar: string;
  creator_verified: boolean;
  rating: number;
  completed_trips: number;
  category: ItemCategory;
  origin: TravelDestination;
  local_currency: string;
  local_price: number;
  estimated_price: number;
  jastip_fee: number;
  weight_kg: number;
  available_qty: number;
  departure_date: string;
  images: string[];
}

// Mock listing detail map
const MOCK_DETAILS: Record<string, ListingDetail> = {
  "list-1": {
    id: "list-1",
    type: "traveler_offer",
    title: "Parfum Surrati Royal Musk & Oud Bukhoor dari Madinah",
    description:
      "Minyak wangi murni non-alkohol dari Surrati Perfumes Madinah Al-Munawwarah. Aromanya lembut, tahan lama lebih dari 24 jam. Saya beli langsung dari gerai resmi depan pelataran Masjid Nabawi. Bisa titip varian Royal Musk, White Musk, atau Black Oud.",
    creator_name: "Ustadz H. Ahmad Fauzi, Lc.",
    creator_role: "Tour Leader Umrah & Mutawwif",
    creator_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    creator_verified: true,
    rating: 4.95,
    completed_trips: 14,
    category: "parfum_attar",
    origin: "madinah",
    local_currency: "SAR",
    local_price: 150,
    estimated_price: 637500,
    jastip_fee: 75000,
    weight_kg: 0.8,
    available_qty: 3,
    departure_date: "12 Okt 2026",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    ],
  },
};

const DEFAULT_ITEM: ListingDetail = {
  id: "list-default",
  type: "traveler_offer",
  title: "Titipan Autentik Tanah Suci & Turki",
  description:
    "Barang original dibeli langsung dari toko fisik terpercaya. Dilengkapi live photo toko dan struk belanja resmi sebelum pembayaran escrow dicairkan.",
  creator_name: "Traveler Terverifikasi",
  creator_role: "Jamaah Umrah Mandiri",
  creator_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  creator_verified: true,
  rating: 4.9,
  completed_trips: 8,
  category: "parfum_attar",
  origin: "makkah",
  local_currency: "SAR",
  local_price: 120,
  estimated_price: 510000,
  jastip_fee: 65000,
  weight_kg: 0.5,
  available_qty: 2,
  departure_date: "15 Okt 2026",
  images: [
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
  ],
};

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const listing = MOCK_DETAILS[resolvedParams.id] || DEFAULT_ITEM;
  const [selectedImg, setSelectedImg] = useState(0);

  const platformFee = Math.round((listing.estimated_price + listing.jastip_fee) * 0.035);
  const totalEscrow = listing.estimated_price + listing.jastip_fee + platformFee;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-sm text-sage hover:text-charcoal mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Semua Titipan
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Gallery & Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Image Preview */}
              <div className="space-y-3">
                <div className="h-[360px] sm:h-[420px] w-full rounded-2xl overflow-hidden bg-white border border-warm-border relative shadow-sm">
                  <Image
                    src={listing.images[selectedImg] || listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 58vw"
                  />
                  <Badge className="absolute top-4 left-4 bg-olive text-white">
                    {listing.type === "traveler_offer" ? "Penawaran Traveler" : "Dicari Pembeli"}
                  </Badge>
                  <Badge className="absolute top-4 right-4 bg-white/95 text-charcoal border-warm-border">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-olive" />
                    {DESTINATIONS[listing.origin]?.label || "Makkah"}
                  </Badge>
                </div>

                {listing.images.length > 1 && (
                  <div className="flex gap-2">
                    {listing.images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImg(idx)}
                        className={`h-16 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImg === idx ? "border-olive ring-2 ring-olive/20" : "border-warm-border opacity-70"
                        }`}
                      >
                        <Image src={img} alt="Thumbnail" width={80} height={64} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <Card className="border-warm-border bg-white p-6 shadow-sm space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-sage mb-2">
                    <span>Kategori: {CATEGORIES[listing.category]?.labelId || "Parfum"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Kepulangan: {listing.departure_date}
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-charcoal sm:text-3xl leading-snug">
                    {listing.title}
                  </h1>
                </div>

                <div className="border-t border-warm-border pt-4">
                  <h3 className="font-bold text-sm text-charcoal mb-2">Deskripsi Produk</h3>
                  <p className="text-sm text-sage leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>

                <div className="border-t border-warm-border pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-sage block">Kapasitas Sisa</span>
                    <span className="font-bold text-charcoal">{listing.available_qty} barang lagi</span>
                  </div>
                  <div>
                    <span className="text-sage block">Estimasi Berat</span>
                    <span className="font-bold text-charcoal">{listing.weight_kg} kg / item</span>
                  </div>
                  <div>
                    <span className="text-sage block">Keaslian</span>
                    <span className="font-bold text-emerald-700">100% Toko Fisik</span>
                  </div>
                </div>
              </Card>

              {/* Traveler Trust Card */}
              <Card className="border-warm-border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={listing.creator_avatar}
                      alt={listing.creator_name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-charcoal text-base">
                          {listing.creator_name}
                        </span>
                        {listing.creator_verified && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-xs text-olive font-medium mt-0.5">
                        {listing.creator_role}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-sage">
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <strong className="text-charcoal">{listing.rating}</strong>
                        </span>
                        <span>•</span>
                        <span>{listing.completed_trips} trip jastip selesai</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/chat">
                    <Button variant="outline" size="sm" className="border-warm-border text-charcoal hover:bg-sand">
                      <MessageCircle className="h-4 w-4 mr-1.5" />
                      Chat
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Right: Escrow Price Breakdown & Buy Action (5 Cols Sticky) */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <Card className="border-warm-border bg-white p-6 shadow-xl space-y-5">
                <div className="border-b border-warm-border pb-4">
                  <div className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Total Dana Masuk Escrow
                  </div>
                  <div className="text-3xl font-extrabold text-olive mt-1">
                    {formatRupiah(totalEscrow)}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Dana Anda 100% aman hingga barang tiba & diperiksa
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="space-y-2.5 text-xs text-sage">
                  <div className="flex justify-between">
                    <span>Harga Barang ({listing.local_price} {listing.local_currency})</span>
                    <span className="font-semibold text-charcoal">
                      {formatRupiah(listing.estimated_price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Komisi Jastip Traveler</span>
                    <span className="font-semibold text-charcoal">
                      {formatRupiah(listing.jastip_fee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      Biaya Proteksi Escrow (3.5%)
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 inline" />
                    </span>
                    <span className="font-semibold text-charcoal">
                      {formatRupiah(platformFee)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-canvas p-4 border border-warm-border space-y-2 text-xs">
                  <div className="font-bold text-charcoal flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-olive" />
                    Jaminan Perlindungan Safara
                  </div>
                  <ul className="text-sage space-y-1 text-[11px] list-disc list-inside">
                    <li>Traveler wajib kirim live photo sebelum beli</li>
                    <li>Garansi 48 jam inspeksi setelah barang sampai</li>
                    <li>Uang kembali 100% jika barang rusak atau palsu</li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <Link href={`/chat`}>
                    <Button className="w-full bg-olive hover:bg-olive-light text-white font-semibold py-6 text-sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat & Ajukan Titipan Ini
                    </Button>
                  </Link>

                  <Button variant="outline" className="w-full border-warm-border hover:bg-sand text-charcoal text-xs">
                    <Share2 className="h-3.5 w-3.5 mr-1.5" />
                    Bagikan Listing
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
