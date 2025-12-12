import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchMyReports, generateMyReport } from '../store/slices/aiReportsSlice';
import AiReportCard from '../components/ai-report/AiReportCard';
import AiReportDetail from '../components/ai-report/AiReportDetail';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AiReport, ReportPeriod } from '../types';

export default function AiReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { reports, isLoading, isGenerating, currentReport } = useSelector(
    (state: RootState) => state.aiReports
  );
  const [selectedReport, setSelectedReport] = useState<AiReport | null>(null);
  const [generatePeriod, setGeneratePeriod] = useState<ReportPeriod>('weekly');

  useEffect(() => {
    dispatch(fetchMyReports());
  }, [dispatch]);

  useEffect(() => {
    if (currentReport && isGenerating === false) {
      setSelectedReport(currentReport);
    }
  }, [currentReport, isGenerating]);

  const handleGenerate = () => {
    dispatch(generateMyReport(generatePeriod));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            AI Insights
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            AI-powered analysis of your productivity blockers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={generatePeriod}
            onChange={(e) => setGeneratePeriod(e.target.value as ReportPeriod)}
            className="select"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={handleGenerate}
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
                🤖 Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="card bg-primary-600/10 border-primary-500/20">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="font-medium text-white mb-1">
              How AI Reports Work
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Our AI analyzes your blocker patterns to identify recurring issues,
              suggest actionable improvements, and provide insights to boost your
              productivity. Reports are generated based on your recent blockers.
            </p>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-12">
          <span className="text-4xl mb-4 block">🤖</span>
          <h3 className="text-lg font-medium text-white mb-2">
            No AI Reports Yet
          </h3>
          <p className="text-[var(--color-text-secondary)] mb-4 max-w-md mx-auto">
            Generate your first AI report to get personalized insights about
            your productivity blockers and actionable recommendations.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary"
          >
            {isGenerating ? 'Generating...' : 'Generate Your First Report'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <div
              key={report.uid}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AiReportCard
                report={report}
                onClick={() => setSelectedReport(report)}
              />
            </div>
          ))}
        </div>
      )}

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

