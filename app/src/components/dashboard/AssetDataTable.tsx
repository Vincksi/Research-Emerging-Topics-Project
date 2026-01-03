import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RiskBadge } from './RiskBadge';
import { cn } from '@/lib/utils';
import type { MiningAsset, RiskCategory, ScenarioPrice } from '@/types/mining';
import { formatCurrency, getCountryFlag, getCostByScenario } from '@/lib/dataUtils';

interface AssetDataTableProps {
  assets: MiningAsset[];
  scenario: ScenarioPrice;
  onAssetClick?: (asset: MiningAsset) => void;
}

type SortField = 'source_name' | 'iso3_country' | 'parent_name' | 'annual_emissions_t_co2e' | 'carbon_intensity' | 'cost' | 'risk_category';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 15;

export function AssetDataTable({ assets, scenario, onAssetClick }: AssetDataTableProps) {
  const [sortField, setSortField] = useState<SortField>('cost');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAssets = useMemo(() => {
    let filtered = assets;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = assets.filter(asset =>
        asset.source_name?.toLowerCase().includes(query) ||
        asset.parent_name?.toLowerCase().includes(query) ||
        asset.iso3_country?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [assets, searchQuery]);

  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortField === 'cost') {
        aValue = getCostByScenario(a, scenario);
        bValue = getCostByScenario(b, scenario);
      } else {
        aValue = a[sortField] || '';
        bValue = b[sortField] || '';
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
  }, [filteredAssets, sortField, sortDirection, scenario]);

  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAssets.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedAssets, currentPage]);

  const totalPages = Math.ceil(sortedAssets.length / ITEMS_PER_PAGE);

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

  const getCostHeatmapColor = (cost: number, maxCost: number) => {
    const intensity = Math.min(cost / maxCost, 1);
    if (intensity < 0.25) return 'bg-risk-low/10';
    if (intensity < 0.5) return 'bg-risk-moderate/15';
    if (intensity < 0.75) return 'bg-risk-high/15';
    return 'bg-risk-critical/15';
  };

  const maxCost = Math.max(...sortedAssets.map(a => getCostByScenario(a, scenario)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search mines, companies, countries..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {sortedAssets.length} assets
          </span>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="min-w-[200px]">
                  <SortButton field="source_name">Mine Name</SortButton>
                </th>
                <th className="min-w-[100px]">
                  <SortButton field="iso3_country">Country</SortButton>
                </th>
                <th className="min-w-[180px]">
                  <SortButton field="parent_name">Parent Company</SortButton>
                </th>
                <th className="min-w-[120px] text-right">
                  <SortButton field="annual_emissions_t_co2e">Emissions (tCO₂)</SortButton>
                </th>
                <th className="min-w-[100px] text-right">
                  <SortButton field="carbon_intensity">Carbon Intensity</SortButton>
                </th>
                <th className="min-w-[130px] text-right">
                  <SortButton field="cost">Cost @ ${scenario}/t</SortButton>
                </th>
                <th className="min-w-[100px]">
                  <SortButton field="risk_category">Risk</SortButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets.map((asset, index) => {
                const cost = getCostByScenario(asset, scenario);
                return (
                  <tr 
                    key={asset.source_id || index}
                    className="cursor-pointer"
                    onClick={() => onAssetClick?.(asset)}
                  >
                    <td className="font-medium">{asset.source_name}</td>
                    <td>
                      <span className="flex items-center gap-2">
                        <span>{getCountryFlag(asset.iso3_country)}</span>
                        <span>{asset.iso3_country}</span>
                      </span>
                    </td>
                    <td className="text-muted-foreground truncate max-w-[200px]">
                      {asset.parent_name || '—'}
                    </td>
                    <td className="text-right tabular-nums">
                      {asset.annual_emissions_t_co2e?.toLocaleString() || '—'}
                    </td>
                    <td className="text-right tabular-nums">
                      {asset.carbon_intensity?.toFixed(4) || '—'}
                    </td>
                    <td className={cn(
                      'text-right tabular-nums font-medium',
                      getCostHeatmapColor(cost, maxCost)
                    )}>
                      {cost > 0 ? formatCurrency(cost, true) : '—'}
                    </td>
                    <td>
                      <RiskBadge category={asset.risk_category} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, sortedAssets.length)} of {sortedAssets.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm tabular-nums px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
