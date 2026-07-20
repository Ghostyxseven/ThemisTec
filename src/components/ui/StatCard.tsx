import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  iconBgClass?: string;
  label: string;
  value: string | number;
  loading?: boolean;
  href?: string;
  badge?: React.ReactNode;
}

export function StatCard({ icon, iconBgClass = "bg-blue-50 text-blue-600", label, value, loading, href, badge }: StatCardProps): React.JSX.Element {
  return (
    <div className="stat-card group">
      <div className="flex items-center justify-between mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBgClass} transition-colors`}>
          {icon}
        </div>
        {href && (
          <Link href={href} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors opacity-0 group-hover:opacity-100">
            Ver <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        {loading ? (
          <div className="skeleton h-8 w-16" />
        ) : (
          <>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
            {badge}
          </>
        )}
      </div>
    </div>
  );
}
