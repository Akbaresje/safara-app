import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-olive/10 text-olive border-olive/20 px-3 py-1">
              Perlindungan Data
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              Kebijakan Privasi
            </h1>
            <p className="text-sage text-sm">
              Safara berkomitmen menjaga keamanan dan kerahasiaan data pribadi seluruh pengguna.
            </p>
          </div>

          <Card className="border-warm-border bg-white p-6 sm:p-8 shadow-sm space-y-6 text-sm text-sage leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal">1. Data yang Kami Kumpulkan</h2>
              <p>
                Kami mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar akun, seperti nama lengkap, nomor WhatsApp, alamat email, serta dokumen identitas resmi (KTP dan Paspor) khusus bagi pengguna yang mendaftar sebagai traveler terverifikasi.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal">2. Penggunaan Data Identitas</h2>
              <p>
                Foto dokumen identitas (KTP/Paspor) hanya digunakan untuk keperluan verifikasi keamanan traveler (KYC) dan tidak pernah dipublikasikan secara umum kepada pembeli maupun pihak ketiga yang tidak berwenang. Dokumen disimpan dengan enkripsi standar industri.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal">3. Keamanan Percakapan &amp; Transaksi</h2>
              <p>
                Seluruh riwayat obrolan pada fitur Chat Safara dilindungi enkripsi dan hanya dapat diakses oleh tim mediasi sengketa Safara jika terjadi laporan keluhan transaksi resmi antara pembeli dan traveler.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal">4. Hak Pengguna</h2>
              <p>
                Anda berhak meminta penghapusan akun beserta data identitas pribadi Anda setelah seluruh kewajiban transaksi yang aktif telah diselesaikan sepenuhnya.
              </p>
            </section>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
