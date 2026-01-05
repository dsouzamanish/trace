import { format } from 'date-fns';
import { AiReport } from '../../types';

interface AiReportDetailProps {
  report: AiReport;
  onClose: () => void;
}

export default function AiReportDetail({ report, onClose }: AiReportDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in overflow-y-auto">
      <div className="min-h-full flex items-start justify-center py-8 px-4">
        <div className="card w-full max-w-2xl animate-slide-up my-auto">
          {/* Header - Sticky */}
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
              className="p-2 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
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
                Action Items ({report.actionItems.length})
              </h3>
              <div className="space-y-4">
                {report.actionItems.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white/5 rounded-lg p-4 border-l-4 ${
                      item.priority === 'high'
                        ? 'border-red-500'
                        : item.priority === 'medium'
                        ? 'border-yellow-500'
                        : 'border-green-500'
                    }`}
                  >
                    {/* Header with priority and blocker reference */}
                    <div className="flex items-center flex-wrap gap-2 mb-3">
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
                      {item.blockerRef && (
                        <span className="badge bg-primary-500/20 text-primary-400 text-xs">
                          {item.blockerRef}
                        </span>
                      )}
                      {item.teamToInvolve && (
                        <span className="badge bg-blue-500/20 text-blue-400 text-xs">
                          👥 {item.teamToInvolve}
                        </span>
                      )}
                      {item.estimatedEffort && (
                        <span className="badge bg-purple-500/20 text-purple-400 text-xs">
                          ⏱️ {item.estimatedEffort}
                        </span>
                      )}
                    </div>
                    
                    {/* Title */}
                    <h4 className="font-medium text-white mb-2">{item.title}</h4>
                    
                    {/* Description */}
                    <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                      {item.description}
                    </p>
                    
                    {/* Suggested Solution */}
                    {item.suggestedSolution && (
                      <div className="bg-black/20 rounded-lg p-3 mb-3">
                        <p className="text-xs font-medium text-primary-400 mb-2">📋 Solution Steps:</p>
                        <p className="text-sm text-gray-300 whitespace-pre-line">
                          {item.suggestedSolution}
                        </p>
                      </div>
                    )}
                    
                    {/* Immediate Next Step */}
                    {item.immediateNextStep && (
                      <div className="flex items-start gap-2 bg-green-500/10 rounded-lg p-3">
                        <span className="text-green-400">▶️</span>
                        <div>
                          <p className="text-xs font-medium text-green-400 mb-1">Next Step:</p>
                          <p className="text-sm text-white">{item.immediateNextStep}</p>
                        </div>
                      </div>
                    )}
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
    </div>
  );
}
