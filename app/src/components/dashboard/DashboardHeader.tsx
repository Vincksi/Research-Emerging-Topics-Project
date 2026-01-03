import { Zap, Shield, ExternalLink } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="gradient-bg text-primary-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Climate Risk Analytics
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Stranded Assets Risk Analysis
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Carbon pricing impact assessment on global copper mining assets. 
              Portfolio exposure analysis across $50-$200/tCO₂ scenarios.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Shield className="w-4 h-4" />
              <span>Data Source: Climate Trace v5.2.0</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
              <span>Last Updated: January 2025</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
