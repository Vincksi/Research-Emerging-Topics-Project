import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { MonteCarloPath, ScenarioType, VaRMetrics } from '@/lib/scenarioUtils';

interface MonteCarloDistributionProps {
  mcPaths: MonteCarloPath[];
  year: number;
  varMetrics?: VaRMetrics[];
  selectedScenarios?: ScenarioType[];
}

const SCENARIO_COLORS = {
  orderly: 'rgb(46, 134, 171)',
  disorderly: 'rgb(241, 143, 1)',
  hothouse: 'rgb(199, 62, 29)',
};

const SCENARIO_NAMES = {
  orderly: 'Orderly',
  disorderly: 'Disorderly',
  hothouse: 'Hothouse',
};

export function MonteCarloDistribution({
  mcPaths,
  year,
  varMetrics,
  selectedScenarios = ['orderly', 'disorderly', 'hothouse']
}: MonteCarloDistributionProps) {
  const plotData = useMemo(() => {
    const traces: any[] = [];

    selectedScenarios.forEach((scenario) => {
      const yearPaths = mcPaths.filter(p => p.year === year && p.scenario === scenario);
      const costs = yearPaths.map(p => p.portfolioCost);

      traces.push({
        x: costs,
        type: 'histogram',
        name: SCENARIO_NAMES[scenario],
        opacity: 0.7,
        marker: {
          color: SCENARIO_COLORS[scenario],
          line: {
            color: SCENARIO_COLORS[scenario],
            width: 1,
          },
        },
        nbinsx: 40,
        hovertemplate: '<b>Cost Range</b>: %{x:$,.0f}<br>Count: %{y}<extra></extra>',
      });
    });

    return traces;
  }, [mcPaths, year, selectedScenarios]);

  const shapes = useMemo(() => {
    if (!varMetrics) return [];

    const varLines: any[] = [];
    const filteredMetrics = varMetrics.filter(m => selectedScenarios.includes(m.scenario));

    filteredMetrics.forEach((metric, idx) => {
      const yPosition = 0.9 - idx * 0.1;

      // VaR line
      varLines.push({
        type: 'line',
        x0: metric.var95,
        x1: metric.var95,
        y0: 0,
        y1: 1,
        yref: 'paper',
        line: {
          color: SCENARIO_COLORS[metric.scenario],
          width: 2,
          dash: 'dash',
        },
      });

      // CVaR line
      varLines.push({
        type: 'line',
        x0: metric.cvar95,
        x1: metric.cvar95,
        y0: 0,
        y1: 1,
        yref: 'paper',
        line: {
          color: SCENARIO_COLORS[metric.scenario],
          width: 2,
          dash: 'dot',
        },
      });
    });

    return varLines;
  }, [varMetrics, selectedScenarios]);

  const annotations = useMemo(() => {
    if (!varMetrics) return [];

    const varAnnotations: any[] = [];
    const filteredMetrics = varMetrics.filter(m => selectedScenarios.includes(m.scenario));

    filteredMetrics.forEach((metric, idx) => {
      varAnnotations.push({
        x: metric.var95,
        y: 0.9 - idx * 0.15,
        yref: 'paper',
        text: `VaR95`,
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: SCENARIO_COLORS[metric.scenario],
        ax: 40,
        ay: 0,
        font: {
          size: 10,
          color: SCENARIO_COLORS[metric.scenario],
        },
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        bordercolor: SCENARIO_COLORS[metric.scenario],
        borderwidth: 1,
        borderpad: 2,
      });
    });

    return varAnnotations;
  }, [varMetrics, selectedScenarios]);

  return (
    <div className="w-full h-full">
      <Plot
        data={plotData}
        layout={{
          title: {
            text: `Portfolio Cost Distribution at Year ${year}<br><sub>500 Monte Carlo Simulations per Scenario</sub>`,
            font: { size: 16, color: '#333' },
          },
          xaxis: {
            title: 'Annual Portfolio Cost (USD)',
            showgrid: true,
            gridcolor: '#e5e7eb',
            tickformat: '$,.0s',
          },
          yaxis: {
            title: 'Frequency',
            showgrid: true,
            gridcolor: '#e5e7eb',
          },
          barmode: 'overlay',
          plot_bgcolor: 'rgba(0,0,0,0)',
          paper_bgcolor: 'rgba(0,0,0,0)',
          margin: { l: 60, r: 40, t: 80, b: 60 },
          legend: {
            orientation: 'h',
            yanchor: 'bottom',
            y: -0.2,
            xanchor: 'center',
            x: 0.5,
          },
          shapes: shapes,
          annotations: annotations,
          autosize: true,
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          toImageButtonOptions: {
            format: 'png',
            filename: `monte_carlo_distribution_${year}`,
            height: 800,
            width: 1200,
          },
        }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
}
