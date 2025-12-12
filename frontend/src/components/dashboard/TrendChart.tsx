import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface TrendChartProps {
  data: Array<{ week: string; count: number }>;
  title?: string;
}

export default function TrendChart({ data, title = 'Weekly Trend' }: TrendChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    weekLabel: format(parseISO(item.week), 'MMM d'),
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-display font-semibold text-white mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="weekLabel"
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
            />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'var(--color-text-primary)' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#5c7cfa"
              strokeWidth={2}
              dot={{ fill: '#5c7cfa', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#ff922b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

