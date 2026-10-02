import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Search,
  Lock,
  Camera,
  PackageCheck,
  Plane,
  Banknote,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <Badge className="bg-olive/10 text-olive border-olive/20 px-3 py-1">
              Panduan Layanan
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal tracking-tight">
              Cara Kerja Safara
            </h1>
            <p className="text-sage text-base sm:text-lg">
              Solusi titip oleh-oleh autentik dari Tanah Suci dan Turki dengan jaminan
              100% keamanan rekening bersama (escrow).
            </p>
          </div>

          {/* Flow for Buyer */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-warm-border pb-4">
              <div className="h-8 w-8 rounded-full bg-olive text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <h2 className="text-2xl font-bold text-charcoal">
                Untuk Pembeli (Buyer / Pemesan Titipan)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  icon: Search,
                  title: "Pilih Barang / Buat Request",
                  desc: "Cari tawaran traveler yang sedang bepergian, atau posting request barang yang kamu inginkan.",
                },
                {
                  step: "02",
                  icon: Lock,
                  title: "Kunci Dana di Escrow",
                  desc: "Bayar via QRIS / Virtual Account. Uangmu aman di rekening bersama Safara dan belum diberikan ke traveler.",
                },
                {
                  step: "03",
                  icon: Camera,
                  title: "Verifikasi Live Photo",
                  desc: "Traveler belanja di toko fisik dan mengirimkan foto asli produk beserta nota sebelum pembelian final.",
                },
                {
                  step: "04",
                  icon: PackageCheck,
                  title: "Inspeksi 48 Jam & Selesai",
                  desc: "Barang dikirim ke rumahmu. Kamu punya waktu 48 jam untuk cek keaslian sebelum dana diteruskan ke traveler.",
                },
              ].map((item) => (
                <Card key={item.step} className="border-warm-border bg-white p-5 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="text-3xl font-extrabold text-olive/20">{item.step}</div>
                  <div className="h-10 w-10 rounded-lg bg-olive/10 text-olive flex items-center justify-center">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-charcoal text-base">{item.title}</h3>
                  <p className="text-xs text-sage leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Flow for Traveler */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-warm-border pb-4">
              <div className="h-8 w-8 rounded-full bg-gold text-charcoal flex items-center justify-center font-bold text-sm">
                B
              </div>
              <h2 className="text-2xl font-bold text-charcoal">
                Untuk Traveler (Jamaah Umrah / Wisatawan)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  icon: Plane,
                  title: "Daftarkan Jadwal Trip",
                  desc: "Cantumkan tanggal keberangkatan, kepulangan, kapasitas sisa bagasi koper (kg), dan rute perjalanan.",
                },
                {
                  step: "02",
                  icon: ShieldCheck,
                  title: "Terima Pesanan Terverifikasi",
                  desc: "Hanya belanja barang yang sudah didanai 100% di Escrow Safara. Bebas risiko pembeli kabur atau PHP.",
                },
                {
                  step: "03",
                  icon: Camera,
                  title: "Belanja & Upload Bukti",
                  desc: "Beli barang di pasar lokal atau toko resmi. Ambil foto barang dan simpan struk belanja untuk bukti.",
                },
                {
                  step: "04",
                  icon: Banknote,
                  title: "Terima Modal + Jastip Fee",
                  desc: "Setelah barang diterima pembeli, dana modal belanja beserta komisi fee jastip otomatis cair ke rekeningmu.",
                },
              ].map((item) => (
                <Card key={item.step} className="border-warm-border bg-white p-5 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="text-3xl font-extrabold text-gold/30">{item.step}</div>
                  <div className="h-10 w-10 rounded-lg bg-gold/15 text-olive flex items-center justify-center">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-charcoal text-base">{item.title}</h3>
                  <p className="text-xs text-sage leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Box */}
          <Card className="border-warm-border bg-olive text-white p-8 sm:p-10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl font-bold">Siap Mencoba Layanan Safara?</h3>
              <p className="text-sm text-sand/80 max-w-xl">
                Jelajahi titipan dari Tanah Suci atau daftarkan perjalananmu untuk menambah penghasilan.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/listings">
                <Button className="bg-white text-olive hover:bg-sand font-semibold">
                  Mulai Belanja
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/trips/new">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 font-semibold">
                  Buat Trip
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
