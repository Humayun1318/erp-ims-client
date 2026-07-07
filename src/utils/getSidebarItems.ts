import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { employeeSidebarItems } from "@/routes/employee.sidebar";
import { managerSidebarItems } from "@/routes/manager.sidebar";
import { TRole } from "@/types";

export const getSidebarItems = (userRole: TRole) => {
  switch (userRole) {
    case role.admin:
      return [...adminSidebarItems];
    case role.manager:
      return [...managerSidebarItems];
    case role.employee:
      return [...employeeSidebarItems];
    default:
      return [];
  }
};
