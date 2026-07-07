import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Boxes, TrendingUp, TrendingDown } from "lucide-react";

import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { ICategory } from "@/types";
import { CategoryTable } from "@/components/modules/dashboard/user/category/CategoryTable";
import { ReusablePagination } from "@/components/ReusablePagination";
import { AddEditCategoryModal } from "@/components/modules/dashboard/user/category/AddEditCategoryModal ";
import { DeleteCategoryModal } from "@/components/modules/dashboard/user/category/DeleteCategoryModal";
import { Input } from "@/components/ui/input";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

export default function CategoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ── Modal states ─────────────────────────────────────────────────────────────

  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ICategory | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ICategory | null>(null);

  // ── Data ─────────────────────────────────────────────────────────────────────

  const { data, isLoading } = useGetAllCategoriesQuery({
    searchTerm: debouncedSearch || undefined,
    sort: "-createdAt",
    isActive: true,
    page: currentPage,
    limit,
  });


  const categories: ICategory[] = Array.isArray(data?.data) ? data.data : [];
  const totalPages: number = data?.meta?.totalPages ?? 1;
  const totalCategories = categories.length;
  const incomeCategories = categories.filter((category) => category.type === "income").length;
  const expenseCategories = categories.filter((category) => category.type === "expense").length;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditTarget(null);
    setAddEditOpen(true);
  };

  const openEdit = (category: ICategory) => {
    setEditTarget(category);
    setAddEditOpen(true);
  };

  const openDelete = (category: ICategory) => {
    setDeleteTarget(category);
    setDeleteOpen(true);
  };

  const closeAddEdit = () => {
    setAddEditOpen(false);
    setEditTarget(null);
  };

  const closeDelete = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  // ── Debounce search ─────────────────────────────────────────────────────────
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 500);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-7xl mx-auto px-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-8 gap-4">
        <div>
          <h1 className="text-xl font-semibold">Inventory & Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize product families, stock categories, and revenue classifications.
          </p>
        </div>
        <Button onClick={openAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Search Field - Under Description */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products or categories..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 pr-4 py-2 w-full"
          />
        </div>
        {searchTerm && (
          <p className="text-xs text-muted-foreground mt-1">
            Searching for: "{searchTerm}"
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Boxes className="h-4 w-4 text-primary" />
              Total Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalCategories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Income Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{incomeCategories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-rose-500" />
              Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{expenseCategories}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="border border-muted rounded-md py-16 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading inventory groups…</p>
        </div>
      ) : (
        <CategoryTable
          data={categories}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <ReusablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddEditCategoryModal
        open={addEditOpen}
        onClose={closeAddEdit}
        editData={editTarget}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        open={deleteOpen}
        onClose={closeDelete}
        categoryId={deleteTarget?._id ?? null}
        categoryName={deleteTarget?.name}
      />
    </div>
  );
}
