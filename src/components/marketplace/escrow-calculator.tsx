"use client";

import { useState, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, ShieldCheck, ArrowRight } from "lucide-react";
import { formatRupiah } from "@/lib/constants";
import Link from "next/link";

// ── Animated number counter ───────────────────────────────────────────────

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const from = prevValue.current;
    prevValue.current = value;

    const controls = animate(from, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate(latest) {
        node.textContent = formatRupiah(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value]);

  return <span ref={ref}>{formatRupiah(value)}</span>;
}

export function EscrowCalculator() {
  const [currency, setCurrency] = useState<"SAR" | "TRY">("SAR");
  const [localPrice, setLocalPrice] = useState<number>(150); // e.g. 150 Riyal
  const [jastipFee, setJastipFee] = useState<number>(75000); // 75k IDR default

  // Estimated exchange rate (SAR ~ Rp 4.250, TRY ~ Rp 520)
  const exchangeRate = currency === "SAR" ? 4250 : 520;
  const itemPriceIdr = localPrice * exchangeRate;
  const platformFee = Math.round((itemPriceIdr + jastipFee) * 0.035); // 3.5% escrow security fee
  const totalEscrow = itemPriceIdr + jastipFee + platformFee;

  return (
    <Card className="overflow-hidden border border-warm-border bg-white shadow-xl">
      <div className="bg-olive p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/20 text-gold">
              <Calculator className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-base tracking-tight">
              Kalkulator Estimasi Biaya Titip
            </h3>
          </div>
          <Badge className="bg-gold/20 text-gold border-gold/30 hover:bg-gold/30">
            Kurs Realtime
          </Badge>
        </div>
        <p className="mt-1 text-xs text-sand/80">
          Hitung estimasi total yang dibayarkan ke Rekening Escrow Safara.
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Currency Switcher */}
        <div>
          <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
            Mata Uang Asal Toko
          </Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["SAR", "TRY"] as const).map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => setCurrency(cur)}
                className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-sm font-semibold transition-all ${
                  currency === cur
                    ? "border-olive bg-olive/5 text-olive ring-2 ring-olive/20"
                    : "border-warm-border bg-canvas text-sage hover:text-charcoal"
                }`}
              >
                <span>
                  {cur === "SAR" ? "Saudi Riyal (SAR)" : "Turkish Lira (TRY)"}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-1.5 text-right text-[11px] text-sage">
            1 {currency} = ~{formatRupiah(exchangeRate)}
          </div>
        </div>

        {/* Price Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
              Estimasi Harga Barang ({currency})
            </Label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-sage">
                {currency}
              </span>
              <Input
                type="number"
                min={1}
                value={localPrice || ""}
                onChange={(e) =>
                  setLocalPrice(Math.max(0, Number(e.target.value)))
                }
                className="pl-14 font-semibold text-charcoal"
                placeholder="0"
              />
            </div>
            <p className="mt-1 text-[11px] text-sage">
              Setara: <AnimatedNumber value={itemPriceIdr} />
            </p>
          </div>

          <div>
            <Label className="text-xs font-semibold text-sage uppercase tracking-wider">
              Tawaran Jastip Fee (IDR)
            </Label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-sage">
                Rp
              </span>
              <Input
                type="number"
                step={5000}
                min={10000}
                value={jastipFee || ""}
                onChange={(e) =>
                  setJastipFee(Math.max(0, Number(e.target.value)))
                }
                className="pl-10 font-semibold text-charcoal"
                placeholder="75000"
              />
            </div>
            <p className="mt-1 text-[11px] text-sage">
              Komisi untuk traveler yang membawa
            </p>
          </div>
        </div>

        {/* Calculation Summary Table */}
        <div className="rounded-xl border border-warm-border bg-canvas p-4 space-y-2">
          <div className="flex justify-between text-xs text-sage">
            <span>
              Harga Barang ({localPrice} {currency})
            </span>
            <span className="font-medium text-charcoal">
              <AnimatedNumber value={itemPriceIdr} />
            </span>
          </div>
          <div className="flex justify-between text-xs text-sage">
            <span>Komisi Jastip Traveler</span>
            <span className="font-medium text-charcoal">
              <AnimatedNumber value={jastipFee} />
            </span>
          </div>
          <div className="flex justify-between text-xs text-sage">
            <span className="flex items-center gap-1">
              Proteksi Escrow &amp; Platform (3.5%)
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 inline" />
            </span>
            <span className="font-medium text-charcoal">
              <AnimatedNumber value={platformFee} />
            </span>
          </div>
          <div className="border-t border-warm-border pt-2 flex justify-between items-baseline">
            <div>
              <div className="text-xs font-semibold text-charcoal">
                Total Masuk Escrow
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">
                Dana aman 100% sampai barang tiba
              </div>
            </div>
            <motion.div
              key={totalEscrow}
              initial={{ scale: 1.05, color: "#D4AF37" }}
              animate={{ scale: 1, color: "#26382B" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-lg font-extrabold"
            >
              <AnimatedNumber value={totalEscrow} />
            </motion.div>
          </div>
        </div>

        <Link
          href={`/listings/new?type=buyer_request&currency=${currency}&price=${localPrice}&fee=${jastipFee}`}
        >
          <Button className="w-full bg-olive hover:bg-olive-light text-white font-semibold py-5">
            <span>Posting Titipan dengan Budget Ini</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
