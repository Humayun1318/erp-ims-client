import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { IDashboardLowStockProduct } from "@/types/analytics.types";


interface LowStockPanelProps {
  products: IDashboardLowStockProduct[];
  isLoading?: boolean;
}

function stockSeverity(qty: number) {
  if (qty === 0) return { dot: "bg-[#E74C3C]", text: "text-[#E74C3C]", label: "Out of Stock" };
  return { dot: "bg-[#F39C12]", text: "text-[#F39C12]", label: "Low Stock" };
}

export default function LowStockPanel({ products, isLoading }: LowStockPanelProps) {
  return (
    <div className="overflow-hidden rounded-[4px] border border-[#D5DBDB] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between border-b border-[#EAEDED] px-4 py-3">
        <span className="flex items-center gap-2 text-[13px] font-bold text-[#16191F]">
          <AlertTriangle className="h-4 w-4 text-[#F39C12]" />
          Low Stock Products
        </span>
        <span className="text-[12px] text-[#879596]">
          {isLoading ? "" : `${products.length} item${products.length === 1 ? "" : "s"}`}
        </span>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">
            <th scope="col" className="px-4 py-2">SKU</th>
            <th scope="col" className="px-4 py-2">Product</th>
            <th scope="col" className="px-4 py-2 text-right">Stock</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-t border-[#EAEDED]">
                <td colSpan={3} className="px-4 py-3">
                  <Skeleton className="h-5 w-full" />
                </td>
              </tr>
            ))
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-[13px] text-[#879596]">
                All products are sufficiently stocked.
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const severity = stockSeverity(product.stockQuantity);
              return (
                <tr key={product._id} className="border-t border-[#EAEDED]">
                  <td className="px-4 py-3 font-mono text-[12px] text-[#545B64]">{product.sku}</td>
                  <td className="px-4 py-3 text-[13px] text-[#16191F]">{product.name}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-[12px]">
                      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${severity.dot}`} />
                      <span className={severity.text}>{product.stockQuantity}</span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}