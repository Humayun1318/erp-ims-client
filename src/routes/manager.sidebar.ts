import { ISidebarItem } from "@/types";
import { lazy } from "react";
import { BarChart3, Package, Users2, Receipt } from "lucide-react";

const DashboardPage = lazy(() => import("@/pages/dashboard/shared/DashboardPage"));
const ProductsPage = lazy(() => import("@/pages/dashboard/shared/ProductsPage"));
const CustomersPage = lazy(() => import("@/pages/dashboard/shared/CustomersPage"));
const SalesPage = lazy(() => import("@/pages/dashboard/shared/SalePage"));

// Manager permissions (backend): Manage Products, Manage Customers,
// Create Sales, view Dashboard. No User Management, no Automation/Analytics.
export const managerSidebarItems: ISidebarItem[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/manager/dashboard", component: DashboardPage, icon: BarChart3 },
    ],
  },
  {
    title: "Inventory",
    items: [
      { title: "Products", url: "/manager/products", component: ProductsPage, icon: Package },
    ],
  },
  {
    title: "Customers & Sales",
    items: [
      { title: "Customers", url: "/manager/customers", component: CustomersPage, icon: Users2 },
      { title: "Sales", url: "/manager/sales", component: SalesPage, icon: Receipt },
    ],
  },
];