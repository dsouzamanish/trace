import { format } from 'date-fns';
import { AiReport } from '../../types';

interface AiReportCardProps {
  report: AiReport;
  onClick?: () => void;
}

export default function AiReportCard({ report, onClick }: AiReportCardProps) {
  return (
    <div
      className="card hover:border-primary-500/30 cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🤖</span>
            <span className="badge bg-primary-500/20 text-primary-400">
              {report.reportPeriod} Report
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Generated {format(new Date(report.generatedAt), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
      </div>

      <p className="text-white mb-4 line-clamp-3">{report.summary}</p>

      {report.actionItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Top Action Items:
          </p>
          {report.actionItems.slice(0, 2).map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm"
            >
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
              <span className="text-white">{item.title}</span>
            </div>
          ))}
        </div>
      )}

      {report.insights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {report.insights.length} insights available
          </p>
        </div>
      )}
    </div>
  );
}

