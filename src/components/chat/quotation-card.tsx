import { formatRupiah } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

interface QuotationCardProps {
  itemName: string;
  itemPriceIdr: number;
  jastipFeeIdr: number;
  platformFeeIdr: number;
  totalEscrow: number;
  expiresAt?: string;
  onAccept?: () => void;
  isAccepted?: boolean;
}

export function QuotationCard({
  itemName,
  itemPriceIdr,
  jastipFeeIdr,
  platformFeeIdr,
  totalEscrow,
  expiresAt,
  onAccept,
  isAccepted = false,
}: QuotationCardProps) {
  return (
    <Card className="border-olive/30 bg-olive/5 p-4 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="h-4 w-4 text-olive" />
        <h4 className="font-bold text-charcoal text-sm">Penawaran Resmi</h4>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-xs font-semibold text-charcoal mb-2">{itemName}</div>

        <div className="flex justify-between text-xs text-sage">
          <span>Harga Barang</span>
          <span className="font-medium text-charcoal">{formatRupiah(itemPriceIdr)}</span>
        </div>

        <div className="flex justify-between text-xs text-sage">
          <span>Fee Jastip</span>
          <span className="font-medium text-charcoal">{formatRupiah(jastipFeeIdr)}</span>
        </div>

        <div className="flex justify-between text-xs text-sage">
          <span>Platform Fee (3.5%)</span>
          <span className="font-medium text-charcoal">{formatRupiah(platformFeeIdr)}</span>
        </div>

        <div className="border-t border-olive/20 pt-2 flex justify-between">
          <span className="text-xs font-bold text-charcoal">Total ke Escrow</span>
          <span className="text-base font-extrabold text-olive">{formatRupiah(totalEscrow)}</span>
        </div>
      </div>

      {!isAccepted ? (
        <>
          {expiresAt && (
            <div className="text-[10px] text-sage mb-3">
              Penawaran berlaku hingga {new Date(expiresAt).toLocaleString("id-ID")}
            </div>
          )}

          <Button
            onClick={onAccept}
            className="w-full bg-olive hover:bg-olive-light text-white text-sm font-semibold"
          >
            Bayar via Escrow Aman
          </Button>
        </>
      ) : (
        <div className="flex items-center justify-center gap-2 py-2 px-3 rounded bg-emerald-100 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 className="h-4 w-4" />
          Penawaran Diterima
        </div>
      )}
    </Card>
  );
}
