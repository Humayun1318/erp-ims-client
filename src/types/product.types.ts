export interface IProduct {
  _id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  images: string[]; // Cloudinary secure_urls, multiple
  createdAt: string;
  updatedAt: string;
}

export interface IProductQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface IProductListResponse {
  meta: { page: number; limit: number; total: number; totalPages: number };
  result: IProduct[];
}

export interface IProductQueryParams {
  searchTerm?: string;
  category?: string;
  minSellingPrice?: number;
  maxSellingPrice?: number;
  minPurchasePrice?: number;
  maxPurchasePrice?: number;
  minStock?: number;
  maxStock?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export const PRODUCT_SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "name", label: "Name: A to Z" },
  { value: "-name", label: "Name: Z to A" },
  { value: "category", label: "Category: A to Z" },
  { value: "-sellingPrice", label: "Selling price: high to low" },
  { value: "sellingPrice", label: "Selling price: low to high" },
  { value: "-purchasePrice", label: "Purchase price: high to low" },
  { value: "purchasePrice", label: "Purchase price: low to high" },
  { value: "-stockQuantity", label: "Stock: high to low" },
  { value: "stockQuantity", label: "Stock: low to high" },
] as const;