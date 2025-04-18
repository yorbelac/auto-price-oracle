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

interface ResultsDisplayProps {
  carData: CarFormData;
}

export function ResultsDisplay({ carData }: ResultsDisplayProps) {
  // Calculate value score
  const valueScore = calculateValueScore(
    carData.price,
    carData.mileage,
    carData.make
  );
  
  // Get rating from score
  const rating = getRatingFromScore(valueScore);
  
  // Get maximum mileage for this make
  const maxMileage = MAX_MILEAGE_BY_MAKE[carData.make.toLowerCase()] || 250000;
  
  // Calculate remaining mileage
  const remainingMiles = Math.max(0, maxMileage - carData.mileage);
  
  // Calculate percentage of life used
  const lifeUsedPercentage = Math.min(100, Math.round((carData.mileage / maxMileage) * 100));
  
  // Calculate cost per mile
  const costPerMile = remainingMiles > 0 ? carData.price / remainingMiles : 0;
  
  // Determine color based on rating
  const getRatingColor = () => {
    switch(rating) {
      case "Excellent": return "text-green-600";
      case "Very Good": return "text-green-500";
      case "Good": return "text-blue-500";
      case "Fair": return "text-yellow-500";
      case "Below Average": return "text-orange-500";
      case "Poor": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <Card className="w-full h-full shadow-lg border-blue-200">
      <CardHeader className="bg-blue-700 text-white rounded-t-lg py-4">
        <CardTitle className="text-center text-2xl">Car Value Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="text-center">
          <h3 className="text-xl font-medium">{carData.year} {carData.make} {carData.model}</h3>
          <p className="text-gray-500">
            {formatNumber(carData.mileage)} miles | {formatCurrency(carData.price)}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Vehicle Life</span>
            <div className="flex items-center gap-2">
              <span>{formatNumber(carData.mileage)} / {formatNumber(maxMileage)} miles</span>
              <MaxMileageModal />
            </div>
          </div>
          <div className="relative pt-1 pb-1">
            <Progress 
              value={Math.min(100, (carData.mileage / maxMileage) * 100)} 
              className="h-2"
            />
            <div 
              className="absolute h-4 w-0.5 bg-red-500 -bottom-1"
              style={{ left: `${(maxMileage / Math.max(maxMileage, carData.mileage)) * 100}%` }}
            />
          </div>
          {carData.mileage > maxMileage && (
            <div className="text-sm text-red-500 mt-1">
              This vehicle has exceeded its estimated maximum life by {formatNumber(carData.mileage - maxMileage)} miles
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 py-8">
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-2">Remaining Miles</p>
            <p className="text-3xl font-semibold">{formatNumber(remainingMiles)}</p>
          </div>
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-2">Cost Per Mile</p>
            <p className="text-3xl font-semibold">
              {remainingMiles > 0 ? `$${costPerMile.toFixed(2)}` : "N/A"}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-2">Value Rating</p>
          <p className={`text-4xl font-bold ${getRatingColor()} mb-4`}>
            {rating}
          </p>
          <div className="text-sm text-gray-500">
            <p>
              This score is calculated based on the car's price divided by its remaining estimated life.
              A lower score indicates better value for money.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
