export interface ISaleProductEntry {
  product: { _id: string; name: string; sku: string; stockQuantity: number } | string;
  quantity: number;
  unitPrice: number;
}

export interface ISale {
  _id: string;
  customer: { _id: string; name: string; phone: string } | string;
  products: ISaleProductEntry[];
  grandTotal: number;
  createdBy: { _id: string; name: string; role: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface ISaleListResponse {
  meta: { page: number; limit: number; total: number; totalPages: number };
  result: ISale[];
}

export interface ISaleQueryParams {
  customer?: string;
  createdBy?: string;
  startDate?: string; // ISO date — matches backend rangeFilter on createdAt
  endDate?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ICreateSalePayload {
  customer: string;
  products: { product: string; quantity: number }[];
}