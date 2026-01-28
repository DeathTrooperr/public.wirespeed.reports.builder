# Wirespeed Security Operations Reports

A professional security report generator for Wirespeed Managed Detection & Response (MDR). This tool generates comprehensive, high-fidelity A4 security operations reports directly from the Wirespeed API, optimized for both digital viewing and high-quality printing.

## 🚀 Features

- **Automated Data Retrieval**: Integrates directly with the Wirespeed API to fetch real-time security telemetry.
- **Professional Layout**: Precision-engineered A4 document structure with automatic page breaking and consistent headers/footers.
- **Comprehensive Reporting Sections**:
    - **Executive Summary**: High-level overview of security posture and service coverage.
    - **Detection Analysis**: Detailed breakdown of alert processing pipelines and funnel metrics.
    - **MDR Activity**: Chronological list of escalated cases with severity levels and response summaries.
    - **Asset Intelligence**: Endpoint OS distribution and identity-based attack analysis.
    - **Data Ingestion**: Visual representation of telemetry sources and event volumes.
- **Flexible Timeframes**: Support for Monthly, Quarterly, Yearly, and Custom reporting periods.
- **Print-Ready**: Optimized CSS for pixel-perfect PDF export and physical printing.

## 🛠 Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev) (using Runes for state management)
- **Meta-framework**: [SvelteKit](https://kit.svelte.dev)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Language**: TypeScript

## 🏁 Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- A Wirespeed API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/WirespeedReports.git
   cd WirespeedReports
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open your browser to `http://localhost:5173`. You can enter your Wirespeed API key in the sidebar to preview reports with live data.

### Deployment

This project is configured for deployment on Cloudflare Workers using `@sveltejs/adapter-cloudflare`.

1. Authenticate with Wrangler:
   ```bash
   npx wrangler login
   ```

2. Deploy the application:
   ```bash
   npm run deploy
   ```

## 📄 Usage

1. **Enter API Key**: Provide your Wirespeed API key in the configuration sidebar.
2. **Select Period**: Choose between monthly, quarterly, yearly, or custom date ranges.
3. **Generate**: Click "Generate Report" to fetch data and render the live preview.
4. **Print/Save**: Use the "Print / Download" button to save the report as a PDF using your browser's print functionality. For best results, ensure "Background Graphics" is enabled in your print settings.

## 🏗 Project Structure

- `src/lib/server/wirespeed`: API client and data fetching logic.
- `src/lib/components/pages/home/layout`: Core document structure components (Header, Footer, Section wrappers).
- `src/lib/components/pages/home/reportPages`: Individual report page implementations.
- `src/routes/api/report/generate`: Backend endpoint for data aggregation and sanitization.

---

Built with ❤️ by a Wirespeed user.
