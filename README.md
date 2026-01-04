# ESG Stranded Assets Analysis: Carbon Transition Risk in Copper Mining

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Academic-green.svg)]()

## Overview

This research project provides a comprehensive **financial risk assessment** of the global copper mining industry under various carbon pricing scenarios. By analyzing **914 mining assets** across 56+ countries, we identify stranded asset risks associated with the transition to a low-carbon economy.

### Key Research Questions

1.  **Financial Vulnerability**: Which copper mining assets become unprofitable under carbon pricing scenarios ($50–$200/tCO₂)?
2.  **Industry Exposure**: What is the total financial exposure of the global copper industry to carbon costs?
3.  **Emission Trajectories**: How are emissions trending over time (2021–2024), and which assets are improving?
4.  **Risk Modeling**: Can we effectively categorize and predict stranded asset risk using quantitative metrics?

### Key Findings

-   **$9.52 billion** annual carbon cost exposure at $100/tCO₂ (for production mines).
-   **28.3%** of assets (259 mines) identified at critical or high stranding risk.
-   **$14.28 billion swing** in total industry cost between $50 and $200 carbon pricing scenarios.
-   **Top 10%** of assets account for **51.6%** of total industry exposure (significant concentration risk).
-   **Median break-even price**: $776/tCO₂ (indicating resilience for the majority of current operations).

---

## Table of Contents

-   [Dataset](#dataset)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Analysis Notebooks](#analysis-notebooks)
-   [Web Application](#web-application)
-   [Key Outputs](#key-outputs)
-   [Methodology](#methodology)
-   [Technical Stack](#technical-stack)
-   [Future Work](#future-work)
-   [Citations](#citations)
-   [License](#license)

---

## Dataset

### Source: Climate TRACE v5.2.0

**Climate TRACE** (Tracking Real-time Atmospheric Carbon Emissions) provides detailed inventories of greenhouse gas emissions by combining satellite imagery, AI, and ground-level sensors.

-   **Sector**: Mineral Extraction - Copper Mining
-   **Version**: 5.2.0 (Released 2025)
-   **Temporal Coverage**: 2021 – 2024 (Monthly records)
-   **Total Assets**: 914 global assets
-   **Total Observations**: 51,184 monthly emission records

**Data Attribution**:
```text
Climate TRACE Coalition (2025). Copper Mining Emissions Database v5.2.0.
Available at: https://climatetrace.org
```

### Data Processing

The raw dataset has been cleaned and enhanced with:
-   **Ownership Mapping**: Parent company identification for asset-level aggregation.
-   **Carbon Cost Modeling**: Calculations for $50, $100, $150, and $200/tCO₂ scenarios.
-   **Risk Categorization**: Classification into Critical, High, Moderate, and Low risk based on cost and intensity.
-   **Financial Metrics**: Estimated revenue impact and break-even carbon pricing.

**Technical Reference**: `Mineral Extraction sector-Mining and Quarrying Emissions from Copper, Iron, Bauxite, Rock and Sand.pdf`

---

## Installation

### Prerequisites

-   **Python**: 3.9+
-   **Node.js**: 18.x / **Bun**: 1.1+ (recommended for the web app)
-   **Git**: For version control

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Research-Emerging-Topics-Project.git
cd Research-Emerging-Topics-Project
```

### 2. Python Environment Setup (Analysis)

```bash
# Using venv
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Web Application Setup

```bash
cd app
npm install  # or 'bun install'
```

---

## Usage

### Running Jupyter Notebooks

1.  Navigate to the root directory and start Jupyter:
    ```bash
    jupyter lab
    ```
2.  Open and run the notebooks in the `notebooks/` directory in the following order:
    1.  `Data_Exploration_and_Cleaning.ipynb`: Preprocessing and feature engineering.
    2.  `Stranded_Assets_Analysis.ipynb`: Main risk assessment and asset categorization.
    3.  `Financial_Analysis.ipynb`: Profitability impact and break-even pricing.
    4.  `Climate_Stress_Testing_and_Portfolio Simulation.ipynb`: Scenario modeling and Monte Carlo simulations.

### Running the Web Application

1.  Navigate to the `app/` directory:
    ```bash
    cd app
    npm run dev  # or 'bun dev'
    ```
2.  Open your browser to `http://localhost:5173` to explore the interactive dashboard.

---

## Project Structure

```text
Research-Emerging-Topics-Project/
├── app/                                        # React/TypeScript Dashboard
│   ├── public/data/                            # CSV data consumed by the app
│   ├── src/
│   │   ├── components/                         # UI and Dashboard components
│   │   └── pages/                              # Application routes
│   └── vite.config.ts
├── datasets/                                   # Data storage
│   ├── input_data/                             # Raw Climate TRACE v5.2.0 CSVs
│   └── output_data/                            # Processed analysis outputs
├── notebooks/                                  # Research and Analysis Notebooks
│   ├── Data_Exploration_and_Cleaning.ipynb
│   ├── Stranded_Assets_Analysis.ipynb
│   ├── Financial_Analysis.ipynb
│   └── Climate_Stress_Testing_and_Portfolio Simulation.ipynb
│ 
├── requirements.txt                            # Python dependencies
├── .gitignore                                  # Git exclusions
└── README.md                                   # Project documentation
```

---

## Analysis Notebooks

### 1. Data Exploration & Cleaning
Initial processing of the Climate TRACE dataset. Handles missing values, performs parent company mapping, and aggregates monthly data into annual snapshots for 2021–2024.

### 2. Stranded Assets Analysis
**The core research module.** Identifies "At-Risk" assets by cross-referencing carbon cost (total exposure) with carbon intensity (efficiency). Categorizes all 914 assets into four risk tiers.

### 3. Financial Analysis
Applies financial metrics to the emissions data. Calculates the **Carbon Break-Even Price** (CBEP) for each asset and analyzes the "stranding cascade"—the point at which a critical mass of the industry becomes unprofitable.

### 4. Climate Stress Testing
Uses Monte Carlo simulations to model uncertainty in carbon pricing and production volatility. Evaluates portfolio-level risk for major mining companies.

---

## Web Application

The interactive dashboard provides a visual interface for the research findings, allowing users to drill down into specific assets, countries, or companies.

-   **Interactive KPI Cards**: Real-time updates based on selected carbon price scenarios.
-   **Risk Distribution**: Visualizing the industry split across risk categories.
-   **Global Asset Map**: Geographic visualization of carbon hotspots.
-   **Company Portfolio Explorer**: Aggregated risk views for the world's largest copper producers.

**Tech Stack**: React 18, TypeScript, Tailwind CSS, Shadcn/UI, Plotly.js, and Vite.

---

## Key Outputs

The following processed datasets are available in `app/public/data/` for use in the dashboard or further analysis:

| File | Description |
| :--- | :--- |
| `copper_mining_with_risk_categories.csv` | Full dataset with risk classifications (914 assets). |
| `critical_risk_assets.csv` | Deep dive into the most vulnerable 21 assets. |
| `company_carbon_exposure.csv` | Aggregated exposure for the top 25 mining companies. |
| `divestment_candidates.csv` | List of assets showing high-risk and deteriorating trends. |
| `low_risk_opportunities.csv` | Comparison set of low-carbon, high-resilience assets. |

---

## Methodology

### Carbon Risk Metrics
We define risk using two primary axes:
1.  **Total Exposure**: $\text{Annual Emissions} \times \text{Carbon Price}$
2.  **Carbon Intensity**: $\frac{\text{tCO}_2}{\text{tCu}}$ (tonnes of CO₂ per tonne of copper produced)

### Financial Assumptions
-   **Copper Benchmark Price**: $9,500/tonne.
-   **Average Operating Margin**: 30%.
-   **Stranding Threshold**: An asset is considered "at risk" if carbon costs exceed 30% of estimated revenue (wiping out operating margin).

---

## Technical Stack

### Data Science (Python)
-   **Processing**: `pandas`, `numpy`
-   **Visualization**: `plotly`, `matplotlib`, `seaborn`
-   **Analysis**: `scipy`, `scikit-learn`

### Web Frontend
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS, Lucide React
-   **Components**: Radix UI (via Shadcn)
-   **Visualization**: Plotly.js, Recharts

---

## Future Work

-   **Scope 3 Integration**: Expanding the analysis to include smelting and transport emissions.
-   **Predictive Modeling**: Using LSTM/Time-Series models to forecast future emission trajectories based on historical satellite data.
-   **Real-time API**: Integrating directly with the Climate TRACE API for live asset monitoring.

---

## Citations

### Data Source
-   Climate TRACE Coalition (2025). *Copper Mining Emissions Database v5.2.0*. [https://climatetrace.org](https://climatetrace.org)

### Academic References
-   Caldecott, B., et al. (2016). *Stranded Assets and the Fossil Fuel Divestment Campaign*.
-   IPCC (2023). *Sixth Assessment Report (AR6) - Mitigation of Climate Change*.

---

## Contributors

**Alexis Vannson, Kerrian Le Bars & Othmane Menkor**  
CentraleSupélec | ESSEC Business School | Research & Emerging Topics (2026)

---

## License

This project is released under the **MIT License**. See the `LICENSE` file for details. Academic use of the data is governed by Climate TRACE's terms of service.
