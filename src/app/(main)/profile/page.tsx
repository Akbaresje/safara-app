"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Camera,
  LayoutDashboard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const BANK_OPTIONS = [
  { code: "BCA", name: "Bank Central Asia (BCA)" },
  { code: "MANDIRI", name: "Bank Mandiri" },
  { code: "BNI", name: "Bank Negara Indonesia (BNI)" },
  { code: "BRI", name: "Bank Rakyat Indonesia (BRI)" },
  { code: "BSI", name: "Bank Syariah Indonesia (BSI)" },
  { code: "CIMB", name: "CIMB Niaga" },
  { code: "PERMATA", name: "Bank Permata" },
];

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bankCode, setBankCode] = useState("BCA");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");
  const [kycStatus, setKycStatus] = useState("unverified");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?redirect=/profile");
        return;
      }

      setEmail(user.email || "");

      const { data: profile } = await (supabase.from("profiles") as unknown as {
        select: (columns: string) => {
          eq: (col: string, val: string) => {
            single: () => Promise<{
              data: {
                full_name?: string | null;
                phone_number?: string | null;
                bio?: string | null;
                avatar_url?: string | null;
                bank_code?: string | null;
                bank_account_number?: string | null;
                bank_account_holder?: string | null;
                kyc_status?: string | null;
              } | null;
            }>;
          };
        };
      })
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setPhoneNumber(profile.phone_number || "");
        setBio(profile.bio || "");
        setAvatarUrl(profile.avatar_url || "");
        setBankCode(profile.bank_code || "BCA");
        setBankAccountNumber(profile.bank_account_number || "");
        setBankAccountHolder(profile.bank_account_holder || "");
        setKycStatus(profile.kyc_status || "unverified");
      } else {
        // Fallback from user metadata
        setFullName(
          user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            ""
        );
        setAvatarUrl(
          user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            ""
        );
      }

      setLoading(false);
    }

    loadProfile();
  }, [supabase, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Anda belum login");

      const profileTable = supabase.from("profiles") as unknown as {
        upsert: (values: Record<string, unknown>) => Promise<{ error: Error | null }>;
      };

      const { error: upsertError } = await profileTable.upsert({
        id: user.id,
        email: user.email || email,
        full_name: fullName,
        phone_number: phoneNumber,
        bio: bio,
        avatar_url: avatarUrl || null,
        bank_code: bankCode,
        bank_account_number: bankAccountNumber,
        bank_account_holder: bankAccountHolder,
        updated_at: new Date().toISOString(),
      });

      if (upsertError) throw upsertError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal memperbarui profil";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const initial = (fullName || email || "U").charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-olive" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-6">
          {/* Breadcrumb / Top Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs text-sage hover:text-charcoal"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </Link>

            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-warm-border text-xs">
                <LayoutDashboard className="h-3.5 w-3.5 mr-1 text-sage" />
                Lihat Dashboard
              </Button>
            </Link>
          </div>

          {/* Header Banner */}
          <div className="border-b border-warm-border pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
              Pengaturan Profil Akun
            </h1>
            <p className="text-xs sm:text-sm text-sage mt-1">
              Perbarui identitas, kontak WhatsApp, dan informasi rekening pencairan jastip Anda.
            </p>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50 text-red-800 text-xs">
              {error}
            </Alert>
          )}

          {success && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Perubahan profil berhasil disimpan!
            </Alert>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Avatar & Basic Info Card */}
            <Card className="border-warm-border bg-white p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={fullName || "User Avatar"}
                      width={84}
                      height={84}
                      className="h-20 w-20 rounded-full object-cover border-2 border-warm-border shadow-sm"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-olive text-2xl font-bold text-white shadow-sm">
                      {initial}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-sand border border-warm-border p-1.5 text-charcoal shadow-xs">
                    <Camera className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-charcoal">
                      {fullName || "Nama Belum Diatur"}
                    </h3>
                    <Badge
                      className={
                        kycStatus === "verified"
                          ? "bg-emerald-100 text-emerald-800 text-[10px]"
                          : "bg-amber-100 text-amber-800 text-[10px]"
                      }
                    >
                      {kycStatus === "verified"
                        ? "Terverifikasi KTP & Paspor"
                        : "Belum Verifikasi Identitas"}
                    </Badge>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                      URL Foto Profil
                    </Label>
                    <Input
                      type="url"
                      placeholder="https://images.unsplash.com/... atau URL foto Anda"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="mt-1 text-xs"
                    />
                    <p className="mt-1 text-[10px] text-sage">
                      Gunakan link gambar publik atau biarkan kosong untuk inisial nama.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-warm-border pt-4">
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Nama Lengkap *
                  </Label>
                  <Input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 font-semibold"
                    placeholder="Nama sesuai KTP"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Alamat Email (Login)
                  </Label>
                  <Input
                    type="email"
                    disabled
                    value={email}
                    className="mt-1 bg-sand/50 text-sage cursor-not-allowed"
                  />
                  <p className="mt-1 text-[10px] text-sage">
                    Email terhubung dengan sistem otentikasi.
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Nomor WhatsApp / HP
                  </Label>
                  <Input
                    type="tel"
                    placeholder="081234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 font-semibold"
                  />
                  <p className="mt-1 text-[10px] text-sage">
                    Untuk notifikasi transaksi escrow &amp; koordinasi jastip.
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Status Akun Safara
                  </Label>
                  <div className="mt-1 flex items-center gap-2 rounded-lg border border-warm-border bg-sand/30 p-2.5 text-xs text-charcoal">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Member Aktif • Skor Kepercayaan: 5.0/5.0</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                  Bio / Catatan Profil
                </Label>
                <Textarea
                  placeholder="Ceritakan tentang Anda, misalnya: Sering umrah mandiri 3 bulan sekali, siap bantu titipan parfum dan kurma segar..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 text-xs resize-none"
                  rows={3}
                />
              </div>
            </Card>

            {/* Bank Account Details Card (For Traveler Payouts) */}
            <Card className="border-warm-border bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-warm-border pb-3">
                <Building2 className="h-5 w-5 text-olive" />
                <div>
                  <h3 className="font-bold text-sm text-charcoal">
                    Rekening Bank Pencairan Dana (Payout Escrow)
                  </h3>
                  <p className="text-xs text-sage">
                    Uang komisi dan modal jastip akan otomatis ditransfer ke rekening ini setelah pesanan selesai.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Pilihan Bank
                  </Label>
                  <select
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-warm-border bg-white p-2.5 text-xs font-semibold text-charcoal focus:border-olive focus:outline-none"
                  >
                    {BANK_OPTIONS.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Nomor Rekening
                  </Label>
                  <Input
                    type="text"
                    placeholder="Contoh: 1234567890"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    className="mt-1 font-mono font-semibold"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Nama Pemilik Rekening
                  </Label>
                  <Input
                    type="text"
                    placeholder="Harus sesuai nama di buku tabungan"
                    value={bankAccountHolder}
                    onChange={(e) => setBankAccountHolder(e.target.value)}
                    className="mt-1 font-semibold"
                  />
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-xs text-sage">
                  Batal
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="bg-olive hover:bg-olive-light text-white font-semibold text-xs px-6 py-5"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan Perubahan...
                  </>
                ) : (
                  "Simpan Perubahan Profil"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
