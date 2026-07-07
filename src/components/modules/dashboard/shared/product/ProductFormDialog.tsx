import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X, ImagePlus } from "lucide-react";
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
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/redux/features/product/product.api";
import { IProduct } from "@/types/product.types";
import { ProductFormInput, productFormSchema, ProductFormValues } from "@/validations/product.validation";


interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: IProduct | null; // presence = edit mode
}

const defaultValues: ProductFormInput = {
  name: "",
  sku: "",
  category: "",
  purchasePrice: 0,
  sellingPrice: 0,
  stockQuantity: 0,
};

export default function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const isEdit = Boolean(product);

  // Images already saved on the product — user can remove any of these.
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // Newly picked files — not uploaded yet, shown via local object URLs.
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const form = useForm<ProductFormInput, any, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;
    form.reset(
      product
        ? {
            name: product.name,
            sku: product.sku,
            category: product.category,
            purchasePrice: product.purchasePrice,
            sellingPrice: product.sellingPrice,
            stockQuantity: product.stockQuantity,
          }
        : defaultValues,
    );
    setExistingImages(product?.images ?? []);
    setNewFiles([]);
    setNewPreviews([]);
  }, [product, open, form]);

  // Clean up object URLs so they don't leak memory.
  useEffect(() => {
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [newPreviews]);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = ""; // allow re-selecting the same file later
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const removeNewFile = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: ProductFormValues) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ ...values, images: existingImages }));
    newFiles.forEach((file) => formData.append("files", file));

    try {
      if (isEdit && product) {
        await updateProduct({ id: product._id, formData }).unwrap();
        toast.success("Product updated");
      } else {
        await createProduct(formData).unwrap();
        toast.success("Product created");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#16191F]">
            {isEdit ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] text-[#545B64]">Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] text-[#545B64]">SKU</FormLabel>
                    <FormControl>
                      <Input {...field} className="font-mono uppercase" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] text-[#545B64]">Category</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] text-[#545B64]">Purchase Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        name={field.name}
                        ref={field.ref}
                        value={field.value as unknown as string}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] text-[#545B64]">Selling Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        name={field.name}
                        ref={field.ref}
                        value={field.value as unknown as string}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] text-[#545B64]">Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        name={field.name}
                        ref={field.ref}
                        value={field.value as unknown as string}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ── Multi-image gallery: existing (removable) + newly picked (removable) ── */}
            <div className="grid gap-2">
              <label className="text-[13px] text-[#545B64]">Product Images</label>

              {(existingImages.length > 0 || newPreviews.length > 0) && (
                <div className="grid grid-cols-4 gap-2">
                  {existingImages.map((url) => (
                    <div key={url} className="group relative aspect-square overflow-hidden rounded-[4px] border border-[#D5DBDB]">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#16191F]/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {newPreviews.map((url, i) => (
                    <div key={url} className="group relative aspect-square overflow-hidden rounded-[4px] border border-[#FF9900]/40">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#16191F]/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 rounded-[2px] bg-[#3498DB] px-1 text-[9px] font-medium text-white">
                        NEW
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <label
                htmlFor="images"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-dashed border-[#D5DBDB] py-3 text-[12px] text-[#545B64] hover:border-[#FF9900] hover:text-[#16191F]"
              >
                <ImagePlus className="h-4 w-4" />
                Add images
              </label>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddFiles}
                className="hidden"
              />
            </div>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FF9900] text-[#16191F] hover:bg-[#EC7211]"
              >
                {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}