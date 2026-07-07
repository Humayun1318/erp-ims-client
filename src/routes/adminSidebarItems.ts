
import { ISidebarItem } from "@/types";
import { lazy } from "react";
import { BarChart3, Package, Users2, Receipt, Users } from "lucide-react";



// Shared modules — same page component every role uses; each page internally
// checks the user's role to show/hide Create/Edit/Delete actions.
const AnalyticsPage = lazy(() => import("@/pages/dashboard/shared/AnalyticsPage"));
const ProductsPage = lazy(() => import("@/pages/dashboard/shared/ProductsPage"));
const CustomersPage = lazy(() => import("@/pages/dashboard/shared/CustomersPage"));
const SalesPage = lazy(() => import("@/pages/dashboard/shared/SalePage"));

// Admin-only pages — these have no equivalent for Manager/Employee.
const AllUsersPage = lazy(() => import("@/pages/dashboard/Admin/AllUsersPage"));


// Admin permissions (backend): full access — every shared module plus
// User Management and system-level Automation/Analytics.
export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/admin/analytics", component: AnalyticsPage, icon: BarChart3 },
      // { title: "ERP Analytics", url: "/admin/analytics", component: AnalyticsPage, icon: BarChart3 },
    ],
  },
  {
    title: "Inventory",
    items: [
      { title: "Products", url: "/admin/products", component: ProductsPage, icon: Package },
    ],
  },
  {
    title: "Customers & Sales",
    items: [
      { title: "Customers", url: "/admin/customers", component: CustomersPage, icon: Users2 },
      { title: "Sales", url: "/admin/sales", component: SalesPage, icon: Receipt },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "User Management", url: "/admin/all-users", component: AllUsersPage, icon: Users },
    ],
  },
];