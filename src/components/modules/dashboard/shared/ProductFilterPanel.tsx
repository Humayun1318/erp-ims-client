import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { emptyProductFilters, ProductFilterInput, productFilterSchema, ProductFilterValues } from "@/validations/product.filter.validation";


interface ProductFilterPanelProps {
  activeFilters: ProductFilterValues;
  onApply: (filters: ProductFilterValues) => void;
  onReset: () => void;
}

// One reusable min/max row — used for all three ranges, keeps the form dense
// and consistent (AWS's own "no wasted pixels" principle from design.md).
function RangeRow({
  control,
  minName,
  maxName,
  label,
  prefix,
}: {
  control: any;
  minName: keyof ProductFilterInput;
  maxName: keyof ProductFilterInput;
  label: string;
  prefix?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <span className="text-[12px] font-bold uppercase tracking-wide text-[#545B64] dark:text-[#9CA6AF]">
        {label}
      </span>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={control}
          name={minName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  {prefix && (
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-[#879596] dark:text-[#6B7680]">
                      {prefix}
                    </span>
                  )}
                  <Input
                    type="number"
                    min={0}
                    placeholder="Min"
                    className={prefix ? "pl-6" : undefined}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={maxName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  {prefix && (
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-[#879596] dark:text-[#6B7680]">
                      {prefix}
                    </span>
                  )}
                  <Input
                    type="number"
                    min={0}
                    placeholder="Max"
                    className={prefix ? "pl-6" : undefined}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default function ProductFilterPanel({ activeFilters, onApply, onReset }: ProductFilterPanelProps) {
  const form = useForm<ProductFilterInput, any, ProductFilterValues>({
    resolver: zodResolver(productFilterSchema),
    defaultValues: emptyProductFilters,
  });

  // Keep the popover's form in sync if filters were cleared/changed elsewhere
  // (e.g. removing a chip from the active-filters row on the page itself).
  useEffect(() => {
    form.reset({
      category: activeFilters.category ?? "",
      minSellingPrice: activeFilters.minSellingPrice ?? "",
      maxSellingPrice: activeFilters.maxSellingPrice ?? "",
      minPurchasePrice: activeFilters.minPurchasePrice ?? "",
      maxPurchasePrice: activeFilters.maxPurchasePrice ?? "",
      minStock: activeFilters.minStock ?? "",
      maxStock: activeFilters.maxStock ?? "",
    });
  }, [activeFilters, form]);

  const activeCount = Object.values(activeFilters).filter(
    (v) => v !== undefined && v !== "" && v !== null,
  ).length;

  const handleSubmit = (values: ProductFilterValues) => {
    onApply(values);
  };

  const handleReset = () => {
    form.reset(emptyProductFilters);
    onReset();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="relative gap-2 bg-white text-[13px] dark:border-[#2A323C] dark:bg-[#161B22] dark:text-[#E6E9EC] dark:hover:bg-[#1D232C]"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#879596] dark:text-[#9CA6AF]" />
          Filters
          {activeCount > 0 && (
            <Badge className="ml-1 h-5 min-w-5 justify-center rounded-full bg-[#FF9900] px-1 text-[11px] font-bold text-[#16191F] hover:bg-[#FF9900]">
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 border-[#D5DBDB] bg-white p-4 dark:border-[#2A323C] dark:bg-[#161B22]"
        align="start"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold uppercase tracking-wide text-[#545B64] dark:text-[#9CA6AF]">
                    Category
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Electronics" {...field} />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <RangeRow
              control={form.control}
              minName="minSellingPrice"
              maxName="maxSellingPrice"
              label="Selling Price"
              prefix="$"
            />
            <RangeRow
              control={form.control}
              minName="minPurchasePrice"
              maxName="maxPurchasePrice"
              label="Purchase Price"
              prefix="$"
            />
            <RangeRow
              control={form.control}
              minName="minStock"
              maxName="maxStock"
              label="Stock Quantity"
            />

            <div className="mt-1 flex items-center justify-between border-t border-[#EAEDED] pt-3 dark:border-[#222830]">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 text-[12px] text-[#545B64] dark:text-[#9CA6AF]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#FF9900] text-[#16191F] hover:bg-[#EC7211]"
              >
                Apply Filters
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}