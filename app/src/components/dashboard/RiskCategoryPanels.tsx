import { AlertCircle, TrendingDown, Leaf } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CriticalAsset, DivestmentCandidate, LowRiskOpportunity } from '@/types/mining';
import { formatCurrency, getCountryFlag } from '@/lib/dataUtils';

interface RiskCategoryPanelsProps {
  criticalAssets: CriticalAsset[];
  divestmentCandidates: DivestmentCandidate[];
  lowRiskOpportunities: LowRiskOpportunity[];
}

export function RiskCategoryPanels({ 
  criticalAssets, 
  divestmentCandidates, 
  lowRiskOpportunities 
}: RiskCategoryPanelsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Critical Risk Panel */}
      <div className="rounded-xl border-2 border-risk-critical/30 bg-risk-critical/5 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-risk-critical/20">
            <AlertCircle className="w-5 h-5 text-risk-critical" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-risk-critical">Critical Risk Assets</h3>
            <p className="text-sm text-muted-foreground">
              {criticalAssets.length} assets requiring immediate action
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          High carbon cost AND high carbon intensity — Most vulnerable to carbon pricing
        </p>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {criticalAssets.slice(0, 8).map((asset, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-card/80 hover:bg-card transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span>{getCountryFlag(asset.Country)}</span>
                <span className="font-medium truncate text-sm">{asset.Mine}</span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-risk-critical">
                {formatCurrency(asset['Cost@$100'], true)}
              </span>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full border-risk-critical/30 text-risk-critical hover:bg-risk-critical/10">
          View All Critical Assets
        </Button>
      </div>

      {/* Divestment Candidates Panel */}
      <div className="rounded-xl border-2 border-risk-high/30 bg-risk-high/5 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-risk-high/20">
            <TrendingDown className="w-5 h-5 text-risk-high" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-risk-high">Divestment Candidates</h3>
            <p className="text-sm text-muted-foreground">
              Top 20 companies with at-risk portfolios
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Critical risk OR (High risk + capacity factor &lt; 30%)
        </p>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {divestmentCandidates.slice(0, 8).map((candidate, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-card/80 hover:bg-card transition-colors"
            >
              <div className="min-w-0">
                <span className="font-medium truncate text-sm block">{candidate.Company}</span>
                <span className="text-xs text-muted-foreground">
                  {candidate['Assets at Risk']} assets at risk
                </span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-risk-high">
                {formatCurrency(candidate['Exposure@$100/t'], true)}
              </span>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full border-risk-high/30 text-risk-high hover:bg-risk-high/10">
          Generate Divestment Report
        </Button>
      </div>

      {/* Low-Risk Opportunities Panel */}
      <div className="rounded-xl border-2 border-risk-low/30 bg-risk-low/5 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-risk-low/20">
            <Leaf className="w-5 h-5 text-risk-low" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-risk-low">Investment Opportunities</h3>
            <p className="text-sm text-muted-foreground">
              {lowRiskOpportunities.length} low-carbon opportunities
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Low carbon intensity + high capacity + above-median production
        </p>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {lowRiskOpportunities.slice(0, 8).map((opportunity, i) => (
            <div 
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-card/80 hover:bg-card transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span>{getCountryFlag(opportunity.Country)}</span>
                <div className="min-w-0">
                  <span className="font-medium truncate text-sm block">{opportunity.Mine}</span>
                  <span className="text-xs text-muted-foreground">
                    Carbon Intensity: {opportunity.Intensity.toFixed(4)}
                  </span>
                </div>
              </div>
              <span className="text-sm font-semibold tabular-nums text-risk-low">
                {formatCurrency(opportunity['Cost@$100'], true)}
              </span>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full border-risk-low/30 text-risk-low hover:bg-risk-low/10">
          Generate Investment Memo
        </Button>
      </div>
    </div>
  );
}
