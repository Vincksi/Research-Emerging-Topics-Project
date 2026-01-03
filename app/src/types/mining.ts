export type RiskCategory = 'Critical Risk' | 'High Risk' | 'Moderate Risk' | 'Low Risk' | 'Already Stranded';

export type MineStatus = 'Production' | 'Closed' | 'Suspended';

export type MineType = 'Open Pit' | 'Underground' | 'Both';

export type ConfidenceLevel = 'very low' | 'low' | 'medium' | 'high';

export interface MiningAsset {
  source_id: string;
  source_name: string;
  iso3_country: string;
  lat: number;
  lon: number;
  year: number;
  annual_emissions_t_co2e: number;
  annual_production_t_ore: number;
  avg_capacity_t: number;
  capacity_factor: number;
  carbon_intensity: number;
  carbon_cost_usd_50: number;
  carbon_cost_usd_100: number;
  carbon_cost_usd_150: number;
  carbon_cost_usd_200: number;
  mine_status: MineStatus;
  mine_type: MineType;
  other_minerals: string;
  parent_name: string;
  parent_headquarter_country: string;
  source_operator: string;
  ownership_complexity: number;
  has_ownership: boolean;
  emissions_confidence: ConfidenceLevel;
  activity_confidence: ConfidenceLevel;
  include_in_intensity: boolean;
  activity_issue: boolean;
  intensity_outlier: boolean;
  data_quality_flag: string;
  risk_category: RiskCategory;
}

export interface CompanyExposure {
  Company: string;
  'HQ Country': string;
  Mines: number;
  'Total Emissions (tCO₂)': number;
  'Production (t)': number;
  '$50/t': number;
  '$100/t': number;
  '$150/t': number;
  '$200/t': number;
  'Portfolio Intensity': number;
}

export interface CriticalAsset {
  Mine: string;
  Country: string;
  Parent: string;
  Type: string;
  Emissions: number;
  Intensity: number;
  'Cost@$100': number;
  'Cost@$200': number;
  Capacity: number;
  Confidence: ConfidenceLevel;
}

export interface DivestmentCandidate {
  Company: string;
  'Assets at Risk': number;
  'Exposure@$100/t': number;
  Emissions: number;
}

export interface LowRiskOpportunity {
  Mine: string;
  Country: string;
  Parent: string;
  Intensity: number;
  Capacity: number;
  Production: number;
  'Cost@$100': number;
  Confidence: ConfidenceLevel;
}

export type ScenarioPrice = 50 | 100 | 150 | 200;

export interface DashboardFilters {
  scenario: ScenarioPrice;
  riskCategories: RiskCategory[];
  countries: string[];
  mineStatus: MineStatus[];
  companies: string[];
  confidenceLevels: ConfidenceLevel[];
  searchQuery: string;
}
