import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBlockers } from '../hooks/useBlockers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { generateTeamReport, fetchTeamReports } from '../store/slices/aiReportsSlice';
import StatsOverview from '../components/dashboard/StatsOverview';
import TrendChart from '../components/dashboard/TrendChart';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import BlockerCard from '../components/blockers/BlockerCard';
import AiReportCard from '../components/ai-report/AiReportCard';
import AiReportDetail from '../components/ai-report/AiReportDetail';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AiReport, ReportPeriod } from '../types';

export default function TeamDashboard() {
  const { user } = useAuth();
  const teamName = user?.team || 'Engineering';
  const dispatch = useDispatch<AppDispatch>();

  const { blockers, stats, isLoading, loadTeamBlockers, loadTeamStats, editBlocker } =
    useBlockers();
  const { reports, isGenerating } = useSelector((state: RootState) => state.aiReports);

  const [selectedReport, setSelectedReport] = useState<AiReport | null>(null);

  useEffect(() => {
    loadTeamBlockers(teamName, { limit: 10 });
    loadTeamStats(teamName);
    dispatch(fetchTeamReports(teamName));
  }, [loadTeamBlockers, loadTeamStats, teamName, dispatch]);

  const handleGenerateTeamReport = (period: ReportPeriod = 'weekly') => {
    dispatch(generateTeamReport({ teamName, period }));
  };

  const handleStatusChange = async (id: string, status: string) => {
    await editBlocker(id, { status });
    loadTeamStats(teamName);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            Team Dashboard 👥
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Overview for {teamName} team
          </p>
        </div>
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

      {/* Stats Overview */}
      <StatsOverview stats={stats} isLoading={isLoading} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.weeklyTrend && stats.weeklyTrend.length > 0 && (
          <TrendChart data={stats.weeklyTrend} title="Team Weekly Blocker Trend" />
        )}
        {stats?.byCategory && <CategoryBreakdown data={stats.byCategory} />}
      </div>

      {/* AI Reports Section */}
      {reports.length > 0 && (
        <div>
          <h2 className="text-xl font-display font-semibold text-white mb-4">
            Team AI Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.slice(0, 2).map((report) => (
              <AiReportCard
                key={report.uid}
                report={report}
                onClick={() => setSelectedReport(report)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Team Blockers */}
      <div>
        <h2 className="text-xl font-display font-semibold text-white mb-4">
          Recent Team Blockers
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : blockers.length === 0 ? (
          <div className="card text-center py-12">
            <span className="text-4xl mb-4 block">🎉</span>
            <h3 className="text-lg font-medium text-white mb-2">
              No team blockers!
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              Your team is doing great! No blockers have been reported recently.
            </p>
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

      {/* Report Detail Modal */}
      {selectedReport && (
        <AiReportDetail
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

