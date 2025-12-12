import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBlockers } from '../hooks/useBlockers';
import StatsOverview from '../components/dashboard/StatsOverview';
import TrendChart from '../components/dashboard/TrendChart';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import BlockerCard from '../components/blockers/BlockerCard';
import CreateBlockerModal from '../components/blockers/CreateBlockerModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    blockers,
    stats,
    isLoading,
    loadMyBlockers,
    loadMyStats,
    addBlocker,
    editBlocker,
  } = useBlockers();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadMyBlockers({ limit: 5 });
    loadMyStats();
  }, [loadMyBlockers, loadMyStats]);

  const handleCreateBlocker = async (data: {
    description: string;
    category: string;
    severity: string;
  }) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addBlocker({
        teamMemberUid: user.uid,
        ...data,
      });
      setShowCreateModal(false);
      loadMyStats();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    await editBlocker(id, { status });
    loadMyStats();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Here's an overview of your productivity blockers
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-accent">
          + Report Blocker
        </button>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} isLoading={isLoading} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.weeklyTrend && stats.weeklyTrend.length > 0 && (
          <TrendChart data={stats.weeklyTrend} title="Your Weekly Blocker Trend" />
        )}
        {stats?.byCategory && (
          <CategoryBreakdown data={stats.byCategory} />
        )}
      </div>

      {/* Recent Blockers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold text-white">
            Recent Blockers
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : blockers.length === 0 ? (
          <div className="card text-center py-12">
            <span className="text-4xl mb-4 block">🎉</span>
            <h3 className="text-lg font-medium text-white mb-2">
              No blockers yet!
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              You're doing great! Report any productivity blockers as they arise.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Report Your First Blocker
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {blockers.map((blocker) => (
              <BlockerCard
                key={blocker.uid}
                blocker={blocker}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Blocker Modal */}
      <CreateBlockerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBlocker}
        isLoading={isSubmitting}
      />
    </div>
  );
}

