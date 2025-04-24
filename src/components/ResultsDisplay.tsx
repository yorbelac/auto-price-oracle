import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  calculateValueScore, 
  getRatingFromScore, 
  formatCurrency, 
  formatNumber,
  getEstimatedLifetimeMiles,
  MAX_MILEAGE_BY_MAKE
} from "@/utils/carCalculations";
import { CarFormData } from "./CarForm";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, InfoIcon, Fuel, Car } from "lucide-react";
import vehicleData from '@/data/vehicle-data.json';
import { VehicleData, getVehicleModelData } from '@/utils/vehicleDataTypes';
import { GasPriceModal } from "./GasPriceModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResultsDisplayProps {
  carData: CarFormData | null;
  gasPrice: number;
  onGasPriceChange: (price: number) => void;
}

// MaxMileageModal component
function MaxMileageModal() {
  // Convert the MAX_MILEAGE_BY_MAKE object into an array of [make, miles] pairs and ensure miles is a number
  const makes = Object.entries(MAX_MILEAGE_BY_MAKE).sort((a, b) => a[0].localeCompare(b[0]));
  const midpoint = Math.ceil(makes.length / 2);
  const leftColumn = makes.slice(0, midpoint);
  const rightColumn = makes.slice(midpoint);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2" title="View Estimated Lifetime Miles">
          <Car className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Maximum Mileage Estimates</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-4">
              These estimates are based on general brand reliability data and represent typical maximum mileage expectations. 
              Actual vehicle lifespan can vary significantly based on:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Model year and technological improvements</li>
              <li>Maintenance history and care</li>
              <li>Driving conditions and climate</li>
              <li>Model-specific reliability</li>
            </ul>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            {/* Headers */}
            <div className="font-semibold py-2 border-b">Make</div>
            <div className="text-right font-semibold py-2 border-b">Max Miles</div>
            <div className="font-semibold py-2 border-b">Make</div>
            <div className="text-right font-semibold py-2 border-b">Max Miles</div>
            
            {/* Left column data */}
            {leftColumn.map(([make, miles]) => (
              <React.Fragment key={make}>
                <div className="py-2 capitalize">{make}</div>
                <div className="text-right py-2">{Number(miles).toLocaleString()}</div>
              </React.Fragment>
            ))}
            
            {/* Right column data */}
            {rightColumn.map(([make, miles]) => (
              <React.Fragment key={make}>
                <div className="py-2 capitalize">{make}</div>
                <div className="text-right py-2">{Number(miles).toLocaleString()}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ResultsDisplay({ carData, gasPrice, onGasPriceChange }: ResultsDisplayProps) {
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
  
  const maxMileage = carData ? getEstimatedLifetimeMiles(carData.make) : 200000;
  
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
    <Card className="shadow-lg border-blue-200">
      <CardHeader className="bg-blue-700 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white">
                ${gasPrice.toFixed(2)}/gal
              </span>
              <GasPriceModal gasPrice={gasPrice} onGasPriceChange={onGasPriceChange} />
            </div>
            <MaxMileageModal />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!carData ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">Enter vehicle details to see analysis</p>
            <p className="text-sm">Fill out the form on the left to calculate:</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Value rating based on price and remaining life</li>
              <li>• Cost per mile including fuel expenses</li>
              <li>• EPA fuel economy data (when available)</li>
              <li>• Vehicle life usage percentage</li>
            </ul>
          </div>
        ) : (
          <>
            {/* Life Used Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span>Life Used ({formatNumber(carData.mileage)} of {formatNumber(maxMileage)} miles)</span>
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
