import { useState, useEffect } from 'react';
import { TeamMember, Blocker, AiReport, BlockerStats } from '../../types';
import { blockersApi, aiReportsApi } from '../../services/api';
import BlockerCard from '../blockers/BlockerCard';
import AiReportDetail from '../ai-report/AiReportDetail';
import LoadingSpinner from '../common/LoadingSpinner';

interface MemberDetailModalProps {
  member: TeamMember;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function MemberDetailModal({ member, onClose, onStatusChange }: MemberDetailModalProps) {
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [stats, setStats] = useState<BlockerStats | null>(null);
  const [reports, setReports] = useState<AiReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AiReport | null>(null);
  const [activeTab, setActiveTab] = useState<'blockers' | 'insights'>('blockers');

  useEffect(() => {
    loadMemberData();
  }, [member.uid]);

  const loadMemberData = async () => {
    setIsLoading(true);
    try {
      const [blockersRes, reportsRes] = await Promise.all([
        blockersApi.getByMember(member.uid, { limit: 50 }),
        aiReportsApi.getForMember(member.uid),
      ]);
      
      setBlockers(blockersRes.data.blockers || []);
      setReports(reportsRes.data || []);

      // Calculate stats from blockers
      if (blockersRes.data.blockers) {
        const blockerList = blockersRes.data.blockers;
        const calculatedStats: BlockerStats = {
          total: blockerList.length,
          byCategory: { Process: 0, Technical: 0, Dependency: 0, Infrastructure: 0, Other: 0 },
          bySeverity: { Low: 0, Medium: 0, High: 0 },
          byStatus: { Open: 0, Resolved: 0, Ignored: 0 },
          weeklyTrend: [],
        };
        blockerList.forEach((b: Blocker) => {
          calculatedStats.byCategory[b.category]++;
          calculatedStats.bySeverity[b.severity]++;
          calculatedStats.byStatus[b.status]++;
        });
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await aiReportsApi.generateForMember(member.uid, 'weekly');
      setReports([response.data, ...reports]);
      setSelectedReport(response.data);
      setActiveTab('insights');
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBlockerStatusChange = async (id: string, status: string) => {
    await onStatusChange(id, status);
    loadMemberData();
  };

  const openBlockers = blockers.filter(b => b.status === 'Open');
  const resolvedBlockers = blockers.filter(b => b.status === 'Resolved');

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-[var(--color-bg-secondary)] rounded-2xl z-50 overflow-hidden flex flex-col border border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {member.profilePic ? (
              <img 
                src={member.profilePic} 
                alt={`${member.firstName} ${member.lastName}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl">
                {member.firstName?.[0]}{member.lastName?.[0]}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-display font-bold text-white">
                {member.firstName} {member.lastName}
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                {member.designation} • {member.team}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateReport}
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
                  🤖 Generate AI Summary
                </>
              )}
            </button>
            <button onClick={onClose} className="btn-secondary">
              ✕ Close
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="px-6 py-4 border-b border-white/5 bg-white/2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Total Blockers</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${stats.byStatus.Open > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                  {stats.byStatus.Open}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">Open</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{stats.byStatus.Resolved}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Resolved</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${stats.bySeverity.High > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {stats.bySeverity.High}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">High Severity</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{reports.length}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">AI Reports</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 border-b border-white/5">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('blockers')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'blockers'
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              🚧 Blockers ({blockers.length})
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'insights'
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              🤖 AI Insights ({reports.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : activeTab === 'blockers' ? (
            <div className="space-y-6">
              {/* Open Blockers */}
              {openBlockers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-amber-400">⚠️</span> Open Blockers ({openBlockers.length})
                  </h3>
                  <div className="space-y-3">
                    {openBlockers.map((blocker) => (
                      <BlockerCard
                        key={blocker.uid}
                        blocker={blocker}
                        onStatusChange={handleBlockerStatusChange}
                        compact
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Resolved Blockers */}
              {resolvedBlockers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-green-400">✅</span> Resolved ({resolvedBlockers.length})
                  </h3>
                  <div className="space-y-3">
                    {resolvedBlockers.slice(0, 5).map((blocker) => (
                      <BlockerCard
                        key={blocker.uid}
                        blocker={blocker}
                        onStatusChange={handleBlockerStatusChange}
                        compact
                      />
                    ))}
                  </div>
                </div>
              )}

              {blockers.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">🎉</span>
                  <h3 className="text-lg font-medium text-white mb-2">No blockers!</h3>
                  <p className="text-[var(--color-text-secondary)]">
                    {member.firstName} has no blockers reported.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <div
                    key={report.uid}
                    onClick={() => setSelectedReport(report)}
                    className="card hover:border-primary-500/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white">
                          {report.reportPeriod === 'weekly' ? 'Weekly' : 'Monthly'} Report
                        </h4>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                          Generated {new Date(report.generatedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-2 line-clamp-2">
                          {report.summary}
                        </p>
                      </div>
                      <span className="text-primary-400">View →</span>
                    </div>
                    {report.actionItems.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {report.actionItems.length} action items • {report.insights.length} insights
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">🤖</span>
                  <h3 className="text-lg font-medium text-white mb-2">No AI reports yet</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    Generate an AI summary to get insights on {member.firstName}'s blockers.
                  </p>
                  <button onClick={handleGenerateReport} className="btn-primary">
                    Generate First Report
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <AiReportDetail
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
}

