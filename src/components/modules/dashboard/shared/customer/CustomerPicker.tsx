import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetCustomersQuery } from "@/redux/features/customer/customer.picker.api";


interface CustomerPickerProps {
  value: string;
  onChange: (id: string, label: string) => void;
}

export default function CustomerPicker({ value, onChange }: CustomerPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isFetching } = useGetCustomersQuery({ searchTerm: searchTerm || undefined, limit: 20 });
  const customers = data?.result ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal"
        >
          <span className="flex items-center gap-2 truncate">
            <User className="h-3.5 w-3.5 text-[#879596]" />
            {value ? selectedLabel : <span className="text-[#879596]">Select a customer</span>}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#879596]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="border-b border-[#EAEDED] p-2">
          <Input
            placeholder="Search name or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoFocus
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {isFetching ? (
            <div className="p-3 text-center text-[12px] text-[#879596]">Searching...</div>
          ) : customers.length === 0 ? (
            <div className="p-3 text-center text-[12px] text-[#879596]">No customers found</div>
          ) : (
            customers.map((c) => (
              <button
                key={c._id}
                type="button"
                onClick={() => {
                  onChange(c._id, `${c.name} · ${c.phone}`);
                  setSelectedLabel(`${c.name} · ${c.phone}`);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-[4px] px-2 py-2 text-left text-[13px] hover:bg-[#F2F3F3]"
              >
                <span>
                  <span className="text-[#16191F]">{c.name}</span>{" "}
                  <span className="font-mono text-[12px] text-[#879596]">{c.phone}</span>
                </span>
                {value === c._id && <Check className="h-4 w-4 text-[#FF9900]" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}