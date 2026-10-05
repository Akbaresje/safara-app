"use client";

import { useState, useEffect } from "react";
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
  Settings,
  ShoppingBag,
  Sparkles,
  Search,
} from "lucide-react";
import { formatRupiah, ORDER_STATUS_LABELS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

interface BuyerOrder {
  id: string;
  item_name: string;
  traveler_name: string;
  traveler_avatar?: string;
  origin: string;
  destination: string;
  status: string;
  item_price: number;
  jastip_fee: number;
  escrow_amount: number;
  eta: string;
}

interface TravelerTrip {
  id: string;
  destination: string;
  origin: string;
  departureDate: string;
  returnDate: string;
  totalLuggageKg: number;
  usedLuggageKg: number;
  remainingKg: number;
  status: string;
  acceptedOrdersCount: number;
  totalPotentialEarnings: number;
}

export default function DashboardPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"buyer" | "traveler">("buyer");
  const [userName, setUserName] = useState("Pengguna Safara");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState("unverified");
  const [buyerOrders, setBuyerOrders] = useState<BuyerOrder[]>([]);
  const [travelerTrips, setTravelerTrips] = useState<TravelerTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await (supabase.from("profiles") as unknown as {
            select: (columns: string) => {
              eq: (col: string, val: string) => {
                single: () => Promise<{
                  data: { full_name?: string; avatar_url?: string | null; kyc_status?: string } | null;
                }>;
              };
            };
          })
            .select("full_name, avatar_url, kyc_status")
            .eq("id", user.id)
            .single();

          if (profile) {
            setUserName(
              profile.full_name || user.email?.split("@")[0] || "Pengguna Safara"
            );
            setUserAvatar(profile.avatar_url || null);
            setKycStatus(profile.kyc_status || "unverified");
          } else {
            setUserName(
              user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split("@")[0] ||
                "Pengguna Safara"
            );
            setUserAvatar(
              user.user_metadata?.avatar_url ||
                user.user_metadata?.picture ||
                null
            );
          }

          // Fetch real buyer orders for this user
          try {
            const { data: ordersData } = await (supabase.from("orders") as unknown as {
              select: (cols: string) => {
                eq: (col: string, val: string) => Promise<{ data: BuyerOrder[] | null }>;
              };
            })
              .select("*")
              .eq("buyer_id", user.id);

            if (ordersData && ordersData.length > 0) {
              setBuyerOrders(ordersData);
            } else {
              setBuyerOrders([]);
            }
          } catch {
            setBuyerOrders([]);
          }

          // Fetch real trips created by this user
          try {
            const { data: tripsData } = await (supabase.from("trips") as unknown as {
              select: (cols: string) => {
                eq: (col: string, val: string) => Promise<{ data: TravelerTrip[] | null }>;
              };
            })
              .select("*")
              .eq("traveler_id", user.id);

            if (tripsData && tripsData.length > 0) {
              setTravelerTrips(tripsData);
            } else {
              setTravelerTrips([]);
            }
          } catch {
            setTravelerTrips([]);
          }
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [supabase]);

  const initial = userName.charAt(0).toUpperCase();
  const totalEscrow = buyerOrders.reduce((acc, curr) => acc + (curr.escrow_amount || 0), 0);
  const activeOrdersCount = buyerOrders.filter((o) => o.status !== "completed" && o.status !== "cancelled").length;
  const activeTripsCount = travelerTrips.filter((t) => t.status === "scheduled" || t.status === "active").length;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* User Profile Header Card */}
          <Card className="border-warm-border bg-white p-6 sm:p-8 rounded-3xl shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt={userName}
                      width={68}
                      height={68}
                      className="h-17 w-17 rounded-2xl object-cover border-2 border-warm-border shadow-2xs"
                    />
                  ) : (
                    <div className="h-17 w-17 rounded-2xl bg-olive/10 flex items-center justify-center font-extrabold text-2xl text-olive shadow-2xs">
                      {initial}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 rounded-full p-1.5 text-white shadow-xs">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal">{userName}</h1>
                    <Badge
                      className={
                        kycStatus === "verified"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 text-xs px-2.5 py-0.5 font-bold"
                          : "bg-olive/10 text-olive border-olive/20 text-xs px-2.5 py-0.5 font-bold"
                      }
                    >
                      {kycStatus === "verified" ? "Terverifikasi KTP & Paspor" : "Member Terdaftar"}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-sage mt-1 font-medium">
                    Member Safara Aktif • Proteksi Rekening Bersama (Escrow) 100%
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Link href="/profile">
                  <Button variant="outline" className="h-10 px-3.5 rounded-xl border-warm-border text-charcoal hover:bg-sand text-xs font-bold active:scale-[0.98]">
                    <Settings className="h-4 w-4 mr-1 text-sage" />
                    Atur Profil
                  </Button>
                </Link>
                <Link href="/trips/new">
                  <Button variant="outline" className="h-10 px-3.5 rounded-xl border-warm-border text-charcoal hover:bg-sand text-xs font-bold active:scale-[0.98]">
                    <Plane className="h-4 w-4 mr-1 text-olive" />
                    Buka Trip Jastip
                  </Button>
                </Link>
                <Link href="/listings/new">
                  <Button className="h-10 px-4 rounded-xl bg-olive hover:bg-olive-light text-white text-xs font-bold shadow-xs active:scale-[0.98]">
                    <Plus className="h-4 w-4 mr-1" />
                    Posting Titipan Baru
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-8 pt-6 border-t border-warm-border/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-canvas border border-warm-border/60">
                <div className="text-xs font-semibold text-sage">Dana Escrow Terlindungi</div>
                <div className="text-lg sm:text-xl font-extrabold text-olive mt-1 tabular-nums tracking-tight">
                  {formatRupiah(totalEscrow)}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-canvas border border-warm-border/60">
                <div className="text-xs font-semibold text-sage">Pesanan Titipan Aktif</div>
                <div className="text-lg sm:text-xl font-extrabold text-charcoal mt-1 tabular-nums tracking-tight">
                  {activeOrdersCount} Titipan
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-canvas border border-warm-border/60">
                <div className="text-xs font-semibold text-sage">Trip Aktif Anda</div>
                <div className="text-lg sm:text-xl font-extrabold text-charcoal mt-1 tabular-nums tracking-tight">
                  {activeTripsCount} Perjalanan
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-canvas border border-warm-border/60">
                <div className="text-xs font-semibold text-sage">Status Perlindungan</div>
                <div className="text-xs font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% Proteksi Dana
                </div>
              </div>
            </div>
          </Card>

          {/* Compact View Switcher */}
          <div className="flex border-b border-warm-border gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("buyer")}
              className={`flex min-h-[48px] items-center gap-2.5 px-6 py-3.5 font-bold text-sm border-b-2 transition-all cursor-pointer active:scale-95 ${
                activeTab === "buyer"
                  ? "border-olive text-olive bg-white rounded-t-2xl shadow-2xs"
                  : "border-transparent text-sage hover:text-charcoal hover:bg-sand/60 rounded-t-2xl"
              }`}
            >
              <Package className="h-4.5 w-4.5" />
              Titipan Saya (Sebagai Buyer)
              <span className="rounded-full bg-olive/10 text-olive px-2 py-0.5 text-xs font-bold">
                {buyerOrders.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("traveler")}
              className={`flex min-h-[48px] items-center gap-2.5 px-6 py-3.5 font-bold text-sm border-b-2 transition-all cursor-pointer active:scale-95 ${
                activeTab === "traveler"
                  ? "border-olive text-olive bg-white rounded-t-2xl shadow-2xs"
                  : "border-transparent text-sage hover:text-charcoal hover:bg-sand/60 rounded-t-2xl"
              }`}
            >
              <Plane className="h-4.5 w-4.5" />
              Trip &amp; Bagasi Saya (Sebagai Traveler)
              <span className="rounded-full bg-gold/20 text-gold-muted px-2 py-0.5 text-xs font-bold">
                {travelerTrips.length}
              </span>
            </button>
          </div>

          {/* Tab Content: Buyer Orders */}
          {activeTab === "buyer" && (
            <div className="space-y-4">
              {buyerOrders.length === 0 ? (
                /* Clean Empty State */
                <Card className="border-warm-border bg-white p-12 text-center shadow-xs">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive/10 text-olive mb-4">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal">
                    Belum Ada Titipan Aktif
                  </h3>
                  <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-sage">
                    Anda belum memiliki transaksi titipan yang sedang berjalan. Temukan barang impian Anda dari Makkah, Madinah, atau Turki dan titip dengan aman lewat traveler terverifikasi.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link href="/listings">
                      <Button className="bg-olive hover:bg-olive-light text-white text-xs sm:text-sm">
                        <Search className="h-4 w-4 mr-1.5" />
                        Jelajahi Listing Titipan
                      </Button>
                    </Link>
                    <Link href="/listings/new">
                      <Button variant="outline" className="border-warm-border text-charcoal hover:bg-sand text-xs sm:text-sm">
                        <Plus className="h-4 w-4 mr-1.5" />
                        Buat Request Titipan
                      </Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                buyerOrders.map((order) => {
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
                            {order.eta && (
                              <span className="text-xs text-sage">Estimasi Tiba: {order.eta}</span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-charcoal">
                            {order.item_name}
                          </h3>

                          <div className="flex items-center gap-2 text-xs text-sage">
                            <span>Traveler:</span>
                            {order.traveler_avatar ? (
                              <Image
                                src={order.traveler_avatar}
                                alt={order.traveler_name}
                                width={20}
                                height={20}
                                className="h-5 w-5 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-olive/10 flex items-center justify-center text-[10px] font-bold text-olive">
                                {order.traveler_name.charAt(0)}
                              </div>
                            )}
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
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {/* Tab Content: Traveler Trips */}
          {activeTab === "traveler" && (
            <div className="space-y-4">
              {travelerTrips.length === 0 ? (
                /* Clean Empty State */
                <Card className="border-warm-border bg-white p-12 text-center shadow-xs">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive/10 text-olive mb-4">
                    <Plane className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal">
                    Belum Ada Rencana Perjalanan
                  </h3>
                  <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-sage">
                    Bagi Anda yang akan bepergian atau menjalankan ibadah Umrah, buka ruang bagasi kosong Anda untuk menerima titipan barang dan raih penghasilan jastip yang berkah.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Link href="/trips/new">
                      <Button className="bg-olive hover:bg-olive-light text-white text-xs sm:text-sm">
                        <Plane className="h-4 w-4 mr-1.5" />
                        Buka Trip Jastip Baru
                      </Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                travelerTrips.map((trip) => (
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
                              style={{ width: `${(trip.usedLuggageKg / (trip.totalLuggageKg || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-warm-border">
                        <div>
                          <div className="text-[11px] text-sage">Potensi Komisi Jastip</div>
                          <div className="text-base font-extrabold text-gold-muted">
                            {formatRupiah(trip.totalPotentialEarnings || 0)}
                          </div>
                          <div className="text-[10px] text-sage">
                            Dari {trip.acceptedOrdersCount || 0} pesanan titipan
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
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
