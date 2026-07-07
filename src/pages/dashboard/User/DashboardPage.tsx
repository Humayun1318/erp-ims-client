
import BalanceTrendChart from "@/components/modules/dashboard/user/overview/BalanceTrendChart";
import OverviewCards from "@/components/modules/dashboard/user/overview/OverviewCards";
import SpendingBreakdownChart from "@/components/modules/dashboard/user/overview/SpendingBreakdownChart";
import { Link } from "react-router";

export default function DashboardPage() {
 
  return (
    <>
      <OverviewCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <Link
          to="/user/sales"
          className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/70 hover:bg-primary/5"
        >
          <p className="text-sm font-semibold text-foreground">Open Sales</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Review the latest sales activity and order entries.
          </p>
        </Link>
        <Link
          to="/user/insights"
          className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/70 hover:bg-primary/5"
        >
          <p className="text-sm font-semibold text-foreground">Open Insights</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Analyze stock movement and operational trends.
          </p>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time-based chart - takes 2/3 of the space on large screens */}
        <BalanceTrendChart/>
        
        {/* Categorical chart - takes 1/3 of the space */}
        <SpendingBreakdownChart />
     </div>
    </>
  );
}