export interface IAnalyticsLowStockProduct {
  _id: string;
  name: string;
  sku: string;
  stockQuantity: number;
}

export interface IAnalyticsSummary {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  lowStockProducts: IAnalyticsLowStockProduct[];
}