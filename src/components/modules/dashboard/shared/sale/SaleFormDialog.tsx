import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SaleFormInput, saleFormSchema, SaleFormValues } from "@/validations/sale.validation";
import { useCreateSaleMutation } from "@/redux/features/sale/sale.api";
import CustomerPicker from "../customer/CustomerPicker";
import ProductPicker from "../product/ProductPicker";

interface SaleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: SaleFormInput = {
  customer: "",
  products: [{ product: "", quantity: 1 }],
};

export default function SaleFormDialog({ open, onOpenChange }: SaleFormDialogProps) {
  const form = useForm<SaleFormInput, any, SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "products" });

  // Client-side preview only — unitPrice/grandTotal are always recomputed server-side.
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const watchedProducts = form.watch("products");

  const [createSale, { isLoading }] = useCreateSaleMutation();

  const previewTotal = watchedProducts.reduce((sum, line) => {
    const price = priceMap[line.product] ?? 0;
    const qty = Number(line.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(defaultValues);
      setPriceMap({});
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: SaleFormValues) => {
    try {
      await createSale(values).unwrap();
      toast.success("Sale recorded successfully");
      handleClose(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create sale");
    }
  };

  const selectedProductIds = watchedProducts.map((p) => p.product).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#16191F]">New Sale</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] text-[#545B64]">Customer</FormLabel>
                  <FormControl>
                    <CustomerPicker value={field.value} onChange={(id) => field.onChange(id)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#545B64]">Products</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => append({ product: "", quantity: 1 })}
                  className="h-7 text-[12px] text-[#0073BB] hover:text-[#005276]"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add product
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2 rounded-[4px] border border-[#D5DBDB] p-2">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`products.${index}.product`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <ProductPicker
                              value={f.value}
                              excludeIds={selectedProductIds}
                              onChange={(id, _label, _stock, sellingPrice) => {
                                f.onChange(id);
                                setPriceMap((prev) => ({ ...prev, [id]: sellingPrice }));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-20">
                    <FormField
                      control={form.control}
                      name={`products.${index}.quantity`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              name={f.name}
                              ref={f.ref}
                              value={f.value as unknown as string}
                              onChange={(e) => f.onChange(e.target.value)}
                              onBlur={f.onBlur}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-0.5 h-9 w-9 shrink-0 text-[#E74C3C] hover:text-[#c0392b]"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {form.formState.errors.products?.root && (
                <p className="text-[12px] text-[#E74C3C]">{form.formState.errors.products.root.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-[4px] bg-[#F2F3F3] px-3 py-2">
              <span className="text-[12px] text-[#545B64]">Estimated total</span>
              <span className="font-mono text-[14px] font-bold text-[#16191F]">${previewTotal.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-[#879596]">
              Final total, unit prices, and stock availability are confirmed by the server at checkout.
            </p>

            <DialogFooter className="mt-1">
              <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-[#FF9900] text-[#16191F] hover:bg-[#EC7211]">
                {isLoading ? "Recording..." : "Record Sale"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}