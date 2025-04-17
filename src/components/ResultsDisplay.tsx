
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
  const maxMileage = MAX_MILEAGE_BY_MAKE[carData.make.toLowerCase()] || 200000;
  
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
    <Card className="w-full max-w-md shadow-lg border-blue-200">
      <CardHeader className="bg-blue-700 text-white rounded-t-lg">
        <CardTitle className="text-center text-2xl">Car Value Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">{carData.year} {carData.make} {carData.model}</h3>
          <p className="text-gray-500">
            {formatNumber(carData.mileage)} miles | {formatCurrency(carData.price)}
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Vehicle Life Used</span>
            <span>{lifeUsedPercentage}%</span>
          </div>
          <Progress value={lifeUsedPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Remaining Miles</p>
            <p className="text-lg font-semibold">{formatNumber(remainingMiles)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Cost Per Mile</p>
            <p className="text-lg font-semibold">
              {remainingMiles > 0 ? `$${costPerMile.toFixed(2)}` : "N/A"}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Value Rating</p>
          <p className={`text-3xl font-bold ${getRatingColor()}`}>
            {rating}
          </p>
        </div>
        
        <div className="text-sm text-gray-500 mt-4">
          <p>
            This score is calculated based on the car's price divided by its remaining estimated life.
            A lower score indicates better value for money.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
