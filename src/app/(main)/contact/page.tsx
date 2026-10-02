import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Clock, MapPin, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge className="bg-olive/10 text-olive border-olive/20 px-3 py-1">
              Bantuan &amp; Dukungan
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              Hubungi Tim Safara
            </h1>
            <p className="text-sage text-base max-w-xl mx-auto">
              Ada pertanyaan seputar transaksi, kendala rekening escrow, atau pendaftaran traveler? Kami siap membantu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp Support */}
            <Card className="border-warm-border bg-white p-6 shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal">Customer Care WhatsApp</h3>
                <p className="text-xs text-sage mt-1">
                  Respon tercepat untuk bantuan pesanan, konfirmasi escrow, dan verifikasi dokumen traveler.
                </p>
              </div>
              <div className="text-sm font-semibold text-charcoal">
                +62 812-3456-7890
              </div>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                  Chat via WhatsApp
                </Button>
              </a>
            </Card>

            {/* Email Support */}
            <Card className="border-warm-border bg-white p-6 shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-xl bg-olive/10 text-olive flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal">Email Resmi</h3>
                <p className="text-xs text-sage mt-1">
                  Untuk pertanyaan kemitraan travel umrah, laporan sengketa resmi, dan pertanyaan hukum.
                </p>
              </div>
              <div className="text-sm font-semibold text-charcoal">
                support@safara.id
              </div>
              <a href="mailto:support@safara.id" className="block">
                <Button variant="outline" className="w-full border-warm-border text-charcoal hover:bg-sand">
                  Kirim Email
                </Button>
              </a>
            </Card>
          </div>

          {/* Operational Hours & Location */}
          <Card className="border-warm-border bg-white p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-olive shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-charcoal">Jam Layanan Operasional</h4>
                <p className="text-xs text-sage mt-1">
                  Senin – Minggu: 08.00 – 22.00 WIB<br />
                  Monitoring Escrow &amp; Dispute: 24/7
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-olive shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-charcoal">Kantor Operasional</h4>
                <p className="text-xs text-sage mt-1">
                  Safara Teknologi Nusantara<br />
                  Jakarta Selatan, DKI Jakarta 12950, Indonesia
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
