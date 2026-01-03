import { useState, useEffect } from 'react';
import { loadCSV } from '@/lib/dataUtils';
import type { MiningAsset, CompanyExposure, CriticalAsset, DivestmentCandidate, LowRiskOpportunity } from '@/types/mining';

export function useMiningData() {
  const [assets, setAssets] = useState<MiningAsset[]>([]);
  const [companies, setCompanies] = useState<CompanyExposure[]>([]);
  const [criticalAssets, setCriticalAssets] = useState<CriticalAsset[]>([]);
  const [divestmentCandidates, setDivestmentCandidates] = useState<DivestmentCandidate[]>([]);
  const [lowRiskOpportunities, setLowRiskOpportunities] = useState<LowRiskOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAllData() {
      try {
        setIsLoading(true);
        
        const [assetsData, companiesData, criticalData, divestmentData, opportunitiesData] = await Promise.all([
          loadCSV<MiningAsset>('/data/copper_mining_with_risk_categories.csv'),
          loadCSV<CompanyExposure>('/data/company_carbon_exposure.csv'),
          loadCSV<CriticalAsset>('/data/critical_risk_assets.csv'),
          loadCSV<DivestmentCandidate>('/data/divestment_candidates.csv'),
          loadCSV<LowRiskOpportunity>('/data/low_risk_opportunities.csv'),
        ]);

        setAssets(assetsData);
        setCompanies(companiesData);
        setCriticalAssets(criticalData);
        setDivestmentCandidates(divestmentData);
        setLowRiskOpportunities(opportunitiesData);
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load mining data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadAllData();
  }, []);

  return {
    assets,
    companies,
    criticalAssets,
    divestmentCandidates,
    lowRiskOpportunities,
    isLoading,
    error,
  };
}
