import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { ScenarioType } from '@/lib/scenarioUtils';
import { formatCurrency } from '@/lib/dataUtils';

interface TrajectoryData {
  year: number;
  totalCost: number;
  totalEmissions: number;
  avgPrice: number;
}

interface ScenarioTrajectoryChartProps {
  orderly: TrajectoryData[];
  disorderly: TrajectoryData[];
  hothouse: TrajectoryData[];
  uncertaintyBands?: {
    scenario: ScenarioType;
    data: { year: number; mean: number; p5: number; p95: number }[];
  }[];
  showUncertainty?: boolean;
  selectedScenarios?: ScenarioType[];
}

const SCENARIO_COLORS = {
  orderly: 'rgb(46, 134, 171)',      // Blue
  disorderly: 'rgb(241, 143, 1)',    // Orange
  hothouse: 'rgb(199, 62, 29)',      // Red
};

const SCENARIO_NAMES = {
  orderly: 'Orderly Transition',
  disorderly: 'Disorderly Transition',
  hothouse: 'Hothouse World',
};

export function ScenarioTrajectoryChart({
  orderly,
  disorderly,
  hothouse,
  uncertaintyBands,
  showUncertainty = false,
  selectedScenarios = ['orderly', 'disorderly', 'hothouse'],
}: ScenarioTrajectoryChartProps) {
  const plotData = useMemo(() => {
    const traces: any[] = [];

    // Add uncertainty bands if available
    if (showUncertainty && uncertaintyBands) {
      uncertaintyBands
        .filter(({ scenario }) => selectedScenarios.includes(scenario))
        .forEach(({ scenario, data }) => {
          const years = data.map(d => d.year);
          const p95 = data.map(d => d.p95);
          const p5 = data.map(d => d.p5);

          // Upper bound of confidence band
          traces.push({
            x: years,
            y: p95,
            name: `${SCENARIO_NAMES[scenario]} (95th percentile)`,
            type: 'scatter',
            mode: 'lines',
            line: { width: 0, color: SCENARIO_COLORS[scenario] },
            showlegend: false,
            hoverinfo: 'skip',
          });

          // Lower bound (filled area)
          traces.push({
            x: years,
            y: p5,
            name: `${SCENARIO_NAMES[scenario]} uncertainty`,
            type: 'scatter',
            mode: 'lines',
            fill: 'tonexty',
            fillcolor: SCENARIO_COLORS[scenario].replace('rgb', 'rgba').replace(')', ', 0.2)'),
            line: { width: 0, color: SCENARIO_COLORS[scenario] },
            showlegend: true,
            hovertemplate: '<b>%{x}</b><br>Range: %{y:$,.0f}<extra></extra>',
          });
        });
    }

    // Main trajectory lines
    const scenarios = [
      { name: 'orderly' as ScenarioType, data: orderly },
      { name: 'disorderly' as ScenarioType, data: disorderly },
      { name: 'hothouse' as ScenarioType, data: hothouse },
    ];

    scenarios
      .filter(({ name }) => selectedScenarios.includes(name))
      .forEach(({ name, data }) => {
        traces.push({
          x: data.map(d => d.year),
          y: data.map(d => d.totalCost),
          name: SCENARIO_NAMES[name],
          type: 'scatter',
          mode: 'lines+markers',
          line: {
            color: SCENARIO_COLORS[name],
            width: 3,
          },
          marker: {
            size: 6,
            color: SCENARIO_COLORS[name],
          },
          hovertemplate:
            '<b>%{x}</b><br>' +
            'Total Cost: %{y:$,.0f}<br>' +
            '<extra></extra>',
        });
      });

    return traces;
  }, [orderly, disorderly, hothouse, uncertaintyBands, showUncertainty, selectedScenarios]);

  return (
    <div className="w-full h-full">
      <Plot
        data={plotData}
        layout={{
          title: {
            text: showUncertainty
              ? 'Portfolio Cost Trajectories with Uncertainty Bands'
              : 'Portfolio Cost Trajectories (2025-2040)',
            font: { size: 16, color: '#333' },
          },
          xaxis: {
            title: 'Year',
            showgrid: true,
            gridcolor: '#e5e7eb',
            zeroline: false,
          },
          yaxis: {
            title: 'Annual Portfolio Cost (USD)',
            showgrid: true,
            gridcolor: '#e5e7eb',
            zeroline: false,
            tickformat: '$,.0s',
          },
          hovermode: 'x unified',
          plot_bgcolor: 'rgba(0,0,0,0)',
          paper_bgcolor: 'rgba(0,0,0,0)',
          margin: { l: 60, r: 40, t: 60, b: 60 },
          legend: {
            orientation: 'h',
            yanchor: 'bottom',
            y: -0.25,
            xanchor: 'center',
            x: 0.5,
          },
          autosize: true,
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          toImageButtonOptions: {
            format: 'png',
            filename: 'scenario_trajectories',
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
