import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-olive/10 text-olive border-olive/20 px-3 py-1">
              Dokumen Hukum
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              Syarat &amp; Ketentuan Layanan
            </h1>
            <p className="text-sage text-sm">
              Terakhir diperbarui: Oktober 2026
            </p>
          </div>

          <Card className="border-warm-border bg-white p-6 sm:p-8 shadow-sm space-y-6 text-sm text-sage leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal">1. Definisi Layanan</h2>
              <p>
                Safara adalah platform penghubung berbasis daring yang memfasilitasi transaksi jasa penitipan (jastip) antara pengguna yang sedang bepergian (&ldquo;Traveler&rdquo;) dengan pengguna yang membutuhkan pembelian barang (&ldquo;Pembeli&rdquo;) dari Tanah Suci (Makkah, Madinah) dan Turki.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal">2. Kewajiban &amp; Tanggung Jawab Traveler</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Wajib memberikan data identitas resmi (KTP dan Paspor) yang valid.</li>
                <li>Hanya membeli barang legal yang diizinkan oleh hukum Indonesia dan negara asal.</li>
                <li>Dilarang membawa barang yang melanggar ketentuan bagasi maskapai dan kepabeanan (maksimal US$ 500 pembebasan bea masuk per penumpang).</li>
                <li>Wajib mengemas barang dengan aman untuk mencegah kerusakan saat perjalanan.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal">3. Kewajiban &amp; Hak Pembeli</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Wajib melunasi total tagihan (harga barang, fee jastip, platform fee) ke Rekening Escrow Safara sebelum traveler berbelanja.</li>
                <li>Memiliki hak melakukan inspeksi 48 jam sejak paket tiba untuk memverifikasi keaslian dan kondisi barang.</li>
                <li>Wajib merekam video unboxing utuh tanpa jeda sebagai syarat sah pengajuan komplain atau sengketa.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-charcoal">4. Barang yang Dilarang</h2>
              <p>
                Platform melarang keras segala bentuk titipan berupa: narkotika, obat-obatan tanpa resep, senjata, barang tiruan/KW yang melanggar hak cipta, makanan olahan basah tanpa izin karantina, serta barang terlarang lainnya sesuai UU Kepabeanan RI.
              </p>
            </section>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
