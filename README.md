# Ripe FX Transparency Widget

A production-ready, embeddable React widget designed to showcase competitive stablecoin-to-fiat conversion rates for Southeast Asian markets. This tool emphasizes transparency by explicitly breaking down fees, spreads, and network costs compared to legacy banking solutions.

## Features

- **Real-time FX Calculator**: Instant conversion estimates from USDC to PHP, THB, IDR, MYR, and VND.
- **Transparent Fee Breakdown**: Detailed line items for Gross Amount, Ripe Fee (0.5%), Network Gas, and Net Received.
- **Competitor Comparison**: Interactive bar chart comparing Ripe's rates against traditional banking legacy rates, highlighting potential savings.
- **Smart Input Handling**: Supports decimal handling and quick-select presets ($100, $1000, etc.).
- **URL State Synchronization**: Shareable quotes via URL parameters (`?amount=1000&currency=THB`).
- **Responsive Design**: Mobile-first UI built with Tailwind CSS, featuring smooth animations and a polished aesthetic.

## Pricing Model

The calculator uses the following logic defined in `constants.ts`:

- **Customer Rate**: Competitive spread closer to interbank rates.
- **Ripe Fee**: Flat **0.5%** of the transaction volume.
- **Network Fee**: Flat **$1.00** USD equivalent for gas/processing.
- **Legacy Comparison**: Simulates a traditional bank with a **3.0%** fee + **$5.00** flat fee and a wider spread.

## Supported Currencies

| Currency Code | Name |
|--------------|------|
| **PHP** | Philippine Peso |
| **THB** | Thai Baht |
| **IDR** | Indonesian Rupiah |
| **MYR** | Malaysian Ringgit |
| **VND** | Vietnamese Dong |

## Technology Stack

- **Framework**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Fonts**: Inter (Google Fonts)

## Project Structure

- **`components/RipeWidget.tsx`**: The core widget component containing state logic, UI rendering, and chart visualizations.
- **`services/calcService.ts`**: Pure business logic for calculating conversions, fees, and formatting currency strings.
- **`constants.ts`**: Configuration for supported currencies, exchange rates, and fee structures.
- **`types.ts`**: TypeScript definitions for currency configurations and calculation results.

## Usage

The widget initializes with default values but listens to URL parameters for pre-filling data:

```
https://your-app-url.com/?amount=5000&currency=IDR
```

This allows marketing teams or partners to send pre-configured quote links to potential customers.
