interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-center justify-between w-full">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

