import { useState } from "react";
import { format } from "date-fns";
import { Plus, CalendarIcon, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetSalesQuery } from "@/redux/features/sale/sale.api";
import CustomerPicker from "@/components/modules/dashboard/shared/customer/CustomerPicker";
// import SaleFormDialog from "@/components/modules/dashboard/shared/SaleFormDialog";
import SaleDetailDialog from "@/components/modules/dashboard/shared/sale/SaleDetailDialog";
import SaleFormDialog from "@/components/modules/dashboard/shared/sale/SaleFormDialog";


const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "-grandTotal", label: "Total: high to low" },
  { value: "grandTotal", label: "Total: low to high" },
];

export default function SalesPage() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const role = userInfo?.data?.role;
  // All three roles can create sales per backend permissions.
  const canCreateSale = role === "ADMIN" || role === "MANAGER" || role === "EMPLOYEE";

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("-createdAt");
  const [customerFilter, setCustomerFilter] = useState<{ id: string; label: string } | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const limit = 10;

  const { data, isLoading, isFetching } = useGetSalesQuery({
    page,
    limit,
    sort,
    customer: customerFilter?.id,
    startDate: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    endDate: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [viewingSaleId, setViewingSaleId] = useState<string | null>(null);

  const sales = data?.result ?? [];
  const meta = data?.meta;

  const hasFilters = Boolean(customerFilter || dateRange.from || dateRange.to);
  const clearFilters = () => {
    setCustomerFilter(null);
    setDateRange({});
    setPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#F2F3F3] p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-[#16191F]">Sales</h1>
        <p className="text-[13px] text-[#545B64]">
          {meta ? `${meta.total} sales recorded` : "Every total confirmed server-side at checkout"}
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-64">
          <CustomerPicker
            value={customerFilter?.id ?? ""}
            onChange={(id, label) => {
              setCustomerFilter({ id, label });
              setPage(1);
            }}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-[13px] font-normal">
              <CalendarIcon className="mr-2 h-4 w-4 text-[#879596]" />
              {dateRange.from
                ? dateRange.to
                  ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`
                  : format(dateRange.from, "MMM d, yyyy")
                : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range ?? {});
                setPage(1);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select
          value={sort}
          onValueChange={(v) => {
            setSort(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48 bg-white text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-[12px] text-[#545B64]">
            <X className="mr-1 h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}

        <div className="flex-1" />

        {canCreateSale && (
          <Button onClick={() => setFormOpen(true)} className="bg-[#FF9900] text-[#16191F] hover:bg-[#EC7211]">
            <Plus className="mr-1.5 h-4 w-4" />
            New Sale
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-[4px] border border-[#D5DBDB] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#EAEDED]">
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">Date</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">Customer</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">Processed By</TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-wide text-[#545B64]">Items</TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-wide text-[#545B64]">Total</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-[13px] text-[#879596]">
                  No sales found for the current filters.
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => {
                const customer = typeof sale.customer === "object" ? sale.customer : null;
                const createdBy = typeof sale.createdBy === "object" ? sale.createdBy : null;
                return (
                  <TableRow key={sale._id} className="border-t border-[#EAEDED]">
                    <TableCell className="text-[13px] text-[#545B64]">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-[13px] text-[#16191F]">{customer?.name ?? "—"}</TableCell>
                    <TableCell className="text-[13px] text-[#545B64]">{createdBy?.name ?? "—"}</TableCell>
                    <TableCell className="text-right text-[13px] text-[#545B64]">{sale.products.length}</TableCell>
                    <TableCell className="text-right font-mono text-[13px] font-bold text-[#16191F]">
                      ${sale.grandTotal.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewingSaleId(sale._id)}
                      >
                        <Eye className="h-4 w-4 text-[#545B64]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-[13px] text-[#545B64]">
          <span>Page {meta.page} of {meta.totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {canCreateSale && <SaleFormDialog open={formOpen} onOpenChange={setFormOpen} />}
      <SaleDetailDialog saleId={viewingSaleId} onOpenChange={(open) => !open && setViewingSaleId(null)} />
    </div>
  );
}