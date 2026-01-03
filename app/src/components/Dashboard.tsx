import { useState, useMemo } from 'react';
import { useMiningData } from '@/hooks/useMiningData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { RiskDonutChart } from '@/components/dashboard/RiskDonutChart';
import { TopAssetsBarChart } from '@/components/dashboard/TopAssetsBarChart';
import { ScenarioComparisonChart } from '@/components/dashboard/ScenarioComparisonChart';
import { AssetDataTable } from '@/components/dashboard/AssetDataTable';
import { CompanyPortfolioTable } from '@/components/dashboard/CompanyPortfolioTable';
import { RiskCategoryPanels } from '@/components/dashboard/RiskCategoryPanels';
import { ScenarioSelector } from '@/components/dashboard/ScenarioSelector';
import { AssetMap } from '@/components/dashboard/AssetMap';
import { ScenarioTrajectoryChart } from '@/components/dashboard/ScenarioTrajectoryChart';
import { VaRMetricsPanel } from '@/components/dashboard/VaRMetricsPanel';
import { MonteCarloDistribution } from '@/components/dashboard/MonteCarloDistribution';
import { ScenarioToggle } from '@/components/dashboard/ScenarioToggle';
import { Skeleton } from '@/components/ui/skeleton';
import { calculateDashboardStats, formatCurrency, formatNumber, formatPercent } from '@/lib/dataUtils';
import {
  generateScenarios,
  calculatePortfolioTrajectory,
  runMonteCarloSimulation,
  calculateVaR,
  getUncertaintyBands,
  type ScenarioType,
} from '@/lib/scenarioUtils';
import type { ScenarioPrice, RiskCategory, CompanyExposure } from '@/types/mining';

export function Dashboard() {
  const { assets, companies, criticalAssets, divestmentCandidates, lowRiskOpportunities, isLoading, error } = useMiningData();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioPrice>(100);

  const stats = useMemo(() => {
    if (!assets.length) return null;
    return calculateDashboardStats(assets);
  }, [assets]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">Failed to load data</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {activeTab === 'overview' && stats && (
              <OverviewTab 
                stats={stats} 
                assets={assets}
                selectedScenario={selectedScenario}
                onScenarioChange={setSelectedScenario}
                onTabChange={setActiveTab}
              />
            )}
            
            {activeTab === 'assets' && (
              <AssetsTab 
                assets={assets}
                selectedScenario={selectedScenario}
                onScenarioChange={setSelectedScenario}
              />
            )}
            
            {activeTab === 'companies' && (
              <CompaniesTab
                companies={companies}
                selectedScenario={selectedScenario}
                onScenarioChange={setSelectedScenario}
              />
            )}
            
            {activeTab === 'scenarios' && stats && (
              <ScenariosTab stats={stats} companies={companies} />
            )}
            
            {activeTab === 'risks' && stats && (
              <RisksTab 
                stats={stats}
                criticalAssets={criticalAssets}
                divestmentCandidates={divestmentCandidates}
                lowRiskOpportunities={lowRiskOpportunities}
              />
            )}
          </>
        )}
      </main>
      
      <DashboardFooter />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}

interface OverviewTabProps {
  stats: ReturnType<typeof calculateDashboardStats>;
  assets: any[];
  selectedScenario: ScenarioPrice;
  onScenarioChange: (scenario: ScenarioPrice) => void;
  onTabChange: (tab: string) => void;
}

function OverviewTab({ stats, assets, selectedScenario, onScenarioChange, onTabChange }: OverviewTabProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground">Real-Time Climate Risk Intelligence</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Navigate the Carbon Transition
          <br />
          with Confidence
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Assess stranded asset risk across your entire mining portfolio. Identify vulnerable assets,
          quantify financial exposure, and make data-driven decisions in a carbon-constrained future.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button 
            onClick={() => onTabChange('scenarios')}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Explore Scenarios
          </button>
        </div>
      </div>

      {/* Key Impact Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center space-y-2 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
          <div className="text-4xl font-bold text-foreground">{stats.totalAssets.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Global Mining Assets Analyzed</div>
        </div>
        <div className="text-center space-y-2 p-6 rounded-xl bg-gradient-to-br from-destructive/5 to-transparent border border-destructive/10">
          <div className="text-4xl font-bold text-destructive">{formatCurrency(stats.totalExposure100, true)}</div>
          <div className="text-sm text-muted-foreground">Potential Exposure @ $100/tCO₂</div>
        </div>
        <div className="text-center space-y-2 p-6 rounded-xl bg-gradient-to-br from-warning/5 to-transparent border border-warning/10">
          <div className="text-4xl font-bold text-warning">{stats.atRiskPercent.toFixed(0)}%</div>
          <div className="text-sm text-muted-foreground">Assets at Moderate-Critical Risk</div>
        </div>
        <div className="text-center space-y-2 p-6 rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10">
          <div className="text-4xl font-bold text-foreground">{stats.criticalAssets}</div>
          <div className="text-sm text-muted-foreground">Critical Assets Requiring Action</div>
        </div>
      </div>

      {/* Interactive World Map - The Centerpiece */}
      <div className="space-y-4">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">Global Risk Landscape</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore carbon exposure across every continent. Each marker represents a production mine,
            sized by exposure and colored by risk level.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-border bg-card overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-background to-accent/5">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Interactive Risk Map</h3>
              <p className="text-sm text-muted-foreground">Hover over markers for detailed asset information</p>
            </div>
            <ScenarioSelector
              selected={selectedScenario}
              onChange={onScenarioChange}
            />
          </div>
          <div className="h-[600px]">
            <AssetMap assets={assets} scenario={selectedScenario} />
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3 p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Portfolio-Wide Visibility</h3>
          <p className="text-muted-foreground leading-relaxed">
            Comprehensive analysis across all assets, companies, and geographies. Identify systemic risks
            and concentration areas at a glance.
          </p>
        </div>

        <div className="space-y-3 p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Scenario Modeling</h3>
          <p className="text-muted-foreground leading-relaxed">
            Model exposure under 4 carbon pricing scenarios ($50-$200/tCO₂). Stress-test your portfolio
            against regulatory and market shifts.
          </p>
        </div>

        <div className="space-y-3 p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Actionable Insights</h3>
          <p className="text-muted-foreground leading-relaxed">
            Automated risk categorization and portfolio recommendations. Identify divestment candidates
            and resilient opportunities immediately.
          </p>
        </div>
      </div>

      {/* Quick Stats and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Highest Exposure Assets</h3>
            <span className="text-sm text-muted-foreground">Top 8</span>
          </div>
          <TopAssetsBarChart assets={assets} scenario={selectedScenario} limit={8} />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Cross-Scenario Comparison</h3>
            <span className="text-sm text-muted-foreground">Total Exposure</span>
          </div>
          <ScenarioComparisonChart
            data={{
              scenario50: stats.totalExposure50,
              scenario100: stats.totalExposure100,
              scenario150: stats.totalExposure150,
              scenario200: stats.totalExposure200,
            }}
            compact
          />
        </div>
      </div>

      {/* Social Proof / Trust Section */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8 md:p-12 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">Powered by Climate TRACE v5.2.0</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
          Built on the world's most comprehensive emissions database, combining satellite imagery,
          AI analysis, and ground-truth data across {stats.totalAssets.toLocaleString()} mining operations worldwide.
        </p>
        <div className="flex flex-wrap justify-center gap-6 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Real-time updates</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Verified data sources</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Transparent methodology</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AssetsTabProps {
  assets: any[];
  selectedScenario: ScenarioPrice;
  onScenarioChange: (scenario: ScenarioPrice) => void;
}

function AssetsTab({ assets, selectedScenario, onScenarioChange }: AssetsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Asset Explorer</h2>
          <p className="text-muted-foreground">Browse and analyze individual mining assets</p>
        </div>
        <ScenarioSelector selected={selectedScenario} onChange={onScenarioChange} />
      </div>

      {/* Top Assets Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-lg mb-4">Top 12 Most Exposed Assets</h3>
        <TopAssetsBarChart assets={assets} scenario={selectedScenario} />
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-card p-6">
        <AssetDataTable assets={assets} scenario={selectedScenario} />
      </div>
    </div>
  );
}

interface CompaniesTabProps {
  companies: any[];
  selectedScenario: ScenarioPrice;
  onScenarioChange: (scenario: ScenarioPrice) => void;
}

function CompaniesTab({ companies, selectedScenario, onScenarioChange }: CompaniesTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Company Portfolio Analysis</h2>
          <p className="text-muted-foreground">Analyze carbon exposure by parent company</p>
        </div>
        <ScenarioSelector selected={selectedScenario} onChange={onScenarioChange} />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <CompanyPortfolioTable companies={companies} scenario={selectedScenario} />
      </div>
    </div>
  );
}

interface ScenariosTabProps {
  stats: ReturnType<typeof calculateDashboardStats>;
  companies: CompanyExposure[];
}

function ScenariosTab({ stats, companies }: ScenariosTabProps) {
  const [showUncertainty, setShowUncertainty] = useState(true);
  const [horizonYear, setHorizonYear] = useState(2040);
  const [selectedScenarios, setSelectedScenarios] = useState<ScenarioType[]>(['orderly', 'disorderly', 'hothouse']);

  // Generate scenario trajectories and Monte Carlo simulations
  const { trajectories, mcPaths, varMetrics, uncertaintyBands } = useMemo(() => {
    if (!companies.length) {
      return { trajectories: null, mcPaths: [], varMetrics: [], uncertaintyBands: [] };
    }

    const scenarios = generateScenarios();

    // Calculate deterministic trajectories
    const orderlyTraj = calculatePortfolioTrajectory(companies, scenarios.orderly, 'orderly');
    const disorderlyTraj = calculatePortfolioTrajectory(companies, scenarios.disorderly, 'disorderly');
    const hothouseTraj = calculatePortfolioTrajectory(companies, scenarios.hothouse, 'hothouse');

    // Run Monte Carlo simulations
    const mcOrderly = runMonteCarloSimulation(companies, scenarios.orderly, 'orderly', 500);
    const mcDisorderly = runMonteCarloSimulation(companies, scenarios.disorderly, 'disorderly', 500);
    const mcHothouse = runMonteCarloSimulation(companies, scenarios.hothouse, 'hothouse', 500);

    const allMcPaths = [...mcOrderly, ...mcDisorderly, ...mcHothouse];

    // Calculate VaR metrics for horizon year
    const varMetricsData = [
      calculateVaR(allMcPaths, horizonYear, 'orderly'),
      calculateVaR(allMcPaths, horizonYear, 'disorderly'),
      calculateVaR(allMcPaths, horizonYear, 'hothouse'),
    ];

    // Get uncertainty bands
    const uncertaintyBandsData = [
      { scenario: 'orderly' as const, data: getUncertaintyBands(allMcPaths, 'orderly') },
      { scenario: 'disorderly' as const, data: getUncertaintyBands(allMcPaths, 'disorderly') },
      { scenario: 'hothouse' as const, data: getUncertaintyBands(allMcPaths, 'hothouse') },
    ];

    return {
      trajectories: {
        orderly: orderlyTraj,
        disorderly: disorderlyTraj,
        hothouse: hothouseTraj,
      },
      mcPaths: allMcPaths,
      varMetrics: varMetricsData,
      uncertaintyBands: uncertaintyBandsData,
    };
  }, [companies, horizonYear]);

  const scenarioData = [
    { scenario: '$50/tCO₂', cost: stats.totalExposure50, increase: 0 },
    { scenario: '$100/tCO₂', cost: stats.totalExposure100, increase: ((stats.totalExposure100 / stats.totalExposure50) - 1) * 100 },
    { scenario: '$150/tCO₂', cost: stats.totalExposure150, increase: ((stats.totalExposure150 / stats.totalExposure50) - 1) * 100 },
    { scenario: '$200/tCO₂', cost: stats.totalExposure200, increase: ((stats.totalExposure200 / stats.totalExposure50) - 1) * 100 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Climate Scenario Analysis & Stress Testing</h2>
        <p className="text-muted-foreground">
          Dynamic portfolio projections across NGFS-style climate scenarios (2025-2040) with Monte Carlo uncertainty quantification
        </p>
      </div>

      {/* Scenario Selector */}
      <ScenarioToggle
        selectedScenarios={selectedScenarios}
        onChange={setSelectedScenarios}
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg border border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showUncertainty"
            checked={showUncertainty}
            onChange={(e) => setShowUncertainty(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="showUncertainty" className="text-sm font-medium cursor-pointer">
            Show Monte Carlo Uncertainty Bands
          </label>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="horizonYear" className="text-sm font-medium">
            VaR Horizon:
          </label>
          <select
            id="horizonYear"
            value={horizonYear}
            onChange={(e) => setHorizonYear(Number(e.target.value))}
            className="px-3 py-1 rounded-md border border-border bg-background text-sm"
          >
            <option value={2030}>2030</option>
            <option value={2035}>2035</option>
            <option value={2040}>2040</option>
          </select>
        </div>
      </div>

      {/* Trajectory Chart */}
      {trajectories && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="h-[500px]">
            <ScenarioTrajectoryChart
              orderly={trajectories.orderly}
              disorderly={trajectories.disorderly}
              hothouse={trajectories.hothouse}
              uncertaintyBands={showUncertainty ? uncertaintyBands : undefined}
              showUncertainty={showUncertainty}
            />
          </div>
        </div>
      )}

      {/* VaR Metrics */}
      {varMetrics.length > 0 && (
        <VaRMetricsPanel metrics={varMetrics} horizon={horizonYear} />
      )}

      {/* Monte Carlo Distribution */}
      {mcPaths.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="h-[500px]">
            <MonteCarloDistribution
              mcPaths={mcPaths}
              year={horizonYear}
              varMetrics={varMetrics}
            />
          </div>
        </div>
      )}

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarioData.map((data, i) => (
          <div
            key={data.scenario}
            className="rounded-xl border border-border bg-card p-5 space-y-2"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: i === 0 ? 'hsl(200, 65%, 42%)' :
                    i === 1 ? 'hsl(328, 55%, 45%)' :
                    i === 2 ? 'hsl(32, 95%, 48%)' : 'hsl(9, 80%, 45%)'
                }}
              />
              <span className="font-medium">{data.scenario}</span>
            </div>
            <p className="text-2xl font-bold tabular-nums">{formatCurrency(data.cost, true)}</p>
            {data.increase > 0 && (
              <p className="text-sm text-muted-foreground">
                +{data.increase.toFixed(0)}% from baseline
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-6">
          <h3 className="font-semibold text-lg mb-2">Scenario Assumptions</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li><strong className="text-foreground">Orderly Transition:</strong> Steady carbon price growth ($50→$200/t by 2040), 4% annual intensity reduction</li>
            <li><strong className="text-foreground">Disorderly Transition:</strong> Low initial prices with sudden policy shock at 2033, 2% intensity reduction</li>
            <li><strong className="text-foreground">Hothouse World:</strong> Minimal carbon pricing ($40→$70/t), only 1% annual decarbonization</li>
          </ul>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-6">
          <h3 className="font-semibold text-lg mb-2">Monte Carlo Method</h3>
          <p className="text-sm text-muted-foreground">
            500 correlated price and intensity shock paths per scenario. Shocks have 20% price volatility,
            10% intensity volatility, and 0.25 correlation. Accounts for company-specific decarbonization
            rates based on current portfolio intensity.
          </p>
        </div>
      </div>
    </div>
  );
}

interface RisksTabProps {
  stats: ReturnType<typeof calculateDashboardStats>;
  criticalAssets: any[];
  divestmentCandidates: any[];
  lowRiskOpportunities: any[];
}

function RisksTab({ stats, criticalAssets, divestmentCandidates, lowRiskOpportunities }: RisksTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Risk Categories & Recommendations</h2>
        <p className="text-muted-foreground">Portfolio action recommendations based on risk assessment</p>
      </div>

      {/* Risk Distribution */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-semibold text-lg mb-4">Risk Distribution Overview</h3>
            <RiskDonutChart 
              data={stats.riskDistribution as Record<RiskCategory, number>} 
              totalAssets={stats.totalAssets} 
            />
          </div>
          <div className="space-y-4">
            {Object.entries(stats.riskDistribution).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: category === 'Critical Risk' ? 'hsl(9, 80%, 45%)' :
                        category === 'High Risk' ? 'hsl(32, 95%, 48%)' :
                        category === 'Moderate Risk' ? 'hsl(45, 95%, 50%)' :
                        category === 'Low Risk' ? 'hsl(152, 55%, 35%)' : 'hsl(215, 12%, 55%)'
                    }}
                  />
                  <span className="font-medium">{category}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold tabular-nums">{count}</span>
                  <span className="text-muted-foreground text-sm ml-2">
                    ({((count / stats.totalAssets) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Panels */}
      <RiskCategoryPanels 
        criticalAssets={criticalAssets}
        divestmentCandidates={divestmentCandidates}
        lowRiskOpportunities={lowRiskOpportunities}
      />
    </div>
  );
}
