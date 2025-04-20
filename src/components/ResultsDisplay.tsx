import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  calculateValueScore, 
  getRatingFromScore, 
  formatCurrency, 
  formatNumber,
  MAX_MILEAGE_BY_MAKE
} from "@/utils/carCalculations";
import { CarFormData } from "./CarForm";
import { Progress } from "@/components/ui/progress";
import { MaxMileageModal } from "./MaxMileageModal";
import { AlertTriangle, InfoIcon } from "lucide-react";

interface ResultsDisplayProps {
  carData: CarFormData | null;
}

export function ResultsDisplay({ carData }: ResultsDisplayProps) {
  // Calculate values only if we have valid data
  const valueScore = carData ? calculateValueScore(
    carData.price,
    carData.mileage,
    carData.make
  ) : 0;
  
  const rating = carData ? getRatingFromScore(valueScore) : "N/A";
  
  const maxMileage = carData?.make ? 
    (MAX_MILEAGE_BY_MAKE[carData.make.toLowerCase()] || 250000) : 
    250000;
  
  const remainingMiles = carData ? 
    Math.max(0, maxMileage - carData.mileage) : 
    maxMileage;
  
  const lifeUsedPercentage = carData ? 
    Math.min(100, Math.round((carData.mileage / maxMileage) * 100)) :
    0;
  
  const costPerMile = carData && remainingMiles > 0 ? 
    carData.price / remainingMiles : 
    0;
  
  // Determine color based on rating
  const getRatingColor = () => {
    switch(rating) {
      case "Excellent": return "text-green-600";
      case "Very Good": return "text-green-500";
      case "Good": return "text-blue-500";
      case "Fair": return "text-yellow-500";
      case "Below Average": return "text-orange-500";
      case "Poor": return "text-red-500";
      default: return "text-gray-400";
    }
  };

  return (
    <Card className="w-full h-full shadow-lg border-blue-200 flex flex-col">
      <CardHeader className="bg-blue-700 text-white rounded-t-lg shrink-0 pb-4">
        {carData && (
          <div className="text-center">
            <h3 className="text-xl font-medium text-white/90">
              {carData.year} {carData.make} {carData.model}
            </h3>
            <p className="text-white/75 text-sm mt-1">
              {formatNumber(carData.mileage)} miles | {formatCurrency(carData.price)}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-8 flex-1 flex flex-col">
        {!carData ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
            Enter car details to see analysis
          </div>
        ) : (
          <>
            {/* Vehicle Life Section */}
            <div className="space-y-2 mb-8">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Vehicle Life</span>
                  <MaxMileageModal />
                </div>
                <span className="text-gray-600">
                  {formatNumber(carData.mileage)} / {formatNumber(maxMileage)} miles
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={lifeUsedPercentage}
                  className="h-2.5"
                />
                <div 
                  className="absolute h-5 w-0.5 bg-red-500 -bottom-1.5"
                  style={{ left: `${(maxMileage / Math.max(maxMileage, carData.mileage)) * 100}%` }}
                />
              </div>
              {carData.mileage > maxMileage && (
                <div className="text-sm text-red-500 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Exceeded estimated life by {formatNumber(carData.mileage - maxMileage)} miles</span>
                </div>
              )}
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium mb-1 text-center">Remaining Miles</p>
                <p className="text-2xl font-bold text-green-800 text-center">
                  {formatNumber(remainingMiles)}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium mb-1 text-center">Cost Per Mile</p>
                <p className="text-2xl font-bold text-blue-800 text-center">
                  ${costPerMile.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Value Rating */}
            <div className="flex-1 flex flex-col justify-center items-center mb-6">
              <p className="text-sm text-gray-600 font-medium mb-2">Value Rating</p>
              <p className={`text-5xl font-bold ${getRatingColor()}`}>
                {rating}
              </p>
            </div>

            {/* Info Text */}
            <div className="text-sm text-gray-500 mt-auto border-t pt-4">
              <div className="flex items-start gap-2">
                <InfoIcon className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  Score calculated from price divided by remaining life. Lower scores indicate better value.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
