import type { VaRMetrics, ScenarioType } from '@/lib/scenarioUtils';
import { formatCurrency } from '@/lib/dataUtils';
import { TrendingUp, AlertTriangle, Target } from 'lucide-react';

interface VaRMetricsPanelProps {
  metrics: VaRMetrics[];
  horizon: number;
  alpha?: number;
  selectedScenarios?: ScenarioType[];
}

const SCENARIO_COLORS = {
  orderly: 'border-blue-500 bg-blue-50',
  disorderly: 'border-orange-500 bg-orange-50',
  hothouse: 'border-red-500 bg-red-50',
};

const SCENARIO_ICONS = {
  orderly: { color: 'text-blue-600', bg: 'bg-blue-100' },
  disorderly: { color: 'text-orange-600', bg: 'bg-orange-100' },
  hothouse: { color: 'text-red-600', bg: 'bg-red-100' },
};

const SCENARIO_NAMES = {
  orderly: 'Orderly Transition',
  disorderly: 'Disorderly Transition',
  hothouse: 'Hothouse World',
};

export function VaRMetricsPanel({
  metrics,
  horizon,
  alpha = 0.95,
  selectedScenarios = ['orderly', 'disorderly', 'hothouse']
}: VaRMetricsPanelProps) {
  const filteredMetrics = metrics.filter(m => selectedScenarios.includes(m.scenario));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Climate Value at Risk (VaR) Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Risk metrics at year {horizon} with {(alpha * 100).toFixed(0)}% confidence level.
          VaR represents the threshold cost exceeded in only {((1 - alpha) * 100).toFixed(0)}% of scenarios.
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${
        filteredMetrics.length === 1 ? 'md:grid-cols-1 max-w-md' :
        filteredMetrics.length === 2 ? 'md:grid-cols-2' :
        'md:grid-cols-3'
      }`}>
        {filteredMetrics.map((metric) => (
          <div
            key={metric.scenario}
            className={`rounded-xl border-2 p-6 space-y-4 ${SCENARIO_COLORS[metric.scenario]}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">{SCENARIO_NAMES[metric.scenario]}</h4>
              <div className={`p-2 rounded-lg ${SCENARIO_ICONS[metric.scenario].bg}`}>
                <TrendingUp className={`w-5 h-5 ${SCENARIO_ICONS[metric.scenario].color}`} />
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-3">
              {/* VaR */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    VaR ({(alpha * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(metric.var95, true)}
                </div>
                <p className="text-xs text-muted-foreground">
                  95% of outcomes below this cost
                </p>
              </div>

              {/* CVaR */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-destructive" />
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    CVaR (Tail Risk)
                  </span>
                </div>
                <div className="text-2xl font-bold text-destructive">
                  {formatCurrency(metric.cvar95, true)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Expected cost in worst 5% of cases
                </p>
              </div>

              {/* Expected Value */}
              <div className="pt-3 border-t border-border space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  Expected Cost
                </span>
                <div className="text-lg font-semibold text-foreground">
                  {formatCurrency(metric.mean, true)}
                </div>
              </div>

              {/* Distribution Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Median</div>
                  <div className="font-semibold">{formatCurrency(metric.median, true)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Std Dev</div>
                  <div className="font-semibold">{formatCurrency(metric.std, true)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">5th %ile</div>
                  <div className="font-semibold">{formatCurrency(metric.p5, true)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">95th %ile</div>
                  <div className="font-semibold">{formatCurrency(metric.p95, true)}</div>
                </div>
              </div>
            </div>

            {/* Risk Indicator */}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Tail Risk Premium</span>
                <span className="font-semibold">
                  {formatCurrency(metric.cvar95 - metric.mean, true)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">CoV (Risk/Return)</span>
                <span className="font-semibold">
                  {(metric.std / metric.mean).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interpretation Guide */}
      <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
        <h4 className="font-semibold text-sm">How to Interpret These Metrics</h4>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>
            <strong>VaR</strong>: The cost threshold exceeded in only 5% of Monte Carlo scenarios
          </li>
          <li>
            <strong>CVaR</strong>: Average cost in the worst 5% of outcomes (tail risk measure)
          </li>
          <li>
            <strong>Tail Risk Premium</strong>: How much worse the worst cases are vs. expected cost
          </li>
          <li>
            <strong>CoV</strong>: Coefficient of Variation - higher values indicate more uncertainty
          </li>
        </ul>
      </div>
    </div>
  );
}
