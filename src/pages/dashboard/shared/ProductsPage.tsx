// import { useEffect, useState } from "react";
// import { Search, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";
// import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
// import {
//   useGetProductsQuery,
//   useDeleteProductMutation,
// } from "@/redux/features/product/product.api";
// import { IProduct } from "@/types/product.types";
// import ProductFormDialog from "@/components/modules/dashboard/shared/ProductFormDialog";

// const LOW_STOCK_THRESHOLD = 5;

// function stockStatus(qty: number) {
//   if (qty === 0)
//     return {
//       label: "Out of Stock",
//       dot: "bg-[#E74C3C]",
//       text: "text-[#E74C3C]",
//     };
//   if (qty < LOW_STOCK_THRESHOLD)
//     return { label: "Low Stock", dot: "bg-[#F39C12]", text: "text-[#F39C12]" };
//   return { label: "In Stock", dot: "bg-[#1D8348]", text: "text-[#1D8348]" };
// }

// export default function ProductsPage() {
//   // role source — already correct in your last message, keeping it explicit here:
//   const { data: userInfo } = useUserInfoQuery(undefined);
//   const role = userInfo?.data?.role;
//   const canManage = role === "ADMIN" || role === "MANAGER";

//   const [searchInput, setSearchInput] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setSearchTerm(searchInput);
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(timeout);
//   }, [searchInput]);

//   const { data, isLoading, isFetching } = useGetProductsQuery({
//     searchTerm: searchTerm || undefined,
//     page,
//     limit,
//   });

//   const [deleteProduct] = useDeleteProductMutation();

//   const [formOpen, setFormOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
//   const [deleteTarget, setDeleteTarget] = useState<IProduct | null>(null);

//   const openCreate = () => {
//     setEditingProduct(null);
//     setFormOpen(true);
//   };

//   const openEdit = (product: IProduct) => {
//     setEditingProduct(product);
//     setFormOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!deleteTarget) return;
//     try {
//       await deleteProduct(deleteTarget._id).unwrap();
//       toast.success(`"${deleteTarget.name}" deleted`);
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Failed to delete product");
//     } finally {
//       setDeleteTarget(null);
//     }
//   };

//   const products = data?.result ?? [];
//   const meta = data?.meta;

//   return (
//     <div className="flex min-h-screen flex-col gap-6 bg-[#F2F3F3] p-6">
//       <div className="flex flex-col gap-1">
//         <h1 className="text-[24px] font-bold text-[#16191F]">Products</h1>
//         <p className="text-[13px] text-[#545B64]">
//           {meta
//             ? `${meta.total} products in catalog`
//             : "Manage your inventory catalog"}
//         </p>
//       </div>

//       <div className="flex items-center justify-between gap-3">
//         <div className="relative w-full max-w-sm">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#879596]" />
//           <Input
//             placeholder="Search by name, SKU, or category"
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             className="bg-white pl-9"
//           />
//         </div>

//         {canManage && (
//           <Button
//             onClick={openCreate}
//             className="bg-[#FF9900] text-[#16191F] hover:bg-[#EC7211]"
//           >
//             <Plus className="mr-1.5 h-4 w-4" />
//             Add Product
//           </Button>
//         )}
//       </div>

//       <div className="overflow-hidden rounded-[4px] border border-[#D5DBDB] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
//         <Table>
//           <TableHeader>
//             <TableRow className="border-b border-[#EAEDED]">
//               <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">
//                 SKU
//               </TableHead>
//               <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">
//                 Name
//               </TableHead>
//               <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">
//                 Category
//               </TableHead>
//               <TableHead className="text-right text-[11px] font-bold uppercase tracking-wide text-[#545B64]">
//                 Price
//               </TableHead>
//               <TableHead className="text-right text-[11px] font-bold uppercase tracking-wide text-[#545B64]">
//                 Stock
//               </TableHead>
//               <TableHead className="text-left text-[11px] font-bold uppercase tracking-wide text-[#545B64]">
//                 images
//               </TableHead>
//               {canManage && <TableHead className="w-10 text-right text-[11px] font-bold uppercase tracking-wide text-[#545B64]"> Action </TableHead>}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isLoading || isFetching ? (
//               Array.from({ length: 5 }).map((_, i) => (
//                 <TableRow key={i}>
//                   <TableCell colSpan={canManage ? 6 : 5}>
//                     <Skeleton className="h-6 w-full" />
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : products.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={canManage ? 6 : 5}
//                   className="py-10 text-center text-[13px] text-[#879596]"
//                 >
//                   No products found.{" "}
//                   {canManage && "Add your first product to get started."}
//                 </TableCell>
//               </TableRow>
//             ) : (
//               products.map((product) => {
//                 const status = stockStatus(product.stockQuantity);
//                 return (
//                   <TableRow
//                     key={product._id}
//                     className="border-t border-[#EAEDED]"
//                   >
//                     <TableCell className="font-mono text-[12px] text-[#545B64]">
//                       {product.sku}
//                     </TableCell>
//                     <TableCell className="text-[13px] text-[#16191F]">
//                       {product.name}
//                     </TableCell>
//                     <TableCell className="text-[13px] text-[#545B64]">
//                       {product.category}
//                     </TableCell>
//                     <TableCell className="text-right font-mono text-[13px] text-[#16191F]">
//                       ${product.sellingPrice.toFixed(2)}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex items-center justify-end gap-1.5 text-[12px]">
//                         <span
//                           aria-hidden
//                           className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
//                         />
//                         <span className={status.text}>
//                           {product.stockQuantity}
//                         </span>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-[13px] text-[#16191F]">
//                       <div className="flex items-center gap-2">
//                         {product.images.length > 0 ? (
//                           product.images.map((url, idx) => (
//                             <img
//                               key={idx}
//                               src={url}
//                               alt=""
//                               className="h-8 w-8 rounded-[4px] border border-[#D5DBDB] object-cover"
//                             />
//                           ))
//                         ) : (
//                           <div className="h-8 w-8 rounded-[4px] border border-[#D5DBDB] bg-[#F2F3F3]" />
//                         )}
//                         {/* <span>{product.name}</span> */}
//                       </div>
//                     </TableCell>
//                     {canManage && (
//                       <TableCell className="">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 border cursor-pointer"
//                             >
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem onClick={() => openEdit(product)}>
//                               <Pencil className="mr-2 h-3.5 w-3.5" />
//                               Edit
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               onClick={() => setDeleteTarget(product)}
//                               className="text-[#E74C3C] focus:text-[#E74C3C]"
//                             >
//                               <Trash2 className="mr-2 h-3.5 w-3.5" />
//                               Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {meta && meta.totalPages > 1 && (
//         <div className="flex items-center justify-between text-[13px] text-[#545B64]">
//           <span>
//             Page {meta.page} of {meta.totalPages}
//           </span>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               disabled={meta.page <= 1}
//               onClick={() => setPage((p) => p - 1)}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               disabled={meta.page >= meta.totalPages}
//               onClick={() => setPage((p) => p + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}

//       {canManage && (
//         <ProductFormDialog
//           open={formOpen}
//           onOpenChange={setFormOpen}
//           product={editingProduct}
//         />
//       )}

//       <AlertDialog
//         open={Boolean(deleteTarget)}
//         onOpenChange={(open) => !open && setDeleteTarget(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete product?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will remove "{deleteTarget?.name}" from the active catalog.
//               Historical sales that reference it are unaffected.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmDelete}
//               className="bg-[#E74C3C] hover:bg-[#c0392b]"
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Search, Plus, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/redux/features/product/product.api";
import { ProductFilterValues } from "@/validations/product.filter.validation";
import { IProduct, PRODUCT_SORT_OPTIONS } from "@/types/product.types";
import ProductFilterPanel from "@/components/modules/dashboard/shared/ProductFilterPanel";
import ProductFormDialog from "@/components/modules/dashboard/shared/ProductFormDialog";


const LOW_STOCK_THRESHOLD = 5;

function stockStatus(qty: number) {
  if (qty === 0) return { label: "Out of Stock", dot: "bg-[#E74C3C] dark:bg-[#FF6B5B]", text: "text-[#E74C3C] dark:text-[#FF6B5B]" };
  if (qty < LOW_STOCK_THRESHOLD) return { label: "Low Stock", dot: "bg-[#F39C12] dark:bg-[#FFC168]", text: "text-[#F39C12] dark:text-[#FFC168]" };
  return { label: "In Stock", dot: "bg-[#1D8348] dark:bg-[#2ECC71]", text: "text-[#1D8348] dark:text-[#2ECC71]" };
}

// Human-readable labels for the active-filter chip row.
function describeFilter(key: string, value: unknown): string {
  switch (key) {
    case "category": return `Category: ${value}`;
    case "minSellingPrice": return `Selling ≥ $${value}`;
    case "maxSellingPrice": return `Selling ≤ $${value}`;
    case "minPurchasePrice": return `Purchase ≥ $${value}`;
    case "maxPurchasePrice": return `Purchase ≤ $${value}`;
    case "minStock": return `Stock ≥ ${value}`;
    case "maxStock": return `Stock ≤ ${value}`;
    default: return String(value);
  }
}

export default function ProductsPage() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const role = userInfo?.data?.role;
  const canManage = role === "ADMIN" || role === "MANAGER";

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [filters, setFilters] = useState<ProductFilterValues>({});
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetProductsQuery({
    searchTerm: searchTerm || undefined,
    sort,
    page,
    limit,
    ...filters,
  });

  const [deleteProduct] = useDeleteProductMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IProduct | null>(null);

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product: IProduct) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget._id).unwrap();
      toast.success(`"${deleteTarget.name}" deleted`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete product");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleApplyFilters = (values: ProductFilterValues) => {
    setFilters(values);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const removeFilter = (key: keyof ProductFilterValues) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setPage(1);
  };

  const activeFilterEntries = Object.entries(filters).filter(
    ([, v]) => v !== undefined && v !== "" && v !== null,
  );

  const products = data?.result ?? [];
  const meta = data?.meta;

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#F2F3F3] p-6 dark:bg-[#0F1720]">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-[#16191F] dark:text-[#E6E9EC]">Products</h1>
        <p className="text-[13px] text-[#545B64] dark:text-[#9CA6AF]">
          {meta ? `${meta.total} products in catalog` : "Manage your inventory catalog"}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#879596] dark:text-[#6B7680]" />
          <Input
            placeholder="Search by name, SKU, or category"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-white pl-9 dark:border-[#2A323C] dark:bg-[#161B22] dark:text-[#E6E9EC] dark:placeholder:text-[#6B7680]"
          />
        </div>

        <ProductFilterPanel
          activeFilters={filters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        <Select
          value={sort}
          onValueChange={(v) => {
            setSort(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-52 bg-white text-[13px] dark:border-[#2A323C] dark:bg-[#161B22] dark:text-[#E6E9EC]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        {canManage && (
          <Button onClick={openCreate} className="bg-[#FF9900] text-[#16191F] hover:bg-[#EC7211]">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {activeFilterEntries.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilterEntries.map(([key, value]) => (
            <span
              key={key}
              className="flex items-center gap-1.5 rounded-[4px] border border-[#D5DBDB] bg-white px-2.5 py-1 text-[12px] text-[#16191F] dark:border-[#2A323C] dark:bg-[#161B22] dark:text-[#E6E9EC]"
            >
              {describeFilter(key, value)}
              <button
                type="button"
                onClick={() => removeFilter(key as keyof ProductFilterValues)}
                className="text-[#879596] hover:text-[#E74C3C] dark:text-[#6B7680] dark:hover:text-[#FF6B5B]"
                aria-label={`Remove filter: ${key}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[12px] text-[#0073BB] hover:text-[#005276] dark:text-[#4DA8DA] dark:hover:text-[#7EC1E8]"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-[4px] border border-[#D5DBDB] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)] dark:border-[#2A323C] dark:bg-[#161B22] dark:shadow-none">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#EAEDED] dark:border-[#222830]">
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64] dark:text-[#9CA6AF]">SKU</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64] dark:text-[#9CA6AF]">Name</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-[#545B64] dark:text-[#9CA6AF]">Category</TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-wide text-[#545B64] dark:text-[#9CA6AF]">Price</TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-wide text-[#545B64] dark:text-[#9CA6AF]">Stock</TableHead>
              {canManage && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={canManage ? 6 : 5}>
                    <Skeleton className="h-6 w-full dark:bg-[#222830]" />
                  </TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 6 : 5} className="py-10 text-center text-[13px] text-[#879596] dark:text-[#6B7680]">
                  No products match the current search and filters.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const status = stockStatus(product.stockQuantity);
                return (
                  <TableRow key={product._id} className="border-t border-[#EAEDED] dark:border-[#222830]">
                    <TableCell className="font-mono text-[12px] text-[#545B64] dark:text-[#9CA6AF]">{product.sku}</TableCell>
                    <TableCell className="text-[13px] text-[#16191F] dark:text-[#E6E9EC]">
                      <div className="flex items-center gap-2.5">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt="" className="h-8 w-8 rounded-[4px] border border-[#D5DBDB] object-cover dark:border-[#2A323C]" />
                        ) : (
                          <div className="h-8 w-8 rounded-[4px] border border-[#D5DBDB] bg-[#F2F3F3] dark:border-[#2A323C] dark:bg-[#0F1720]" />
                        )}
                        <span>{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-[#545B64] dark:text-[#9CA6AF]">{product.category}</TableCell>
                    <TableCell className="text-right font-mono text-[13px] text-[#16191F] dark:text-[#E6E9EC]">
                      ${product.sellingPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5 text-[12px]">
                        <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        <span className={status.text}>{product.stockQuantity}</span>
                      </div>
                    </TableCell>
                    {canManage && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 dark:hover:bg-[#222830]">
                              <MoreHorizontal className="h-4 w-4 dark:text-[#9CA6AF]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(product)}>
                              <Pencil className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(product)}
                              className="text-[#E74C3C] focus:text-[#E74C3C] dark:text-[#FF6B5B] dark:focus:text-[#FF6B5B]"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-[13px] text-[#545B64] dark:text-[#9CA6AF]">
          <span>Page {meta.page} of {meta.totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => setPage((p) => p - 1)} className="dark:border-[#2A323C] dark:text-[#E6E9EC]">
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} className="dark:border-[#2A323C] dark:text-[#E6E9EC]">
              Next
            </Button>
          </div>
        </div>
      )}

      {canManage && (
        <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} product={editingProduct} />
      )}

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{deleteTarget?.name}" from the active catalog. Historical sales that reference it are unaffected.
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