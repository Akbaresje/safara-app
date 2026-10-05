"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { QuotationCard } from "@/components/chat/quotation-card";
import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  X,
  FileText,
  DollarSign,
  Info,
  Check,
  CheckCheck,
  Headphones,
  Loader2,
} from "lucide-react";
import { formatRupiah } from "@/lib/constants";

interface Message {
  id: string;
  sender_name: string;
  content: string;
  message_type: "text" | "quotation" | "image";
  created_at: string;
  is_mine: boolean;
  attachment_url?: string;
  quotation?: {
    itemName: string;
    itemPriceIdr: number;
    jastipFeeIdr: number;
    platformFeeIdr: number;
    totalEscrow: number;
    expiresAt: string;
    isAccepted: boolean;
  };
}

interface Conversation {
  id: string;
  participant_name: string;
  participant_avatar?: string;
  is_official?: boolean;
  is_verified?: boolean;
  status_online?: boolean;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  order_status?: string;
  item_name?: string;
  messages: Message[];
}

const OFFICIAL_SUPPORT_CONVERSATION: Conversation = {
  id: "support-official",
  participant_name: "Tim Bantuan & Escrow Safara",
  is_official: true,
  is_verified: true,
  status_online: true,
  last_message: "Assalamu'alaikum! Ada yang bisa kami bantu seputar transaksi Safara?",
  last_message_at: new Date().toISOString(),
  unread_count: 0,
  order_status: "official_support",
  item_name: "Layanan Resmi 24/7",
  messages: [
    {
      id: "msg-welcome-1",
      sender_name: "Tim Bantuan & Escrow Safara",
      content:
        "Assalamu'alaikum! Selamat datang di Safara. Kami siap membantu Anda seputar sistem titipan jastip, proteksi dana rekening bersama (escrow), atau panduan verifikasi identitas resmi (KYC).",
      message_type: "text",
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      is_mine: false,
    },
    {
      id: "msg-welcome-2",
      sender_name: "Tim Bantuan & Escrow Safara",
      content:
        "Pilih salah satu topik di bawah ini atau ketik pertanyaan Anda secara langsung:",
      message_type: "text",
      created_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      is_mine: false,
    },
  ],
};

const QUICK_TOPICS = [
  {
    label: "Bagaimana cara kerja Escrow?",
    reply:
      "Dana pembayaran titipan Anda akan disimpan aman di rekening bersama (escrow) Safara terlebih dahulu. Dana baru dicairkan ke rekening traveler setelah Anda menerima barang dan memastikan keasliannya.",
  },
  {
    label: "Berapa estimasi kurs SAR & TRY?",
    reply:
      "Kurs acuan Safara saat ini: 1 Saudi Riyal (SAR) ≈ Rp 4.250 dan 1 Turkish Lira (TRY) ≈ Rp 520. Kurs ini diperbarui secara berkala.",
  },
  {
    label: "Syarat verifikasi KYC Traveler?",
    reply:
      "Untuk menjadi traveler terverifikasi di Safara, Anda perlu mengunggah foto KTP resmi, nomor Paspor RI, serta tiket keberangkatan/kepulangan Umrah atau Turki.",
  },
  {
    label: "Bagaimana jika barang rusak / tidak sesuai?",
    reply:
      "Anda memiliki waktu inspeksi 48 jam setelah barang tiba. Jika barang cacat atau tidak sesuai kesepakatan, Anda dapat mengajukan sengketa (dispute) untuk klaim pengembalian dana 100%.",
  },
];

function ChatContent() {
  const searchParams = useSearchParams();
  const queryTo = searchParams.get("to");
  const queryItem = searchParams.get("item");

  const [conversations, setConversations] = useState<Conversation[]>([
    OFFICIAL_SUPPORT_CONVERSATION,
  ]);
  const [selectedId, setSelectedId] = useState<string>("support-official");
  const [searchFilter, setSearchFilter] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("chat");

  // Attachment & Quotation modal states
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quoteItemName, setQuoteItemName] = useState("");
  const [quotePrice, setQuotePrice] = useState("");
  const [quoteFee, setQuoteFee] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize query-based conversation if user navigated with ?to= & ?item=
  useEffect(() => {
    if (queryTo) {
      const existing = conversations.find(
        (c) => c.participant_name.toLowerCase() === queryTo.toLowerCase()
      );
      if (existing) {
        setSelectedId(existing.id);
      } else {
        const newConvId = `conv-${Date.now()}`;
        const newConv: Conversation = {
          id: newConvId,
          participant_name: queryTo,
          is_official: false,
          is_verified: true,
          status_online: true,
          last_message: queryItem
            ? `Diskusi titipan: ${queryItem}`
            : "Percakapan baru dimulai",
          last_message_at: new Date().toISOString(),
          unread_count: 0,
          item_name: queryItem || "Titipan Barang",
          order_status: "inquiry",
          messages: [
            {
              id: `msg-init-${Date.now()}`,
              sender_name: queryTo,
              content: queryItem
                ? `Halo! Saya melihat Anda tertarik dengan titipan "${queryItem}". Ada yang ingin ditanyakan seputar pembelian atau jadwal berangkat?`
                : "Halo! Ada yang bisa saya bantu untuk kebutuhan titipan Anda?",
              message_type: "text",
              created_at: new Date().toISOString(),
              is_mine: false,
            },
          ],
        };
        setConversations((prev) => [newConv, ...prev]);
        setSelectedId(newConvId);
      }
      setMobileView("chat");
    }
  }, [queryTo, queryItem]);

  const activeConversation =
    conversations.find((c) => c.id === selectedId) || conversations[0];

  const scrollToBottom = (behavior: ScrollBehavior = "instant") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom("instant");
  }, [selectedId]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : messageInput).trim();
    if (!text && !attachedImage) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender_name: "Saya",
      content: text,
      message_type: attachedImage ? "image" : "text",
      created_at: new Date().toISOString(),
      is_mine: true,
      attachment_url: attachedImage || undefined,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            last_message: text || "Mengirim gambar",
            last_message_at: new Date().toISOString(),
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setMessageInput("");
    setAttachedImage(null);
    setTimeout(() => scrollToBottom("smooth"), 50);

    // If talking to official support, simulate intelligent assistant response
    if (activeConversation.id === "support-official") {
      setTimeout(() => {
        const lower = text.toLowerCase();
        let reply =
          "Terima kasih atas pesan Anda! Tim kami siap mendampingi proses transaksi Anda agar aman, berkah, dan terpercaya. Jika ada kendala darurat, Anda juga dapat menghubungi kami melalui halaman Kontak.";

        for (const topic of QUICK_TOPICS) {
          if (
            lower.includes(topic.label.toLowerCase()) ||
            topic.label.toLowerCase().split(" ").some((w) => w.length > 4 && lower.includes(w))
          ) {
            reply = topic.reply;
            break;
          }
        }

        if (lower.includes("escrow") || lower.includes("rekening")) {
          reply =
            "Rekening Bersama (Escrow) Safara melindungi 100% uang Anda. Traveler hanya dapat mencairkan dana setelah barang tiba di Indonesia dan disetujui pembeli.";
        } else if (lower.includes("kurs") || lower.includes("riyal") || lower.includes("lira")) {
          reply =
            "Kurs acuan resmi Safara: 1 SAR (Saudi Riyal) = Rp 4.250 | 1 TRY (Turkish Lira) = Rp 520.";
        } else if (lower.includes("kyc") || lower.includes("ktp") || lower.includes("paspor")) {
          reply =
            "Semua traveler Safara wajib lulus verifikasi KTP dan Paspor asli sebelum dapat membuka bagasi jastip.";
        }

        const supportReply: Message = {
          id: `msg-rep-${Date.now()}`,
          sender_name: "Tim Bantuan & Escrow Safara",
          content: reply,
          message_type: "text",
          created_at: new Date().toISOString(),
          is_mine: false,
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === "support-official") {
              return {
                ...c,
                last_message: reply,
                last_message_at: new Date().toISOString(),
                messages: [...c.messages, supportReply],
              };
            }
            return c;
          })
        );
        setTimeout(() => scrollToBottom("smooth"), 50);
      }, 700);
    }
  };

  const handleSelectQuickTopic = (topic: (typeof QUICK_TOPICS)[number]) => {
    handleSendMessage(topic.label);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteItemName || !quotePrice || !quoteFee) return;

    const price = Number(quotePrice);
    const fee = Number(quoteFee);
    const platform = Math.round((price + fee) * 0.035);
    const total = price + fee + platform;

    const quoteMsg: Message = {
      id: `msg-quote-${Date.now()}`,
      sender_name: "Saya",
      content: "",
      message_type: "quotation",
      created_at: new Date().toISOString(),
      is_mine: true,
      quotation: {
        itemName: quoteItemName,
        itemPriceIdr: price,
        jastipFeeIdr: fee,
        platformFeeIdr: platform,
        totalEscrow: total,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
        isAccepted: false,
      },
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            last_message: `Penawaran Jastip: ${quoteItemName} (${formatRupiah(total)})`,
            last_message_at: new Date().toISOString(),
            messages: [...c.messages, quoteMsg],
          };
        }
        return c;
      })
    );

    setShowQuotationModal(false);
    setQuoteItemName("");
    setQuotePrice("");
    setQuoteFee("");
  };

  const filteredConversations = conversations.filter((c) =>
    searchFilter
      ? c.participant_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.item_name?.toLowerCase().includes(searchFilter.toLowerCase())
      : true
  );

  return (
    <div className="flex h-screen max-h-screen flex-col overflow-hidden bg-canvas">
      <Navbar />

      <main className="flex-1 min-h-0 overflow-hidden p-2 sm:p-4">
        <div className="mx-auto h-full max-w-7xl rounded-2xl border border-warm-border bg-white shadow-xs overflow-hidden flex flex-row">
          {/* ── LEFT SIDEBAR: Conversations List (Independent Scroll) ─────── */}
          <aside
            className={`w-full md:w-80 lg:w-[350px] shrink-0 h-full border-r border-warm-border flex flex-col bg-white overflow-hidden ${
              mobileView === "chat" ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Sidebar Header - Pinned at top */}
            <div className="shrink-0 p-4 border-b border-warm-border space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-charcoal">
                  Pesan &amp; Diskusi
                </h2>
                <Badge className="bg-olive/10 text-olive text-xs font-semibold">
                  {conversations.length} Obrolan
                </Badge>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage" />
                <Input
                  placeholder="Cari obrolan atau barang..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-9 h-9 text-xs border-warm-border"
                />
              </div>
            </div>

            {/* Conversations Scroll Area - Independent Scroll Container */}
            <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-warm-border touch-pan-y">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-sage">
                  Tidak ditemukan obrolan yang sesuai
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === selectedId;
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(conv.id);
                        setMobileView("chat");
                      }}
                      className={`w-full p-4 text-left transition-colors flex items-start gap-3 hover:bg-sand/30 ${
                        isSelected ? "bg-olive/5 border-l-4 border-l-olive" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {conv.is_official ? (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-olive text-white shadow-xs">
                            <ShieldCheck className="h-6 w-6" />
                          </div>
                        ) : conv.participant_avatar ? (
                          <Image
                            src={conv.participant_avatar}
                            alt={conv.participant_name}
                            width={44}
                            height={44}
                            className="h-11 w-11 rounded-full object-cover border border-warm-border"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-olive/10 text-olive font-bold text-sm">
                            {conv.participant_name.charAt(0)}
                          </div>
                        )}

                        {conv.status_online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-xs text-charcoal truncate flex items-center gap-1">
                            {conv.participant_name}
                            {conv.is_verified && (
                              <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                            )}
                          </span>
                          <span className="text-[10px] text-sage shrink-0 ml-1">
                            {new Date(conv.last_message_at).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>

                        <p className="text-[11px] text-sage truncate mb-1.5">
                          {conv.last_message}
                        </p>

                        <div className="flex items-center gap-1.5">
                          {conv.is_official ? (
                            <Badge className="bg-olive/10 text-olive text-[10px] font-semibold">
                              Layanan Resmi
                            </Badge>
                          ) : (
                            <Badge className="bg-sand text-charcoal border-warm-border text-[10px] font-medium truncate max-w-[150px]">
                              {conv.item_name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* ── RIGHT PANEL: Active Chat (Independent Scroll) ──────────────── */}
          <div
            className={`flex-1 min-w-0 h-full flex flex-col bg-[#FAF8F5] overflow-hidden ${
              mobileView === "list" ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Chat Header - Pinned at top */}
            <div className="shrink-0 p-3.5 border-b border-warm-border bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Back button for mobile */}
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  className="md:hidden text-sage hover:text-charcoal p-1 rounded-lg hover:bg-sand"
                  aria-label="Kembali ke daftar pesan"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="relative">
                  {activeConversation.is_official ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-olive text-white">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                  ) : activeConversation.participant_avatar ? (
                    <Image
                      src={activeConversation.participant_avatar}
                      alt={activeConversation.participant_name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover border border-warm-border"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-olive/10 text-olive font-bold text-sm">
                      {activeConversation.participant_name.charAt(0)}
                    </div>
                  )}
                  {activeConversation.status_online && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-charcoal">
                      {activeConversation.participant_name}
                    </span>
                    {activeConversation.is_verified && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                  </div>
                  <div className="text-[11px] text-sage flex items-center gap-1.5">
                    <span>{activeConversation.item_name}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!activeConversation.is_official && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowQuotationModal(true)}
                    className="border-olive/30 text-olive hover:bg-olive/10 text-xs hidden sm:flex"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    Kirim Penawaran Jastip
                  </Button>
                )}
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Escrow Aktif</span>
                </div>
              </div>
            </div>

            {/* Messages Area - Independent Scroll Container */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 touch-pan-y">
              {activeConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.is_mine ? "justify-end" : "justify-start"}`}
                >
                  {msg.message_type === "quotation" && msg.quotation ? (
                    <div className="max-w-[85%] md:max-w-[65%]">
                      <QuotationCard
                        itemName={msg.quotation.itemName}
                        itemPriceIdr={msg.quotation.itemPriceIdr}
                        jastipFeeIdr={msg.quotation.jastipFeeIdr}
                        platformFeeIdr={msg.quotation.platformFeeIdr}
                        totalEscrow={msg.quotation.totalEscrow}
                        expiresAt={msg.quotation.expiresAt}
                        isAccepted={msg.quotation.isAccepted}
                        onAccept={() => {
                          setConversations((prev) =>
                            prev.map((c) =>
                              c.id === selectedId
                                ? {
                                    ...c,
                                    messages: c.messages.map((m) =>
                                      m.id === msg.id && m.quotation
                                        ? {
                                            ...m,
                                            quotation: {
                                              ...m.quotation,
                                              isAccepted: true,
                                            },
                                          }
                                        : m
                                    ),
                                  }
                                : c
                            )
                          );
                        }}
                      />
                      <div className="text-[10px] text-sage mt-1 text-right">
                        {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3.5 text-xs shadow-xs ${
                        msg.is_mine
                          ? "bg-olive text-white rounded-br-xs"
                          : "bg-white text-charcoal border border-warm-border rounded-bl-xs"
                      }`}
                    >
                      {!msg.is_mine && (
                        <div className="font-bold text-olive mb-1 text-[11px]">
                          {msg.sender_name}
                        </div>
                      )}

                      {msg.attachment_url && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                          <Image
                            src={msg.attachment_url}
                            alt="Foto bukti"
                            width={400}
                            height={250}
                            className="w-full max-h-56 object-cover"
                          />
                        </div>
                      )}

                      <p className="leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>

                      <div
                        className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                          msg.is_mine ? "text-white/70" : "text-sage"
                        }`}
                      >
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                        {msg.is_mine && <CheckCheck className="h-3 w-3" />}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips (when in Support conversation) */}
            {activeConversation.id === "support-official" && (
              <div className="shrink-0 px-4 py-2 bg-white/80 border-t border-warm-border overflow-x-auto">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-[10px] font-bold text-sage mr-1 flex items-center gap-1">
                    <Headphones className="h-3 w-3 text-olive" /> Bantuan Cepat:
                  </span>
                  {QUICK_TOPICS.map((topic, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectQuickTopic(topic)}
                      className="rounded-full border border-warm-border bg-white px-2.5 py-1 text-[11px] font-medium text-charcoal hover:border-olive hover:text-olive transition-colors shadow-2xs"
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image attachment preview badge */}
            {attachedImage && (
              <div className="shrink-0 px-4 py-2 bg-sand/40 border-t border-warm-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded overflow-hidden border border-warm-border">
                    <Image
                      src={attachedImage}
                      alt="Preview"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-charcoal font-medium">
                    Foto siap dikirim
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAttachedImage(null)}
                  className="h-7 w-7 p-0 text-sage hover:text-charcoal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Message Input Footer - Pinned at bottom */}
            <div className="shrink-0 p-3.5 border-t border-warm-border bg-white">
              <div className="flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  title="Lampirkan Foto Produk / Struk"
                  className="text-sage hover:text-olive shrink-0 h-10 w-10"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>

                <div className="flex-1">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ketik pesan untuk didiskusikan... (Enter untuk kirim)"
                    className="h-10 text-xs sm:text-sm border-warm-border focus-visible:ring-olive"
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!messageInput.trim() && !attachedImage}
                  className="bg-olive hover:bg-olive-light text-white shrink-0 h-10 px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-2 text-[10px] text-sage text-center flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>
                  Seluruh percakapan dienkripsi dan menjadi bukti perlindungan garansi rekening bersama
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Quotation Modal ──────────────────────────────────────────────── */}
      {showQuotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between border-b border-warm-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-olive" />
                <h3 className="font-bold text-sm text-charcoal">
                  Buat Penawaran Resmi Jastip
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQuotationModal(false)}
                className="text-sage hover:text-charcoal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendQuotation} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-charcoal block mb-1">
                  Nama Barang Titipan
                </label>
                <Input
                  value={quoteItemName}
                  onChange={(e) => setQuoteItemName(e.target.value)}
                  placeholder="Misal: Sajadah Rawdah Madinah Emboss"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">
                    Harga Barang (Rp)
                  </label>
                  <Input
                    type="number"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    placeholder="350000"
                    required
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">
                    Fee Jastip (Rp)
                  </label>
                  <Input
                    type="number"
                    value={quoteFee}
                    onChange={(e) => setQuoteFee(e.target.value)}
                    placeholder="75000"
                    required
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {quotePrice && quoteFee && (
                <div className="rounded-lg bg-sand/40 p-3 space-y-1 text-[11px] border border-warm-border">
                  <div className="flex justify-between">
                    <span>Komisi Escrow (3.5%):</span>
                    <span>
                      {formatRupiah(
                        Math.round((Number(quotePrice) + Number(quoteFee)) * 0.035)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-olive border-t border-warm-border pt-1">
                    <span>Total Pembayaran Masuk Escrow:</span>
                    <span>
                      {formatRupiah(
                        Number(quotePrice) +
                          Number(quoteFee) +
                          Math.round((Number(quotePrice) + Number(quoteFee)) * 0.035)
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuotationModal(false)}
                  className="flex-1 text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-olive hover:bg-olive-light text-white text-xs"
                >
                  Kirim ke Chat
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-canvas">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-olive mx-auto mb-2" />
            <p className="text-xs text-sage">Memuat percakapan...</p>
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
