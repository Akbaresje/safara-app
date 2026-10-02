"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Search,
  Filter,
  MapPin,
  Star,
  CheckCircle2,
  Calendar,
  Package,
} from "lucide-react";
import Link from "next/link";
import { CATEGORIES, DESTINATIONS, formatRupiah } from "@/lib/constants";
import type { ItemCategory, TravelDestination } from "@/types/database";

// Mock listing data
const MOCK_LISTINGS = [
  {
    id: "list-1",
    type: "traveler_offer" as const,
    title: "Parfum Surrati Royal Musk & Oud Bukhoor dari Madinah",
    creator_name: "Ustadz H. Ahmad Fauzi, Lc.",
    creator_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    creator_verified: true,
    category: "parfum_attar" as ItemCategory,
    origin: "madinah" as TravelDestination,
    estimated_price: 350000,
    jastip_fee: 75000,
    total_price: 425000,
    weight_kg: 0.8,
    available_qty: 3,
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    ],
    departure_date: "2026-10-12",
    rating: 4.95,
    completed_trips: 14,
  },
  {
    id: "list-2",
    type: "buyer_request" as const,
    title: "Dicari: Turkish Delight Hafiz Mustafa Mix Pistachio 1kg",
    creator_name: "Nabila Saraswati",
    creator_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    creator_verified: true,
    category: "turkish_delight_tea" as ItemCategory,
    origin: "istanbul" as TravelDestination,
    estimated_price: 280000,
    jastip_fee: 100000,
    total_price: 380000,
    weight_kg: 1.2,
    available_qty: 1,
    images: [
      "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80",
    ],
    departure_date: "2026-10-18",
    rating: 4.88,
    completed_trips: 8,
  },
  {
    id: "list-3",
    type: "traveler_offer" as const,
    title: "Sajadah Tebal Raudhah Motif Kiswah + Tasbih Kayu",
    creator_name: "Muhammad Rizky Pratama",
    creator_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    creator_verified: true,
    category: "sajadah_textiles" as ItemCategory,
    origin: "makkah" as TravelDestination,
    estimated_price: 450000,
    jastip_fee: 80000,
    total_price: 530000,
    weight_kg: 1.5,
    available_qty: 5,
    images: [
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80",
    ],
    departure_date: "2026-10-15",
    rating: 5.0,
    completed_trips: 19,
  },
];

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | "all">("all");
  const [selectedDestination, setSelectedDestination] = useState<TravelDestination | "all">("all");
  const [listingType, setListingType] = useState<"all" | "traveler_offer" | "buyer_request">("all");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory, selectedDestination, listingType]);

  const filteredListings = MOCK_LISTINGS.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || listing.category === selectedCategory;
    const matchesDestination = selectedDestination === "all" || listing.origin === selectedDestination;
    const matchesType = listingType === "all" || listing.type === listingType;
    return matchesSearch && matchesCategory && matchesDestination && matchesType;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-canvas">
        {/* Hero Search Section */}
        <section className="bg-white border-b border-warm-border py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-charcoal">Jelajahi Titipan</h1>
                <p className="text-sm text-sage mt-1">
                  {filteredListings.length} listing tersedia dari Tanah Suci & Turki
                </p>
              </div>
              <Link href="/listings/new">
                <Button className="bg-olive hover:bg-olive-light text-white">
                  + Posting Titipan
                </Button>
              </Link>
            </div>

            {/* Search & Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sage" />
                <Input
                  placeholder="Cari parfum, kurma, sajadah, Turkish delight..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-warm-border"
                />
              </div>

              {/* Type Filter */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setListingType("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    listingType === "all"
                      ? "bg-olive text-white"
                      : "bg-white border border-warm-border text-sage hover:border-olive"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setListingType("traveler_offer")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    listingType === "traveler_offer"
                      ? "bg-olive text-white"
                      : "bg-white border border-warm-border text-sage hover:border-olive"
                  }`}
                >
                  Penawaran Traveler
                </button>
                <button
                  onClick={() => setListingType("buyer_request")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    listingType === "buyer_request"
                      ? "bg-olive text-white"
                      : "bg-white border border-warm-border text-sage hover:border-olive"
                  }`}
                >
                  Permintaan Pembeli
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:col-span-1">
                <Card className="border-warm-border bg-white p-4 sticky top-20">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-4 w-4 text-olive" />
                    <h3 className="font-bold text-charcoal">Filter</h3>
                  </div>

                  {/* Destination Filter */}
                  <div className="mb-6">
                    <Label className="text-xs font-semibold text-sage uppercase tracking-wider mb-2 block">
                      Destinasi
                    </Label>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedDestination("all")}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          selectedDestination === "all"
                            ? "bg-olive/10 text-olive font-semibold"
                            : "text-sage hover:bg-sand"
                        }`}
                      >
                        Semua Destinasi
                      </button>
                      {Object.entries(DESTINATIONS).map(([key, dest]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedDestination(key as TravelDestination)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            selectedDestination === key
                              ? "bg-olive/10 text-olive font-semibold"
                              : "text-sage hover:bg-sand"
                          }`}
                        >
                          {dest.flag} {dest.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <Label className="text-xs font-semibold text-sage uppercase tracking-wider mb-2 block">
                      Kategori
                    </Label>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          selectedCategory === "all"
                            ? "bg-olive/10 text-olive font-semibold"
                            : "text-sage hover:bg-sand"
                        }`}
                      >
                        Semua Kategori
                      </button>
                      {Object.entries(CATEGORIES).map(([key, cat]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedCategory(key as ItemCategory)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            selectedCategory === key
                              ? "bg-olive/10 text-olive font-semibold"
                              : "text-sage hover:bg-sand"
                          }`}
                        >
                          {cat.labelId}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              </aside>

              {/* Listings Grid */}
              <div className="lg:col-span-3">
                {filteredListings.length === 0 ? (
                  <Card className="border-warm-border bg-white p-12 text-center">
                    <Package className="h-12 w-12 text-sage mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-charcoal mb-2">
                      Tidak ada listing ditemukan
                    </h3>
                    <p className="text-sm text-sage">
                      Coba ubah filter atau buat request baru
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredListings.map((listing) => (
                      <Card
                        key={listing.id}
                        className="border-warm-border bg-white overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {/* Image */}
                        <div className="relative h-48">
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <Badge
                            className={`absolute top-3 left-3 ${
                              listing.type === "traveler_offer"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }`}
                          >
                            {listing.type === "traveler_offer" ? "Penawaran" : "Dicari"}
                          </Badge>
                          <Badge className="absolute top-3 right-3 bg-white/90 text-charcoal border-warm-border">
                            <MapPin className="h-3 w-3 mr-1" />
                            {DESTINATIONS[listing.origin].city}
                          </Badge>
                        </div>

                        <div className="p-4">
                          {/* Title */}
                          <h3 className="font-bold text-charcoal text-sm line-clamp-2 mb-3">
                            {listing.title}
                          </h3>

                          {/* Creator Info */}
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-warm-border">
                            <Image
                              src={listing.creator_avatar}
                              alt={listing.creator_name}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold text-charcoal truncate">
                                  {listing.creator_name}
                                </span>
                                {listing.creator_verified && (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-sage">
                                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                <span>{listing.rating}</span>
                                <span>•</span>
                                <span>{listing.completed_trips} trip</span>
                              </div>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-xs">
                              <span className="text-sage">Harga Barang</span>
                              <span className="font-semibold text-charcoal">
                                {formatRupiah(listing.estimated_price)}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-sage">Fee Jastip</span>
                              <span className="font-semibold text-charcoal">
                                {formatRupiah(listing.jastip_fee)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-warm-border">
                              <span className="text-xs font-bold text-charcoal">Total Estimasi</span>
                              <span className="text-base font-extrabold text-olive">
                                {formatRupiah(listing.total_price)}
                              </span>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-xs text-sage mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(listing.departure_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              <span>{listing.weight_kg}kg • {listing.available_qty} item</span>
                            </div>
                          </div>

                          <Link href={`/listings/${listing.id}`}>
                            <Button className="w-full bg-olive hover:bg-olive-light text-white text-sm">
                              {listing.type === "traveler_offer" ? "Pesan Sekarang" : "Tawarkan Bawakan"}
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
