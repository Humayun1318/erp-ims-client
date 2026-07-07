import { useEffect, useState } from "react";
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useDeleteCustomerMutation, useGetCustomersQuery } from "@/redux/features/customer/customer.picker.api";
import CustomerFormDialog from "@/components/modules/dashboard/shared/CustomerFormDialog";
import { ICustomer } from "@/types/customer.types";


export default function CustomersPage() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const role = userInfo?.data?.role;
  // Employee has read-only access — needed only to attach a customer to a sale.
  const canManage = role === "ADMIN" || role === "MANAGER";

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetCustomersQuery({
    searchTerm: searchTerm || undefined,
    page,
    limit,
  });

  const [deleteCustomer] = useDeleteCustomerMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<ICustomer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ICustomer | null>(null);

  const openCreate = () => {
    setEditingCustomer(null);
    setFormOpen(true);
  };

  const openEdit = (customer: ICustomer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCustomer(deleteTarget._id).unwrap();
      toast.success(`"${deleteTarget.name}" deleted`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete customer");
    } finally {
      setDeleteTarget(null);
    }
  };

  const customers = data?.result ?? [];
  const meta = data?.meta;

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#F2F3F3] p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-[#16191F]">Customers</h1>
        <p className="text-[13px] text-[#545B64]">
          {meta ? `${meta.total} customers on file` : "Manage your customer directory"}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#879596]" />
          <Input
            placeholder="Search by name, phone, or email"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-white pl-9"
          />
        </div>

        {canManage && (
          <Button onClick={openCreate} className="bg-[#FF9900] text-[#16191F] hover:bg-[#EC7211]">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Customer
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-[4px] border border-[#D5DBDB] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#EAEDED]">
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">Name</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">Phone</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">Email</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">Address</TableHead>
              {canManage && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={canManage ? 5 : 4}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 5 : 4} className="py-10 text-center text-[13px] text-[#879596]">
                  No customers found. {canManage && "Add your first customer to get started."}
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer._id} className="border-t border-[#EAEDED]">
                  <TableCell className="text-[13px] text-[#16191F]">{customer.name}</TableCell>
                  <TableCell className="font-mono text-[12px] text-[#545B64]">{customer.phone}</TableCell>
                  <TableCell className="text-[13px] text-[#545B64]">
                    {customer.email ? (
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-[#879596]" />
                        {customer.email}
                      </span>
                    ) : (
                      <span className="text-[#879596]">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-[13px] text-[#545B64]">
                    {customer.address ? (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#879596]" />
                        {customer.address}
                      </span>
                    ) : (
                      <span className="text-[#879596]">—</span>
                    )}
                  </TableCell>
                  {canManage && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(customer)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(customer)}
                            className="text-[#E74C3C] focus:text-[#E74C3C]"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
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

      {canManage && (
        <CustomerFormDialog open={formOpen} onOpenChange={setFormOpen} customer={editingCustomer} />
      )}

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{deleteTarget?.name}" from the active directory. Their existing sale history is unaffected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-[#E74C3C] hover:bg-[#c0392b]">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}