import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ShieldCheck, CreditCard, Plane, AlertTriangle } from "lucide-react";

const FAQ_ITEMS = [
  {
    category: "Keamanan & Escrow",
    icon: ShieldCheck,
    questions: [
      {
        q: "Bagaimana cara kerja Rekening Bersama (Escrow) Safara?",
        a: "Saat Anda membayar pesanan, uang Anda tidak langsung dikirim ke traveler. Dana disimpan di rekening penampungan resmi Safara. Traveler baru menerima modal belanja dan komisi fee jastip setelah barang sampai di tangan Anda dan melewati masa inspeksi 48 jam.",
      },
      {
        q: "Bagaimana jika barang yang dibeli palsu atau tidak sesuai?",
        a: "Anda memiliki garansi 48 jam inspeksi sejak barang diterima. Jika barang terbukti tidak sesuai pesanan atau palsu, Anda dapat mengajukan komplain melalui tombol 'Buka Sengketa'. Tim Safara akan menahan dana escrow dan mengembalikan uang Anda 100% setelah proses verifikasi.",
      },
    ],
  },
  {
    category: "Pembayaran & Biaya",
    icon: CreditCard,
    questions: [
      {
        q: "Metode pembayaran apa saja yang didukung?",
        a: "Safara mendukung pembayaran instan via QRIS (BCA, Mandiri, GoPay, OVO, ShopeePay) serta Virtual Account seluruh bank nasional besar di Indonesia.",
      },
      {
        q: "Berapa biaya layanan (Platform Fee) Safara?",
        a: "Biaya perlindungan escrow dan operasional platform adalah sebesar 3.5% dari total nilai transaksi. Biaya ini mencakup asuransi proteksi dana dan mediasi jika terjadi kendala.",
      },
    ],
  },
  {
    category: "Pengiriman & Bea Cukai",
    icon: Plane,
    questions: [
      {
        q: "Bagaimana regulasi bea cukai untuk barang titipan?",
        a: "Traveler membawa barang sebagai bagasi pribadi penumpang (Personal Effect) sesuai regulasi batasan pembebasan bea masuk yang berlaku di Indonesia (US$ 500 per penumpang). Traveler dilarang membawa barang kena cukai melebihi batas atau komoditas terlarang.",
      },
      {
        q: "Bagaimana proses pengiriman barang dari traveler ke rumah pembeli?",
        a: "Setelah traveler tiba di Indonesia, barang dapat dikirimkan ke alamat Anda menggunakan ekspedisi kilat (JNE, J&T, SiCepat) atau kurir instan/sameday jika berada di satu kota.",
      },
    ],
  },
  {
    category: "Traveler & Verifikasi",
    icon: AlertTriangle,
    questions: [
      {
        q: "Bagaimana Safara memverifikasi traveler?",
        a: "Setiap traveler wajib mengunggah verifikasi KTP, Paspor yang masih berlaku, serta bukti tiket penerbangan atau visa umrah sebelum dapat menerima pesanan titipan.",
      },
      {
        q: "Apa yang terjadi jika traveler gagal mendapatkan barang di toko?",
        a: "Jika stok barang habis di toko fisik luar negeri, traveler dapat membatalkan pesanan di aplikasi dan dana escrow pembeli akan dikembalikan utuh 100% tanpa potongan.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge className="bg-olive/10 text-olive border-olive/20 px-3 py-1">
              Pusat Bantuan
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-sage text-base max-w-xl mx-auto">
              Temukan jawaban seputar mekanisme rekening escrow, aturan bea cukai, verifikasi traveler, dan perlindungan pembeli.
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-10">
            {FAQ_ITEMS.map((group) => (
              <div key={group.category} className="space-y-4">
                <div className="flex items-center gap-2 text-olive font-bold text-lg border-b border-warm-border pb-2">
                  <group.icon className="h-5 w-5" />
                  <h2>{group.category}</h2>
                </div>

                <div className="space-y-3">
                  {group.questions.map((faq) => (
                    <Card key={faq.q} className="border-warm-border bg-white p-5 shadow-sm space-y-2">
                      <h3 className="font-bold text-charcoal text-base flex items-start gap-2">
                        <HelpCircle className="h-4 w-4 text-olive shrink-0 mt-1" />
                        <span>{faq.q}</span>
                      </h3>
                      <p className="text-sm text-sage leading-relaxed pl-6">
                        {faq.a}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
