import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { BlockerCategory } from '../../types';

interface CategoryBreakdownProps {
  data: Record<BlockerCategory, number>;
}

const COLORS = ['#5c7cfa', '#ff922b', '#51cf66', '#fcc419', '#a0a0a0'];

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-display font-semibold text-white mb-4">
          Blockers by Category
        </h3>
        <div className="h-64 flex items-center justify-center text-[var(--color-text-secondary)]">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-display font-semibold text-white mb-4">
        Blockers by Category
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: 'var(--color-text-secondary)' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

