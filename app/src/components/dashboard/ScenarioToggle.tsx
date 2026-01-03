import type { ScenarioType } from '@/lib/scenarioUtils';

interface ScenarioToggleProps {
  selectedScenarios: ScenarioType[];
  onChange: (scenarios: ScenarioType[]) => void;
}

const SCENARIO_INFO = {
  orderly: {
    name: 'Orderly Transition',
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    description: 'Steady carbon price growth, early policy action',
  },
  disorderly: {
    name: 'Disorderly Transition',
    color: 'bg-orange-500',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    description: 'Delayed action with sudden policy shock',
  },
  hothouse: {
    name: 'Hothouse World',
    color: 'bg-red-500',
    borderColor: 'border-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    description: 'Minimal climate action, limited decarbonization',
  },
};

export function ScenarioToggle({ selectedScenarios, onChange }: ScenarioToggleProps) {
  const toggleScenario = (scenario: ScenarioType) => {
    const isSelected = selectedScenarios.includes(scenario);

    if (isSelected) {
      // Don't allow deselecting all scenarios
      if (selectedScenarios.length === 1) return;
      onChange(selectedScenarios.filter(s => s !== scenario));
    } else {
      onChange([...selectedScenarios, scenario]);
    }
  };

  const selectAll = () => {
    onChange(['orderly', 'disorderly', 'hothouse']);
  };

  const selectOnly = (scenario: ScenarioType) => {
    onChange([scenario]);
  };

  const allSelected = selectedScenarios.length === 3;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Active Scenarios</label>
        <button
          onClick={selectAll}
          disabled={allSelected}
          className="text-xs text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          Select All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(Object.entries(SCENARIO_INFO) as [ScenarioType, typeof SCENARIO_INFO.orderly][]).map(([scenario, info]) => {
          const isSelected = selectedScenarios.includes(scenario);

          return (
            <button
              key={scenario}
              onClick={() => toggleScenario(scenario)}
              className={`
                relative p-4 rounded-lg border-2 transition-all text-left
                ${isSelected
                  ? `${info.borderColor} ${info.bgColor} shadow-sm`
                  : 'border-border bg-background hover:border-muted-foreground/30'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox indicator */}
                <div className={`
                  mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                  ${isSelected
                    ? `${info.borderColor} ${info.color}`
                    : 'border-muted-foreground/30 bg-background'
                  }
                `}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${info.color}`} />
                    <span className={`font-semibold text-sm ${isSelected ? info.textColor : 'text-foreground'}`}>
                      {info.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {info.description}
                  </p>

                  {/* Select only button */}
                  {!isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectOnly(scenario);
                      }}
                      className="mt-2 text-xs text-primary hover:text-primary/80 hover:underline"
                    >
                      View only
                    </button>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active count indicator */}
      <div className="text-xs text-muted-foreground text-center">
        {selectedScenarios.length} of 3 scenarios active
      </div>
    </div>
  );
}
