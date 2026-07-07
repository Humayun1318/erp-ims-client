const routeTitleMap: Record<string, string> = {
  dashboard: "ERP Dashboard",
  sales: "Sales Overview",
  insights: "Inventory Insights",
  products: "Products",
  customers: "Customers",
  profile: "Profile",
  settings: "Settings",
  privacy: "Privacy",
  analytics: "ERP Analytics",
  "all-users": "User Management",
  "corn-job": "System Operations",
};

export const getDashboardPageTitle = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const page = segments[1] || "overview";

  return routeTitleMap[page] || "Dashboard";
};