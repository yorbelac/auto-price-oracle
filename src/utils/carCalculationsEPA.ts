import vehicleData from '../data/vehicle-data.json';
import { VehicleData, getVehicleModelData, getCombinedMPG } from './vehicleDataTypes';

const DEFAULT_LIFETIME_MILES = 200000;

/**
 * Calculate the value score of a car using EPA data
 * @param price Purchase price of the car
 * @param currentMileage Current mileage of the car
 * @param make Car make
 * @param model Car model
 * @param year Car year
 * @returns Value score (price per remaining mile, adjusted for fuel efficiency)
 */
export function calculateValueScore(
  price: number,
  currentMileage: number,
  make: string,
  model: string,
  year: string
): number {
  // Get vehicle data from EPA database
  const modelData = getVehicleModelData(vehicleData as VehicleData, year, make, model);
  
  // Get maximum mileage from EPA data or use default
  const maxMileage = modelData?.estimatedLifetimeMiles || DEFAULT_LIFETIME_MILES;
  
  // Calculate remaining miles
  const remainingMiles = Math.max(0, maxMileage - currentMileage);
  
  // If no remaining miles, return a very high score (bad value)
  if (remainingMiles <= 0) {
    return Number.MAX_SAFE_INTEGER;
  }
  
  // Get MPG adjustment factor (higher MPG = better value)
  const mpgAdjustment = modelData ? calculateMPGAdjustment(modelData) : 1;
  
  // Calculate value score (price per remaining mile, adjusted for fuel efficiency)
  const valueScore = (price / remainingMiles) / mpgAdjustment;
  
  return valueScore;
}

/**
 * Calculate MPG adjustment factor
 * Higher MPG = lower factor = better value score
 */
function calculateMPGAdjustment(modelData: any): number {
  const combinedMPG = getCombinedMPG(modelData);
  if (combinedMPG <= 0) return 1;
  
  // Base adjustment on MPG relative to average (assumed 25 MPG)
  const avgMPG = 25;
  return avgMPG / combinedMPG;
}

/**
 * Get a rating text based on the value score
 * @param valueScore The calculated value score
 * @returns A string rating from "Excellent" to "Poor"
 */
export function getRatingFromScore(valueScore: number): string {
  // Adjusted thresholds to account for MPG adjustment
  if (valueScore < 0.06) return "Excellent";
  if (valueScore < 0.12) return "Very Good";
  if (valueScore < 0.20) return "Good";
  if (valueScore < 0.35) return "Fair";
  if (valueScore < 0.50) return "Below Average";
  return "Poor";
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format a currency value
 */
export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
} 