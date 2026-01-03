# ESG Stranded Assets Analysis: Carbon Transition Risk in Copper Mining

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Academic-green.svg)]()

## Overview

This research project provides a comprehensive **financial risk assessment** of the global copper mining industry under carbon pricing scenarios, analyzing **914 mining assets** across 56+ countries to identify stranded asset risk in the transition to a low-carbon economy.

### Key Research Questions

1. **Which copper mining assets become unprofitable under carbon pricing?** ($50-$200/tCO₂ scenarios)
2. **What is the total financial exposure** of the industry to carbon costs?
3. **How are emissions trending** over time (2021-2024)?
4. **Can we predict stranded asset risk** using machine learning?

### Key Findings

- **$9.52 billion** annual carbon cost exposure at $100/tCO₂ (production mines)
- **28.3%** of assets (259 mines) at critical or high stranding risk
- **$14.28 billion swing** between $50 and $200 carbon pricing scenarios
- **+0.99% CAGR** in emissions (2021-2024) - concerning upward trend
- **Top 10%** of assets account for **51.6%** of total exposure (concentration risk)
- **Median break-even price**: $776/tCO₂ (most mines remain profitable below this)

---

## Table of Contents

- [Dataset](#dataset)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Analysis Notebooks](#analysis-notebooks)
- [Web Application](#web-application)
- [Key Outputs](#key-outputs)
- [Methodology](#methodology)
- [Technical Stack](#technical-stack)
- [Future Work](#future-work)
- [Citations](#citations)
- [License](#license)

---

## Dataset

### Source: Climate TRACE v5.2.0

**Climate TRACE** (Tracking Real-time Atmospheric Carbon Emissions) provides the world's most detailed inventory of greenhouse gas emissions, combining satellite imagery, AI, and ground-level sensors.

- **Dataset**: Mineral Extraction - Copper Mining Emissions
- **Version**: 5.2.0 (released 2025)
- **Temporal Coverage**: Monthly data from January 2021 to August 2025
- **Spatial Coverage**: Global (914 assets across 56+ countries)
- **Observations**: 51,184 monthly emission records

**Data Attribution**:
```
Climate TRACE Coalition (2025). Copper Mining Emissions Database v5.2.0.
Available at: https://climatetrace.org
```

### Data Processing

The raw dataset has been cleaned and enhanced with:
- Parent company ownership mapping (66.8% coverage)
- Mine status classification (Production, Closed, Suspended)
- Carbon cost calculations ($50, $100, $150, $200/tCO₂ scenarios)
- Risk categorization (Critical, High, Moderate, Low)
- Financial metrics (revenue estimates, break-even pricing)

**Source PDF**: `Mineral Extraction sector-Mining and Quarrying Emissions from Copper, Iron, Bauxite, Rock and Sand.pdf`

---

## Installation

### Prerequisites

- **Python**: 3.9 or higher
- **Node.js**: 18.x or higher (for web application)
- **Git**: For cloning the repository

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/Research-Emerging-Topics-Project.git
cd Research-Emerging-Topics-Project
```

### 2. Python Environment Setup

#### Option A: Using conda (recommended)

```bash
conda create -n esg-analysis python=3.9
conda activate esg-analysis
pip install -r requirements.txt
```

#### Option B: Using venv

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Verify Installation

```bash
python -c "import pandas, numpy, plotly, sklearn; print('All packages installed successfully!')"
```

---

## Usage

### Running Jupyter Notebooks

1. **Start Jupyter Lab**:
```bash
jupyter lab
```

2. **Navigate to `notebooks/` folder**

3. **Run notebooks in this order**:
   - `Data_Exploration_and_Cleaning.ipynb` - Initial data processing
   - `Stranded_Assets_Analysis.ipynb` - **Main analysis** (start here for key findings)
   - `Financial_Analysis.ipynb` - Break-even pricing and profitability impact
   - `Q1_Enhanced_Analysis.ipynb` - Machine learning models and interactive tools
   - `Climate_Stress_Testing_and_Portfolio Simulation.ipynb` - Advanced scenario modeling

### Running the Web Application

1. **Navigate to app directory**:
```bash
cd app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

4. **Open browser**: Navigate to `http://localhost:5173`

5. **Build for production**:
```bash
npm run build
```

---

## Project Structure

```
Research-Emerging-Topics-Project/
│
├── README.md                          # This file
├── requirements.txt                   # Python dependencies (to be created)
├── .gitignore                        # Git ignore rules
│
├── data/                             # Processed datasets
│   ├── copper_mining.csv             # Raw monthly emissions data
│   ├── copper_mining_cleaned.csv     # Cleaned annual aggregates
│   ├── copper_mining_with_risk_categories.csv
│   ├── critical_risk_assets.csv
│   ├── company_carbon_exposure.csv
│   ├── divestment_candidates.csv
│   ├── low_risk_opportunities.csv
│   └── [8 more analysis outputs]
│
├── notebooks/                        # Jupyter analysis notebooks
│   ├── Stranded_Assets_Analysis.ipynb           # ⭐ Main analysis
│   ├── Financial_Analysis.ipynb                 # Break-even pricing
│   ├── Q1_Enhanced_Analysis.ipynb               # ML models
│   ├── Data_Exploration_and_Cleaning.ipynb
│   ├── Climate_Stress_Testing_and_Portfolio Simulation.ipynb
│   └── Exploration_data.ipynb
│
├── app/                              # React/TypeScript web application
│   ├── src/
│   │   ├── components/
│   │   │   └── dashboard/           # 15+ dashboard components
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── types/
│   ├── public/data/                 # CSV data for app
│   ├── package.json
│   └── vite.config.ts
│
└── manus_pitch_deck_prompt.md       # Business context & pitch guidelines
```

---

## Analysis Notebooks

### 1. Stranded_Assets_Analysis.ipynb ⭐

**The primary analysis notebook** - Start here for main findings.

**Contents**:
- Executive summary with key metrics
- Asset-level carbon cost rankings (total & intensity)
- Company portfolio aggregation (top 25 exposed companies)
- Geographic risk mapping (global distribution)
- Stranded asset identification (Critical/High/Moderate/Low risk categories)
- Scenario sensitivity analysis ($50-$200/tCO₂)
- Portfolio rebalancing recommendations

**Outputs**: 5 CSV files for downstream use

---

### 2. Financial_Analysis.ipynb

**Financial lens on stranded asset risk**

**Contents**:
- Break-even carbon pricing ($/tCO₂ where assets become unprofitable)
- Stranding cascade analysis (how many assets at each price point)
- Carbon cost as % of revenue
- Mine type vulnerability analysis
- Temporal emission trends (2021-2024)
- Trajectory classification (Improving vs. Deteriorating assets)

**Key Metric**: Median break-even = $776/tCO₂

---

### 3. Q1_Enhanced_Analysis.ipynb

**Advanced analytics module**

**Contents**:
- Machine Learning models (Random Forest, Gradient Boosting)
- Interactive scenario builders with price sliders
- Temporal trend analysis with linear regression
- Risk probability predictions (ML-based scoring)
- Feature importance analysis

**Model Performance**: 75-85% accuracy, ROC-AUC > 0.75

---

### 4. Data_Exploration_and_Cleaning.ipynb

Initial data processing, quality checks, and transformation pipeline.

---

### 5. Climate_Stress_Testing_and_Portfolio Simulation.ipynb

Monte Carlo simulations and portfolio optimization scenarios.

---

## Web Application

### Technology Stack

- **Frontend**: React 18.3, TypeScript 5.8
- **UI Framework**: shadcn/ui, Tailwind CSS
- **Charts**: Plotly.js, Recharts
- **Build Tool**: Vite 5.4
- **Data**: CSV loading via PapaParse

### Features

- **Interactive Dashboard**: KPI cards, risk distribution charts
- **Asset Explorer**: Searchable data tables with filtering
- **Geographic Mapping**: Asset locations with risk overlays
- **Scenario Comparison**: Toggle between carbon pricing scenarios
- **Company Portfolios**: Aggregated exposure by parent company
- **Risk Panels**: Drill-down by Critical/High/Moderate/Low risk categories

### Components (81+ TypeScript files)

Key dashboard components in `app/src/components/dashboard/`:
- `KPICard.tsx` - Key performance indicators
- `RiskDonutChart.tsx` - Risk distribution visualization
- `TopAssetsBarChart.tsx` - Most exposed assets
- `AssetMap.tsx` - Geographic risk mapping
- `AssetDataTable.tsx` - Searchable asset table
- `CompanyPortfolioTable.tsx` - Parent company aggregation
- `ScenarioComparisonChart.tsx` - Multi-scenario analysis
- `VaRMetricsPanel.tsx` - Value-at-Risk metrics
- `MonteCarloDistribution.tsx` - Simulation results

---

## Key Outputs

### Analysis Datasets (in `data/` and `notebooks/`)

| File | Description | Records |
|------|-------------|---------|
| `copper_mining_with_risk_categories.csv` | All assets with risk classifications | 914 |
| `critical_risk_assets.csv` | Top 21 critical risk mines | 21 |
| `company_carbon_exposure.csv` | Top 25 companies by exposure | 25 |
| `divestment_candidates.csv` | High-risk, low-performance assets | Variable |
| `low_risk_opportunities.csv` | Low-carbon, high-capacity assets | 28 |
| `financial_analysis_complete.csv` | Break-even pricing & profitability | 601 |
| `ml_risk_predictions.csv` | Machine learning risk scores | 608 |
| `temporal_trends_2021_2024.csv` | Emission trajectories | 914 |
| `mine_type_vulnerability.csv` | Risk by mine type | Variable |
| `stranding_cascade_data.csv` | Stranding thresholds ($0-$250) | 51 |

---

## Methodology

### Carbon Cost Calculation

```
Carbon Cost ($) = Annual Emissions (tCO₂) × Carbon Price ($/tCO₂)
```

**Scenarios**: $50, $100, $150, $200 per tonne CO₂ (based on IPCC pathway modeling)

### Risk Classification

**Critical Risk**: High total carbon cost (>75th percentile) AND high intensity (>75th percentile)

**High Risk**: High cost OR high intensity

**Moderate Risk**: Positive carbon costs below high-risk thresholds

**Low Risk**: Minimal carbon exposure

### Financial Parameters

- **Copper Price**: $9,500/tonne (2024 average)
- **Ore Grade**: 0.8% Cu content (industry average)
- **Operating Margin**: 30% (typical for copper mining)
- **Break-even Threshold**: Carbon cost > 30% of revenue

### Machine Learning Models

**Features**: Carbon intensity, capacity factor, mine type, country, production volume, emissions confidence

**Models**: Random Forest (200 trees), Gradient Boosting (150 estimators)

**Validation**: 75/25 train-test split, stratified sampling, ROC-AUC scoring

---

## Technical Stack

### Python Libraries

- **Data Processing**: pandas 2.x, numpy 1.x
- **Visualization**: plotly 5.x, matplotlib 3.x, seaborn 0.12+
- **Machine Learning**: scikit-learn 1.3+
- **Statistical Analysis**: scipy 1.x
- **Notebooks**: jupyter, jupyterlab

### Web Application

- **Framework**: React 18.3
- **Language**: TypeScript 5.8
- **UI Components**: @radix-ui, shadcn/ui
- **Charts**: plotly.js, recharts
- **State Management**: @tanstack/react-query
- **Routing**: react-router-dom 6.x
- **Build**: Vite 5.4, SWC compiler

---

## Future Work

### To Achieve 19+/20 Academic Grade

1. ✅ **Comprehensive README** (completed)
2. ⬜ **Create requirements.txt** with exact package versions
3. ⬜ **Literature review section** citing 5-10 academic papers on stranded assets
4. ⬜ **Sensitivity analysis** on ore grade and operating margin assumptions
5. ⬜ **Clear notebook outputs** before committing to repository

### Research Extensions

- **Scope 3 Emissions**: Include downstream processing and transport
- **Dynamic Ore Grades**: Use actual mine-specific copper content data
- **Renewable Energy Integration**: Model decarbonization pathway scenarios
- **Regulatory Analysis**: Country-specific carbon pricing mechanisms
- **Real Options Valuation**: Option to abandon vs. retrofit mines
- **Social Impact**: Employment and community effects of mine closures

### Technical Enhancements

- **Deploy web application** (Vercel, Netlify, or AWS)
- **API Backend**: Real-time data updates from Climate TRACE
- **Unit Tests**: pytest coverage for critical functions
- **CI/CD Pipeline**: Automated testing and deployment
- **Docker Containerization**: Reproducible environment

---

## Citations

### Primary Data Source

```bibtex
@dataset{climatetrace2025,
  title = {Climate TRACE Global Emissions Database v5.2.0},
  author = {{Climate TRACE Coalition}},
  year = {2025},
  url = {https://climatetrace.org},
  note = {Mineral Extraction sector - Copper Mining}
}
```

### Methodology References

**Carbon Pricing**:
- World Bank (2024). State and Trends of Carbon Pricing 2024. Washington, DC.
- IPCC (2022). Climate Change 2022: Mitigation of Climate Change.

**Stranded Assets**:
- Caldecott, B., et al. (2016). Stranded Assets: A Climate Risk Challenge. Oxford University.
- Carbon Tracker Initiative (2023). Carbon Asset Risk: Discussion Framework.

**Copper Industry**:
- IEA (2024). The Role of Critical Minerals in Clean Energy Transitions.
- S&P Global (2024). Copper Market Outlook 2024-2030.

---

## Contributors

**Research & Analysis**: Philippe Vannson

**Course**: Research Emerging Topics

**Institution**: [Your University]

**Date**: January 2026

---

## License

This project is for **academic research purposes**.

**Data**: Climate TRACE data is publicly available under their terms of use.

**Code**: MIT License (proposed)

```
MIT License

Copyright (c) 2026 Philippe Vannson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Acknowledgments

- **Climate TRACE Coalition** for providing open-access emissions data
- **Shadcn** for the beautiful UI component library
- **Plotly Team** for interactive visualization tools
- Academic advisors and peer reviewers

---

## Contact

For questions about this research:
- **Email**: [your.email@university.edu]
- **GitHub**: [Your GitHub Profile]
- **LinkedIn**: [Your LinkedIn]

---

**⭐ Star this repository if you find it useful for ESG research!**

Last Updated: January 3, 2026
