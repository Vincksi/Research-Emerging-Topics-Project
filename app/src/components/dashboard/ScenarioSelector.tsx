import { cn } from '@/lib/utils';
import type { ScenarioPrice } from '@/types/mining';

interface ScenarioSelectorProps {
  selected: ScenarioPrice;
  onChange: (scenario: ScenarioPrice) => void;
  className?: string;
}

const scenarios: { value: ScenarioPrice; label: string; color: string }[] = [
  { value: 50, label: '$50', color: 'bg-scenario-50' },
  { value: 100, label: '$100', color: 'bg-scenario-100' },
  { value: 150, label: '$150', color: 'bg-scenario-150' },
  { value: 200, label: '$200', color: 'bg-scenario-200' },
];

export function ScenarioSelector({ selected, onChange, className }: ScenarioSelectorProps) {
  return (
    <div className={cn('flex items-center gap-1 p-1 bg-muted rounded-lg', className)}>
      {scenarios.map(scenario => (
        <button
          key={scenario.value}
          onClick={() => onChange(scenario.value)}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            selected === scenario.value
              ? 'bg-card shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          )}
        >
          <span className="flex items-center gap-2">
            <span
              className={cn(
                'w-2 h-2 rounded-full transition-opacity',
                scenario.color,
                selected === scenario.value ? 'opacity-100' : 'opacity-50'
              )}
            />
            {scenario.label}/tCO₂
          </span>
        </button>
      ))}
    </div>
  );
}
