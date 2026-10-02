"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  ArrowLeft,
  Plane,
  Luggage,
  Calendar,
  Upload,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { DESTINATIONS } from "@/lib/constants";
import type { TravelDestination } from "@/types/database";

export default function NewTripPage() {
  const router = useRouter();

  const [destination, setDestination] = useState<TravelDestination>("makkah");
  const [originCity, setOriginCity] = useState("Jakarta (CGK)");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [orderCutoffDate, setOrderCutoffDate] = useState("");
  const [availableLuggageKg, setAvailableLuggageKg] = useState("10");
  const [maxItemCount, setMaxItemCount] = useState("15");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: Implement Supabase insertion
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-canvas py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-sage hover:text-charcoal mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-charcoal">Buat Jadwal Trip Baru</h1>
            <p className="text-sm text-sage mt-2">
              Daftarkan rencana perjalanan Umrah atau liburan Anda untuk membuka kuota titipan
            </p>
          </div>

          <div className="space-y-6">
            {/* Destination & Route */}
            <Card className="border-warm-border bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="h-4 w-4 text-olive" />
                <h3 className="font-bold text-charcoal">Rute & Destinasi</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Kota Asal Keberangkatan *
                  </Label>
                  <Input
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    placeholder="Jakarta (CGK)"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Destinasi Tujuan *
                  </Label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value as TravelDestination)}
                    className="mt-1.5 w-full rounded-lg border border-warm-border px-3 py-2 text-sm"
                  >
                    {Object.entries(DESTINATIONS).map(([key, dest]) => (
                      <option key={key} value={key}>
                        {dest.flag} {dest.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Dates */}
            <Card className="border-warm-border bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-olive" />
                <h3 className="font-bold text-charcoal">Jadwal Perjalanan</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Tanggal Berangkat *
                  </Label>
                  <Input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Tanggal Pulang / Tiba di Indo *
                  </Label>
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                  Batas Akhir Penerimaan Order (Cut-off) *
                </Label>
                <Input
                  type="datetime-local"
                  value={orderCutoffDate}
                  onChange={(e) => setOrderCutoffDate(e.target.value)}
                  className="mt-1.5"
                />
                <p className="mt-1 text-xs text-sage">
                  Setelah waktu ini, Anda tidak akan menerima titipan baru lagi untuk trip ini
                </p>
              </div>
            </Card>

            {/* Capacity */}
            <Card className="border-warm-border bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Luggage className="h-4 w-4 text-olive" />
                <h3 className="font-bold text-charcoal">Kapasitas Bagasi</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Kuota Bagasi Tersedia (kg) *
                  </Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={availableLuggageKg}
                    onChange={(e) => setAvailableLuggageKg(e.target.value)}
                    placeholder="10"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Maksimal Jumlah Barang *
                  </Label>
                  <Input
                    type="number"
                    value={maxItemCount}
                    onChange={(e) => setMaxItemCount(e.target.value)}
                    placeholder="15"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                  Catatan / Ketentuan Khusus (Opsional)
                </Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Tidak menerima titipan barang pecah belah besar, cairan > 100ml, dll."
                  className="mt-1.5 w-full min-h-[100px] rounded-lg border border-warm-border px-3 py-2 text-sm"
                />
              </div>
            </Card>

            {/* Verification Proof */}
            <Card className="border-warm-border bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-charcoal">Bukti Tiket / Visa (Opsional untuk Badge Verified)</h3>
              </div>
              <p className="text-xs text-sage">
                Upload bukti e-ticket atau visa Umrah untuk mendapatkan badge &quot;Verified Traveler&quot; dan meningkatkan kepercayaan calon pembeli.
              </p>

              <div className="border-2 border-dashed border-warm-border rounded-lg p-6 text-center hover:border-olive transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-sage mx-auto mb-2" />
                <div className="text-xs font-semibold text-charcoal">
                  Klik untuk upload e-ticket / visa
                </div>
                <div className="text-[10px] text-sage mt-1">
                  Format PDF, JPG, PNG (Maks 5MB)
                </div>
              </div>
            </Card>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !departureDate || !returnDate || !orderCutoffDate}
              className="w-full bg-olive hover:bg-olive-light text-white font-semibold py-6"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan Jadwal Trip...
                </>
              ) : (
                "Publikasikan Jadwal Trip"
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
