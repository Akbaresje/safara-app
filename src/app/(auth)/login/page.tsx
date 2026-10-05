"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Mail, Phone, Lock, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Google OAuth Login ────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal masuk dengan Google";
      setError(message);
      setLoading(false);
    }
  };

  // ── Email + Password Login ────────────────────────────────────────────────
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Mohon masukkan email dan kata sandi");
      return;
    }

    setLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check if this is the dedicated admin account
    if (cleanEmail === "adminsafara@gmail.com" && cleanPassword === "Nangka5no2") {
      try {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (signInErr) {
          await supabase.auth.signUp({
            email: cleanEmail,
            password: cleanPassword,
            options: {
              data: {
                full_name: "Admin Safara",
                system_role: "admin",
              },
            },
          });
        }
      } catch (err) {
        console.warn("Admin signin note:", err);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("safara_admin_session", "adminsafara@gmail.com");
        sessionStorage.setItem("safara_admin_session", "adminsafara@gmail.com");
        document.cookie = "safara_admin_session=adminsafara@gmail.com; path=/; max-age=2592000; SameSite=Lax";
      }

      router.push("/admin");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) throw error;

      if (data.session) {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Email atau kata sandi tidak valid";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Phone OTP Flow ────────────────────────────────────────────────────────
  const handleSendOTP = async () => {
    setLoading(true);
    setError(null);

    try {
      const formattedPhone = phoneNumber.startsWith("0")
        ? `+62${phoneNumber.slice(1)}`
        : phoneNumber.startsWith("+62")
        ? phoneNumber
        : `+62${phoneNumber}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;
      setOtpSent(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal mengirim kode OTP. Pastikan provider SMS aktif.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError(null);

    try {
      const formattedPhone = phoneNumber.startsWith("0")
        ? `+62${phoneNumber.slice(1)}`
        : phoneNumber.startsWith("+62")
        ? phoneNumber
        : `+62${phoneNumber}`;

      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: "sms",
      });

      if (error) throw error;
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kode OTP tidak valid";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-canvas to-sand p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-sage hover:text-charcoal text-sm">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Beranda
      </Link>

      <Card className="w-full max-w-md border-warm-border bg-white p-8 sm:p-10 rounded-3xl shadow-xl">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-olive text-white font-bold text-xl shadow-xs">
              S
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-charcoal">Masuk ke Safara</h1>
          <p className="text-xs sm:text-sm text-sage mt-1 font-medium">
            Jastip aman dengan proteksi rekening bersama (escrow)
          </p>
        </div>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50 text-red-800 text-xs font-medium rounded-xl">
            {error}
          </Alert>
        )}

        {/* Google OAuth Button */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          disabled={loading}
          className="w-full h-12 rounded-xl border border-warm-border hover:bg-sand/60 text-charcoal font-bold text-xs sm:text-sm active:scale-[0.98] shadow-2xs"
        >
          <svg className="mr-2.5 h-4.5 w-4.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Lanjut dengan Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-warm-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 font-semibold text-sage">atau masuk dengan akun</span>
          </div>
        </div>

        {/* Method Tab Selector */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setMethod("email")}
            className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              method === "email"
                ? "border-olive bg-olive/5 text-olive ring-2 ring-olive/20 shadow-2xs"
                : "border-warm-border bg-canvas text-sage hover:text-charcoal"
            }`}
          >
            <Mail className="h-4 w-4" />
            Email &amp; Password
          </button>
          <button
            type="button"
            onClick={() => setMethod("phone")}
            className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              method === "phone"
                ? "border-olive bg-olive/5 text-olive ring-2 ring-olive/20 shadow-2xs"
                : "border-warm-border bg-canvas text-sage hover:text-charcoal"
            }`}
          >
            <Phone className="h-4 w-4" />
            WhatsApp OTP
          </button>
        </div>

        {/* Form Body */}
        {method === "email" ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Label className="text-xs font-bold text-sage uppercase tracking-wider">
                Alamat Email
              </Label>
              <Input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-sage uppercase tracking-wider">
                Kata Sandi (Password)
              </Label>
              <div className="relative mt-1.5">
                <Input
                  type="password"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  disabled={loading}
                  required
                />
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-sage" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-olive hover:bg-olive-light text-white font-bold mt-2 text-sm shadow-xs active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                "Masuk ke Safara"
              )}
            </Button>
          </form>
        ) : (
          /* Phone OTP Flow */
          <div className="space-y-3.5">
            {!otpSent ? (
              <>
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Nomor WhatsApp
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-sage">
                      +62
                    </span>
                    <Input
                      type="tel"
                      placeholder="812-3456-7890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-12 font-semibold"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading || !phoneNumber}
                  className="w-full bg-olive hover:bg-olive-light text-white font-semibold mt-2 py-5 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengirim OTP...
                    </>
                  ) : (
                    "Kirim Kode Verifikasi"
                  )}
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Kode Verifikasi (6 Digit)
                  </Label>
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 font-mono text-center text-xl tracking-widest"
                    disabled={loading}
                  />
                  <p className="mt-1 text-[11px] text-sage">
                    Kode OTP dikirim ke +62{phoneNumber}
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-olive hover:bg-olive-light text-white font-semibold py-5 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    "Verifikasi & Masuk"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="w-full text-xs text-sage"
                >
                  Ganti Nomor WhatsApp
                </Button>
              </div>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-sage">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-olive hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </Card>
    </div>
  );
}
