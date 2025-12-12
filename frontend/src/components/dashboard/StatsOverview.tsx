import { BlockerStats } from '../../types';
import StatCard from '../common/StatCard';

interface StatsOverviewProps {
  stats: BlockerStats | null;
  isLoading?: boolean;
}

export default function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card animate-pulse">
            <div className="w-8 h-8 bg-white/10 rounded-lg mb-2" />
            <div className="w-16 h-8 bg-white/10 rounded mb-2" />
            <div className="w-24 h-4 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon="🚧"
        value={stats.total}
        label="Total Blockers"
        className="animate-slide-up"
      />
      <StatCard
        icon="🔴"
        value={stats.byStatus.Open}
        label="Open Blockers"
        className="animate-slide-up animate-delay-100"
      />
      <StatCard
        icon="⚠️"
        value={stats.bySeverity.High}
        label="High Severity"
        className="animate-slide-up animate-delay-200"
      />
      <StatCard
        icon="✅"
        value={stats.byStatus.Resolved}
        label="Resolved"
        className="animate-slide-up animate-delay-300"
      />
    </div>
  );
}

