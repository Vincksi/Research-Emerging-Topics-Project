import { ExternalLink, FileText, Github, Database } from 'lucide-react';

export function DashboardFooter() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>Data Source: Climate Trace v5.2.0 (2024)</span>
            </div>
            <span className="hidden md:inline">•</span>
            <span>Analysis Period: 2024 Annual Data</span>
            <span className="hidden md:inline">•</span>
            <span>914 Total Assets Analyzed</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="w-4 h-4" />
              Methodology
            </a>
            <a 
              href="#" 
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              API Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
