import { z } from "zod";

// Empty strings from number inputs must become `undefined`, not 0 —
// z.coerce.number() on "" silently evaluates to 0, which would incorrectly
// look like an active "min 0" filter. Preprocess strips that ambiguity.
const optionalNonNegativeNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().min(0, "Must be 0 or greater").optional(),
);

const optionalNonNegativeInt = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().int().min(0, "Must be 0 or greater").optional(),
);

export const productFilterSchema = z
  .object({
    category: z.string().trim().optional(),
    minSellingPrice: optionalNonNegativeNumber,
    maxSellingPrice: optionalNonNegativeNumber,
    minPurchasePrice: optionalNonNegativeNumber,
    maxPurchasePrice: optionalNonNegativeNumber,
    minStock: optionalNonNegativeInt,
    maxStock: optionalNonNegativeInt,
  })
  .refine(
    (d) => d.minSellingPrice === undefined || d.maxSellingPrice === undefined || d.minSellingPrice <= d.maxSellingPrice,
    { path: ["maxSellingPrice"], message: "Max must be ≥ min" },
  )
  .refine(
    (d) => d.minPurchasePrice === undefined || d.maxPurchasePrice === undefined || d.minPurchasePrice <= d.maxPurchasePrice,
    { path: ["maxPurchasePrice"], message: "Max must be ≥ min" },
  )
  .refine(
    (d) => d.minStock === undefined || d.maxStock === undefined || d.minStock <= d.maxStock,
    { path: ["maxStock"], message: "Max must be ≥ min" },
  );

export type ProductFilterInput = z.input<typeof productFilterSchema>;
export type ProductFilterValues = z.output<typeof productFilterSchema>;

export const emptyProductFilters: ProductFilterInput = {
  category: "",
  minSellingPrice: "",
  maxSellingPrice: "",
  minPurchasePrice: "",
  maxPurchasePrice: "",
  minStock: "",
  maxStock: "",
};