import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBlockers } from '../hooks/useBlockers';
import BlockerCard from '../components/blockers/BlockerCard';
import CreateBlockerModal from '../components/blockers/CreateBlockerModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BlockerCategory, BlockerSeverity, BlockerStatus } from '../types';

export default function BlockersPage() {
  const { user } = useAuth();
  const { blockers, isLoading, total, loadMyBlockers, addBlocker, editBlocker } =
    useBlockers();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [category, setCategory] = useState<BlockerCategory | ''>('');
  const [severity, setSeverity] = useState<BlockerSeverity | ''>('');
  const [status, setStatus] = useState<BlockerStatus | ''>('');

  useEffect(() => {
    const params: Record<string, string | number> = { limit: 50 };
    if (category) params.category = category;
    if (severity) params.severity = severity;
    if (status) params.status = status;
    loadMyBlockers(params);
  }, [loadMyBlockers, category, severity, status]);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await editBlocker(id, { status: newStatus });
  };

  const clearFilters = () => {
    setCategory('');
    setSeverity('');
    setStatus('');
  };

  const hasFilters = category || severity || status;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            My Blockers
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            {total} blocker{total !== 1 ? 's' : ''} total
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-accent">
          + Report Blocker
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs text-[var(--color-text-secondary)] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BlockerCategory | '')}
              className="select"
            >
              <option value="">All Categories</option>
              <option value="Process">Process</option>
              <option value="Technical">Technical</option>
              <option value="Dependency">Dependency</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[var(--color-text-secondary)] mb-1">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as BlockerSeverity | '')}
              className="select"
            >
              <option value="">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[var(--color-text-secondary)] mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BlockerStatus | '')}
              className="select"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
              <option value="Ignored">Ignored</option>
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="btn-secondary text-sm mt-5"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Blockers List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : blockers.length === 0 ? (
        <div className="card text-center py-12">
          <span className="text-4xl mb-4 block">🔍</span>
          <h3 className="text-lg font-medium text-white mb-2">
            {hasFilters ? 'No blockers match your filters' : 'No blockers yet'}
          </h3>
          <p className="text-[var(--color-text-secondary)] mb-4">
            {hasFilters
              ? 'Try adjusting your filters or clear them to see all blockers.'
              : "Report any productivity blockers as they arise."}
          </p>
          {hasFilters ? (
            <button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Report Your First Blocker
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {blockers.map((blocker, index) => (
            <div
              key={blocker.uid}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <BlockerCard
                blocker={blocker}
                onStatusChange={handleStatusChange}
              />
            </div>
          ))}
        </div>
      )}

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

