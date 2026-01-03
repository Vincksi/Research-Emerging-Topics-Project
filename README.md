# ESG Stranded Assets Analysis: Carbon Transition Risk in Copper Mining

## Overview

This research project provides a comprehensive financial risk assessment of the global copper mining industry under carbon pricing scenarios, analyzing 914 mining assets across 56+ countries to identify stranded asset risk in the transition to a low-carbon economy.

### Key Research Questions

1. Which copper mining assets become unprofitable under carbon pricing? ($50-$200/tCO₂ scenarios)
2. What is the total financial exposure of the industry to carbon costs?
3. How are emissions trending over time (2021-2024)?
4. Can we predict stranded asset risk using machine learning?

### Key Findings

- $9.52 billion annual carbon cost exposure at $100/tCO₂ (production mines)
- 28.3% of assets (259 mines) at critical or high stranding risk
- $14.28 billion swing between $50 and $200 carbon pricing scenarios
- +0.99% CAGR in emissions (2021-2024)
- Top 10% of assets account for 51.6% of total exposure
- Median break-even price: $776/tCO₂

---

## Table of Contents

- [Dataset](#dataset)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Analysis](#analysis)
- [Web Application](#web-application)
- [Methodology](#methodology)
- [Technical Stack](#technical-stack)
- [Future Work](#future-work)
- [License](#license)

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

## Installation

### Prerequisites

- Python: 3.9 or higher
- Node.js: 18.x or higher (for web application)
- Git: For cloning the repository

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
python -c "import pandas, numpy, plotly, sklearn; print('All packages installed!')"
```

## Usage

### Running Jupyter Notebooks

1. Start Jupyter Lab:
```bash
jupyter lab
```

2. Navigate to notebooks/ folder

3. Run notebooks in this order:
   - Data_Exploration_and_Cleaning.ipynb - Initial data processing
   - Stranded_Assets_Analysis.ipynb - Main analysis
   - Financial_Analysis.ipynb - Break-even pricing and profitability impact
   - Q1_Enhanced_Analysis.ipynb - Machine learning models and interactive tools
   - Climate_Stress_Testing_and_Portfolio Simulation.ipynb - Advanced scenario modeling

### Running the Web Application

1. Navigate to app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser: Navigate to http://localhost:5173

5. Build for production:
```bash
npm run build
```

## Project Structure

```
Research-Emerging-Topics-Project/
│
├── README.md                                   # Project documentation
├── requirements.txt                            # Python dependencies
├── .gitignore                                  # Git ignore rules
│
├── datasets/     
│   ├── input_data/                             # Raw data files
│   └── output_data/                            # Processed data
│       ├── cleaning/                           # Outputs from data cleaning
│       ├── financial/                          # Financial analysis outputs
│       ├── portfolio_simulation/               # Portfolio analysis
│       └── stranded_assets/                    # Stranded assets analysis
│
├── notebooks/                                  # Jupyter notebooks for analysis      
│   ├── Data_Exploration_and_Cleaning.ipynb
│   ├── Stranded_Assets_Analysis.ipynb
│   ├── Financial_Analysis.ipynb
│   └── Climate_Stress_Testing_and_Portfolio_Simulation.ipynb
│
└── app/                                        # Web application
    ├── src/
    │   ├── components/                         # React components
    │   │   └── dashboard/                      # Dashboard components
    │   ├── pages/                              # Application pages
    │   ├── hooks/                              # Custom React hooks
    │   ├── lib/                                # Utility functions
    │   └── types/                              # TypeScript type definitions
    ├── public/
    │   └── data/                               # Data files for the web app
    ├── package.json                            # Node.js dependencies
    └── vite.config.ts                          # Vite configuration
```

## Detailed Project Description

This project provides a comprehensive analysis of carbon transition risks in the global copper mining industry. It combines data analysis, financial modeling, and web visualization to assess the impact of carbon pricing on mining assets worldwide.

### Key Components

1. **Data Processing Pipeline**
   - Ingests raw emissions data from Climate TRACE
   - Cleans and processes data for analysis
   - Generates derived metrics and risk indicators
   - `Data_Exploration_and_Cleaning.ipynb`: Initial data processing and quality checks

2. **Analytical Notebooks**
   - `Stranded_Assets_Analysis.ipynb`: Identifies assets at risk of becoming stranded
   - `Financial_Analysis.ipynb`: Evaluates financial impacts of carbon pricing
   - `Climate_Stress_Testing_and_Portfolio_Simulation.ipynb`: Simulates different climate scenarios

3. **Web Application**
   - Interactive dashboard for data exploration
   - Visualization of key metrics and trends
   - Scenario analysis tools

### Data Flow

1. **Input Data**
   - Raw emissions data from Climate TRACE
   - Asset-level production and financial data
   - Carbon pricing scenarios

2. **Processing**
   - Data cleaning and validation
   - Feature engineering
   - Risk scoring and classification

3. **Outputs**
   - Processed datasets
   - Analytical reports
   - Interactive visualizations

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18.x+
- Jupyter Lab
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Research-Emerging-Topics-Project.git
   cd Research-Emerging-Topics-Project
   ```

2. Set up Python environment:
   ```bash
   # Using conda (recommended)
   conda create -n esg-analysis python=3.9
   conda activate esg-analysis
   pip install -r requirements.txt
   
   # Or using venv
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Install Node.js dependencies:
   ```bash
   cd app
   npm install
   ```

## Usage

### Running Analysis

1. Start Jupyter Lab:
   ```bash
   jupyter lab
   ```

2. Open and run notebooks in the `notebooks/` directory in order:
   - Start with `Data_Exploration_and_Cleaning.ipynb`
   - Proceed with the remaining notebooks in sequence

### Running the Web Application

1. From the project root:
   ```bash
   cd app
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

## Data Management

### Input Data
- Location: `datasets/input_data/`
- Format: CSV, JSON
- Update Frequency: As needed

### Output Data
- Location: `datasets/output_data/`
- Organized by analysis type (cleaning, financial, etc.)
- Includes processed datasets and analysis results

## Analysis

Key analysis components include:
- Stranded assets assessment
- Financial risk modeling
- Carbon pricing scenarios
- Machine learning predictions
- Portfolio stress testing

## Web Application

### Technology Stack

- Frontend: React 18 with TypeScript
- Backend: Python 3.9+
- Database: CSV loading via PapaParse

### Features

- Interactive Dashboard: KPI cards, risk distribution charts
- Asset Explorer: Searchable data tables with filtering
- Geographic Mapping: Asset locations with risk overlays
- Scenario Comparison: Toggle between carbon pricing scenarios
- Company Portfolios: Aggregated exposure by parent company
- Risk Panels: Drill-down by Critical/High/Moderate/Low risk categories

## Key Outputs

### Analysis Datasets (in data/ and notebooks/)

| File | Description | Records |
|------|-------------|---------|
| copper_mining_with_risk_categories.csv | All assets with risk classifications | 914 |
| critical_risk_assets.csv | Top 21 critical risk mines | 21 |
| company_carbon_exposure.csv | Top 25 companies by exposure | 25 |
| divestment_candidates.csv | High-risk, low-performance assets | Variable |
| low_risk_opportunities.csv | Low-carbon, high-capacity assets | 28 |
| financial_analysis_complete.csv | Break-even pricing & profitability | 601 |
| ml_risk_predictions.csv | Machine learning risk scores | 608 |
| temporal_trends_2021_2024.csv | Emission trajectories | 914 |
| mine_type_vulnerability.csv | Risk by mine type | Variable |
| stranding_cascade_data.csv | Stranding thresholds ($0-$250) | 51 |

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Climate TRACE Coalition for providing open-access emissions data
- Shadcn for the beautiful UI component library
- Plotly Team for interactive visualization tools
- Academic advisors and peer reviewers

## Future Work

- Expand data coverage with recent emissions
- Enhance prediction models
- Improve web application features
- Add more interactive visualizations

Last Updated: January 3, 2026
