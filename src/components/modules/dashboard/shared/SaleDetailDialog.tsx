import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSaleQuery } from "@/redux/features/sale/sale.api";


interface SaleDetailDialogProps {
  saleId: string | null;
  onOpenChange: (open: boolean) => void;
}

export default function SaleDetailDialog({ saleId, onOpenChange }: SaleDetailDialogProps) {
  const { data: sale, isFetching } = useGetSaleQuery(saleId ?? "", { skip: !saleId });

  const customer = typeof sale?.customer === "object" ? sale.customer : null;
  const createdBy = typeof sale?.createdBy === "object" ? sale.createdBy : null;

  return (
    <Dialog open={Boolean(saleId)} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#16191F]">Sale Details</DialogTitle>
        </DialogHeader>

        {isFetching || !sale ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[#879596]">Customer</div>
                <div className="text-[#16191F]">{customer?.name ?? "—"}</div>
                <div className="font-mono text-[12px] text-[#545B64]">{customer?.phone}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[#879596]">Processed By</div>
                <div className="text-[#16191F]">{createdBy?.name ?? "—"}</div>
                <div className="text-[12px] text-[#545B64]">{createdBy?.role}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[#879596]">Date</div>
                <div className="text-[#16191F]">{new Date(sale.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[#879596]">Grand Total</div>
                <div className="font-mono text-[15px] font-bold text-[#16191F]">
                  ${sale.grandTotal.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[4px] border border-[#D5DBDB]">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#EAEDED] text-[11px] uppercase tracking-wide text-[#545B64]">
                    <th className="px-3 py-2 font-bold">Product</th>
                    <th className="px-3 py-2 text-right font-bold">Qty</th>
                    <th className="px-3 py-2 text-right font-bold">Unit Price</th>
                    <th className="px-3 py-2 text-right font-bold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.products.map((line, i) => {
                    const product = typeof line.product === "object" ? line.product : null;
                    return (
                      <tr key={i} className="border-t border-[#EAEDED]">
                        <td className="px-3 py-2 text-[#16191F]">
                          {product?.name ?? "—"}
                          <div className="font-mono text-[11px] text-[#879596]">{product?.sku}</div>
                        </td>
                        <td className="px-3 py-2 text-right font-mono">{line.quantity}</td>
                        <td className="px-3 py-2 text-right font-mono">${line.unitPrice.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right font-mono">
                          ${(line.quantity * line.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}