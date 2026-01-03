import { Activity, BarChart3, Building2, Globe2, AlertTriangle, Leaf, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'assets', label: 'Asset Explorer', icon: BarChart3 },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'scenarios', label: 'Scenarios', icon: PieChart },
  { id: 'risks', label: 'Risk Categories', icon: AlertTriangle },
];

export function DashboardNav({ activeTab, onTabChange }: DashboardNavProps) {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
