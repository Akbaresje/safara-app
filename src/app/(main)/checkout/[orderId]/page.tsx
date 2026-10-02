"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Copy,
  CreditCard,
  QrCode,
} from "lucide-react";
import { formatRupiah } from "@/lib/constants";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = use(params);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "va">("qris");
  const [isCopied, setIsCopied] = useState(false);

  // Mock order context
  const order = {
    id: resolvedParams.orderId || "ORD-88219",
    itemName: "Parfum Surrati Royal Musk 100ml (Madinah)",
    travelerName: "Ustadz H. Ahmad Fauzi, Lc.",
    itemPrice: 637500,
    jastipFee: 75000,
    platformFee: 24763,
    totalAmount: 737263,
    vaNumber: "8808129381729381",
  };

  const copyVA = () => {
    navigator.clipboard.writeText(order.vaNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-xs text-sage hover:text-charcoal"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Chat
          </Link>

          {/* Header */}
          <div className="border-b border-warm-border pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Escrow Protected
              </Badge>
              <span className="text-xs text-sage">Order #{order.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-charcoal">
              Pembayaran Rekening Escrow Safara
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Payment Method Selection */}
            <div className="md:col-span-7 space-y-4">
              <Card className="border-warm-border bg-white p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-charcoal">
                  Pilih Cara Pembayaran
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("qris")}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      paymentMethod === "qris"
                        ? "border-olive bg-olive/5 ring-2 ring-olive/20"
                        : "border-warm-border hover:border-olive/40"
                    }`}
                  >
                    <QrCode className="h-5 w-5 text-olive mb-2" />
                    <div className="font-semibold text-xs text-charcoal">QRIS Instan</div>
                    <div className="text-[10px] text-sage">BCA, GoPay, OVO, ShopeePay</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("va")}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      paymentMethod === "va"
                        ? "border-olive bg-olive/5 ring-2 ring-olive/20"
                        : "border-warm-border hover:border-olive/40"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-olive mb-2" />
                    <div className="font-semibold text-xs text-charcoal">Virtual Account</div>
                    <div className="text-[10px] text-sage">BCA, Mandiri, BNI, BRI</div>
                  </button>
                </div>

                {/* Payment Detail Display */}
                {paymentMethod === "qris" ? (
                  <div className="rounded-xl border border-warm-border bg-sand/40 p-4 text-center space-y-3">
                    <div className="text-xs font-semibold text-charcoal">
                      Scan QRIS via Aplikasi Bank / E-Wallet Anda
                    </div>
                    <div className="inline-block p-3 bg-white rounded-lg border border-warm-border shadow-sm">
                      <div className="h-44 w-44 bg-sand flex flex-col items-center justify-center rounded text-sage text-xs">
                        <QrCode className="h-16 w-16 text-olive mb-2" />
                        <span>QRIS Safara Escrow</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-sage">
                      Kadaluarsa dalam: <strong>23:59:45</strong>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-warm-border bg-sand/40 p-4 space-y-3">
                    <div className="text-xs text-sage">Nomor Virtual Account Bank Mandiri:</div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-warm-border font-mono font-bold text-sm">
                      <span>{order.vaNumber}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyVA}
                        className="h-7 text-xs text-olive"
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        {isCopied ? "Tersalin!" : "Salin"}
                      </Button>
                    </div>
                    <div className="text-[11px] text-sage">
                      Verifikasi pembayaran otomatis dalam 1-2 menit setelah transfer.
                    </div>
                  </div>
                )}
              </Card>

              {/* Security Notice */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <strong>Jaminan Uang Aman 100%:</strong> Traveler belum menerima dana ini.
                  Uang hanya dicairkan setelah barang tiba di alamat Anda dan melewati masa inspeksi 48 jam.
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="md:col-span-5 space-y-4">
              <Card className="border-warm-border bg-white p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-charcoal border-b border-warm-border pb-2">
                  Ringkasan Pesanan
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-charcoal">{order.itemName}</div>
                  <div className="text-sage">Traveler: {order.travelerName}</div>
                </div>

                <div className="space-y-2 border-t border-warm-border pt-3 text-xs text-sage">
                  <div className="flex justify-between">
                    <span>Harga Barang</span>
                    <span className="font-medium text-charcoal">{formatRupiah(order.itemPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee Jastip</span>
                    <span className="font-medium text-charcoal">{formatRupiah(order.jastipFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform &amp; Escrow (3.5%)</span>
                    <span className="font-medium text-charcoal">{formatRupiah(order.platformFee)}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-warm-border pt-2 text-charcoal font-bold">
                    <span>Total Pembayaran</span>
                    <span className="text-base text-olive font-extrabold">
                      {formatRupiah(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <Link href="/dashboard">
                  <Button className="w-full bg-olive hover:bg-olive-light text-white font-semibold py-5 text-xs">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Saya Sudah Transfer / Cek Dashboard
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
