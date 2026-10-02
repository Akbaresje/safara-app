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
    <footer className="border-t border-warm-border bg-sand">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-olive text-white font-bold text-lg">
                S
              </div>
              <span className="text-lg font-bold text-charcoal">Safara</span>
            </div>
            <p className="mt-3 text-sm text-sage leading-relaxed">
              Platform jastip terpercaya untuk oleh-oleh dari Tanah Suci & Turki.
              Escrow aman, traveler terverifikasi.
            </p>
          </div>

          {/* Link Groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-charcoal">{group}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-sage transition-colors hover:text-charcoal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-warm-border pt-6 text-center text-xs text-sage">
          &copy; {new Date().getFullYear()} Safara. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
