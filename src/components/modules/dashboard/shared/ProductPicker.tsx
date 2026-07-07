import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Package } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetProductsQuery } from "@/redux/features/product/product.api";

interface ProductPickerProps {
  value: string;
  onChange: (id: string, label: string, stockQuantity: number, sellingPrice: number) => void;
  excludeIds?: string[]; // already-selected products in other line items
}

export default function ProductPicker({ value, onChange, excludeIds = [] }: ProductPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isFetching } = useGetProductsQuery({ searchTerm: searchTerm || undefined, limit: 20 });
  const products = (data?.result ?? []).filter((p) => !excludeIds.includes(p._id) || p._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" className="w-full justify-between font-normal">
          <span className="flex items-center gap-2 truncate">
            <Package className="h-3.5 w-3.5 text-[#879596]" />
            {value ? selectedLabel : <span className="text-[#879596]">Select a product</span>}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#879596]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="border-b border-[#EAEDED] p-2">
          <Input
            placeholder="Search name, SKU, or category..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoFocus
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {isFetching ? (
            <div className="p-3 text-center text-[12px] text-[#879596]">Searching...</div>
          ) : products.length === 0 ? (
            <div className="p-3 text-center text-[12px] text-[#879596]">No products found</div>
          ) : (
            products.map((p) => {
              const outOfStock = p.stockQuantity === 0;
              return (
                <button
                  key={p._id}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => {
                    onChange(p._id, `${p.name} (${p.sku})`, p.stockQuantity, p.sellingPrice);
                    setSelectedLabel(`${p.name} (${p.sku})`);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-[4px] px-2 py-2 text-left text-[13px] hover:bg-[#F2F3F3] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="truncate">
                    <span className="text-[#16191F]">{p.name}</span>{" "}
                    <span className="font-mono text-[12px] text-[#879596]">{p.sku}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-[11px] text-[#879596]">
                      {outOfStock ? "Out of stock" : `${p.stockQuantity} in stock`}
                    </span>
                    {value === p._id && <Check className="h-4 w-4 text-[#FF9900]" />}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}