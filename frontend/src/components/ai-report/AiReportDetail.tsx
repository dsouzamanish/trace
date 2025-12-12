import { format } from 'date-fns';
import { AiReport } from '../../types';

interface AiReportDetailProps {
  report: AiReport;
  onClose: () => void;
}

export default function AiReportDetail({ report, onClose }: AiReportDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in overflow-y-auto py-8">
      <div className="card w-full max-w-2xl mx-4 animate-slide-up">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">🤖</span>
              <h2 className="text-xl font-display font-semibold text-white">
                AI Insights Report
              </h2>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {report.reportPeriod.charAt(0).toUpperCase() + report.reportPeriod.slice(1)} Report •
              Generated {format(new Date(report.generatedAt), 'MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Summary
          </h3>
          <p className="text-white bg-white/5 rounded-lg p-4">{report.summary}</p>
        </div>

        {/* Action Items */}
        {report.actionItems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
              Action Items
            </h3>
            <div className="space-y-3">
              {report.actionItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg p-4 border-l-2 border-primary-500"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`badge ${
                        item.priority === 'high'
                          ? 'badge-high'
                          : item.priority === 'medium'
                          ? 'badge-medium'
                          : 'badge-low'
                      }`}
                    >
                      {item.priority}
                    </span>
                    <span className="font-medium text-white">{item.title}</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {report.insights.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
              Key Insights
            </h3>
            <ul className="space-y-2">
              {report.insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-white"
                >
                  <span className="text-primary-400">💡</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/5">
          <button onClick={onClose} className="btn-secondary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

