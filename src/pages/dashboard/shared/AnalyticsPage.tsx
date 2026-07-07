import { Package, Users2, Receipt, AlertTriangle } from "lucide-react";
import { Navigate } from "react-router";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import StatCard from "../../../components/modules/dashboard/shared/analytics/StatCard";
import LowStockPanel from "../../../components/modules/dashboard/shared/analytics/LowStockPanel";
import { useGetDashboardSummaryQuery } from "@/redux/features/analytics/analytics.api";

export default function AnalyticsPage() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const role = userInfo?.data?.role;

  // Defensive guard — sidebar already hides this route from Employee, but the
  // backend also enforces Admin/Manager-only on /dashboard/summary, so this
  // page should never render for anyone else even via a direct URL.
  const isAuthorized = role === "ADMIN" || role === "MANAGER";

  const { data: summary, isLoading } = useGetDashboardSummaryQuery(undefined, { skip: !isAuthorized });

  if (userInfo && !isAuthorized) {
    return <Navigate to="/" replace />;
  }

  const lowStockCount = summary?.lowStockProducts.length ?? 0;

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#F2F3F3] dark:bg-[#0F1720] p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-[#16191F]">Dashboard</h1>
        <p className="text-[13px] text-[#545B64]">Real-time overview of inventory and sales activity</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Products"
          value={summary?.totalProducts ?? 0}
          icon={Package}
          accentColor="#FF9900"
          isLoading={isLoading}
          subtitle="Active, non-deleted catalog items"
        />
        <StatCard
          label="Total Customers"
          value={summary?.totalCustomers ?? 0}
          icon={Users2}
          accentColor="#0073BB"
          isLoading={isLoading}
          subtitle="Active customer directory"
        />
        <StatCard
          label="Total Sales"
          value={summary?.totalSales ?? 0}
          icon={Receipt}
          accentColor="#1D8348"
          isLoading={isLoading}
          subtitle="All-time recorded sales"
        />
        <StatCard
          label="Low Stock Alerts"
          value={lowStockCount}
          icon={AlertTriangle}
          accentColor={lowStockCount > 0 ? "#F39C12" : "#1D8348"}
          isLoading={isLoading}
          subtitle="Stock below threshold"
        />
      </div>

      <LowStockPanel products={summary?.lowStockProducts ?? []} isLoading={isLoading} />
    </div>
  );
}