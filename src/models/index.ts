// src/models/index.tsx

export interface SupplyRatioData {
    date: string;       // in short-hand form, e.g. "Jan 1"
    Actual: number;     // int
    Utilized: number;   // int
    Ratio: number;      // float
  }