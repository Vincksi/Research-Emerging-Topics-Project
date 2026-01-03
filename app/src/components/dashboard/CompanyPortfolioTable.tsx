import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CompanyExposure, ScenarioPrice } from '@/types/mining';
import { formatCurrency, getCountryFlag } from '@/lib/dataUtils';

interface CompanyPortfolioTableProps {
  companies: CompanyExposure[];
  scenario: ScenarioPrice;
}

type SortField = 'Company' | 'Mines' | 'Total Emissions (tCO₂)' | 'Exposure' | 'Portfolio Intensity';
type SortDirection = 'asc' | 'desc';

export function CompanyPortfolioTable({ companies, scenario }: CompanyPortfolioTableProps) {
  const [sortField, setSortField] = useState<SortField>('Exposure');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  // Helper to get exposure value by scenario
  const getExposureByScenario = (company: CompanyExposure): number => {
    const exposureMap: Record<ScenarioPrice, keyof CompanyExposure> = {
      50: '$50/t',
      100: '$100/t',
      150: '$150/t',
      200: '$200/t',
    };
    return company[exposureMap[scenario]] as number;
  };

  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortField === 'Exposure') {
        aValue = getExposureByScenario(a);
        bValue = getExposureByScenario(b);
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [companies, sortField, sortDirection, scenario]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      {sortField === field ? (
        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-50" />
      )}
    </button>
  );

  const maxExposure = Math.max(...sortedCompanies.map(c => getExposureByScenario(c)));

  const getExposureBarWidth = (exposure: number) => {
    return (exposure / maxExposure) * 100;
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity < 0.01) return 'text-risk-low';
    if (intensity < 0.02) return 'text-risk-moderate';
    if (intensity < 0.04) return 'text-risk-high';
    return 'text-risk-critical';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Top 25 Companies by Exposure</h3>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-8"></th>
                <th className="min-w-[200px]">
                  <SortButton field="Company">Company</SortButton>
                </th>
                <th className="min-w-[80px] text-center">
                  <SortButton field="Mines">Mines</SortButton>
                </th>
                <th className="min-w-[150px] text-right">
                  <SortButton field="Total Emissions (tCO₂)">Total Emissions</SortButton>
                </th>
                <th className="min-w-[200px]">
                  <SortButton field="Exposure">Exposure @ ${scenario}/tCO₂</SortButton>
                </th>
                <th className="min-w-[120px] text-right">
                  <SortButton field="Portfolio Intensity">Carbon Intensity</SortButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCompanies.slice(0, 25).map((company, index) => (
                <tr 
                  key={company.Company}
                  className="cursor-pointer group"
                  onClick={() => setExpandedCompany(
                    expandedCompany === company.Company ? null : company.Company
                  )}
                >
                  <td className="text-muted-foreground">
                    {expandedCompany === company.Company ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCountryFlag(company['HQ Country'])}</span>
                      <span className="font-medium">{company.Company}</span>
                    </div>
                  </td>
                  <td className="text-center tabular-nums font-medium">
                    {company.Mines}
                  </td>
                  <td className="text-right tabular-nums">
                    {company['Total Emissions (tCO₂)']?.toLocaleString()} tCO₂
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-scenario-100 rounded-full transition-all duration-500"
                          style={{ width: `${getExposureBarWidth(getExposureByScenario(company))}%` }}
                        />
                      </div>
                      <span className="tabular-nums font-medium min-w-[80px] text-right">
                        {formatCurrency(getExposureByScenario(company), true)}
                      </span>
                    </div>
                  </td>
                  <td className={cn(
                    'text-right tabular-nums font-medium',
                    getIntensityColor(company['Portfolio Intensity'])
                  )}>
                    {company['Portfolio Intensity']?.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
