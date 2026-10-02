"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Mail, Phone, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AuthMethod = "phone" | "email";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [method, setMethod] = useState<AuthMethod>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async () => {
    setLoading(true);
    setError(null);

    try {
      if (method === "phone") {
        // Format phone number to E.164 format (Indonesia +62)
        const formattedPhone = phoneNumber.startsWith("0")
          ? `+62${phoneNumber.slice(1)}`
          : phoneNumber.startsWith("+62")
          ? phoneNumber
          : `+62${phoneNumber}`;

        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
      }

      setOtpSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengirim kode OTP";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError(null);

    try {
      if (method === "phone") {
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
      } else {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: "email",
        });

        if (error) throw error;
      }

      // Check if profile exists, if not redirect to onboarding
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!profile) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kode OTP tidak valid";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
      const message = err instanceof Error ? err.message : "Gagal login dengan Google";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-canvas to-sand p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-sage hover:text-charcoal">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Beranda
      </Link>

      <Card className="w-full max-w-md border-warm-border bg-white p-8 shadow-xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-olive text-white font-bold text-xl">
              S
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-charcoal">Masuk ke Safara</h1>
          <p className="text-sm text-sage mt-2">
            Jastip aman dengan escrow terpercaya
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
            {error}
          </Alert>
        )}

        {!otpSent ? (
          <>
            {/* Method Selector */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                type="button"
                onClick={() => setMethod("phone")}
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-semibold transition-all ${
                  method === "phone"
                    ? "border-olive bg-olive/5 text-olive ring-2 ring-olive/20"
                    : "border-warm-border bg-canvas text-sage hover:text-charcoal"
                }`}
              >
                <Phone className="h-4 w-4" />
                WhatsApp OTP
              </button>
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-semibold transition-all ${
                  method === "email"
                    ? "border-olive bg-olive/5 text-olive ring-2 ring-olive/20"
                    : "border-warm-border bg-canvas text-sage hover:text-charcoal"
                }`}
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
            </div>

            {/* Phone/Email Input */}
            <div className="space-y-4">
              {method === "phone" ? (
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Nomor WhatsApp
                  </Label>
                  <div className="relative mt-1.5">
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
                  <p className="mt-1 text-xs text-sage">
                    Kode OTP akan dikirim via WhatsApp
                  </p>
                </div>
              ) : (
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Alamat Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 font-semibold"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-sage">
                    Link verifikasi akan dikirim ke email Anda
                  </p>
                </div>
              )}

              <Button
                onClick={handleSendOTP}
                disabled={loading || (method === "phone" ? !phoneNumber : !email)}
                className="w-full bg-olive hover:bg-olive-light text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Kode OTP"
                )}
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-warm-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-sage">atau</span>
              </div>
            </div>

            {/* Google OAuth */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              disabled={loading}
              className="w-full border-warm-border hover:bg-canvas"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Lanjut dengan Google
            </Button>
          </>
        ) : (
          <>
            {/* OTP Verification */}
            <div className="space-y-4">
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
                  className="mt-1.5 font-mono text-center text-2xl tracking-widest"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-sage">
                  Kode OTP dikirim ke {method === "phone" ? `+62${phoneNumber}` : email}
                </p>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-olive hover:bg-olive-light text-white font-semibold"
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
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setError(null);
                }}
                variant="ghost"
                className="w-full text-sage"
                disabled={loading}
              >
                Kirim Ulang Kode
              </Button>
            </div>
          </>
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
