import { AlertTriangle, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InsightCardProps {
  icon: 'alert' | 'trending' | 'target' | 'lightbulb';
  title: string;
  description: string;
  variant?: 'default' | 'warning' | 'critical' | 'success';
  compact?: boolean;
}

const iconMap = {
  alert: AlertTriangle,
  trending: TrendingUp,
  target: Target,
  lightbulb: Lightbulb,
};

const variantStyles = {
  default: 'bg-card border-border',
  warning: 'bg-risk-high/5 border-risk-high/20',
  critical: 'bg-risk-critical/5 border-risk-critical/20',
  success: 'bg-risk-low/5 border-risk-low/20',
};

const iconStyles = {
  default: 'text-primary',
  warning: 'text-risk-high',
  critical: 'text-risk-critical',
  success: 'text-risk-low',
};

export function InsightCard({ icon, title, description, variant = 'default', compact = false }: InsightCardProps) {
  const Icon = iconMap[icon];
  
  return (
    <div className={cn(
      'rounded-xl border transition-all duration-200 hover:shadow-md',
      variantStyles[variant],
      compact ? 'p-3' : 'p-4'
    )}>
      <div className="flex items-start gap-2.5">
        <div className={cn(
          'rounded-lg bg-current/10 shrink-0',
          iconStyles[variant],
          compact ? 'p-1.5' : 'p-2'
        )}>
          <Icon className={cn(iconStyles[variant], compact ? 'w-3.5 h-3.5' : 'w-5 h-5')} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('font-semibold text-foreground leading-tight', compact ? 'text-xs' : 'text-sm')}>{title}</p>
          <p className={cn('text-muted-foreground', compact ? 'text-xs mt-0.5' : 'text-sm mt-1')}>{description}</p>
        </div>
      </div>
    </div>
  );
}
