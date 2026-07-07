import { z } from "zod";

export const customerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(6, "Phone must be at least 6 characters").max(20),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  address: z.string().max(250).optional().or(z.literal("")),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;