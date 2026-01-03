import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { MiningAsset, ScenarioPrice } from '@/types/mining';
import { formatCurrency } from '@/lib/dataUtils';

interface AssetMapProps {
  assets: MiningAsset[];
  scenario: ScenarioPrice;
}

export function AssetMap({ assets, scenario }: AssetMapProps) {
  const validAssets = useMemo(() => {
    return assets
      .filter(a => a.lat && a.lon && a.mine_status === 'Production' && a[`carbon_cost_usd_${scenario}` as keyof MiningAsset])
      .sort((a, b) => Number(b[`carbon_cost_usd_${scenario}` as keyof MiningAsset]) - Number(a[`carbon_cost_usd_${scenario}` as keyof MiningAsset]))
      .slice(0, 300); // Top 300 for performance
  }, [assets, scenario]);

  const getCostKey = (scenario: ScenarioPrice) => {
    return `carbon_cost_usd_${scenario}` as keyof MiningAsset;
  };

  const getRiskColorValue = (category: string) => {
    switch (category) {
      case 'Critical Risk': return 4;
      case 'High Risk': return 3;
      case 'Moderate Risk': return 2;
      case 'Low Risk': return 1;
      default: return 0;
    }
  };

  const plotData = useMemo(() => {
    const lats = validAssets.map(a => a.lat);
    const lons = validAssets.map(a => a.lon);
    const costs = validAssets.map(a => Number(a[getCostKey(scenario)]) || 0);
    const intensities = validAssets.map(a => a.carbon_intensity || 0);
    const names = validAssets.map(a => a.source_name);
    const countries = validAssets.map(a => a.iso3_country);
    const parents = validAssets.map(a => a.parent_name || 'Unknown');
    const emissions = validAssets.map(a => a.annual_emissions_t_co2e);
    const riskColors = validAssets.map(a => getRiskColorValue(a.risk_category || ''));

    return [{
      type: 'scattergeo' as const,
      mode: 'markers' as const,
      lat: lats,
      lon: lons,
      marker: {
        size: costs.map(cost => Math.sqrt(cost) / 150 + 4),
        color: riskColors,
        colorscale: [
          [0, 'rgb(168, 168, 168)'],      // Unknown - gray
          [0.25, 'rgb(52, 168, 83)'],      // Low Risk - green
          [0.5, 'rgb(251, 188, 5)'],       // Moderate Risk - yellow
          [0.75, 'rgb(251, 140, 0)'],      // High Risk - orange
          [1, 'rgb(234, 67, 53)']          // Critical Risk - red
        ],
        colorbar: {
          title: 'Risk Level',
          tickmode: 'array',
          tickvals: [0, 1, 2, 3, 4],
          ticktext: ['Unknown', 'Low', 'Moderate', 'High', 'Critical'],
          thickness: 15,
          len: 0.7,
        },
        line: {
          width: 1,
          color: 'rgba(255, 255, 255, 0.3)'
        },
        sizemode: 'diameter',
        opacity: 0.8,
      },
      text: names,
      hovertemplate:
        '<b>%{text}</b><br>' +
        'Country: %{customdata[0]}<br>' +
        'Parent: %{customdata[1]}<br>' +
        'Carbon Cost: %{customdata[2]}<br>' +
        'Emissions: %{customdata[3]:,.0f} tCO₂<br>' +
        'Intensity: %{customdata[4]:.4f}<br>' +
        '<extra></extra>',
      customdata: validAssets.map((_, i) => [
        countries[i],
        parents[i],
        formatCurrency(costs[i]),
        emissions[i],
        intensities[i]
      ]),
    }];
  }, [validAssets, scenario]);

  return (
    <div className="relative w-full h-full">
      <Plot
        data={plotData}
        layout={{
          geo: {
            projection: {
              type: 'natural earth'
            },
            showland: true,
            landcolor: 'rgb(243, 243, 243)',
            coastlinecolor: 'rgb(204, 204, 204)',
            showlakes: true,
            lakecolor: 'rgb(255, 255, 255)',
            showcountries: true,
            countrycolor: 'rgb(204, 204, 204)',
            bgcolor: 'rgba(240, 240, 240, 0.5)',
          },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          margin: { l: 0, r: 0, t: 0, b: 0 },
          hoverlabel: {
            bgcolor: 'white',
            font: { size: 12, color: 'black' },
            bordercolor: '#ccc',
          },
          showlegend: false,
          autosize: true,
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
          toImageButtonOptions: {
            format: 'png',
            filename: `carbon_risk_map_${scenario}`,
            height: 1080,
            width: 1920,
          }
        }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
}
