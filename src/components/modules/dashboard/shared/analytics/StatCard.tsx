import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accentColor: string; // hex, drives the 4px left border
  isLoading?: boolean;
  subtitle?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  accentColor,
  isLoading,
  subtitle,
}: StatCardProps) {
  return (
    <div
      className="flex flex-col gap-2 rounded-[4px] border border-[#D5DBDB] dark:bg-[#0F1720] bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold uppercase tracking-wide text-[#545B64]">
          {label}
        </span>
        <Icon className="h-4 w-4 text-[#879596]" />
      </div>

      {isLoading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <span className="font-mono text-[28px] font-bold leading-none text-[#16191F]">
          {value}
        </span>
      )}

      {subtitle && (
        <span className="text-[11px] text-[#879596]">{subtitle}</span>
      )}
    </div>
  );
}
