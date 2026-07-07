import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  sku: z.string().min(2, "SKU must be at least 2 characters").max(40),
  category: z.string().min(2, "Category must be at least 2 characters").max(60),
  purchasePrice: z.coerce.number().nonnegative("Must be 0 or greater"),
  sellingPrice: z.coerce.number().nonnegative("Must be 0 or greater"),
  stockQuantity: z.coerce.number().int().nonnegative("Must be 0 or greater"),
});

// Input = what the form fields hold before coercion (RHF's TFieldValues)
// Output = what you get in onSubmit after zod parses it (RHF's TTransformedValues)
export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;