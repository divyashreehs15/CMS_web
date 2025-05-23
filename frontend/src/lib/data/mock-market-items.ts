import { MarketItem } from "./types";

// Mock data for the comprehensive market data table
export const mockMarketItems: MarketItem[] = [
  // Indices
  {
    id: "sp500",
    name: "S&P 500",
    country: "USA",
    value: 5123.45,
    change1D: 0.75,
    change1W: 1.25,
    change1M: 2.5,
    change3M: 4.2,
    change6M: 8.7,
    change1Y: 15.3,
    trend: [5000, 5050, 5100, 5080, 5120, 5123.45],
    type: 'index'
  },
  {
    id: "nasdaq",
    name: "NASDAQ",
    country: "USA",
    value: 16234.56,
    change1D: 1.2,
    change1W: 2.1,
    change1M: 3.8,
    change3M: 7.5,
    change6M: 12.3,
    change1Y: 22.7,
    trend: [15800, 15900, 16100, 16000, 16200, 16234.56],
    type: 'index'
  },
  {
    id: "dowjones",
    name: "Dow Jones",
    country: "USA",
    value: 38765.32,
    change1D: 0.45,
    change1W: 0.95,
    change1M: 1.8,
    change3M: 3.2,
    change6M: 6.5,
    change1Y: 11.2,
    trend: [38500, 38600, 38700, 38650, 38730, 38765.32],
    type: 'index'
  },
  {
    id: "ftse100",
    name: "FTSE 100",
    country: "UK",
    value: 7654.32,
    change1D: -0.3,
    change1W: 0.5,
    change1M: 1.2,
    change3M: 2.8,
    change6M: 5.4,
    change1Y: 8.7,
    trend: [7600, 7620, 7640, 7630, 7650, 7654.32],
    type: 'index'
  },
  {
    id: "nikkei225",
    name: "Nikkei 225",
    country: "Japan",
    value: 38123.45,
    change1D: -0.5,
    change1W: -1.2,
    change1M: 2.3,
    change3M: 4.5,
    change6M: 7.8,
    change1Y: 14.2,
    trend: [37800, 37900, 38000, 38050, 38100, 38123.45],
    type: 'index'
  },
  {
    id: "sensex",
    name: "SENSEX",
    country: "India",
    value: 72345.67,
    change1D: 1.1,
    change1W: 2.3,
    change1M: 4.5,
    change3M: 8.7,
    change6M: 15.4,
    change1Y: 25.6,
    trend: [71500, 71800, 72000, 72200, 72300, 72345.67],
    type: 'index'
  },
  {
    id: "dax",
    name: "DAX",
    country: "Germany",
    value: 17654.32,
    change1D: 0.6,
    change1W: 1.3,
    change1M: 2.7,
    change3M: 5.1,
    change6M: 9.8,
    change1Y: 16.5,
    trend: [17500, 17550, 17600, 17620, 17640, 17654.32],
    type: 'index'
  },
  {
    id: "cac40",
    name: "CAC 40",
    country: "France",
    value: 7543.21,
    change1D: 0.4,
    change1W: 0.9,
    change1M: 1.9,
    change3M: 3.8,
    change6M: 7.2,
    change1Y: 13.5,
    trend: [7500, 7520, 7530, 7525, 7540, 7543.21],
    type: 'index'
  },
  {
    id: "ssecomp",
    name: "SSE Composite",
    country: "China",
    value: 3123.45,
    change1D: -0.8,
    change1W: -1.5,
    change1M: -2.3,
    change3M: -3.5,
    change6M: 1.2,
    change1Y: 5.4,
    trend: [3150, 3140, 3130, 3125, 3120, 3123.45],
    type: 'index'
  },
  {
    id: "asx200",
    name: "ASX 200",
    country: "Australia",
    value: 7654.32,
    change1D: 0.3,
    change1W: 0.7,
    change1M: 1.5,
    change3M: 3.2,
    change6M: 6.1,
    change1Y: 11.3,
    trend: [7620, 7630, 7640, 7645, 7650, 7654.32],
    type: 'index'
  },
  
  // Commodities
  {
    id: "gold",
    name: "Gold",
    value: 2345.67,
    change1D: 0.8,
    change1W: 1.5,
    change1M: 3.2,
    change3M: 6.7,
    change6M: 12.4,
    change1Y: 18.5,
    trend: [2300, 2320, 2330, 2340, 2342, 2345.67],
    type: 'commodity'
  },
  {
    id: "silver",
    name: "Silver",
    value: 28.45,
    change1D: 1.2,
    change1W: 2.3,
    change1M: 4.5,
    change3M: 8.7,
    change6M: 15.3,
    change1Y: 22.4,
    trend: [27.5, 27.8, 28.0, 28.2, 28.3, 28.45],
    type: 'commodity'
  },
  {
    id: "crudeoil",
    name: "Crude Oil",
    value: 78.34,
    change1D: -1.2,
    change1W: -2.5,
    change1M: 1.5,
    change3M: 3.2,
    change6M: 5.6,
    change1Y: -8.7,
    trend: [79.5, 79.2, 78.9, 78.7, 78.5, 78.34],
    type: 'commodity'
  },
  {
    id: "naturalgas",
    name: "Natural Gas",
    value: 2.34,
    change1D: -0.5,
    change1W: -1.2,
    change1M: -2.5,
    change3M: -4.5,
    change6M: -8.7,
    change1Y: -15.3,
    trend: [2.4, 2.38, 2.36, 2.35, 2.34, 2.34],
    type: 'commodity'
  },
  {
    id: "copper",
    name: "Copper",
    value: 4.56,
    change1D: 0.7,
    change1W: 1.4,
    change1M: 2.8,
    change3M: 5.6,
    change6M: 10.2,
    change1Y: 15.7,
    trend: [4.5, 4.52, 4.54, 4.55, 4.56, 4.56],
    type: 'commodity'
  },
  {
    id: "platinum",
    name: "Platinum",
    value: 987.65,
    change1D: 0.4,
    change1W: 0.9,
    change1M: 1.8,
    change3M: 3.6,
    change6M: 7.2,
    change1Y: 12.5,
    trend: [980, 982, 984, 985, 986, 987.65],
    type: 'commodity'
  },
  {
    id: "palladium",
    name: "Palladium",
    value: 1234.56,
    change1D: -0.3,
    change1W: -0.7,
    change1M: -1.5,
    change3M: -3.2,
    change6M: -6.5,
    change1Y: -12.3,
    trend: [1240, 1238, 1236, 1235, 1234, 1234.56],
    type: 'commodity'
  },
  {
    id: "wheat",
    name: "Wheat",
    value: 6.78,
    change1D: 1.1,
    change1W: 2.3,
    change1M: 4.5,
    change3M: 8.9,
    change6M: 12.3,
    change1Y: -5.6,
    trend: [6.7, 6.72, 6.74, 6.76, 6.77, 6.78],
    type: 'commodity'
  },
  
  // Bonds
  {
    id: "us10y",
    name: "US 10Y",
    value: 4.25,
    change1D: 0.02,
    change1W: 0.05,
    change1M: 0.12,
    change3M: 0.25,
    change6M: 0.45,
    change1Y: 0.75,
    trend: [4.20, 4.22, 4.23, 4.24, 4.25, 4.25],
    type: 'bond'
  },
  {
    id: "us30y",
    name: "US 30Y",
    value: 4.45,
    change1D: 0.01,
    change1W: 0.03,
    change1M: 0.08,
    change3M: 0.18,
    change6M: 0.35,
    change1Y: 0.65,
    trend: [4.40, 4.42, 4.43, 4.44, 4.45, 4.45],
    type: 'bond'
  },
  {
    id: "us2y",
    name: "US 2Y",
    value: 4.15,
    change1D: 0.03,
    change1W: 0.07,
    change1M: 0.15,
    change3M: 0.30,
    change6M: 0.55,
    change1Y: 0.85,
    trend: [4.10, 4.12, 4.13, 4.14, 4.15, 4.15],
    type: 'bond'
  },
  {
    id: "germany10y",
    name: "Germany 10Y",
    value: 2.35,
    change1D: -0.01,
    change1W: -0.03,
    change1M: -0.08,
    change3M: -0.15,
    change6M: -0.25,
    change1Y: 0.35,
    trend: [2.40, 2.38, 2.37, 2.36, 2.35, 2.35],
    type: 'bond'
  },
  {
    id: "uk10y",
    name: "UK 10Y",
    value: 3.85,
    change1D: -0.02,
    change1W: -0.05,
    change1M: -0.10,
    change3M: -0.20,
    change6M: -0.35,
    change1Y: 0.45,
    trend: [3.90, 3.88, 3.87, 3.86, 3.85, 3.85],
    type: 'bond'
  },
  {
    id: "japan10y",
    name: "Japan 10Y",
    value: 0.85,
    change1D: 0.01,
    change1W: 0.02,
    change1M: 0.05,
    change3M: 0.10,
    change6M: 0.20,
    change1Y: 0.35,
    trend: [0.80, 0.82, 0.83, 0.84, 0.85, 0.85],
    type: 'bond'
  },
  
  // Currencies
  {
    id: "eurusd",
    name: "EUR/USD",
    value: 1.0845,
    change1D: -0.12,
    change1W: -0.25,
    change1M: 0.45,
    change3M: 0.85,
    change6M: 1.25,
    change1Y: -2.35,
    trend: [1.086, 1.085, 1.084, 1.083, 1.084, 1.0845],
    type: 'currency'
  },
  {
    id: "gbpusd",
    name: "GBP/USD",
    value: 1.2654,
    change1D: 0.15,
    change1W: 0.35,
    change1M: 0.75,
    change3M: 1.25,
    change6M: 2.15,
    change1Y: -1.45,
    trend: [1.263, 1.264, 1.265, 1.264, 1.265, 1.2654],
    type: 'currency'
  },
  {
    id: "usdjpy",
    name: "USD/JPY",
    value: 151.23,
    change1D: 0.25,
    change1W: 0.65,
    change1M: 1.25,
    change3M: 2.45,
    change6M: 4.75,
    change1Y: 8.35,
    trend: [150.8, 150.9, 151.0, 151.1, 151.2, 151.23],
    type: 'currency'
  },
  {
    id: "usdcad",
    name: "USD/CAD",
    value: 1.3456,
    change1D: -0.10,
    change1W: -0.25,
    change1M: -0.55,
    change3M: -1.15,
    change6M: -2.25,
    change1Y: 1.75,
    trend: [1.347, 1.346, 1.345, 1.346, 1.345, 1.3456],
    type: 'currency'
  },
  {
    id: "audusd",
    name: "AUD/USD",
    value: 0.6543,
    change1D: 0.20,
    change1W: 0.45,
    change1M: 0.95,
    change3M: 1.85,
    change6M: 3.45,
    change1Y: -2.75,
    trend: [0.652, 0.653, 0.654, 0.653, 0.654, 0.6543],
    type: 'currency'
  },
  {
    id: "nzdusd",
    name: "NZD/USD",
    value: 0.6123,
    change1D: 0.15,
    change1W: 0.35,
    change1M: 0.75,
    change3M: 1.45,
    change6M: 2.85,
    change1Y: -3.25,
    trend: [0.610, 0.611, 0.612, 0.611, 0.612, 0.6123],
    type: 'currency'
  },
  {
    id: "usdchf",
    name: "USD/CHF",
    value: 0.8765,
    change1D: -0.05,
    change1W: -0.15,
    change1M: -0.35,
    change3M: -0.75,
    change6M: -1.45,
    change1Y: 2.35,
    trend: [0.877, 0.876, 0.875, 0.876, 0.875, 0.8765],
    type: 'currency'
  },
];