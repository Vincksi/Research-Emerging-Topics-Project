import { Cell, PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';
import type { RiskCategory } from '@/types/mining';

interface RiskDonutChartProps {
  data: Record<RiskCategory, number>;
  totalAssets: number;
}

const RISK_COLORS: Record<RiskCategory, string> = {
  'Critical Risk': '#c73e1d',
  'High Risk': '#f18f01',
  'Moderate Risk': '#f7b801',
  'Low Risk': '#2d6a4f',
  'Already Stranded': '#6c757d',
};

const RISK_ORDER: RiskCategory[] = [
  'Critical Risk',
  'High Risk', 
  'Moderate Risk',
  'Low Risk',
  'Already Stranded'
];

export function RiskDonutChart({ data, totalAssets }: RiskDonutChartProps) {
  const chartData = RISK_ORDER.map(category => ({
    name: category,
    value: data[category] || 0,
    percent: ((data[category] || 0) / totalAssets * 100).toFixed(1),
    color: RISK_COLORS[category],
  })).filter(d => d.value > 0);

  return (
    <div className="w-full h-[320px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.value} assets ({item.percent}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-3xl font-bold tabular-nums">{totalAssets}</p>
        <p className="text-xs text-muted-foreground">Total Assets</p>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">
              {entry.name.replace(' Risk', '')} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
