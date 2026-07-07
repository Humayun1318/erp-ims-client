import { ISidebarItem } from "@/types";
import { lazy } from "react";
import {
  Users,
  Flame,
  BarChart3,
} from "lucide-react";

const AnalyticsPage = lazy(() => import("@/pages/dashboard/Admin/AnalyticsPage"));
const AllUsersPage = lazy(() => import("@/pages/dashboard/Admin/AllUsersPage"));
const CornJobPage = lazy(() => import("@/pages/dashboard/Admin/CornJobPage"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Operations",
    items: [
      {
        title: "ERP Analytics",
        url: "/admin/analytics",
        component: AnalyticsPage,
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "User Management",
        url: "/admin/all-users",
        component: AllUsersPage,
        icon: Users,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Automation",
        url: "/admin/corn-job",
        component: CornJobPage,
        icon: Flame,
      },
    ],
  },
];