import { TrendingUp, TrendingDown, AlertTriangle, Building2, Globe2, DollarSign, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: 'trending-up' | 'trending-down' | 'alert' | 'building' | 'globe' | 'dollar' | 'activity';
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
  variant?: 'default' | 'critical' | 'warning' | 'success' | 'primary';
  compact?: boolean;
  className?: string;
}

const iconMap = {
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'alert': AlertTriangle,
  'building': Building2,
  'globe': Globe2,
  'dollar': DollarSign,
  'activity': Activity,
};

const variantStyles = {
  default: 'bg-card border-border',
  critical: 'bg-risk-critical/5 border-risk-critical/20',
  warning: 'bg-risk-high/5 border-risk-high/20',
  success: 'bg-risk-low/5 border-risk-low/20',
  primary: 'bg-primary/5 border-primary/20',
};

const iconVariantStyles = {
  default: 'bg-muted text-muted-foreground',
  critical: 'bg-risk-critical/10 text-risk-critical',
  warning: 'bg-risk-high/10 text-risk-high',
  success: 'bg-risk-low/10 text-risk-low',
  primary: 'bg-primary/10 text-primary',
};

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon,
  trend,
  variant = 'default',
  compact = false,
  className 
}: KPICardProps) {
  const Icon = icon ? iconMap[icon] : null;
  
  return (
    <div className={cn(
      'kpi-card border transition-all duration-300',
      variantStyles[variant],
      compact ? 'p-4' : '',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            'font-medium text-muted-foreground mb-1',
            compact ? 'text-xs' : 'text-sm'
          )}>{title}</p>
          <p className={cn(
            'font-bold tracking-tight animate-count-up tabular-nums',
            compact ? 'text-xl' : 'text-3xl'
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              'text-muted-foreground',
              compact ? 'text-xs mt-0.5' : 'text-sm mt-1'
            )}>{subtitle}</p>
          )}
          {trend && !compact && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm font-medium',
              trend.direction === 'up' ? 'text-risk-high' : 'text-risk-low'
            )}>
              {trend.direction === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trend.value}%</span>
              <span className="text-muted-foreground font-normal">{trend.label}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'rounded-xl',
            iconVariantStyles[variant],
            compact ? 'p-2' : 'p-3'
          )}>
            <Icon className={compact ? 'w-4 h-4' : 'w-6 h-6'} />
          </div>
        )}
      </div>
    </div>
  );
}
