"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Phone, Mail, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async () => {
    setLoading(true);
    setError(null);

    try {
      if (method === "phone") {
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

  const handleVerifyAndRegister = async () => {
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

      // Create/Update profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const profileTable = supabase.from("profiles") as unknown as {
          upsert: (values: Record<string, unknown>) => Promise<{ error: Error | null }>;
        };
        const { error: profileError } = await profileTable.upsert({
          id: user.id,
          full_name: fullName,
          email: user.email || email,
          phone_number: user.phone || phoneNumber,
          kyc_status: "unverified",
        });

        if (profileError) throw profileError;
        router.push("/onboarding/role-select");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal verifikasi OTP";
      setError(message);
    } finally {
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
          <h1 className="text-2xl font-bold text-charcoal">Daftar Akun Safara</h1>
          <p className="text-sm text-sage mt-2">
            Mulai jastip amanah dari Tanah Suci & Turki
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
            {error}
          </Alert>
        )}

        {!otpSent ? (
          <>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                  Nama Lengkap Sesuai KTP
                </Label>
                <Input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 font-semibold"
                  disabled={loading}
                />
              </div>

              {/* Method Selector */}
              <div className="grid grid-cols-2 gap-2 pt-2">
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
                  WhatsApp
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
                </div>
              )}

              <Button
                onClick={handleSendOTP}
                disabled={loading || !fullName || (method === "phone" ? !phoneNumber : !email)}
                className="w-full bg-olive hover:bg-olive-light text-white font-semibold mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Kode Verifikasi"
                )}
              </Button>
            </div>
          </>
        ) : (
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
              onClick={handleVerifyAndRegister}
              disabled={loading || otp.length !== 6}
              className="w-full bg-olive hover:bg-olive-light text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                "Selesaikan Pendaftaran"
              )}
            </Button>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-sage">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-olive hover:underline">
            Masuk
          </Link>
        </p>
      </Card>
    </div>
  );
}
