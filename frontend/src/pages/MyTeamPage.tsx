import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { generateTeamReport, fetchTeamReports } from '../store/slices/aiReportsSlice';
import { teamMembersApi, blockersApi } from '../services/api';
import { TeamMember, BlockerStats, AiReport, ReportPeriod } from '../types';
import TeamMemberCard from '../components/team/TeamMemberCard';
import MemberDetailModal from '../components/team/MemberDetailModal';
import AiReportDetail from '../components/ai-report/AiReportDetail';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface MemberWithStats extends TeamMember {
  stats?: BlockerStats;
}

export default function MyTeamPage() {
  const { user } = useAuth();
  const teamName = user?.team || 'Engineering';
  const dispatch = useDispatch<AppDispatch>();
  
  const { reports: teamReports, isGenerating } = useSelector((state: RootState) => state.aiReports);
  
  const [members, setMembers] = useState<MemberWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedReport, setSelectedReport] = useState<AiReport | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadTeamData();
    dispatch(fetchTeamReports(teamName));
  }, [teamName, dispatch]);

  const loadTeamData = async () => {
    setIsLoading(true);
    try {
      // Fetch team members
      const membersRes = await teamMembersApi.getByTeam(teamName);
      const teamMembers: TeamMember[] = membersRes.data;

      // Fetch stats for each member
      const membersWithStats: MemberWithStats[] = await Promise.all(
        teamMembers.map(async (member) => {
          try {
            const blockersRes = await blockersApi.getByMember(member.uid, { limit: 100 });
            const blockerList = blockersRes.data.blockers || [];
            
            const stats: BlockerStats = {
              total: blockerList.length,
              byCategory: { Process: 0, Technical: 0, Dependency: 0, Infrastructure: 0, Other: 0 },
              bySeverity: { Low: 0, Medium: 0, High: 0 },
              byStatus: { Open: 0, Resolved: 0, Ignored: 0 },
              weeklyTrend: [],
            };
            
            blockerList.forEach((b: { category: keyof BlockerStats['byCategory']; severity: keyof BlockerStats['bySeverity']; status: keyof BlockerStats['byStatus'] }) => {
              stats.byCategory[b.category]++;
              stats.bySeverity[b.severity]++;
              stats.byStatus[b.status]++;
            });

            return { ...member, stats };
          } catch {
            return member;
          }
        })
      );

      setMembers(membersWithStats);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTeamReport = (period: ReportPeriod = 'weekly') => {
    dispatch(generateTeamReport({ teamName, period }));
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await blockersApi.update(id, { status });
      loadTeamData();
    } catch (error) {
      console.error('Error updating blocker:', error);
    }
  };

  // Calculate team summary
  const totalOpenBlockers = members.reduce((sum, m) => sum + (m.stats?.byStatus?.Open || 0), 0);
  const totalHighSeverity = members.reduce((sum, m) => sum + (m.stats?.bySeverity?.High || 0), 0);
  const membersWithBlockers = members.filter(m => (m.stats?.byStatus?.Open || 0) > 0).length;

  // Sort members: those with high severity blockers first, then by open blockers
  const sortedMembers = [...members].sort((a, b) => {
    const aHigh = a.stats?.bySeverity?.High || 0;
    const bHigh = b.stats?.bySeverity?.High || 0;
    if (aHigh !== bHigh) return bHigh - aHigh;
    
    const aOpen = a.stats?.byStatus?.Open || 0;
    const bOpen = b.stats?.byStatus?.Open || 0;
    return bOpen - aOpen;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            My Team 👥
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage and monitor {teamName} team members
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleGenerateTeamReport('weekly')}
            disabled={isGenerating}
            className="btn-accent flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" />
                Generating...
              </>
            ) : (
              <>
                🤖 Generate Team Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-500/20 to-primary-600/10">
          <p className="text-3xl font-bold text-white">{members.length}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Team Members</p>
        </div>
        <div className={`card ${totalOpenBlockers > 0 ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10' : 'bg-gradient-to-br from-green-500/20 to-green-600/10'}`}>
          <p className={`text-3xl font-bold ${totalOpenBlockers > 0 ? 'text-amber-400' : 'text-green-400'}`}>
            {totalOpenBlockers}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">Open Blockers</p>
        </div>
        <div className={`card ${totalHighSeverity > 0 ? 'bg-gradient-to-br from-red-500/20 to-red-600/10' : 'bg-gradient-to-br from-green-500/20 to-green-600/10'}`}>
          <p className={`text-3xl font-bold ${totalHighSeverity > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {totalHighSeverity}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">High Severity</p>
        </div>
        <div className="card bg-gradient-to-br from-blue-500/20 to-blue-600/10">
          <p className="text-3xl font-bold text-blue-400">{membersWithBlockers}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Need Attention</p>
        </div>
      </div>

      {/* Latest Team Report */}
      {teamReports.length > 0 && (
        <div className="card border-primary-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                🤖 Latest Team AI Report
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Generated {new Date(teamReports[0].generatedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setSelectedReport(teamReports[0])}
              className="btn-secondary text-sm"
            >
              View Full Report
            </button>
          </div>
          <p className="text-[var(--color-text-secondary)]">{teamReports[0].summary}</p>
          {teamReports[0].actionItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-[var(--color-text-secondary)] mb-2">Top Action Items:</p>
              <ul className="space-y-1">
                {teamReports[0].actionItems.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="text-sm text-white flex items-start gap-2">
                    <span className={`mt-0.5 ${
                      item.priority === 'high' ? 'text-red-400' : 
                      item.priority === 'medium' ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      {item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢'}
                    </span>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* View Mode Toggle & Members Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold text-white">
          Team Members ({members.length})
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-primary-500/20 text-primary-400' 
                : 'bg-white/5 text-[var(--color-text-secondary)] hover:text-white'
            }`}
          >
            ▦
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-primary-500/20 text-primary-400' 
                : 'bg-white/5 text-[var(--color-text-secondary)] hover:text-white'
            }`}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Team Members */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : members.length === 0 ? (
        <div className="card text-center py-12">
          <span className="text-4xl mb-4 block">👥</span>
          <h3 className="text-lg font-medium text-white mb-2">No team members found</h3>
          <p className="text-[var(--color-text-secondary)]">
            There are no team members in the {teamName} team yet.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMembers.map((member) => (
            <TeamMemberCard
              key={member.uid}
              member={member}
              stats={member.stats}
              onClick={() => setSelectedMember(member)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedMembers.map((member) => (
            <div
              key={member.uid}
              onClick={() => setSelectedMember(member)}
              className="card hover:border-primary-500/50 cursor-pointer transition-all p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {member.profilePic ? (
                    <img 
                      src={member.profilePic} 
                      alt={`${member.firstName} ${member.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium">
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {member.designation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-white">{member.stats?.total || 0}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">Total</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold ${(member.stats?.byStatus?.Open || 0) > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                      {member.stats?.byStatus?.Open || 0}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">Open</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold ${(member.stats?.bySeverity?.High || 0) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {member.stats?.bySeverity?.High || 0}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">High</p>
                  </div>
                  <span className="text-primary-400">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Team Report Detail Modal */}
      {selectedReport && (
        <AiReportDetail
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

