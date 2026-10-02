import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, AlertOctagon, RefreshCw } from "lucide-react";

export default function EscrowPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-olive/10 text-olive border-olive/20 px-3 py-1">
              Standar Keamanan Transaksi
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              Kebijakan Rekening Bersama (Escrow)
            </h1>
            <p className="text-sage text-sm max-w-xl mx-auto">
              Safara menerapkan sistem rekening bersama terkunci untuk melindungi hak pembeli dan kepastian pembayaran bagi traveler.
            </p>
          </div>

          <div className="space-y-6 text-sm text-charcoal leading-relaxed">
            <Card className="border-warm-border bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-olive font-bold text-base">
                <ShieldCheck className="h-5 w-5" />
                <h2>1. Prinsip Dasar Proteksi Escrow</h2>
              </div>
              <p className="text-sage text-xs sm:text-sm">
                Seluruh pembayaran atas pesanan barang dan komisi jastip ditampung pada Rekening Penampungan Khusus (Escrow Account) Safara yang bermitra dengan institusi perbankan dan payment gateway berizin Bank Indonesia. Dana tidak dapat ditarik sepihak oleh traveler sebelum barang diterima oleh pembeli.
              </p>
            </Card>

            <Card className="border-warm-border bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-olive font-bold text-base">
                <CheckCircle2 className="h-5 w-5" />
                <h2>2. Ketentuan Pencairan Dana (Disbursement)</h2>
              </div>
              <ul className="text-sage text-xs sm:text-sm space-y-2 list-disc list-inside">
                <li>Dana modal dan fee jastip dicairkan ke saldo/rekening traveler setelah pembeli mengonfirmasi penerimaan barang.</li>
                <li>Jika pembeli tidak memberikan konfirmasi dalam waktu 48 jam sejak paket tiba menurut bukti tracking ekspedisi resmi, dana akan otomatis dicairkan ke traveler.</li>
                <li>Traveler wajib mengunggah foto produk asli dan nota pembelian toko fisik sebagai syarat kelayakan pencairan.</li>
              </ul>
            </Card>

            <Card className="border-warm-border bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-olive font-bold text-base">
                <AlertOctagon className="h-5 w-5 text-amber-700" />
                <h2>3. Mediasi Sengketa (Dispute Resolution)</h2>
              </div>
              <p className="text-sage text-xs sm:text-sm">
                Apabila pembeli mengajukan komplain atas barang rusak, palsu, atau tidak sesuai pesanan, dana escrow akan dibekukan sementara. Tim verifikasi Safara akan memeriksa bukti berupa rekaman video unboxing dan nota fisik toko dalam kurun waktu 1x24 jam kerja.
              </p>
            </Card>

            <Card className="border-warm-border bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-olive font-bold text-base">
                <RefreshCw className="h-5 w-5" />
                <h2>4. Kebijakan Refund 100%</h2>
              </div>
              <p className="text-sage text-xs sm:text-sm">
                Pembeli berhak menerima pengembalian dana 100% tanpa potongan jika: (a) traveler membatalkan pembelian karena stok toko habis, (b) traveler tidak mengirimkan barang dalam tenggat waktu kepulangan yang disepakati, atau (c) barang terbukti tidak otentik.
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
