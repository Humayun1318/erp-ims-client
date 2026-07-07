import { z } from "zod";

const saleLineItemSchema = z.object({
  product: z.string().min(1, "Select a product"),
  quantity: z.coerce.number().int().positive("Must be at least 1"),
});

export const saleFormSchema = z.object({
  customer: z.string().min(1, "Select a customer"),
  products: z
    .array(saleLineItemSchema)
    .min(1, "Add at least one product")
    .refine(
      (items) => new Set(items.map((i) => i.product)).size === items.length,
      { message: "Each product can only appear once — adjust quantity instead" },
    ),
});

export type SaleFormInput = z.input<typeof saleFormSchema>;
export type SaleFormValues = z.output<typeof saleFormSchema>;