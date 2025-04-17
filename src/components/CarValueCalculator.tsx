
import { useState } from "react";
import { CarForm, CarFormData } from "./CarForm";
import { ResultsDisplay } from "./ResultsDisplay";

export function CarValueCalculator() {
  const [calculatedCar, setCalculatedCar] = useState<CarFormData | null>(null);

  const handleFormSubmit = (data: CarFormData) => {
    setCalculatedCar(data);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Enter Car Details</h2>
          <CarForm onSubmit={handleFormSubmit} />
        </div>
        
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">
            {calculatedCar ? "Value Analysis" : "Result Preview"}
          </h2>
          {calculatedCar ? (
            <ResultsDisplay carData={calculatedCar} />
          ) : (
            <div className="w-full max-w-md h-96 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-400">
              Enter car details to see the value analysis
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
