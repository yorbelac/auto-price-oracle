import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  calculateValueScore, 
  getRatingFromScore, 
  formatCurrency, 
  formatNumber 
} from "@/utils/carCalculationsEPA";
import { CarFormData } from "./CarForm";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, InfoIcon, Fuel } from "lucide-react";
import vehicleData from '@/data/vehicle-data.json';
import { VehicleData, getVehicleModelData } from '@/utils/vehicleDataTypes';
import { GasPriceModal } from "./GasPriceModal";

interface ResultsDisplayProps {
  carData: CarFormData | null;
}

export function ResultsDisplay({ carData }: ResultsDisplayProps) {
  const [gasPrice, setGasPrice] = useState(0);
  // Get EPA data if available
  const modelData = carData ? getVehicleModelData(
    vehicleData as VehicleData,
    carData.year.toString(),
    carData.make,
    carData.model
  ) : null;

  // Calculate values only if we have valid data
  const valueScore = carData ? calculateValueScore(
    carData.price,
    carData.mileage,
    carData.make,
    carData.model,
    carData.year.toString()
  ) : 0;
  
  const rating = carData ? getRatingFromScore(valueScore) : "N/A";
  
  const maxMileage = modelData?.estimatedLifetimeMiles || 200000;
  
  const remainingMiles = carData ? 
    Math.max(0, maxMileage - carData.mileage) : 
    maxMileage;
  
  const lifeUsedPercentage = carData ? 
    Math.min(100, Math.round((carData.mileage / maxMileage) * 100)) :
    0;
  
  const costPerMile = carData && remainingMiles > 0 ? 
    (() => {
      // Base cost from purchase price
      const baseCost = carData.price / remainingMiles;
      
      // Add fuel cost if we have gas price and MPG data
      if (gasPrice > 0 && modelData?.mpg.combined) {
        const fuelCostPerMile = gasPrice / modelData.mpg.combined;
        return baseCost + fuelCostPerMile;
      }
      
      return baseCost;
    })() : 
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
    <Card className="w-full h-full shadow-lg border-blue-200">
      <CardHeader className="bg-blue-700 text-white rounded-t-lg flex flex-row items-center justify-between">
        <CardTitle className="text-center text-2xl">Value Analysis</CardTitle>
        <div className="flex items-center">
          {gasPrice > 0 && (
            <span className="text-sm mr-2">${gasPrice.toFixed(2)}/gal</span>
          )}
          <GasPriceModal gasPrice={gasPrice} onGasPriceChange={setGasPrice} />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!carData ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <AlertTriangle className="h-12 w-12 mb-4" />
            <p className="text-center">
              Enter car details to see value analysis
            </p>
          </div>
        ) : (
          <>
            {/* Life Used Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span>Life Used</span>
                <span>{lifeUsedPercentage}%</span>
              </div>
              <Progress value={lifeUsedPercentage} className="h-2" />
            </div>

            {/* EPA Data Display */}
            {modelData && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">City MPG</p>
                    <p className="text-lg font-semibold">{modelData.mpg.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Highway MPG</p>
                    <p className="text-lg font-semibold">{modelData.mpg.highway}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Combined MPG</p>
                    <p className="text-lg font-semibold">{modelData.mpg.combined}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Vehicle Type: {modelData.type}
                </p>
              </div>
            )}

            {/* Value Metrics */}
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
                {gasPrice > 0 && modelData?.mpg.combined && (
                  <p className="text-xs text-blue-600 text-center mt-1">
                    Includes fuel cost at ${gasPrice.toFixed(2)}/gal
                  </p>
                )}
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
                  Score calculated based on price, remaining life, and fuel efficiency. Lower scores indicate better value.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
