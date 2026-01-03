import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/lib/dataUtils';
import { cn } from '@/lib/utils';

interface ScenarioComparisonChartProps {
  data: {
    scenario50: number;
    scenario100: number;
    scenario150: number;
    scenario200: number;
  };
  compact?: boolean;
}

export function ScenarioComparisonChart({ data, compact = false }: ScenarioComparisonChartProps) {
  const chartData = [
    { name: '$50/tCO₂', value: data.scenario50, color: '#2e86ab' },
    { name: '$100/tCO₂', value: data.scenario100, color: '#a23b72' },
    { name: '$150/tCO₂', value: data.scenario150, color: '#f18f01' },
    { name: '$200/tCO₂', value: data.scenario200, color: '#c73e1d' },
  ];

  return (
    <div className={cn("w-full", compact ? "h-[200px]" : "h-[300px]")}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value, true)}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                const increase = ((item.value / chartData[0].value - 1) * 100).toFixed(0);
                return (
                  <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-lg font-bold tabular-nums">{formatCurrency(item.value, true)}</p>
                    {item.value > chartData[0].value && (
                      <p className="text-xs text-muted-foreground mt-1">+{increase}% from baseline</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
