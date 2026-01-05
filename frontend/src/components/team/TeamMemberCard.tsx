import { TeamMember, BlockerStats } from '../../types';

interface TeamMemberCardProps {
  member: TeamMember;
  stats?: BlockerStats;
  onClick: () => void;
}

export default function TeamMemberCard({ member, stats, onClick }: TeamMemberCardProps) {
  const openBlockers = stats?.byStatus?.Open || 0;
  const highSeverity = stats?.bySeverity?.High || 0;
  
  return (
    <div 
      onClick={onClick}
      className="card hover:border-primary-500/50 cursor-pointer transition-all duration-200 hover:transform hover:scale-[1.02]"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          {member.profilePic ? (
            <img 
              src={member.profilePic} 
              alt={`${member.firstName} ${member.lastName}`}
              className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
              {member.firstName?.[0]}{member.lastName?.[0]}
            </div>
          )}
          {/* Status indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--color-bg-secondary)] ${
            member.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
          }`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">
            {member.firstName} {member.lastName}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {member.designation || 'Team Member'}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            {member.team}
          </p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-semibold text-white">{stats.total}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Total</p>
            </div>
            <div>
              <p className={`text-lg font-semibold ${openBlockers > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                {openBlockers}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">Open</p>
            </div>
            <div>
              <p className={`text-lg font-semibold ${highSeverity > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {highSeverity}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">High</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick action hint */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)]">
        <span>Click to view details</span>
        <span>→</span>
      </div>
    </div>
  );
}

