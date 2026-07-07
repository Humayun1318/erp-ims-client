import { ISidebarItem } from "@/types";
import { lazy } from "react";
import { Package,Users2, Receipt } from "lucide-react";


const ProductsPage = lazy(() => import("@/pages/dashboard/shared/ProductsPage"));
const CustomersPage = lazy(() => import("@/pages/dashboard/shared/CustomersPage"));
const SalesPage = lazy(() => import("@/pages/dashboard/shared/SalePage"));

// Employee permissions (backend): View Products (read-only), View Customers
// (read-only — needed only to attach one to a sale), Create Sales.
// No Dashboard route — Dashboard API is Admin/Manager only on the backend,
// so there's nothing here for an Employee to view.
export const employeeSidebarItems: ISidebarItem[] = [
  {
    title: "Catalog",
    items: [
      { title: "Products", url: "/employee/products", component: ProductsPage, icon: Package },
    ],
  },
  {
    title: "Point of Sale",
    items: [
      { title: "Customers", url: "/employee/customers", component: CustomersPage, icon: Users2 },
      { title: "Sales", url: "/employee/sales", component: SalesPage, icon: Receipt },
    ],
  },
];