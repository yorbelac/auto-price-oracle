// Car value calculation utilities

// Default maximum mileage for different car types (in miles)
export const DEFAULT_MAX_MILEAGE = 200000;

// Maximum mileage by car make (based on reliability data and brand reputation)
export const MAX_MILEAGE_BY_MAKE: Record<string, number> = {
  "acura": 230000,
  "alfa romeo": 180000,
  "amc": 150000,
  "audi": 180000,
  "bentley": 150000,
  "bmw": 180000,
  "buick": 200000,
  "cadillac": 190000,
  "chevrolet": 200000,
  "chery": 150000,
  "chrysler": 180000,
  "daewoo": 150000,
  "datsun": 180000,
  "dodge": 180000,
  "eagle": 150000,
  "ferrari": 100000,
  "fiat": 150000,
  "ford": 200000,
  "genesis": 200000,
  "geo": 180000,
  "gmc": 200000,
  "holden": 180000,
  "honda": 240000,
  "hsv": 180000,
  "hummer": 150000,
  "hyundai": 200000,
  "infiniti": 200000,
  "isuzu": 200000,
  "jaguar": 150000,
  "jeep": 200000,
  "kenworth": 500000,
  "kia": 200000,
  "lamborghini": 100000,
  "land rover": 150000,
  "lexus": 250000,
  "lincoln": 190000,
  "lotus": 100000,
  "mahindra": 180000,
  "maruti": 180000,
  "maserati": 150000,
  "mazda": 210000,
  "mercedes": 180000,
  "mercedes-benz": 180000,
  "mercury": 180000,
  "mini": 150000,
  "mitsubishi": 190000,
  "nissan": 210000,
  "oldsmobile": 180000,
  "opel": 180000,
  "peugeot": 180000,
  "plymouth": 150000,
  "pontiac": 180000,
  "porsche": 150000,
  "ram": 200000,
  "renault": 180000,
  "rivian": 200000,
  "rover": 150000,
  "saab": 180000,
  "saturn": 180000,
  "scion": 200000,
  "seat": 180000,
  "skoda": 200000,
  "smart": 150000,
  "ssangyong": 180000,
  "subaru": 220000,
  "suzuki": 200000,
  "tata": 180000,
  "tesla": 300000,
  "toyota": 250000,
  "vauxhall": 180000,
  "volkswagen": 200000,
  "volvo": 200000,
  "yugo": 100000,
  "zimmer": 100000
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
  if (valueScore < 0.08) return "Excellent";
  if (valueScore < 0.15) return "Very Good";
  if (valueScore < 0.25) return "Good";
  if (valueScore < 0.40) return "Fair";
  if (valueScore < 0.60) return "Below Average";
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

/**
 * Get the estimated lifetime miles for a given car make
 * @param make Car make to look up
 * @returns Estimated lifetime miles for the make
 */
export function getEstimatedLifetimeMiles(make: string): number {
  const makeNormalized = make.toLowerCase().trim();
  return MAX_MILEAGE_BY_MAKE[makeNormalized] || DEFAULT_MAX_MILEAGE;
}
