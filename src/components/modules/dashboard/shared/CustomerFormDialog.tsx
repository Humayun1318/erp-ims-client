import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { ICustomer } from "@/types/customer.types";
import { customerFormSchema, CustomerFormValues } from "@/validations/customer.validation";
import { useCreateCustomerMutation, useUpdateCustomerMutation } from "@/redux/features/customer/customer.picker.api";


interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: ICustomer | null; // presence = edit mode
}

const defaultValues: CustomerFormValues = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

export default function CustomerFormDialog({ open, onOpenChange, customer }: CustomerFormDialogProps) {
  const isEdit = Boolean(customer);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues,
  });

  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;
    form.reset(
      customer
        ? {
            name: customer.name,
            phone: customer.phone,
            email: customer.email ?? "",
            address: customer.address ?? "",
          }
        : defaultValues,
    );
  }, [customer, open, form]);

  const onSubmit = async (values: CustomerFormValues) => {
    // Strip empty optional strings so PATCH doesn't overwrite existing values with "".
    const payload = {
      name: values.name,
      phone: values.phone,
      ...(values.email ? { email: values.email } : {}),
      ...(values.address ? { address: values.address } : {}),
    };

    try {
      if (isEdit && customer) {
        await updateCustomer({ id: customer._id, payload }).unwrap();
        toast.success("Customer updated");
      } else {
        await createCustomer(payload as any).unwrap();
        toast.success("Customer created");
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
            {isEdit ? "Edit Customer" : "Add Customer"}
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

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] text-[#545B64]">Phone</FormLabel>
                  <FormControl>
                    <Input {...field} className="font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] text-[#545B64]">
                    Email <span className="text-[#879596]">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] text-[#545B64]">
                    Address <span className="text-[#879596]">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FF9900] text-[#16191F] hover:bg-[#EC7211]"
              >
                {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Customer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}