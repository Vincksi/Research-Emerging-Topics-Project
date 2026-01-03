import Papa from 'papaparse';
import type { MiningAsset, CompanyExposure, CriticalAsset, DivestmentCandidate, LowRiskOpportunity, RiskCategory, ScenarioPrice } from '@/types/mining';

export async function loadCSV<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  const text = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse<T>(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    }
    if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(0)}K`;
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function getCostByScenario(asset: MiningAsset, scenario: ScenarioPrice): number {
  const costMap: Record<ScenarioPrice, keyof MiningAsset> = {
    50: 'carbon_cost_usd_50',
    100: 'carbon_cost_usd_100',
    150: 'carbon_cost_usd_150',
    200: 'carbon_cost_usd_200',
  };
  return asset[costMap[scenario]] as number;
}

export function getRiskColor(category: RiskCategory): string {
  const colors: Record<RiskCategory, string> = {
    'Critical Risk': 'hsl(var(--risk-critical))',
    'High Risk': 'hsl(var(--risk-high))',
    'Moderate Risk': 'hsl(var(--risk-moderate))',
    'Low Risk': 'hsl(var(--risk-low))',
    'Already Stranded': 'hsl(var(--risk-stranded))',
  };
  return colors[category];
}

export function getRiskBadgeClass(category: RiskCategory): string {
  const classes: Record<RiskCategory, string> = {
    'Critical Risk': 'risk-badge-critical',
    'High Risk': 'risk-badge-high',
    'Moderate Risk': 'risk-badge-moderate',
    'Low Risk': 'risk-badge-low',
    'Already Stranded': 'risk-badge-stranded',
  };
  return classes[category];
}

export function getScenarioColor(scenario: ScenarioPrice): string {
  const colors: Record<ScenarioPrice, string> = {
    50: 'hsl(var(--scenario-50))',
    100: 'hsl(var(--scenario-100))',
    150: 'hsl(var(--scenario-150))',
    200: 'hsl(var(--scenario-200))',
  };
  return colors[scenario];
}

export function getCountryName(iso3: string): string {
  const countries: Record<string, string> = {
    'USA': 'United States',
    'CAN': 'Canada',
    'AUS': 'Australia',
    'CHL': 'Chile',
    'PER': 'Peru',
    'CHN': 'China',
    'COD': 'DR Congo',
    'ZMB': 'Zambia',
    'IDN': 'Indonesia',
    'MEX': 'Mexico',
    'KAZ': 'Kazakhstan',
    'POL': 'Poland',
    'RUS': 'Russia',
    'ARG': 'Argentina',
    'BRA': 'Brazil',
    'IRN': 'Iran',
    'ZAF': 'South Africa',
    'DOM': 'Dominican Republic',
    'ARM': 'Armenia',
    'ALB': 'Albania',
    'QAT': 'Qatar',
    'LUX': 'Luxembourg',
    'GBR': 'United Kingdom',
    'CHE': 'Switzerland',
  };
  return countries[iso3] || iso3;
}

export function getCountryFlag(iso3: string): string {
  // Convert ISO3 to ISO2 for flag emoji
  const iso3ToIso2: Record<string, string> = {
    'USA': 'US', 'CAN': 'CA', 'AUS': 'AU', 'CHL': 'CL', 'PER': 'PE',
    'CHN': 'CN', 'COD': 'CD', 'ZMB': 'ZM', 'IDN': 'ID', 'MEX': 'MX',
    'KAZ': 'KZ', 'POL': 'PL', 'RUS': 'RU', 'ARG': 'AR', 'BRA': 'BR',
    'IRN': 'IR', 'ZAF': 'ZA', 'DOM': 'DO', 'ARM': 'AM', 'ALB': 'AL',
    'QAT': 'QA', 'LUX': 'LU', 'GBR': 'GB', 'CHE': 'CH',
  };
  
  const iso2 = iso3ToIso2[iso3] || iso3.substring(0, 2);
  const codePoints = iso2
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function calculateDashboardStats(assets: MiningAsset[]) {
  const productionAssets = assets.filter(a => a.mine_status === 'Production');
  const atRiskAssets = assets.filter(a => 
    a.risk_category === 'Critical Risk' || a.risk_category === 'High Risk'
  );
  const criticalAssets = assets.filter(a => a.risk_category === 'Critical Risk');
  
  const totalExposure50 = assets.reduce((sum, a) => sum + (a.carbon_cost_usd_50 || 0), 0);
  const totalExposure100 = assets.reduce((sum, a) => sum + (a.carbon_cost_usd_100 || 0), 0);
  const totalExposure150 = assets.reduce((sum, a) => sum + (a.carbon_cost_usd_150 || 0), 0);
  const totalExposure200 = assets.reduce((sum, a) => sum + (a.carbon_cost_usd_200 || 0), 0);
  
  const totalEmissions = assets.reduce((sum, a) => sum + (a.annual_emissions_t_co2e || 0), 0);
  
  const riskDistribution = {
    'Critical Risk': assets.filter(a => a.risk_category === 'Critical Risk').length,
    'High Risk': assets.filter(a => a.risk_category === 'High Risk').length,
    'Moderate Risk': assets.filter(a => a.risk_category === 'Moderate Risk').length,
    'Low Risk': assets.filter(a => a.risk_category === 'Low Risk').length,
    'Already Stranded': assets.filter(a => a.risk_category === 'Already Stranded').length,
  };
  
  const uniqueCountries = new Set(assets.map(a => a.iso3_country)).size;
  const uniqueCompanies = new Set(assets.filter(a => a.parent_name).map(a => a.parent_name)).size;
  
  return {
    totalAssets: assets.length,
    productionAssets: productionAssets.length,
    atRiskAssets: atRiskAssets.length,
    criticalAssets: criticalAssets.length,
    atRiskPercent: (atRiskAssets.length / assets.length) * 100,
    totalExposure50,
    totalExposure100,
    totalExposure150,
    totalExposure200,
    totalEmissions,
    riskDistribution,
    uniqueCountries,
    uniqueCompanies,
  };
}

export function getTopAssetsByExposure(assets: MiningAsset[], scenario: ScenarioPrice, limit = 15): MiningAsset[] {
  return [...assets]
    .filter(a => getCostByScenario(a, scenario) > 0)
    .sort((a, b) => getCostByScenario(b, scenario) - getCostByScenario(a, scenario))
    .slice(0, limit);
}
