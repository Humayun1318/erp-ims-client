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