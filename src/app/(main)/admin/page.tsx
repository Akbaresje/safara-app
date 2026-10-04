"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  Eye,
  RefreshCw,
  Sliders,
  DollarSign,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import { formatRupiah } from "@/lib/constants";

// ── Mock Initial Admin Data ──────────────────────────────────────────────────

const INITIAL_ESCROW_ORDERS = [
  {
    id: "ord-88120",
    itemName: "Parfum Surrati Royal Musk 100ml",
    buyerName: "Muhammad Rizky",
    buyerEmail: "rizky@gmail.com",
    travelerName: "Ustadz H. Ahmad Fauzi, Lc.",
    amount: 737412,
    itemPrice: 637500,
    jastipFee: 75000,
    platformFee: 24912,
    status: "escrow_funded",
    date: "04 Okt 2026",
    receiptPhoto: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "ord-88121",
    itemName: "Turkish Delight Hafiz Mustafa 1kg Mix Pistachio",
    buyerName: "Siti Rahmania",
    buyerEmail: "siti.rahma@yahoo.com",
    travelerName: "Nabila Saraswati",
    amount: 393300,
    itemPrice: 280000,
    jastipFee: 100000,
    platformFee: 13300,
    status: "delivered", // Siap dicairkan
    date: "02 Okt 2026",
    receiptPhoto: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "ord-88118",
    itemName: "Sajadah Tebal Rawdah Madinah Emboss Emas",
    buyerName: "Hendro Wibowo",
    buyerEmail: "hendro.w@gmail.com",
    travelerName: "Zulkifli Arifin",
    amount: 492000,
    itemPrice: 400000,
    jastipFee: 75000,
    platformFee: 17000,
    status: "disputed", // Sengketa
    date: "29 Sept 2026",
    receiptPhoto: null,
  },
];

const INITIAL_KYC_APPLICATIONS = [
  {
    id: "kyc-01",
    userId: "usr-201",
    name: "Ustadz H. Ahmad Fauzi, Lc.",
    role: "Tour Leader Umrah",
    ktpNumber: "3273192003840002",
    passportNumber: "C8192831",
    destination: "Makkah & Madinah Al-Mukarramah",
    departureDate: "12 Okt 2026",
    submittedAt: "03 Okt 2026",
    status: "pending",
  },
  {
    id: "kyc-02",
    userId: "usr-202",
    name: "Fajar Setiawan",
    role: "Backpacker Turki",
    ktpNumber: "3171092810920004",
    passportNumber: "B9201928",
    destination: "Istanbul & Grand Bazaar",
    departureDate: "15 Okt 2026",
    submittedAt: "04 Okt 2026",
    status: "pending",
  },
];

const INITIAL_USERS = [
  {
    id: "usr-01",
    name: "Ahmad Disk",
    email: "adisk@gmail.com",
    role: "admin",
    kycStatus: "verified",
    joinedDate: "Sept 2026",
  },
  {
    id: "usr-02",
    name: "Ustadz H. Ahmad Fauzi, Lc.",
    email: "ahmad.fauzi@gmail.com",
    role: "user",
    kycStatus: "verified",
    joinedDate: "Agust 2026",
  },
  {
    id: "usr-03",
    name: "Nabila Saraswati",
    email: "nabila.s@gmail.com",
    role: "user",
    kycStatus: "verified",
    joinedDate: "Sept 2026",
  },
  {
    id: "usr-04",
    name: "Muhammad Rizky",
    email: "rizky@gmail.com",
    role: "user",
    kycStatus: "unverified",
    joinedDate: "Okt 2026",
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"escrow" | "kyc" | "users" | "settings">("escrow");
  const [orders, setOrders] = useState(INITIAL_ESCROW_ORDERS);
  const [kycList, setKycList] = useState(INITIAL_KYC_APPLICATIONS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Platform setting states
  const [platformFeePercent, setPlatformFeePercent] = useState("3.5");
  const [sarRate, setSarRate] = useState("4250");
  const [tryRate, setTryRate] = useState("520");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleReleaseEscrow = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "completed" } : o))
    );
    showNotification(`Dana pesanan #${orderId} berhasil dicairkan ke rekening traveler.`);
  };

  const handleRefundBuyer = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "refunded" } : o))
    );
    showNotification(`Dana pesanan #${orderId} berhasil di-refund 100% ke pembeli.`);
  };

  const handleApproveKYC = (kycId: string) => {
    setKycList((prev) =>
      prev.map((k) => (k.id === kycId ? { ...k, status: "approved" } : k))
    );
    showNotification(`Verifikasi KTP & Paspor traveler #${kycId} telah disetujui.`);
  };

  const handleRejectKYC = (kycId: string) => {
    setKycList((prev) =>
      prev.map((k) => (k.id === kycId ? { ...k, status: "rejected" } : k))
    );
    showNotification(`Pengajuan verifikasi #${kycId} ditolak.`);
  };

  const handleToggleAdminRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newRole = u.role === "admin" ? "user" : "admin";
          showNotification(`Role user ${u.name} diubah menjadi: ${newRole.toUpperCase()}`);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("Pengaturan komisi platform & kurs realtime berhasil disimpan.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-border pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-olive text-white">
                  <Shield className="h-4 w-4" />
                </div>
                <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">
                  Safara Admin &amp; Escrow Control
                </h1>
                <Badge className="bg-olive text-white text-[10px]">Superadmin</Badge>
              </div>
              <p className="text-xs text-sage mt-1">
                Pusat pengawasan pencairan dana rekening bersama, verifikasi identitas traveler, dan operasional platform.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="border-warm-border text-xs text-charcoal hover:bg-sand">
                  Dashboard Pengguna
                </Button>
              </Link>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-sm animate-in fade-in-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{notification}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="text-emerald-700 hover:text-emerald-900"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Platform Quick KPI Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-warm-border bg-white p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-sage">
                <span>Total Escrow Aktif</span>
                <DollarSign className="h-4 w-4 text-olive" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-charcoal">
                {formatRupiah(1622712)}
              </div>
              <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                3 Transaksi Berjalan
              </div>
            </Card>

            <Card className="border-warm-border bg-white p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-sage">
                <span>Fee Platform Terkumpul</span>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-olive">
                {formatRupiah(55212)}
              </div>
              <div className="text-[10px] text-sage">3.5% komisi escrow aman</div>
            </Card>

            <Card className="border-warm-border bg-white p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-sage">
                <span>Verifikasi KYC Tertunda</span>
                <Users className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-800">
                {kycList.filter((k) => k.status === "pending").length} Traveler
              </div>
              <div className="text-[10px] text-amber-700 font-medium">Perlu review KTP &amp; Paspor</div>
            </Card>

            <Card className="border-warm-border bg-white p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-sage">
                <span>Total Pengguna Terdaftar</span>
                <Users className="h-4 w-4 text-olive" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-charcoal">
                {users.length} Akun
              </div>
              <div className="text-[10px] text-sage">Database Supabase Auth</div>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-warm-border pb-3 overflow-x-auto">
            {[
              { id: "escrow", label: "Moderasi Escrow & Transaksi", icon: DollarSign },
              { id: "kyc", label: "Verifikasi KYC Traveler", icon: ShieldCheck, badge: kycList.filter((k) => k.status === "pending").length },
              { id: "users", label: "Manajemen Pengguna & Role", icon: Users },
              { id: "settings", label: "Pengaturan Komisi & Kurs", icon: Sliders },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-olive text-white shadow-xs"
                    : "bg-white border border-warm-border text-sage hover:text-charcoal"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${activeTab === tab.id ? "bg-white text-olive" : "bg-amber-100 text-amber-800"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── TAB 1: Escrow & Orders Moderation ─────────────────────────── */}
          {activeTab === "escrow" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-bold text-base text-charcoal">
                  Daftar Transaksi Rekening Bersama (Escrow)
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-sage" />
                  <Input
                    placeholder="Cari order ID atau pembeli..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} className="border-warm-border bg-white p-5 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-border pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-charcoal">
                          #{order.id}
                        </span>
                        <span className="text-xs text-sage">• {order.date}</span>
                      </div>
                      <Badge
                        className={
                          order.status === "escrow_funded"
                            ? "bg-blue-100 text-blue-800 text-xs"
                            : order.status === "delivered"
                            ? "bg-amber-100 text-amber-800 text-xs"
                            : order.status === "completed"
                            ? "bg-emerald-100 text-emerald-800 text-xs"
                            : order.status === "disputed"
                            ? "bg-red-100 text-red-800 text-xs"
                            : "bg-gray-100 text-gray-800 text-xs"
                        }
                      >
                        {order.status === "escrow_funded"
                          ? "Dana Terkunci di Escrow"
                          : order.status === "delivered"
                          ? "Tiba / Menunggu Konfirmasi 48 Jam"
                          : order.status === "completed"
                          ? "Selesai & Dana Dicairkan"
                          : order.status === "disputed"
                          ? "Sengketa Aktif"
                          : "Refund Selesai"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-sage block">Barang Titipan:</span>
                        <span className="font-bold text-charcoal">{order.itemName}</span>
                      </div>
                      <div>
                        <span className="text-sage block">Pembeli (Buyer):</span>
                        <span className="font-semibold text-charcoal">{order.buyerName}</span>
                        <span className="text-sage block text-[11px]">{order.buyerEmail}</span>
                      </div>
                      <div>
                        <span className="text-sage block">Traveler Pembawa:</span>
                        <span className="font-semibold text-charcoal">{order.travelerName}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-warm-border">
                      <div className="text-xs text-sage flex items-center gap-3">
                        <span>Total Dana: <strong className="text-olive">{formatRupiah(order.amount)}</strong></span>
                        <span>Barang: {formatRupiah(order.itemPrice)}</span>
                        <span>Fee Traveler: {formatRupiah(order.jastipFee)}</span>
                        <span>Fee Platform: {formatRupiah(order.platformFee)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status !== "completed" && order.status !== "refunded" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleReleaseEscrow(order.id)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-8"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Cairkan ke Traveler
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRefundBuyer(order.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50 text-xs h-8"
                            >
                              <RotateCcw className="h-3.5 w-3.5 mr-1" />
                              Refund Pembeli
                            </Button>
                          </>
                        )}
                        {order.receiptPhoto && (
                          <a href={order.receiptPhoto} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="ghost" className="text-xs h-8 text-sage">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Foto Struk
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 2: KYC Verification ───────────────────────────────────── */}
          {activeTab === "kyc" && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-charcoal">
                Antrean Verifikasi Identitas Traveler (KTP &amp; Paspor)
              </h3>

              <div className="space-y-3">
                {kycList.map((app) => (
                  <Card key={app.id} className="border-warm-border bg-white p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-border pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-charcoal">{app.name}</h4>
                          <span className="text-xs text-olive font-medium">• {app.role}</span>
                        </div>
                        <p className="text-xs text-sage mt-0.5">
                          Tujuan Trip: <strong>{app.destination}</strong> (Keberangkatan: {app.departureDate})
                        </p>
                      </div>

                      <Badge
                        className={
                          app.status === "pending"
                            ? "bg-amber-100 text-amber-800 text-xs"
                            : app.status === "approved"
                            ? "bg-emerald-100 text-emerald-800 text-xs"
                            : "bg-red-100 text-red-800 text-xs"
                        }
                      >
                        {app.status === "pending"
                          ? "Menunggu Verifikasi"
                          : app.status === "approved"
                          ? "Disetujui (Verified)"
                          : "Ditolak"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="rounded-lg bg-sand/30 border border-warm-border p-3">
                        <span className="text-sage block text-[11px]">Nomor Induk Kependudukan (KTP):</span>
                        <span className="font-mono font-bold text-charcoal">{app.ktpNumber}</span>
                      </div>
                      <div className="rounded-lg bg-sand/30 border border-warm-border p-3">
                        <span className="text-sage block text-[11px]">Nomor Paspor RI:</span>
                        <span className="font-mono font-bold text-charcoal">{app.passportNumber}</span>
                      </div>
                    </div>

                    {app.status === "pending" && (
                      <div className="flex justify-end gap-2 pt-2 border-t border-warm-border">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectKYC(app.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 text-xs"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Tolak
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveKYC(app.id)}
                          className="bg-olive hover:bg-olive-light text-white text-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Setujui &amp; Beri Badge Terverifikasi
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 3: Users & Roles Management ───────────────────────────── */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-charcoal">
                Daftar Pengguna Platform
              </h3>

              <Card className="border-warm-border bg-white overflow-hidden shadow-sm">
                <div className="divide-y divide-warm-border">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-sand/20 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-charcoal">{u.name}</span>
                          <Badge
                            className={
                              u.role === "admin"
                                ? "bg-olive text-white text-[10px]"
                                : "bg-canvas border-warm-border text-sage text-[10px]"
                            }
                          >
                            {u.role.toUpperCase()}
                          </Badge>
                          {u.kycStatus === "verified" && (
                            <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                              KYC Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-sage mt-0.5">{u.email} • Bergabung: {u.joinedDate}</p>
                      </div>

                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleAdminRole(u.id)}
                          className="border-warm-border text-xs text-charcoal hover:bg-sand"
                        >
                          {u.role === "admin" ? "Turunkan ke User" : "Jadikan Admin"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ── TAB 4: Platform Commission & Currency Settings ─────────────── */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-charcoal">
                Pengaturan Escrow &amp; Kurs Mata Uang Asing
              </h3>

              <Card className="border-warm-border bg-white p-6 shadow-sm">
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-xl">
                  <div>
                    <label className="text-xs font-semibold text-sage uppercase tracking-wider block mb-1">
                      Platform Fee Escrow Proteksi (%)
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="20"
                        value={platformFeePercent}
                        onChange={(e) => setPlatformFeePercent(e.target.value)}
                        className="font-semibold pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-sage">
                        %
                      </span>
                    </div>
                    <p className="text-[11px] text-sage mt-1">
                      Komisi perlindungan escrow yang dikenakan kepada pembeli (default: 3.5%).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-sage uppercase tracking-wider block mb-1">
                        Kurs 1 SAR (Saudi Riyal)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-sage">
                          Rp
                        </span>
                        <Input
                          type="number"
                          value={sarRate}
                          onChange={(e) => setSarRate(e.target.value)}
                          className="font-semibold pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-sage uppercase tracking-wider block mb-1">
                        Kurs 1 TRY (Turkish Lira)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-sage">
                          Rp
                        </span>
                        <Input
                          type="number"
                          value={tryRate}
                          onChange={(e) => setTryRate(e.target.value)}
                          className="font-semibold pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="bg-olive hover:bg-olive-light text-white text-xs font-semibold px-6 py-5">
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Simpan Perubahan Pengaturan
                  </Button>
                </form>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
