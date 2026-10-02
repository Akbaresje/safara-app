"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Calendar,
  Luggage,
  Star,
  CheckCircle2,
  Search,
  Plus,
  ArrowRight,
} from "lucide-react";
import { MOCK_TRAVELERS } from "@/lib/constants";

export default function TripsPage() {
  const [searchCity, setSearchCity] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  const filteredTravelers = MOCK_TRAVELERS.filter((trv) => {
    const matchesSearch =
      trv.name.toLowerCase().includes(searchCity.toLowerCase()) ||
      trv.destination.toLowerCase().includes(searchCity.toLowerCase()) ||
      trv.origin.toLowerCase().includes(searchCity.toLowerCase());
    const matchesRole = filterRole === "all" || trv.tripRole === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-charcoal">
                Jadwal Trip & Traveler Terverifikasi
              </h1>
              <p className="text-sm text-sage mt-1">
                Pilih traveler terpercaya yang sedang atau akan berangkat untuk membawakan titipan Anda.
              </p>
            </div>

            <Link href="/trips/new">
              <Button className="bg-olive hover:bg-olive-light text-white font-semibold">
                <Plus className="h-4 w-4 mr-1.5" />
                Buka Kuota Trip Saya
              </Button>
            </Link>
          </div>

          {/* Search & Filters */}
          <Card className="border-warm-border bg-white p-4 shadow-sm space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage" />
              <Input
                placeholder="Cari kota keberangkatan atau tujuan (Makkah, Madinah, Istanbul, Jakarta)..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="pl-9 h-11 border-warm-border text-sm"
              />
            </div>

            <div className="flex gap-2 flex-wrap text-xs">
              <button
                onClick={() => setFilterRole("all")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterRole === "all"
                    ? "bg-olive text-white"
                    : "bg-sand text-sage hover:text-charcoal"
                }`}
              >
                Semua Peran
              </button>
              <button
                onClick={() => setFilterRole("Tour Leader Umrah")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterRole === "Tour Leader Umrah"
                    ? "bg-olive text-white"
                    : "bg-sand text-sage hover:text-charcoal"
                }`}
              >
                Tour Leader Umrah
              </button>
              <button
                onClick={() => setFilterRole("Mahasiswa Madinah")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterRole === "Mahasiswa Madinah"
                    ? "bg-olive text-white"
                    : "bg-sand text-sage hover:text-charcoal"
                }`}
              >
                Mahasiswa Madinah
              </button>
              <button
                onClick={() => setFilterRole("Traveler / Backpacker")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterRole === "Traveler / Backpacker"
                    ? "bg-olive text-white"
                    : "bg-sand text-sage hover:text-charcoal"
                }`}
              >
                Backpacker Turki
              </button>
            </div>
          </Card>

          {/* Travelers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTravelers.map((traveler) => (
              <Card
                key={traveler.id}
                className="border-warm-border bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top: Avatar & Badges */}
                  <div className="flex items-start gap-3">
                    <Image
                      src={traveler.avatar}
                      alt={traveler.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-charcoal text-sm truncate">
                          {traveler.name}
                        </span>
                        {traveler.verifiedKtp && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-olive font-medium mt-0.5">
                        {traveler.tripRole}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-sage mt-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-charcoal">{traveler.rating}</span>
                        <span>({traveler.reviewCount} ulasan)</span>
                        <span>•</span>
                        <span>{traveler.completedTrips} trip</span>
                      </div>
                    </div>
                  </div>

                  {/* Route & Dates */}
                  <div className="rounded-xl bg-canvas p-3 border border-warm-border space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-charcoal">
                      <MapPin className="h-3.5 w-3.5 text-olive" />
                      <span>{traveler.origin} ➔ {traveler.destination}</span>
                    </div>
                    <div className="flex items-center justify-between text-sage text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Kembali: {traveler.returnDate}
                      </span>
                      {traveler.statusBadge && (
                        <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 text-[10px]">
                          {traveler.statusBadge}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Luggage gauge */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-sage flex items-center gap-1">
                        <Luggage className="h-3.5 w-3.5 text-olive" />
                        Sisa Kuota Bagasi
                      </span>
                      <span className="font-extrabold text-olive">
                        {traveler.remainingKg} kg dari {traveler.totalLuggageKg} kg
                      </span>
                    </div>
                    <div className="w-full bg-sand h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-olive h-full rounded-full"
                        style={{
                          width: `${((traveler.totalLuggageKg - traveler.remainingKg) / traveler.totalLuggageKg) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-warm-border flex gap-2">
                  <Link href={`/trips/${traveler.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-olive hover:bg-olive-light text-white text-xs font-semibold"
                    >
                      Lihat Jadwal & Titip
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
