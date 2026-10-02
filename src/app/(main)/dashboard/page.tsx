"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Plane,
  Package,
  ArrowRight,
  MessageCircle,
  Plus,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { formatRupiah, ORDER_STATUS_LABELS } from "@/lib/constants";

// Mock user active orders
const MOCK_BUYER_ORDERS = [
  {
    id: "ord-101",
    item_name: "Parfum Surrati Royal Musk 100ml",
    traveler_name: "Ustadz H. Ahmad Fauzi, Lc.",
    traveler_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    origin: "Madinah",
    destination: "Jakarta",
    status: "purchased",
    item_price: 637500,
    jastip_fee: 75000,
    escrow_amount: 737412,
    eta: "12 Okt 2026",
  },
  {
    id: "ord-102",
    item_name: "Turkish Delight Hafiz Mustafa 1kg Mix Pistachio",
    traveler_name: "Siti Rahmania Putri",
    traveler_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    origin: "Istanbul",
    destination: "Surabaya",
    status: "escrow_funded",
    item_price: 280000,
    jastip_fee: 100000,
    escrow_amount: 393300,
    eta: "22 Okt 2026",
  },
];

const MOCK_TRAVELER_TRIPS = [
  {
    id: "trip-201",
    destination: "Makkah & Madinah Al-Mukarramah",
    origin: "Jakarta (CGK)",
    departureDate: "10 Okt 2026",
    returnDate: "24 Okt 2026",
    totalLuggageKg: 20,
    usedLuggageKg: 11.5,
    remainingKg: 8.5,
    status: "scheduled",
    acceptedOrdersCount: 6,
    totalPotentialEarnings: 650000,
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"buyer" | "traveler">("buyer");

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* User Profile Header Card */}
          <Card className="border-warm-border bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-olive/10 flex items-center justify-center font-bold text-2xl text-olive">
                    A
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 rounded-full p-1 text-white">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-charcoal">Ahmad Disk</h1>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                      Terverifikasi KTP
                    </Badge>
                  </div>
                  <p className="text-xs text-sage mt-0.5">
                    Member Safara sejak Sept 2026 • Skor Kepercayaan: 5.0 / 5.0
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/trips/new">
                  <Button variant="outline" size="sm" className="border-warm-border text-charcoal hover:bg-sand">
                    <Plane className="h-4 w-4 mr-1.5" />
                    Buka Trip Jastip
                  </Button>
                </Link>
                <Link href="/listings/new">
                  <Button size="sm" className="bg-olive hover:bg-olive-light text-white">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Posting Titipan Baru
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-6 pt-6 border-t border-warm-border grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-canvas">
                <div className="text-xs text-sage">Dana Escrow Terlindungi</div>
                <div className="text-lg font-bold text-olive mt-0.5">
                  {formatRupiah(1130712)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-canvas">
                <div className="text-xs text-sage">Pesanan Aktif</div>
                <div className="text-lg font-bold text-charcoal mt-0.5">2 Titipan</div>
              </div>
              <div className="p-3 rounded-lg bg-canvas">
                <div className="text-xs text-sage">Trip Aktif Anda</div>
                <div className="text-lg font-bold text-charcoal mt-0.5">1 Perjalanan</div>
              </div>
              <div className="p-3 rounded-lg bg-canvas">
                <div className="text-xs text-sage">Status Garansi</div>
                <div className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 100% Proteksi
                </div>
              </div>
            </div>
          </Card>

          {/* Compact View Switcher */}
          <div className="flex border-b border-warm-border">
            <button
              onClick={() => setActiveTab("buyer")}
              className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all ${
                activeTab === "buyer"
                  ? "border-olive text-olive bg-white rounded-t-lg"
                  : "border-transparent text-sage hover:text-charcoal"
              }`}
            >
              <Package className="h-4 w-4" />
              Titipan Saya (Sebagai Buyer)
              <Badge className="bg-olive/10 text-olive ml-1 text-xs">
                {MOCK_BUYER_ORDERS.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("traveler")}
              className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all ${
                activeTab === "traveler"
                  ? "border-olive text-olive bg-white rounded-t-lg"
                  : "border-transparent text-sage hover:text-charcoal"
              }`}
            >
              <Plane className="h-4 w-4" />
              Trip & Bagasi Saya (Sebagai Traveler)
              <Badge className="bg-gold/20 text-gold-muted ml-1 text-xs">
                {MOCK_TRAVELER_TRIPS.length}
              </Badge>
            </button>
          </div>

          {/* Tab Content: Buyer Orders */}
          {activeTab === "buyer" && (
            <div className="space-y-4">
              {MOCK_BUYER_ORDERS.map((order) => {
                const statusInfo = ORDER_STATUS_LABELS[order.status] || {
                  label: order.status,
                  color: "bg-slate-100 text-slate-700",
                };

                return (
                  <Card key={order.id} className="border-warm-border bg-white p-5 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Product & Traveler */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-sage">{order.id}</span>
                          <span className="text-sage">•</span>
                          <Badge className={`${statusInfo.color} text-xs`}>
                            {statusInfo.label}
                          </Badge>
                          <span className="text-xs text-sage">Estimasi Tiba: {order.eta}</span>
                        </div>

                        <h3 className="text-base font-bold text-charcoal">
                          {order.item_name}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-sage">
                          <span>Traveler:</span>
                          <Image
                            src={order.traveler_avatar}
                            alt={order.traveler_name}
                            width={20}
                            height={20}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          <span className="font-medium text-charcoal">{order.traveler_name}</span>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{order.origin} → {order.destination}</span>
                        </div>
                      </div>

                      {/* Right: Escrow summary & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-warm-border">
                        <div>
                          <div className="text-[11px] text-sage">Dana Aman di Escrow</div>
                          <div className="text-base font-extrabold text-olive">
                            {formatRupiah(order.escrow_amount)}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-medium">
                            Barang: {formatRupiah(order.item_price)} + Fee: {formatRupiah(order.jastip_fee)}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href="/chat">
                            <Button size="sm" variant="outline" className="border-warm-border hover:bg-sand text-xs">
                              <MessageCircle className="h-3.5 w-3.5 mr-1" />
                              Chat
                            </Button>
                          </Link>
                          {order.status === "purchased" && (
                            <Button size="sm" className="bg-olive hover:bg-olive-light text-white text-xs">
                              Cek Foto Toko
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Tab Content: Traveler Trips */}
          {activeTab === "traveler" && (
            <div className="space-y-4">
              {MOCK_TRAVELER_TRIPS.map((trip) => (
                <Card key={trip.id} className="border-warm-border bg-white p-5 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {trip.status === "scheduled" ? "Trip Terjadwal" : trip.status}
                        </Badge>
                        <span className="text-xs text-sage">
                          {trip.departureDate} - {trip.returnDate}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-charcoal">
                        {trip.origin} ➔ {trip.destination}
                      </h3>

                      {/* Baggage progress bar */}
                      <div className="space-y-1 max-w-xs">
                        <div className="flex justify-between text-xs text-sage">
                          <span>Bagasi Terisi ({trip.usedLuggageKg} kg)</span>
                          <span className="font-semibold text-olive">Sisa {trip.remainingKg} kg</span>
                        </div>
                        <div className="w-full bg-sand h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-olive h-full rounded-full"
                            style={{ width: `${(trip.usedLuggageKg / trip.totalLuggageKg) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-warm-border">
                      <div>
                        <div className="text-[11px] text-sage">Potensi Komisi Jastip</div>
                        <div className="text-base font-extrabold text-gold-muted">
                          {formatRupiah(trip.totalPotentialEarnings)}
                        </div>
                        <div className="text-[10px] text-sage">
                          Dari {trip.acceptedOrdersCount} pesanan titipan
                        </div>
                      </div>

                      <Link href={`/trips/${trip.id}`}>
                        <Button size="sm" className="bg-olive hover:bg-olive-light text-white text-xs">
                          Kelola Pesanan Trip
                          <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
