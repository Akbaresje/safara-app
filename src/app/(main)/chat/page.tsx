"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
} from "lucide-react";

// Mock conversation data
const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    participant_name: "Ustadz H. Ahmad Fauzi, Lc.",
    participant_avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    last_message: "Baik, saya sudah ambil foto parfumnya di toko. Cek ya!",
    last_message_at: "2026-09-25T10:30:00Z",
    unread_count: 2,
    order_status: "purchased",
    item_name: "Parfum Surrati Royal Musk",
  },
  {
    id: "conv-2",
    participant_name: "Nabila Saraswati",
    participant_avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    last_message: "Oke deal! Saya transfer ke escrow sekarang ya",
    last_message_at: "2026-09-25T09:15:00Z",
    unread_count: 0,
    order_status: "escrow_funded",
    item_name: "Turkish Delight Hafiz Mustafa",
  },
  {
    id: "conv-3",
    participant_name: "Muhammad Rizky Pratama",
    participant_avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    last_message: "Harga terbaiknya berapa kak untuk sajadah?",
    last_message_at: "2026-09-24T16:45:00Z",
    unread_count: 1,
    order_status: "inquiry",
    item_name: "Sajadah Tebal Raudhah",
  },
];

const MOCK_MESSAGES = [
  {
    id: "msg-1",
    sender_name: "Ustadz H. Ahmad Fauzi, Lc.",
    content:
      "Assalamualaikum, untuk parfum Surrati Royal Musk yang 100ml harga tokonya 150 SAR. Saya tawarkan fee jastip 75rb. Totalnya sekitar 712rb masuk escrow.",
    message_type: "text",
    created_at: "2026-09-25T08:00:00Z",
    is_mine: false,
  },
  {
    id: "msg-2",
    sender_name: "Saya",
    content:
      "Waalaikumsalam ustadz, boleh! Tapi bisa minta foto asli dari toko dulu sebelum beli?",
    message_type: "text",
    created_at: "2026-09-25T08:05:00Z",
    is_mine: true,
  },
  {
    id: "msg-3",
    sender_name: "Ustadz H. Ahmad Fauzi, Lc.",
    content:
      "Siap, InsyaAllah besok pagi saya ke toko di depan Masjid Nabawi. Nanti saya foto live sekalian sama notanya.",
    message_type: "text",
    created_at: "2026-09-25T08:10:00Z",
    is_mine: false,
  },
  {
    id: "msg-quotation",
    sender_name: "Ustadz H. Ahmad Fauzi, Lc.",
    content: "",
    message_type: "quotation",
    created_at: "2026-09-25T09:50:00Z",
    is_mine: false,
    quotation: {
      itemName: "Parfum Surrati Royal Musk 100ml",
      itemPriceIdr: 637500,
      jastipFeeIdr: 75000,
      platformFeeIdr: 24763,
      totalEscrow: 737263,
      expiresAt: "2026-09-27T09:50:00Z",
      isAccepted: false,
    },
  },
  {
    id: "msg-4",
    sender_name: "Ustadz H. Ahmad Fauzi, Lc.",
    content: "Alhamdulillah sudah beli. Ini foto dari tokonya",
    message_type: "text",
    created_at: "2026-09-25T10:25:00Z",
    is_mine: false,
    attachment_urls: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "msg-5",
    sender_name: "Ustadz H. Ahmad Fauzi, Lc.",
    content: "Baik, saya sudah ambil foto parfumnya di toko. Cek ya!",
    message_type: "live_store_photo",
    created_at: "2026-09-25T10:30:00Z",
    is_mine: false,
    attachment_urls: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    ],
  },
];

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(
    MOCK_CONVERSATIONS[0]
  );
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [messageInput, setMessageInput] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectConversation = (
    conv: (typeof MOCK_CONVERSATIONS)[number]
  ) => {
    setSelectedConversation(conv);
    setMobileView("chat");
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender_name: "Saya",
      content: messageInput,
      message_type: "text",
      created_at: new Date().toISOString(),
      is_mine: true,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 1) {
      const diffMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffMinutes} menit lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam lalu`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const getOrderStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      inquiry: { label: "Diskusi", color: "bg-slate-100 text-slate-700" },
      offer_sent: {
        label: "Penawaran Dikirim",
        color: "bg-blue-100 text-blue-700",
      },
      escrow_funded: {
        label: "Escrow Terkunci",
        color: "bg-emerald-100 text-emerald-800",
      },
      purchased: {
        label: "Sudah Dibeli",
        color: "bg-indigo-100 text-indigo-700",
      },
      in_transit: {
        label: "Dalam Pengiriman",
        color: "bg-purple-100 text-purple-700",
      },
      delivered: {
        label: "Tiba (Inspeksi)",
        color: "bg-teal-100 text-teal-800",
      },
      completed: { label: "Selesai", color: "bg-green-100 text-green-800" },
    };

    const status_info = statusMap[status] || statusMap.inquiry;
    return (
      <Badge className={`${status_info.color} text-xs`}>
        {status_info.label}
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-canvas">
        <div className="mx-auto h-[calc(100vh-4rem)] max-w-7xl">
          <div className="grid grid-cols-12 h-full border-x border-warm-border bg-white">
            {/* Conversation List Sidebar — hidden on mobile when chat is open */}
            <aside
              className={`col-span-12 md:col-span-4 border-r border-warm-border flex flex-col ${
                mobileView === "chat" ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Search Header */}
              <div className="p-4 border-b border-warm-border">
                <h2 className="text-xl font-bold text-charcoal mb-3">Pesan</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage" />
                  <Input
                    placeholder="Cari percakapan..."
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {MOCK_CONVERSATIONS.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full p-4 border-b border-warm-border text-left transition-colors hover:bg-sand ${
                      selectedConversation.id === conv.id ? "bg-olive/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Image
                          src={conv.participant_avatar}
                          alt={conv.participant_name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        {conv.unread_count > 0 && (
                          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {conv.unread_count}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-semibold text-charcoal text-sm truncate">
                            {conv.participant_name}
                          </span>
                          <span className="text-[10px] text-sage shrink-0 ml-2">
                            {formatTimestamp(conv.last_message_at)}
                          </span>
                        </div>

                        <div className="text-xs text-sage mb-2 truncate">
                          {conv.last_message}
                        </div>

                        <div className="flex items-center gap-2">
                          {getOrderStatusBadge(conv.order_status)}
                          <span className="text-[10px] text-sage truncate">
                            {conv.item_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Chat Area — hidden on mobile when list is shown */}
            <div
              className={`col-span-12 md:col-span-8 flex flex-col ${
                mobileView === "list" ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-warm-border bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Back button — mobile only */}
                    <button
                      className="md:hidden mr-1 text-sage hover:text-charcoal transition-colors"
                      onClick={() => setMobileView("list")}
                      aria-label="Kembali ke daftar pesan"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>

                    <Image
                      src={selectedConversation.participant_avatar}
                      alt={selectedConversation.participant_name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-charcoal text-sm">
                          {selectedConversation.participant_name}
                        </span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xs text-sage">
                        {selectedConversation.item_name}
                      </div>
                    </div>
                  </div>

                  {getOrderStatusBadge(selectedConversation.order_status)}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sand/30">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_mine ? "justify-end" : "justify-start"}`}
                  >
                    {/* Quotation card — special rendering */}
                    {message.message_type === "quotation" && message.quotation ? (
                      <div className="w-full max-w-[85%] md:max-w-[70%]">
                        {!message.is_mine && (
                          <div className="text-xs font-semibold mb-1 text-olive">
                            {message.sender_name}
                          </div>
                        )}
                        <QuotationCard
                          itemName={message.quotation.itemName}
                          itemPriceIdr={message.quotation.itemPriceIdr}
                          jastipFeeIdr={message.quotation.jastipFeeIdr}
                          platformFeeIdr={message.quotation.platformFeeIdr}
                          totalEscrow={message.quotation.totalEscrow}
                          expiresAt={message.quotation.expiresAt}
                          isAccepted={message.quotation.isAccepted}
                          onAccept={() => {
                            setMessages((prev) =>
                              prev.map((m) =>
                                m.id === message.id && m.quotation
                                  ? { ...m, quotation: { ...m.quotation, isAccepted: true } }
                                  : m
                              )
                            );
                          }}
                        />
                        <div className="text-[10px] mt-1 text-sage">
                          {new Date(message.created_at).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Regular text / attachment message */
                      <div
                        className={`max-w-[85%] md:max-w-[70%] ${
                          message.is_mine
                            ? "bg-olive text-white"
                            : "bg-white text-charcoal border border-warm-border"
                        } rounded-lg p-3 shadow-sm`}
                      >
                        {!message.is_mine && (
                          <div className="text-xs font-semibold mb-1 text-olive">
                            {message.sender_name}
                          </div>
                        )}

                        {message.attachment_urls &&
                          message.attachment_urls.length > 0 && (
                            <div className="mb-2 rounded overflow-hidden">
                              <Image
                                src={message.attachment_urls[0]}
                                alt="Attachment"
                                width={400}
                                height={192}
                                className="w-full max-h-48 object-cover"
                              />
                            </div>
                          )}

                        {message.content && (
                          <div className="text-sm break-words">
                            {message.content}
                          </div>
                        )}

                        <div
                          className={`text-[10px] mt-1 ${
                            message.is_mine ? "text-white/70" : "text-sage"
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Order Context Banner (if escrow funded) */}
              {selectedConversation.order_status === "escrow_funded" && (
                <div className="border-t border-warm-border bg-emerald-50 p-3">
                  <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-800 font-semibold">
                      Dana Escrow Rp 712.500 telah terkunci aman. Traveler
                      dapat mulai membeli barang.
                    </span>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-warm-border bg-white">
                <div className="flex items-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-sage hover:text-olive"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-sage hover:text-olive"
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
                      placeholder="Ketik pesan..."
                      className="h-10"
                    />
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="bg-olive hover:bg-olive-light text-white shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-2 text-[10px] text-sage text-center">
                  Semua percakapan dilindungi enkripsi dan tercatat sebagai
                  bukti transaksi
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
