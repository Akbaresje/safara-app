"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  Loader2,
  ShieldCheck,
  Calculator,
} from "lucide-react";
import Link from "next/link";
import { CATEGORIES, DESTINATIONS, formatRupiah } from "@/lib/constants";
import type { ItemCategory, TravelDestination, ListingType } from "@/types/database";

function NewListingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill from calculator if available
  const typeParam = searchParams.get("type") as ListingType | null;
  const currencyParam = searchParams.get("currency") || "SAR";
  const priceParam = searchParams.get("price") || "";
  const feeParam = searchParams.get("fee") || "";

  const [type, setType] = useState<ListingType>(typeParam || "buyer_request");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ItemCategory>("parfum_attar");
  const [origin, setOrigin] = useState<TravelDestination>("makkah");
  const [localCurrency, setLocalCurrency] = useState(currencyParam);
  const [localPrice, setLocalPrice] = useState(priceParam);
  const [jastipFee, setJastipFee] = useState(feeParam);
  const [weightKg, setWeightKg] = useState("0.5");
  const [quantity, setQuantity] = useState("1");
  const [images, setImages] = useState<string[]>([]);
  const [referenceLinks, setReferenceLinks] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const exchangeRate = localCurrency === "SAR" ? 4250 : 520;
  const estimatedPriceIdr = Number(localPrice) * exchangeRate;
  const jastipFeeIdr = Number(jastipFee);
  const platformFee = Math.round((estimatedPriceIdr + jastipFeeIdr) * 0.035);
  const totalEscrow = estimatedPriceIdr + jastipFeeIdr + platformFee;

  const handleAddReferenceLink = () => {
    setReferenceLinks([...referenceLinks, ""]);
  };

  const handleRemoveReferenceLink = (index: number) => {
    setReferenceLinks(referenceLinks.filter((_, i) => i !== index));
  };

  const handleUpdateReferenceLink = (index: number, value: string) => {
    const updated = [...referenceLinks];
    updated[index] = value;
    setReferenceLinks(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: Implement Supabase insertion
    setTimeout(() => {
      router.push("/listings");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-canvas py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-sm text-sage hover:text-charcoal mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Listing
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-charcoal">Buat Listing Baru</h1>
            <p className="text-sm text-sage mt-2">
              Posting penawaran atau request titipan dengan proteksi escrow penuh
            </p>
          </div>

          <div className="space-y-6">
            {/* Type Selection */}
            <Card className="border-warm-border bg-white p-6">
              <Label className="text-xs font-semibold text-sage uppercase tracking-wider mb-3 block">
                Tipe Listing
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("traveler_offer")}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    type === "traveler_offer"
                      ? "border-olive bg-olive/5 ring-2 ring-olive/20"
                      : "border-warm-border hover:border-olive/50"
                  }`}
                >
                  <div className="font-bold text-charcoal mb-1">Penawaran Traveler</div>
                  <div className="text-xs text-sage">
                    Saya sedang/akan pergi dan bisa membelikan barang untuk orang lain
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setType("buyer_request")}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    type === "buyer_request"
                      ? "border-olive bg-olive/5 ring-2 ring-olive/20"
                      : "border-warm-border hover:border-olive/50"
                  }`}
                >
                  <div className="font-bold text-charcoal mb-1">Request Titip (Buyer)</div>
                  <div className="text-xs text-sage">
                    Saya butuh barang tertentu dan mencari traveler yang bisa membelikan
                  </div>
                </button>
              </div>
            </Card>

            {/* Basic Info */}
            <Card className="border-warm-border bg-white p-6 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                  Judul Listing *
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Parfum Surrati Royal Musk dari Madinah"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                  Deskripsi Lengkap *
                </Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan detail barang, ukuran, spesifikasi, dan informasi penting lainnya..."
                  className="mt-1.5 w-full min-h-[120px] rounded-lg border border-warm-border px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Kategori *
                  </Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    className="mt-1.5 w-full rounded-lg border border-warm-border px-3 py-2 text-sm"
                  >
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                      <option key={key} value={key}>
                        {cat.labelId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Destinasi Asal *
                  </Label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value as TravelDestination)}
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

            {/* Pricing */}
            <Card className="border-warm-border bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-olive" />
                <h3 className="font-bold text-charcoal">Estimasi Harga & Fee</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setLocalCurrency("SAR")}
                  className={`p-2 rounded-lg border text-sm font-semibold transition-all ${
                    localCurrency === "SAR"
                      ? "border-olive bg-olive/5 text-olive"
                      : "border-warm-border text-sage"
                  }`}
                >
                  Saudi Riyal (SAR)
                </button>
                <button
                  type="button"
                  onClick={() => setLocalCurrency("TRY")}
                  className={`p-2 rounded-lg border text-sm font-semibold transition-all ${
                    localCurrency === "TRY"
                      ? "border-olive bg-olive/5 text-olive"
                      : "border-warm-border text-sage"
                  }`}
                >
                  Turkish Lira (TRY)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Harga Barang ({localCurrency}) *
                  </Label>
                  <Input
                    type="number"
                    value={localPrice}
                    onChange={(e) => setLocalPrice(e.target.value)}
                    placeholder="150"
                    className="mt-1.5"
                  />
                  <p className="mt-1 text-xs text-sage">
                    ≈ {formatRupiah(estimatedPriceIdr)}
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Fee Jastip (IDR) *
                  </Label>
                  <Input
                    type="number"
                    value={jastipFee}
                    onChange={(e) => setJastipFee(e.target.value)}
                    placeholder="75000"
                    className="mt-1.5"
                  />
                  <p className="mt-1 text-xs text-sage">Komisi untuk traveler</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="rounded-lg bg-canvas p-4 space-y-2 border border-warm-border">
                <div className="flex justify-between text-xs text-sage">
                  <span>Harga Barang</span>
                  <span className="font-medium text-charcoal">
                    {formatRupiah(estimatedPriceIdr)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-sage">
                  <span>Fee Jastip</span>
                  <span className="font-medium text-charcoal">
                    {formatRupiah(jastipFeeIdr)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-sage">
                  <span className="flex items-center gap-1">
                    Platform Fee (3.5%)
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  </span>
                  <span className="font-medium text-charcoal">
                    {formatRupiah(platformFee)}
                  </span>
                </div>
                <div className="border-t border-warm-border pt-2 flex justify-between">
                  <span className="text-xs font-bold text-charcoal">Total Escrow</span>
                  <span className="text-lg font-extrabold text-olive">
                    {formatRupiah(totalEscrow)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Berat Estimasi (kg) *
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="0.5"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
                    Kuantitas *
                  </Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="1"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </Card>

            {/* Photo Upload */}
            <Card className="border-warm-border bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-4 w-4 text-olive" />
                <h3 className="font-bold text-charcoal">Foto Produk / Contoh Barang</h3>
              </div>
              <p className="text-xs text-sage">
                Tambahkan URL foto produk untuk memperjelas bentuk, warna, dan kemasan yang dicari.
              </p>
              <div className="flex gap-2">
                <Input
                  value={images[0] || ""}
                  onChange={(e) => setImages([e.target.value])}
                  placeholder="https://images.unsplash.com/... (atau URL gambar)"
                  className="flex-1"
                />
              </div>
            </Card>

            {/* Reference Links */}
            <Card className="border-warm-border bg-white p-6 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-sage uppercase tracking-wider mb-2 block">
                  Link Referensi Produk (Opsional)
                </Label>
                <p className="text-xs text-sage mb-3">
                  Tambahkan link toko online atau marketplace untuk membantu traveler menemukan
                  barang yang tepat
                </p>
                {referenceLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={link}
                      onChange={(e) => handleUpdateReferenceLink(index, e.target.value)}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    {referenceLinks.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveReferenceLink(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddReferenceLink}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah Link
                </Button>
              </div>
            </Card>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={loading || !title || !description || !localPrice || !jastipFee}
                className="flex-1 bg-olive hover:bg-olive-light text-white font-semibold py-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Publish Listing"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function NewListingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-olive mx-auto mb-2" />
          <p className="text-sm text-sage">Memuat formulir...</p>
        </div>
      </div>
    }>
      <NewListingForm />
    </Suspense>
  );
}
