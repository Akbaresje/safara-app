import { ItemCategory, TravelDestination } from "@/types/database";
import {
  Sparkles,
  Layers,
  Palmtree,
  HeartHandshake,
  Coffee,
  Briefcase,
  Smartphone,
  Droplet,
  FileEdit,
  type LucideIcon
} from "lucide-react";

export const DESTINATIONS: Record<
  TravelDestination,
  { label: string; city: string; country: string; flag: string; airport: string; image: string }
> = {
  makkah: {
    label: "Makkah Al-Mukarramah",
    city: "Makkah",
    country: "Arab Saudi",
    flag: "",
    airport: "JED",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80"
  },
  madinah: {
    label: "Madinah Al-Munawwarah",
    city: "Madinah",
    country: "Arab Saudi",
    flag: "",
    airport: "MED",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80"
  },
  istanbul: {
    label: "Istanbul & Grand Bazaar",
    city: "Istanbul",
    country: "Turki",
    flag: "",
    airport: "IST",
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80"
  },
  bursa: {
    label: "Bursa & Uludag",
    city: "Bursa",
    country: "Turki",
    flag: "",
    airport: "SAW",
    image: "https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=800&q=80"
  },
  saudi_general: {
    label: "Arab Saudi (Umum)",
    city: "Riyadh/Jeddah",
    country: "Arab Saudi",
    flag: "",
    airport: "RUH",
    image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=80"
  },
  turkey_general: {
    label: "Turki (Umum)",
    city: "Turki",
    country: "Turki",
    flag: "",
    airport: "IST",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80"
  },
  indonesia: {
    label: "Indonesia",
    city: "Jakarta",
    country: "Indonesia",
    flag: "",
    airport: "CGK",
    image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=800&q=80"
  },
};

export interface CategoryInfo {
  label: string;
  labelId: string;
  description: string;
  icon: LucideIcon;
  image: string;
  sampleItems: string[];
}

export const CATEGORIES: Record<ItemCategory, CategoryInfo> = {
  parfum_attar: {
    label: "Perfume & Oud Attar",
    labelId: "Parfum & Minyak Wangi",
    description: "Oud murni, Musk Al-Thaharah, Surrati, Arabian Oud, Abdul Samad Al Qurashi",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    sampleItems: ["Surrati Royal Musk", "Oud Bukhoor Premium", "Khas Madinah Oil"]
  },
  sajadah_textiles: {
    label: "Prayer Mats & Textiles",
    labelId: "Sajadah & Tekstil Raudhah",
    description: "Sajadah motif Raudhah & Kiswah, abaya Makkah, pashmina sutra Turki",
    icon: Layers,
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80",
    sampleItems: ["Sajadah Tebal Raudhah", "Abaya Hitam Saudi", "Syal Sutra Bursa"]
  },
  kurma_food: {
    label: "Dates & Fresh Produce",
    labelId: "Kurma Ajwa & Makanan Khas",
    description: "Kurma Ajwa Aliyah Madinah, Sukari King, Medjool, kacang Arab, kismis",
    icon: Palmtree,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    sampleItems: ["Ajwa Madinah Organik", "Sukari Basah Al-Qassim", "Kacang Pistachio Saudi"]
  },
  turkish_delight_tea: {
    label: "Turkish Delight & Apple Tea",
    labelId: "Turkish Delight & Teh",
    description: "Hafiz Mustafa Lokum, Caykur Black Tea, Apple Tea Grand Bazaar, Kopi Mehmet Efendi",
    icon: Coffee,
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80",
    sampleItems: ["Hafiz Mustafa Pistachio Lokum", "Kurukahveci Mehmet Efendi", "Teh Apel Turki"]
  },
  leather_goods: {
    label: "Anatolian Leather Goods",
    labelId: "Jaket & Kerajinan Kulit Turki",
    description: "Jaket kulit domba asli Istanbul, dompet, tas handmade Kapalicarsi",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
    sampleItems: ["Jaket Kulit Lambskin", "Dompet Kulit Anatolia", "Tas Selempang Vintage"]
  },
  skincare_beauty: {
    label: "Skincare & Natural Beauty",
    labelId: "Skincare & Sabun Minyak Zaitun",
    description: "Sabun Aleppo zaitun murni, Rosewater Isparta Turki, Dhab cream, Serum Habbatussauda",
    icon: HeartHandshake,
    image: "https://images.unsplash.com/photo-1608248597359-00f074d28437?auto=format&fit=crop&w=600&q=80",
    sampleItems: ["Isparta Rosewater Asli", "Sabun Minyak Zaitun Turki", "Dhab Cream Herbal"]
  },
  zamzam_dates: {
    label: "Authentic Zamzam Water",
    labelId: "Air Zamzam & Herbal Nabawi",
    description: "Air Zamzam galon resmi SNAS/NWC, madu Yaman Sidr, habbatussauda kapsul",
    icon: Droplet,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80",
    sampleItems: ["Zamzam Galon 5L Barcode", "Madu Yaman Sidr Baghiya", "Minyak Zaitun Peras Pertama"]
  },
  electronics_accessories: {
    label: "Smart Accessories & Devices",
    labelId: "Aksesoris & Jam Sholat",
    description: "Jam tangan waktu sholat Al-Fajr/Al-Harameen, Tasbih digital pintar iQibla, Cincin Dzikir Zikr Ring",
    icon: Smartphone,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    sampleItems: ["Jam Al-Fajr Automatic Qibla", "iQibla Smart Zikr Ring", "Tasbih Counter Bluetooth"]
  },
  custom_request: {
    label: "Custom Request / Titip Khusus",
    labelId: "Request Khusus / Barang Langka",
    description: "Buku rujukan bahasa Arab, perhiasan emas Turki, pecah belah antik Ottoman",
    icon: FileEdit,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    sampleItems: ["Kitab Hadits Maktabah Madinah", "Cangkir Teh Kaca Ottoman", "Kaligrafi Asli Makkah"]
  },
};

export interface MockTraveler {
  id: string;
  name: string;
  avatar: string;
  tripRole: "Umrah Jamaah" | "Tour Leader Umrah" | "Traveler / Backpacker" | "Mahasiswa Madinah";
  verifiedKtp: boolean;
  verifiedPassport: boolean;
  verifiedTicket: boolean;
  origin: string;
  destination: string;
  destinationName: string;
  departureDate: string;
  returnDate: string;
  remainingKg: number;
  totalLuggageKg: number;
  rating: number;
  reviewCount: number;
  completedTrips: number;
  statusBadge: string;
}

export const MOCK_TRAVELERS: MockTraveler[] = [
  {
    id: "trv-1",
    name: "Ustadz H. Ahmad Fauzi, Lc.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    tripRole: "Tour Leader Umrah",
    verifiedKtp: true,
    verifiedPassport: true,
    verifiedTicket: true,
    origin: "Jakarta (CGK)",
    destination: "Jeddah / Madinah (JED/MED)",
    destinationName: "Makkah & Madinah",
    departureDate: "28 Sep 2026",
    returnDate: "12 Okt 2026",
    remainingKg: 8.5,
    totalLuggageKg: 20.0,
    rating: 4.95,
    reviewCount: 48,
    completedTrips: 14,
    statusBadge: "Sedang di Madinah",
  },
  {
    id: "trv-2",
    name: "Siti Rahmania Putri",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    tripRole: "Traveler / Backpacker",
    verifiedKtp: true,
    verifiedPassport: true,
    verifiedTicket: true,
    origin: "Surabaya (SUB)",
    destination: "Istanbul & Bursa (IST/SAW)",
    destinationName: "Istanbul & Bursa",
    departureDate: "05 Okt 2026",
    returnDate: "22 Okt 2026",
    remainingKg: 5.0,
    totalLuggageKg: 15.0,
    rating: 4.88,
    reviewCount: 29,
    completedTrips: 8,
    statusBadge: "Berangkat 10 Hari Lagi",
  },
  {
    id: "trv-3",
    name: "Muhammad Rizky Pratama",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    tripRole: "Mahasiswa Madinah",
    verifiedKtp: true,
    verifiedPassport: true,
    verifiedTicket: true,
    origin: "Madinah (MED)",
    destination: "Jakarta (CGK)",
    destinationName: "Pulang Liburan Semester",
    departureDate: "15 Okt 2026",
    returnDate: "18 Okt 2026",
    remainingKg: 12.0,
    totalLuggageKg: 25.0,
    rating: 5.0,
    reviewCount: 62,
    completedTrips: 19,
    statusBadge: "Akses Toko Lokal Grosir",
  },
  {
    id: "trv-4",
    name: "dr. Annisa Laksmi & Suami",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    tripRole: "Umrah Jamaah",
    verifiedKtp: true,
    verifiedPassport: true,
    verifiedTicket: true,
    origin: "Bandung (BDO)",
    destination: "Makkah (JED)",
    destinationName: "Umrah Mandiri",
    departureDate: "10 Okt 2026",
    returnDate: "26 Okt 2026",
    remainingKg: 4.0,
    totalLuggageKg: 10.0,
    rating: 4.92,
    reviewCount: 16,
    completedTrips: 5,
    statusBadge: "Bisa Titip Parfum Makkah",
  }
];

export interface MockTestimonial {
  id: string;
  name: string;
  city: string;
  avatar: string;
  role: "Buyer" | "Traveler";
  itemPurchased: string;
  rating: number;
  quote: string;
  date: string;
  destination: string;
}

export const MOCK_TESTIMONIALS: MockTestimonial[] = [
  {
    id: "test-1",
    name: "Fadhil Muhammad",
    city: "Jakarta Selatan",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    role: "Buyer",
    itemPurchased: "Sajadah Tebal Tebal Raudhah + Parfum Surrati",
    rating: 5,
    quote: "Awalnya ragu jastip karena sering dengar kasus kabur bawa DP. Di Safara dana Rp 1.4jt saya ditahan di escrow dulu sampai barang saya terima dan saya unboxing sendiri. Barangnya 100% asli dari toko depan Masjid Nabawi!",
    date: "18 Sep 2026",
    destination: "Madinah",
  },
  {
    id: "test-2",
    name: "Nabila Saraswati",
    city: "Bandung",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    role: "Buyer",
    itemPurchased: "Turkish Delight Hafiz Mustafa 1kg Mix Pistachio",
    rating: 5,
    quote: "Nitip cemilan Turki yang super fresh. Kak Siti kirim live photo pas lagi di tokonya di Sirkeci Istanbul sebelum beli. Packing rapi, bubble wrap berlapis, tiba di Bandung masih fresh banget.",
    date: "14 Sep 2026",
    destination: "Istanbul",
  },
  {
    id: "test-3",
    name: "Ustadz H. Ahmad Fauzi",
    city: "Bekasi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    role: "Traveler",
    itemPurchased: "14 Pesanan Titipan Terpenuhi",
    rating: 5,
    quote: "Sebagai pembimbing umrah, kuota bagasi saya sering bersisa 15-20kg. Lewat Safara, saya bisa bantu jamaah di tanah air dapat barang amanah, sekaligus dapat komisi halal jutaan rupiah setiap pulang trip.",
    date: "09 Sep 2026",
    destination: "Makkah & Madinah",
  }
];

export const PLATFORM_STATS = {
  totalEscrowDisbursedIdr: "Rp 3.8 Miliar+",
  successfulTransactions: "4,920+",
  activeVerifiedTravelers: "340+",
  avgCustomerRating: 4.96,
  disputeRate: "0.12%",
};

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  inquiry: { label: "Diskusi", color: "bg-slate-100 text-slate-700 border-slate-200" },
  offer_sent: { label: "Penawaran Dikirim", color: "bg-blue-100 text-blue-700 border-blue-200" },
  escrow_pending: { label: "Menunggu Pembayaran", color: "bg-amber-100 text-amber-700 border-amber-200" },
  escrow_funded: { label: "Dana Terkunci (Escrow)", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  purchased: { label: "Barang Sudah Dibeli", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  in_transit: { label: "Dalam Pengiriman", color: "bg-purple-100 text-purple-700 border-purple-200" },
  delivered: { label: "Paket Tiba (Inspeksi 48 Jam)", color: "bg-teal-100 text-teal-800 border-teal-200" },
  completed: { label: "Selesai & Dana Cair", color: "bg-green-100 text-green-800 border-green-200" },
  disputed: { label: "Sengketa (Dana Dibekukan)", color: "bg-red-100 text-red-700 border-red-200" },
  cancelled: { label: "Dibatalkan", color: "bg-gray-100 text-gray-600 border-gray-200" },
  refunded: { label: "Dana Dikembalikan 100%", color: "bg-orange-100 text-orange-700 border-orange-200" },
};

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SAF-${dateStr}-${random}`;
}
