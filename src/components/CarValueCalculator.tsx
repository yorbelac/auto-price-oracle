
import { useState, useEffect } from "react";
import { CarForm, CarFormData } from "./CarForm";
import { ResultsDisplay } from "./ResultsDisplay";
import { SavedListings } from "./SavedListings";
import { toast } from "@/components/ui/sonner";

const STORAGE_KEY = "savedCarListings";

export function CarValueCalculator() {
  const [calculatedCar, setCalculatedCar] = useState<CarFormData | null>(null);
  const [savedListings, setSavedListings] = useState<CarFormData[]>([]);

  // Load saved listings from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSavedListings(JSON.parse(saved));
    }
  }, []);

  const handleFormSubmit = (data: CarFormData) => {
    setCalculatedCar(data);
    const newListings = [...savedListings, data];
    setSavedListings(newListings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));
    toast.success("Listing saved successfully!");
  };

  const handleClearListings = () => {
    setSavedListings([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("All listings cleared!");
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Enter Car Details</h2>
          <CarForm onSubmit={handleFormSubmit} />
          <SavedListings listings={savedListings} onClear={handleClearListings} />
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
