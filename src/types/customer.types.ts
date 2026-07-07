export interface ICustomer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomerQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ICustomerListResponse {
  meta: { page: number; limit: number; total: number; totalPages: number };
  result: ICustomer[];
}