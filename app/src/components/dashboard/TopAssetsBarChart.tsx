import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { MiningAsset, ScenarioPrice } from '@/types/mining';
import { getCostByScenario, formatCurrency } from '@/lib/dataUtils';

interface TopAssetsBarChartProps {
  assets: MiningAsset[];
  scenario: ScenarioPrice;
  limit?: number;
}

export function TopAssetsBarChart({ assets, scenario, limit = 12 }: TopAssetsBarChartProps) {
  const chartData = assets
    .filter(a => getCostByScenario(a, scenario) > 0)
    .sort((a, b) => getCostByScenario(b, scenario) - getCostByScenario(a, scenario))
    .slice(0, limit)
    .map(asset => ({
      name: asset.source_name.length > 20 
        ? asset.source_name.substring(0, 18) + '...' 
        : asset.source_name,
      fullName: asset.source_name,
      cost: getCostByScenario(asset, scenario),
      company: asset.parent_name || 'Unknown',
      country: asset.iso3_country,
      emissions: asset.annual_emissions_t_co2e,
      riskCategory: asset.risk_category,
    }));

  const getBarColor = (riskCategory: string) => {
    const colors: Record<string, string> = {
      'Critical Risk': 'hsl(9, 80%, 45%)',
      'High Risk': 'hsl(32, 95%, 48%)',
      'Moderate Risk': 'hsl(45, 95%, 50%)',
      'Low Risk': 'hsl(152, 55%, 35%)',
      'Already Stranded': 'hsl(215, 12%, 55%)',
    };
    return colors[riskCategory] || 'hsl(var(--primary))';
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            horizontal={true} 
            vertical={false}
            stroke="hsl(var(--border))"
          />
          <XAxis 
            type="number" 
            tickFormatter={(value) => formatCurrency(value, true)}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={150}
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-popover border border-border rounded-lg shadow-lg p-4 max-w-xs">
                    <p className="font-semibold text-foreground mb-2">{data.fullName}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Cost:</span> {formatCurrency(data.cost)}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Company:</span> {data.company}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Country:</span> {data.country}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Emissions:</span> {data.emissions.toLocaleString()} tCO₂
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="cost" 
            radius={[0, 4, 4, 0]}
            maxBarSize={24}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.riskCategory)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
