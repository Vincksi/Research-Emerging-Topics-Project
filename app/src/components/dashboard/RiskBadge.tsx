import { cn } from '@/lib/utils';
import type { RiskCategory } from '@/types/mining';

interface RiskBadgeProps {
  category: RiskCategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

const categoryStyles: Record<RiskCategory, string> = {
  'Critical Risk': 'bg-risk-critical/15 text-risk-critical border-risk-critical/30',
  'High Risk': 'bg-risk-high/15 text-risk-high border-risk-high/30',
  'Moderate Risk': 'bg-risk-moderate/20 text-risk-moderate border-risk-moderate/30',
  'Low Risk': 'bg-risk-low/15 text-risk-low border-risk-low/30',
  'Already Stranded': 'bg-risk-stranded/15 text-risk-stranded border-risk-stranded/30',
};

const categoryLabels: Record<RiskCategory, string> = {
  'Critical Risk': 'Critical',
  'High Risk': 'High',
  'Moderate Risk': 'Moderate',
  'Low Risk': 'Low',
  'Already Stranded': 'Stranded',
};

export function RiskBadge({ category, size = 'md', className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold border',
        sizeStyles[size],
        categoryStyles[category],
        className
      )}
    >
      {categoryLabels[category]}
    </span>
  );
}
