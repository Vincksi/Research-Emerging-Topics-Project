# ESG Dashboard - Web Application

Interactive web dashboard for visualizing stranded asset risk analysis in the copper mining industry.

## Quick Start

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Technology Stack

- **React** 18.3 - UI framework
- **TypeScript** 5.8 - Type safety
- **Vite** 5.4 - Build tool & dev server
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **Plotly.js** - Interactive charts
- **Recharts** - Additional charting
- **React Router** 6.x - Navigation

## Project Structure

```
app/
├── src/
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── AssetDataTable.tsx
│   │   │   ├── AssetMap.tsx
│   │   │   ├── CompanyPortfolioTable.tsx
│   │   │   ├── KPICard.tsx
│   │   │   ├── RiskDonutChart.tsx
│   │   │   ├── ScenarioComparisonChart.tsx
│   │   │   ├── TopAssetsBarChart.tsx
│   │   │   └── [10+ more components]
│   │   ├── ui/                 # Reusable UI components (shadcn)
│   │   └── Dashboard.tsx       # Main dashboard component
│   ├── pages/
│   │   ├── Index.tsx          # Home page
│   │   └── NotFound.tsx       # 404 page
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── types/                  # TypeScript type definitions
│   └── App.tsx                 # Root component
│
├── public/
│   └── data/                   # CSV data files
│       ├── copper_mining_with_risk_categories.csv
│       ├── critical_risk_assets.csv
│       ├── company_carbon_exposure.csv
│       └── [more data files]
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## Key Features

### 1. Interactive Dashboard
- Real-time KPI cards showing total exposure, assets at risk, emissions
- Risk distribution donut chart
- Scenario comparison visualizations

### 2. Asset Explorer
- Searchable, sortable data table
- Filter by country, risk category, mine type
- Export to CSV

### 3. Geographic Mapping
- Global asset locations with risk overlays
- Interactive tooltips with asset details
- Zoom and pan controls

### 4. Company Portfolios
- Aggregated exposure by parent company
- Portfolio-level risk metrics
- Drill-down to individual assets

### 5. Scenario Analysis
- Toggle between $50, $100, $150, $200/tCO₂ scenarios
- Interactive carbon price sliders
- Real-time cost recalculation

## Data Loading

Data is loaded from CSV files in `public/data/` using PapaParse:

```typescript
import Papa from 'papaparse';

Papa.parse('/data/copper_mining_with_risk_categories.csv', {
  download: true,
  header: true,
  complete: (results) => {
    // Process data
  }
});
```

## Development

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

### Netlify

1. Build: `npm run build`
2. Deploy `dist/` folder to Netlify

### GitHub Pages

1. Update `vite.config.ts` with base path
2. Build: `npm run build`
3. Deploy `dist/` to `gh-pages` branch

## Environment Variables

No environment variables required for basic usage. All data is static CSV files.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

- Code splitting via Vite
- Lazy loading of components
- Optimized bundle size with SWC compiler

## Contributing

This is an academic project. For questions or issues, please contact the repository owner.

## License

See main project README for licensing information.

---

Last Updated: January 3, 2026
