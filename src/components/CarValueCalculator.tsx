import { useState, useEffect } from "react";
import { CarForm, CarFormData } from "./CarForm";
import { ResultsDisplay } from "./ResultsDisplay";
import { SavedListings } from "./SavedListings";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "savedCarListings";

export function CarValueCalculator() {
  const [calculatedCar, setCalculatedCar] = useState<CarFormData | null>(null);
  const [savedListings, setSavedListings] = useState<CarFormData[]>([]);
  const [editingListing, setEditingListing] = useState<CarFormData | null>(null);

  // Load saved listings from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSavedListings(JSON.parse(saved));
    }
  }, []);

  const handleFormSubmit = (data: CarFormData) => {
    setCalculatedCar(data);
    
    if (editingListing) {
      // Update existing listing
      const updatedListings = savedListings.map(listing => 
        listing === editingListing ? data : listing
      );
      setSavedListings(updatedListings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedListings));
      setEditingListing(null);
      toast.success("Listing updated successfully!");
    } else {
      // Add new listing
      const newListings = [...savedListings, data];
      setSavedListings(newListings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));
      toast.success("Listing saved successfully!");
    }
  };

  const handleClearListings = () => {
    setSavedListings([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("All listings cleared!");
  };

  const handleEditListing = (listing: CarFormData) => {
    setEditingListing(listing);
    setCalculatedCar(listing);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteListings = (indices: number[]) => {
    const newListings = savedListings.filter((_, index) => !indices.includes(index));
    setSavedListings(newListings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));
    toast.success(`Deleted ${indices.length} listing${indices.length > 1 ? 's' : ''}`);
  };

  const handleNewCar = () => {
    setEditingListing(null);
    setCalculatedCar(null);
    toast.success("Form cleared for new car entry");
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800">
              {editingListing ? "Edit Car Details" : "Enter Car Details"}
            </h2>
            {editingListing && (
              <Button
                variant="outline"
                onClick={handleNewCar}
                className="text-blue-600 hover:text-blue-800"
              >
                New Car
              </Button>
            )}
          </div>
          <CarForm 
            onSubmit={handleFormSubmit} 
            initialData={editingListing || undefined}
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            {calculatedCar ? "Value Analysis" : "Result Preview"}
          </h2>
          {calculatedCar ? (
            <ResultsDisplay carData={calculatedCar} />
          ) : (
            <div className="w-full max-w-md h-[520px] flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-400">
              Enter car details to see the value analysis
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <SavedListings 
          listings={savedListings} 
          onClear={handleClearListings}
          onEdit={handleEditListing}
          onDelete={handleDeleteListings}
        />
      </div>
    </div>
  );
}
