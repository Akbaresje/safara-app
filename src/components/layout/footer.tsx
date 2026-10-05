import Link from "next/link";

const FOOTER_LINKS = {
  Platform: [
    { href: "/listings", label: "Jelajahi Barang" },
    { href: "/trips/new", label: "Buat Trip" },
    { href: "/listings/new", label: "Jual Barang" },
  ],
  Bantuan: [
    { href: "/how-it-works", label: "Cara Kerja" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Hubungi Kami" },
  ],
  Legal: [
    { href: "/terms", label: "Syarat & Ketentuan" },
    { href: "/privacy", label: "Kebijakan Privasi" },
    { href: "/escrow-policy", label: "Kebijakan Escrow" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-warm-border bg-sand/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-olive text-white font-bold text-lg shadow-2xs">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-charcoal">Safara</span>
            </Link>
            <p className="text-sm text-sage leading-relaxed">
              Platform jastip terpercaya untuk oleh-oleh dari Tanah Suci &amp; Turki.
              Escrow aman, traveler terverifikasi.
            </p>
          </div>

          {/* Link Groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="space-y-3">
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">{group}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 text-sm font-medium text-sage transition-colors duration-150 hover:text-olive"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-warm-border pt-8 text-center text-xs font-medium text-sage">
          &copy; {new Date().getFullYear()} Safara. Seluruh hak cipta dilindungi. Transaksi aman dengan Rekening Bersama.
        </div>
      </div>
    </footer>
  );
}
