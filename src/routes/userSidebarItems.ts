// import CategoryPage from "@/pages/dashboard/User/CategoryPage";
// import { InsightPage } from "@/pages/dashboard/User/InsightPage";
// import Overview from "@/pages/dashboard/User/Overview";
// import PrivacyPage from "@/pages/dashboard/User/PrivacyPage";
// import ProfilePage from "@/pages/dashboard/User/ProfilePage";
// import RecurringPage from "@/pages/dashboard/User/RecurringPage";
// import SettingsPage from "@/pages/dashboard/User/SettingsPage";
// import TransactionPage from "@/pages/dashboard/User/TransactionPage";
// import { ISidebarItem } from "@/types";

// export const userSidebarItems: ISidebarItem[] = [
//   {
//     title: "Dashboard",
//     items: [
//       {
//         title: "Overview",
//         url: "/user/overview",
//         component: Overview,
//       },
//       {
//         title: "Categories",
//         url: "/user/categories",
//         component: CategoryPage,
//       },
//       {
//         title: "Transactions",
//         url: "/user/transactions",
//         component: TransactionPage,
//       },
//       {
//         title: "Recurring Transactions",
//         url: "/user/recurring",
//         component: RecurringPage,
//       },
//       {
//         title: "Insights",
//         url: "/user/insights",
//         component: InsightPage,
//       },
//     ],
//   },
//   {
//     title: "Account Management",
//     items: [
//       {
//         title: "Profile",
//         url: "/user/profile",
//         component: ProfilePage,
//       },
//       {
//         title: "Settings",
//         url: "/user/settings",
//         component: SettingsPage,
//       },
//       {
//         title: "Privacy",
//         url: "/user/privacy",
//         component: PrivacyPage,
//       },
//     ],
//   },
// ];
// utils/getSidebarItems.ts
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  UserCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import DashboardPage from "@/pages/dashboard/User/DashboardPage";
import ProductsPage from "@/pages/dashboard/User/ProductsPage";
import SalesPage from "@/pages/dashboard/User/SalesPage";
import CustomersPage from "@/pages/dashboard/User/CustomersPage";
import InsightsPage from "@/pages/dashboard/User/InsightsPage";
import PrivacyPage from "@/pages/dashboard/User/PrivacyPage";
import ProfilePage from "@/pages/dashboard/User/ProfilePage";
import SettingsPage from "@/pages/dashboard/User/SettingsPage";
import { ISidebarItem } from "@/types";


export const userSidebarItems: ISidebarItem[] = [
  {
    title: "Operations",
    items: [
      {
        title: "Dashboard",
        url: "/user/dashboard",
        component: DashboardPage,
        icon: LayoutDashboard,
      },
      {
        title: "Products",
        url: "/user/products",
        component: ProductsPage,
        icon: Package,
      },
      {
        title: "Sales",
        url: "/user/sales",
        component: SalesPage,
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        url: "/user/customers",
        component: CustomersPage,
        icon: Users,
      },
      {
        title: "Insights",
        url: "/user/insights",
        component: InsightsPage,
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        url: "/user/profile",
        component: ProfilePage,
        icon: UserCircle,
      },
      {
        title: "Settings",
        url: "/user/settings",
        component: SettingsPage,
        icon: Settings,
      },
      {
        title: "Privacy",
        url: "/user/privacy",
        component: PrivacyPage,
        icon: ShieldCheck,
      },
    ],
  },
];