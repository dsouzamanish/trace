import { format } from 'date-fns';
import { Blocker } from '../../types';

interface BlockerCardProps {
  blocker: Blocker;
  onStatusChange?: (id: string, status: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export default function BlockerCard({
  blocker,
  onStatusChange,
  showActions = true,
  compact = false,
}: BlockerCardProps) {
  const severityClass = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    High: 'badge-high',
  }[blocker.severity];

  const statusClass = {
    Open: 'badge-open',
    Resolved: 'badge-resolved',
    Ignored: 'badge-ignored',
  }[blocker.status];

  return (
    <div className={`card hover:border-white/10 transition-all duration-200 animate-fade-in ${compact ? 'p-4' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`badge ${severityClass}`}>{blocker.severity}</span>
            <span className={`badge ${statusClass}`}>{blocker.status}</span>
            <span className="badge bg-white/5 text-[var(--color-text-secondary)]">
              {blocker.category}
            </span>
          </div>
          <p className={`text-white ${compact ? 'text-sm line-clamp-2' : 'mb-3'}`}>
            {blocker.description}
          </p>
          {!compact && (
            <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1">
                📅 {format(new Date(blocker.timestamp), 'MMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1">
                via {blocker.reportedVia}
              </span>
            </div>
          )}
          {compact && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              {format(new Date(blocker.timestamp), 'MMM d, yyyy')}
            </p>
          )}
        </div>

        {showActions && blocker.status === 'Open' && (
          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange?.(blocker.uid, 'Resolved')}
              className={`rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors ${compact ? 'p-1.5 text-sm' : 'p-2'}`}
              title="Mark as Resolved"
            >
              ✓
            </button>
            <button
              onClick={() => onStatusChange?.(blocker.uid, 'Ignored')}
              className={`rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors ${compact ? 'p-1.5 text-sm' : 'p-2'}`}
              title="Ignore"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {!compact && blocker.managerNotes && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <span className="text-primary-400">Manager Notes:</span> {blocker.managerNotes}
          </p>
        </div>
      )}
    </div>
  );
}

