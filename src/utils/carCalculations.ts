
// Car value calculation utilities

// Default maximum mileage for different car types (in miles)
export const DEFAULT_MAX_MILEAGE = 200000;

// Maximum mileage by car make (you can expand this with real data)
export const MAX_MILEAGE_BY_MAKE: Record<string, number> = {
  "toyota": 250000,
  "honda": 240000,
  "ford": 200000,
  "chevrolet": 200000,
  "bmw": 180000,
  "mercedes": 180000,
  "audi": 180000,
  "volkswagen": 200000,
  "lexus": 250000,
  "subaru": 220000,
  "hyundai": 200000,
  "kia": 200000,
  "nissan": 210000,
  "mazda": 210000,
  "jeep": 200000,
  "dodge": 180000,
  "chrysler": 180000,
};

/**
 * Calculate the value score of a car
 * @param price Purchase price of the car
 * @param currentMileage Current mileage of the car
 * @param make Car make for determining max mileage
 * @returns Value score (price per remaining mile)
 */
export function calculateValueScore(
  price: number,
  currentMileage: number,
  make: string = ""
): number {
  // Get maximum mileage based on make
  const makeNormalized = make.toLowerCase().trim();
  const maxMileage = MAX_MILEAGE_BY_MAKE[makeNormalized] || DEFAULT_MAX_MILEAGE;
  
  // Calculate remaining miles
  const remainingMiles = Math.max(0, maxMileage - currentMileage);
  
  // If no remaining miles, return a very high score (bad value)
  if (remainingMiles <= 0) {
    return Number.MAX_SAFE_INTEGER;
  }
  
  // Calculate value score (price per remaining mile)
  const valueScore = price / remainingMiles;
  
  return valueScore;
}

/**
 * Get a rating text based on the value score
 * @param valueScore The calculated value score
 * @returns A string rating from "Excellent" to "Poor"
 */
export function getRatingFromScore(valueScore: number): string {
  if (valueScore < 0.1) return "Excellent";
  if (valueScore < 0.2) return "Very Good";
  if (valueScore < 0.3) return "Good";
  if (valueScore < 0.5) return "Fair";
  if (valueScore < 0.8) return "Below Average";
  return "Poor";
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
