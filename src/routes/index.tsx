import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { withAuth } from "@/utils/withAuth";
import { role } from "@/constants/role";
import { TRole } from "@/types";
import Homepage from "@/pages/Homepage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { managerSidebarItems } from "./manager.sidebar";
import { employeeSidebarItems } from "./employee.sidebar";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: Homepage,
        index: true,
      },
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.admin as TRole),
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/analytics" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.manager as TRole),
    path: "/manager",
    children: [
      { index: true, element: <Navigate to="/manager/analytics" /> },
      ...generateRoutes(managerSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.employee as TRole),
    path: "/employee",
    children: [
      { index: true, element: <Navigate to="/employee/products" /> },
      ...generateRoutes(employeeSidebarItems),
    ],
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
  {
    Component: UnauthorizedPage,
    path: "/unauthorized",
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
