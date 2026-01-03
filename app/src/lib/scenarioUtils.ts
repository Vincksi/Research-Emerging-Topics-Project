import type { MiningAsset, CompanyExposure } from '@/types/mining';

export type ScenarioType = 'orderly' | 'disorderly' | 'hothouse';

export interface ScenarioYearData {
  year: number;
  price: number;
  intensityFactor: number;
}

export interface ScenarioTrajectory {
  scenario: ScenarioType;
  years: number[];
  prices: number[];
  intensityFactors: number[];
}

export interface MonteCarloPath {
  pathId: number;
  scenario: ScenarioType;
  year: number;
  portfolioCost: number;
  price: number;
  intensityFactor: number;
}

export interface VaRMetrics {
  scenario: ScenarioType;
  var95: number;
  cvar95: number;
  mean: number;
  std: number;
  median: number;
  p5: number;
  p95: number;
}

const YEARS = Array.from({ length: 16 }, (_, i) => 2025 + i); // 2025-2040

/**
 * Generate NGFS-style climate scenarios
 */
export function generateScenarios(): Record<ScenarioType, ScenarioYearData[]> {
  const years = YEARS;
  const t = years.map((_, i) => i);

  // Orderly transition: steady carbon price increase with good decarbonization
  const orderly = years.map((year, i) => ({
    year,
    price: 50 + 10 * t[i],
    intensityFactor: Math.pow(1 - 0.04, t[i]), // 4% annual intensity reduction
  }));

  // Disorderly transition: low initial prices, then rapid shock
  const disorderly = years.map((year, i) => {
    const preBreak = i < 8;
    const basePrice = preBreak ? 40 + 2 * t[i] : 40 + 2 * 8 + 20 * (t[i] - 8);
    return {
      year,
      price: basePrice,
      intensityFactor: Math.pow(1 - 0.02, t[i]), // 2% annual intensity reduction
    };
  });

  // Hothouse world: minimal carbon pricing, slow decarbonization
  const hothouse = years.map((year, i) => ({
    year,
    price: 40 + 2 * t[i],
    intensityFactor: Math.pow(1 - 0.01, t[i]), // 1% annual intensity reduction
  }));

  return { orderly, disorderly, hothouse };
}

/**
 * Calculate decarbonization rate based on portfolio intensity
 * Higher intensity → higher decarbonization target
 */
export function calculateDecarbRate(portfolioIntensity: number, minIntensity: number, maxIntensity: number): number {
  const normalized = (portfolioIntensity - minIntensity) / (maxIntensity - minIntensity);
  const lowTarget = 0.01;
  const highTarget = 0.06;
  return Math.min(Math.max(lowTarget + (highTarget - lowTarget) * normalized, lowTarget), highTarget);
}

/**
 * Simulate company trajectory under a specific scenario
 */
export function simulateCompanyTrajectory(
  company: CompanyExposure,
  scenario: ScenarioYearData[],
  decarbRate: number
): { year: number; emissions: number; cost: number }[] {
  const baseEmissions = company['Total Emissions (tCO₂)'];

  return scenario.map((yearData, i) => {
    const companyDecayFactor = Math.pow(1 - decarbRate, i);
    const emissionsYear = baseEmissions * yearData.intensityFactor * companyDecayFactor;
    const costYear = emissionsYear * yearData.price;

    return {
      year: yearData.year,
      emissions: emissionsYear,
      cost: costYear,
    };
  });
}

/**
 * Aggregate company trajectories into portfolio trajectory
 */
export function calculatePortfolioTrajectory(
  companies: CompanyExposure[],
  scenario: ScenarioYearData[],
  scenarioName: ScenarioType
): { year: number; totalCost: number; totalEmissions: number; avgPrice: number }[] {
  // Calculate intensity range for decarb rates
  const intensities = companies.map(c => c['Portfolio Intensity']).filter(i => i > 0);
  const minIntensity = Math.min(...intensities);
  const maxIntensity = Math.max(...intensities);

  // Simulate each company
  const companyTrajectories = companies.map(company => {
    const decarbRate = calculateDecarbRate(company['Portfolio Intensity'], minIntensity, maxIntensity);
    return {
      company: company.Company,
      trajectory: simulateCompanyTrajectory(company, scenario, decarbRate),
    };
  });

  // Aggregate by year
  return scenario.map((yearData, i) => {
    const yearCosts = companyTrajectories.map(ct => ct.trajectory[i].cost);
    const yearEmissions = companyTrajectories.map(ct => ct.trajectory[i].emissions);

    return {
      year: yearData.year,
      totalCost: yearCosts.reduce((sum, c) => sum + c, 0),
      totalEmissions: yearEmissions.reduce((sum, e) => sum + e, 0),
      avgPrice: yearData.price,
    };
  });
}

/**
 * Generate correlated random shocks for price and intensity
 */
function generateCorrelatedShocks(
  n: number,
  priceVol: number,
  intensityVol: number,
  correlation: number,
  rng: () => number
): { priceShocks: number[]; intensityShocks: number[] } {
  const shocks = [];

  for (let i = 0; i < n; i++) {
    // Box-Muller transform for normal random variables
    const u1 = rng();
    const u2 = rng();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);

    // Correlated shocks
    const priceShock = z0 * priceVol;
    const intensityShock = (correlation * z0 + Math.sqrt(1 - correlation * correlation) * z1) * intensityVol;

    shocks.push({ priceShock, intensityShock });
  }

  return {
    priceShocks: shocks.map(s => s.priceShock),
    intensityShocks: shocks.map(s => s.intensityShock),
  };
}

/**
 * Run Monte Carlo simulation for a scenario
 */
export function runMonteCarloSimulation(
  companies: CompanyExposure[],
  baseScenario: ScenarioYearData[],
  scenarioName: ScenarioType,
  nPaths: number = 500,
  seed: number = 42
): MonteCarloPath[] {
  const results: MonteCarloPath[] = [];

  // Simple seeded random number generator
  let rngSeed = seed;
  const rng = () => {
    rngSeed = (rngSeed * 9301 + 49297) % 233280;
    return rngSeed / 233280;
  };

  // Calculate intensity range for decarb rates
  const intensities = companies.map(c => c['Portfolio Intensity']).filter(i => i > 0);
  const minIntensity = Math.min(...intensities);
  const maxIntensity = Math.max(...intensities);

  // Pre-calculate company data
  const companyData = companies.map(company => ({
    emissions: company['Total Emissions (tCO₂)'],
    decarbRate: calculateDecarbRate(company['Portfolio Intensity'], minIntensity, maxIntensity),
  }));

  const priceVol = 0.2;
  const intensityVol = 0.1;
  const correlation = 0.25;

  for (let pathId = 0; pathId < nPaths; pathId++) {
    // Generate correlated shocks for this path
    const { priceShocks, intensityShocks } = generateCorrelatedShocks(
      baseScenario.length,
      priceVol,
      intensityVol,
      correlation,
      rng
    );

    baseScenario.forEach((yearData, yearIdx) => {
      // Apply shocks to base scenario
      const priceMultiplier = Math.exp(priceShocks[yearIdx] - 0.5 * priceVol * priceVol);
      const intensityNoise = Math.max(0.6, Math.min(1.4, 1 + intensityShocks[yearIdx]));

      const shockedPrice = yearData.price * priceMultiplier;
      const shockedIntensity = yearData.intensityFactor * intensityNoise;

      // Calculate portfolio cost for this year
      let portfolioCost = 0;

      companyData.forEach(comp => {
        const decayFactor = Math.pow(1 - comp.decarbRate, yearIdx);
        const emissions = comp.emissions * shockedIntensity * decayFactor;
        portfolioCost += emissions * shockedPrice;
      });

      results.push({
        pathId,
        scenario: scenarioName,
        year: yearData.year,
        portfolioCost,
        price: shockedPrice,
        intensityFactor: shockedIntensity,
      });
    });
  }

  return results;
}

/**
 * Calculate VaR and CVaR from Monte Carlo paths at a specific year
 */
export function calculateVaR(
  mcPaths: MonteCarloPath[],
  year: number,
  scenario: ScenarioType,
  alpha: number = 0.95
): VaRMetrics {
  const yearPaths = mcPaths.filter(p => p.year === year && p.scenario === scenario);
  const costs = yearPaths.map(p => p.portfolioCost).sort((a, b) => a - b);

  if (costs.length === 0) {
    return {
      scenario,
      var95: 0,
      cvar95: 0,
      mean: 0,
      std: 0,
      median: 0,
      p5: 0,
      p95: 0,
    };
  }

  const mean = costs.reduce((sum, c) => sum + c, 0) / costs.length;
  const variance = costs.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / costs.length;
  const std = Math.sqrt(variance);

  const varIdx = Math.floor(alpha * costs.length);
  const var95 = costs[varIdx];
  const cvar95 = costs.slice(varIdx).reduce((sum, c) => sum + c, 0) / costs.slice(varIdx).length;

  const medianIdx = Math.floor(costs.length / 2);
  const p5Idx = Math.floor(0.05 * costs.length);
  const p95Idx = Math.floor(0.95 * costs.length);

  return {
    scenario,
    var95,
    cvar95,
    mean,
    std,
    median: costs[medianIdx],
    p5: costs[p5Idx],
    p95: costs[p95Idx],
  };
}

/**
 * Get percentile bands from Monte Carlo results for uncertainty visualization
 */
export function getUncertaintyBands(
  mcPaths: MonteCarloPath[],
  scenario: ScenarioType
): { year: number; mean: number; p5: number; p25: number; p75: number; p95: number }[] {
  const years = [...new Set(mcPaths.map(p => p.year))].sort((a, b) => a - b);

  return years.map(year => {
    const yearPaths = mcPaths.filter(p => p.year === year && p.scenario === scenario);
    const costs = yearPaths.map(p => p.portfolioCost).sort((a, b) => a - b);

    const mean = costs.reduce((sum, c) => sum + c, 0) / costs.length;
    const p5 = costs[Math.floor(0.05 * costs.length)];
    const p25 = costs[Math.floor(0.25 * costs.length)];
    const p75 = costs[Math.floor(0.75 * costs.length)];
    const p95 = costs[Math.floor(0.95 * costs.length)];

    return { year, mean, p5, p25, p75, p95 };
  });
}
