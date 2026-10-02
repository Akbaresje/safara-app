"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Star,
  MapPin,
  Calendar,
  MessageCircle,
  ShieldCheck,
  Package,
} from "lucide-react";
import { MOCK_TRAVELERS } from "@/lib/constants";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const traveler =
    MOCK_TRAVELERS.find((t) => t.id === resolvedParams.id) || MOCK_TRAVELERS[0];

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
          {/* Profile Header Card */}
          <Card className="border-warm-border bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <Image
                src={traveler.avatar}
                alt={traveler.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover border-2 border-warm-border shadow-sm"
              />
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-2xl font-bold text-charcoal">{traveler.name}</h1>
                      {traveler.verifiedKtp && traveler.verifiedPassport && (
                        <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                          Verified ID
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-olive font-semibold mt-0.5">
                      {traveler.tripRole}
                    </div>
                  </div>

                  <Link href="/chat">
                    <Button className="bg-olive hover:bg-olive-light text-white text-xs">
                      <MessageCircle className="h-4 w-4 mr-1.5" />
                      Kirim Pesan
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-sage pt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{traveler.origin} → {traveler.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Kepulangan: {traveler.returnDate}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{traveler.rating} ({traveler.reviewCount} ulasan)</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Verification Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-warm-border bg-white p-4 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-xs text-charcoal">KTP Terverifikasi</div>
                <div className="text-[10px] text-sage">Identitas kependudukan sah</div>
              </div>
            </Card>

            <Card className="border-warm-border bg-white p-4 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-xs text-charcoal">Paspor &amp; Visa Sah</div>
                <div className="text-[10px] text-sage">Izin bepergian luar negeri valid</div>
              </div>
            </Card>

            <Card className="border-warm-border bg-white p-4 flex items-center gap-3">
              <Package className="h-6 w-6 text-olive shrink-0" />
              <div>
                <div className="font-bold text-xs text-charcoal">{traveler.completedTrips} Trip Selesai</div>
                <div className="text-[10px] text-sage">100% pesanan terkirim selamat</div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
