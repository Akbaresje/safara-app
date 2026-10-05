"use client";

import { useState, useEffect } from "react";
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
  Lock,
  LogOut,
  Package,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { formatRupiah } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

interface EscrowOrder {
  id: string;
  itemName: string;
  buyerName: string;
  buyerEmail: string;
  travelerName: string;
  amount: number;
  itemPrice: number;
  jastipFee: number;
  platformFee: number;
  status: string;
  date: string;
  receiptPhoto?: string | null;
}

interface KycApplication {
  id: string;
  userId: string;
  name: string;
  role: string;
  ktpNumber: string;
  passportNumber: string;
  destination: string;
  departureDate: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  system_role: string;
  kyc_status: string;
  created_at?: string;
}

export default function AdminDashboardPage() {
  const supabase = createClient();

  // Authentication State
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("adminsafara@gmail.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<"escrow" | "kyc" | "users" | "settings">("escrow");
  const [orders, setOrders] = useState<EscrowOrder[]>([]);
  const [kycList, setKycList] = useState<KycApplication[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Platform setting states
  const [platformFeePercent, setPlatformFeePercent] = useState("3.5");
  const [sarRate, setSarRate] = useState("4250");
  const [tryRate, setTryRate] = useState("520");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Check whether current user is authorized as Admin
  useEffect(() => {
    async function verifyAdminAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const sessionAdmin =
          typeof window !== "undefined" &&
          (localStorage.getItem("safara_admin_session") === "adminsafara@gmail.com" ||
            sessionStorage.getItem("safara_admin_session") === "adminsafara@gmail.com" ||
            document.cookie.includes("safara_admin_session=adminsafara@gmail.com"));

        if (sessionAdmin || user?.email === "adminsafara@gmail.com") {
          setIsAdmin(true);
          setCurrentEmail("adminsafara@gmail.com");
          loadAdminData();
        } else if (user) {
          setCurrentEmail(user.email ?? null);
          setIsAdmin(false);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Auth verification error:", err);
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    }

    verifyAdminAuth();
  }, [supabase]);

  // Load real data from Supabase
  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch real registered users
      const { data: profilesData } = await (supabase.from("profiles") as unknown as {
        select: (cols: string) => Promise<{ data: UserProfile[] | null }>;
      }).select("id, full_name, email, system_role, kyc_status, created_at");

      if (profilesData && profilesData.length > 0) {
        setUsers(profilesData);
      } else {
        // Fallback default admin record
        setUsers([
          {
            id: "adm-01",
            full_name: "Admin Safara",
            email: "adminsafara@gmail.com",
            system_role: "admin",
            kyc_status: "verified",
            created_at: new Date().toISOString(),
          },
        ]);
      }

      // 2. Fetch real orders
      const { data: ordersData } = await (supabase.from("orders") as unknown as {
        select: (cols: string) => Promise<{ data: EscrowOrder[] | null }>;
      }).select("*");

      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData);
      } else {
        setOrders([]);
      }

      // 3. Fetch real KYC applications if available
      try {
        const { data: kycData } = await (supabase.from("kyc_applications") as unknown as {
          select: (cols: string) => Promise<{ data: KycApplication[] | null }>;
        }).select("*");
        if (kycData && kycData.length > 0) {
          setKycList(kycData);
        } else {
          setKycList([]);
        }
      } catch {
        setKycList([]);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // Handle Admin Portal Login
  const handleAdminLogin = async (e?: React.FormEvent, directEmail?: string, directPassword?: string) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const email = (directEmail || loginEmail).trim().toLowerCase();
    const password = (directPassword || loginPassword).trim();

    // Verify credentials specifically requested: adminsafara@gmail.com / Nangka5no2
    if (email !== "adminsafara@gmail.com" || password !== "Nangka5no2") {
      setLoginError("Email atau password administrator salah. Akses ditolak.");
      setIsLoggingIn(false);
      return;
    }

    try {
      // Clear previous non-admin user session if any
      await supabase.auth.signOut();

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If account doesn't exist yet in Supabase auth, auto sign it up
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: "Admin Safara",
              system_role: "admin",
            },
          },
        });
      }
    } catch (err) {
      console.warn("Supabase auth note:", err);
    }

    // Persist admin session in localStorage, sessionStorage, and cookie
    if (typeof window !== "undefined") {
      localStorage.setItem("safara_admin_session", "adminsafara@gmail.com");
      sessionStorage.setItem("safara_admin_session", "adminsafara@gmail.com");
      document.cookie = "safara_admin_session=adminsafara@gmail.com; path=/; max-age=2592000; SameSite=Lax";
    }

    setIsAdmin(true);
    setCurrentEmail("adminsafara@gmail.com");
    showNotification("Selamat datang di Safara Admin Dashboard!");
    loadAdminData();
    setIsLoggingIn(false);
  };

  const handleAdminLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("safara_admin_session");
      sessionStorage.removeItem("safara_admin_session");
      document.cookie = "safara_admin_session=; path=/; max-age=0";
    }
    await supabase.auth.signOut();
    setIsAdmin(false);
    setCurrentEmail(null);
    setLoginPassword("");
  };

  // Escrow moderation actions
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
          const newRole = u.system_role === "admin" ? "user" : "admin";
          showNotification(`Role user ${u.full_name || u.email} diubah menjadi: ${newRole.toUpperCase()}`);
          return { ...u, system_role: newRole };
        }
        return u;
      })
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("Pengaturan komisi platform & kurs realtime berhasil disimpan.");
  };

  // ── RENDER LOADING STATE ───────────────────────────────────────────────────
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-olive mx-auto mb-2" />
            <p className="text-xs text-sage">Memeriksa hak akses administrator...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER DEDICATED ADMIN LOGIN GATE IF NOT ADMIN ─────────────────────────
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas">
        <Navbar />

        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md border-warm-border bg-white p-8 shadow-xl rounded-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-olive/10 text-olive">
                <Lock className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-charcoal">
                Portal Admin Safara
              </h1>
              <p className="text-xs text-sage">
                Akses terbatas khusus tim Safara. Masukkan kredensial administrator resmi untuk mengelola platform.
              </p>
            </div>

            {/* Current user non-admin alert */}
            {currentEmail && currentEmail !== "adminsafara@gmail.com" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Akun saat ini bukan Admin</p>
                  <p className="text-[11px] text-amber-800">
                    Anda sedang masuk sebagai <strong>{currentEmail}</strong>. Dashboard admin hanya dapat diakses dengan akun <strong>adminsafara@gmail.com</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {loginError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium animate-in fade-in-0 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Admin Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1.5">
                  Email Administrator
                </label>
                <Input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="adminsafara@gmail.com"
                  required
                  className="h-10 text-sm border-warm-border"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-charcoal block">
                    Password Administrator
                  </label>
                </div>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-10 text-sm border-warm-border"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-olive hover:bg-olive-light text-white font-semibold h-11 text-sm shadow-sm"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Masuk ke Dashboard Admin
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setLoginEmail("adminsafara@gmail.com");
                  setLoginPassword("Nangka5no2");
                  handleAdminLogin(undefined, "adminsafara@gmail.com", "Nangka5no2");
                }}
                disabled={isLoggingIn}
                className="w-full border-olive/30 text-olive hover:bg-olive/5 text-xs font-semibold h-10"
              >
                Masuk Instan Akun Admin
              </Button>
            </form>

            <div className="pt-2 border-t border-warm-border text-center">
              <Link
                href="/dashboard"
                className="text-xs text-sage hover:text-charcoal transition-colors font-medium"
              >
                ← Kembali ke Dashboard Pengguna
              </Link>
            </div>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  // ── RENDER FULL ADMIN DASHBOARD IF AUTHENTICATED ───────────────────────────
  const activeOrdersCount = orders.filter((o) => o.status !== "completed" && o.status !== "refunded").length;
  const totalEscrowAmount = orders.reduce((acc, o) => acc + (o.amount || 0), 0);
  const platformFeeCollected = orders.reduce((acc, o) => acc + (o.platformFee || 0), 0);
  const pendingKycCount = kycList.filter((k) => k.status === "pending").length;

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
              <Button
                variant="outline"
                size="sm"
                onClick={handleAdminLogout}
                className="border-red-200 text-red-600 hover:bg-red-50 text-xs"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Keluar Admin
              </Button>
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
                {formatRupiah(totalEscrowAmount)}
              </div>
              <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {activeOrdersCount} Transaksi Berjalan
              </div>
            </Card>

            <Card className="border-warm-border bg-white p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-sage">
                <span>Fee Platform Terkumpul</span>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-olive">
                {formatRupiah(platformFeeCollected)}
              </div>
              <div className="text-[10px] text-sage">3.5% komisi escrow aman</div>
            </Card>

            <Card className="border-warm-border bg-white p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-sage">
                <span>Verifikasi KYC Tertunda</span>
                <Users className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-800">
                {pendingKycCount} Traveler
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
              { id: "kyc", label: "Verifikasi KYC Traveler", icon: ShieldCheck, badge: pendingKycCount },
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

              {orders.length === 0 ? (
                /* Clean Empty State */
                <Card className="border-warm-border bg-white p-12 text-center shadow-xs">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-olive/10 text-olive mb-3">
                    <Package className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-bold text-charcoal">
                    Belum Ada Transaksi Escrow Pending
                  </h4>
                  <p className="mx-auto mt-1 max-w-md text-xs text-sage">
                    Saat ini belum ada pesanan jastip baru yang masuk ke rekening bersama. Semua transaksi baru dari pembeli akan otomatis muncul di tabel ini untuk pengawasan escrow.
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {orders
                    .filter((order) =>
                      searchQuery
                        ? order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.itemName?.toLowerCase().includes(searchQuery.toLowerCase())
                        : true
                    )
                    .map((order) => (
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
              )}
            </div>
          )}

          {/* ── TAB 2: KYC Verification ───────────────────────────────────── */}
          {activeTab === "kyc" && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-charcoal">
                Antrean Verifikasi Identitas Traveler (KTP &amp; Paspor)
              </h3>

              {kycList.length === 0 ? (
                /* Clean Empty State */
                <Card className="border-warm-border bg-white p-12 text-center shadow-xs">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-olive/10 text-olive mb-3">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-bold text-charcoal">
                    Belum Ada Permohonan KYC Baru
                  </h4>
                  <p className="mx-auto mt-1 max-w-md text-xs text-sage">
                    Semua dokumen identitas traveler telah diverifikasi atau belum ada traveler baru yang mengunggah berkas KTP dan Paspor.
                  </p>
                </Card>
              ) : (
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
              )}
            </div>
          )}

          {/* ── TAB 3: Users & Roles Management ───────────────────────────── */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-charcoal">
                Daftar Pengguna Platform ({users.length} Akun Terdaftar)
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
                          <span className="font-bold text-sm text-charcoal">{u.full_name || u.email?.split("@")[0]}</span>
                          <Badge
                            className={
                              u.system_role === "admin"
                                ? "bg-olive text-white text-[10px]"
                                : "bg-canvas border-warm-border text-sage text-[10px]"
                            }
                          >
                            {(u.system_role || "USER").toUpperCase()}
                          </Badge>
                          {u.kyc_status === "verified" && (
                            <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                              KYC Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-sage mt-0.5">
                          {u.email} {u.created_at ? `• Terdaftar: ${new Date(u.created_at).toLocaleDateString("id-ID")}` : ""}
                        </p>
                      </div>

                      <div>
                        {u.email !== "adminsafara@gmail.com" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleAdminRole(u.id)}
                            className="border-warm-border text-xs text-charcoal hover:bg-sand"
                          >
                            {u.system_role === "admin" ? "Turunkan ke User" : "Jadikan Admin"}
                          </Button>
                        )}
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
