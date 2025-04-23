export interface MPGData {
  city: string;
  highway: string;
  combined: string;
}

export interface VehicleModelData {
  type: string;
  mpg: MPGData;
  estimatedLifetimeMiles: number;
}

export interface VehicleMakeData {
  [model: string]: VehicleModelData;
}

export interface YearData {
  [make: string]: VehicleMakeData;
}

export interface VehicleData {
  [year: string]: YearData;
}

// Helper function to get all available makes for a given year
export function getAvailableMakes(data: VehicleData, year: string): string[] {
  return Object.keys(data[year] || {});
}

// Helper function to get all available models for a given make and year
export function getAvailableModels(data: VehicleData, year: string, make: string): string[] {
  return Object.keys((data[year] || {})[make] || {});
}

// Helper function to get vehicle data for a specific model
export function getVehicleModelData(
  data: VehicleData,
  year: string,
  make: string,
  model: string
): VehicleModelData | null {
  return ((data[year] || {})[make] || {})[model] || null;
}

// Helper function to get all available years
export function getAvailableYears(data: VehicleData): string[] {
  return Object.keys(data).filter(year => Object.keys(data[year] || {}).length > 0);
}

// Helper function to get combined MPG as a number
export function getCombinedMPG(modelData: VehicleModelData): number {
  return parseInt(modelData.mpg.combined) || 0;
} 