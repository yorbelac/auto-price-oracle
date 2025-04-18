import { useState, useEffect } from "react";
import { CarForm, CarFormData } from "./CarForm";
import { ResultsDisplay } from "./ResultsDisplay";
import { SavedListings } from "./SavedListings";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { carService, CarData } from "../services/carService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const CarValueCalculator = () => {
  const [calculatedCar, setCalculatedCar] = useState<CarFormData | null>(null);
  const [savedListings, setSavedListings] = useState<CarData[]>([]);
  const [selectedListing, setSelectedListing] = useState<CarData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedListings();
  }, []);

  const loadSavedListings = async () => {
    try {
      setIsLoading(true);
      const listings = await carService.getCars();
      // Ensure listings is always an array
      setSavedListings(Array.isArray(listings) ? listings : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to server. Please make sure you are logged in.');
      setSavedListings([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData: CarFormData) => {
    try {
      // Set the calculated car immediately for instant feedback
      setCalculatedCar(formData);

      // Transform model to modelName for backend compatibility
      const carData = {
        ...formData,
        modelName: formData.model,
      };
      delete (carData as any).model;

      let savedCar;
      if (selectedListing?._id) {
        savedCar = await carService.updateCar(selectedListing._id, carData);
        toast.success('Car listing updated successfully');
      } else {
        savedCar = await carService.createCar(carData);
        toast.success('Car listing saved successfully');
      }

      // Refresh the listings
      await loadSavedListings();
      setSelectedListing(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save car listing');
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await carService.deleteCar(id);
      await loadSavedListings();
      toast.success('Car listing deleted successfully');
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete car listing');
    }
  };

  const handleSelectListing = (listing: CarData) => {
    // Transform modelName back to model for frontend compatibility
    const formData: CarFormData = {
      ...listing,
      model: listing.modelName,
    };
    setSelectedListing(listing);
    setCalculatedCar(formData);
  };

  const handleClearListings = async () => {
    try {
      // Delete all listings one by one
      await Promise.all(savedListings.map(listing => carService.deleteCar(listing._id!)));
      setSavedListings([]);
      setCalculatedCar(null);
      toast.success('All listings cleared');
    } catch (err) {
      console.error(err);
      setError('Failed to clear listings');
    }
  };

  const handleCancelEdit = () => {
    setSelectedListing(null);
    setCalculatedCar(null);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Top section with two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column - Car Form */}
        <div className="h-full">
          <Card className="h-[calc(100%-2rem)] shadow-lg border-blue-200">
            <CardHeader className="bg-blue-700 text-white rounded-t-lg py-4">
              <CardTitle className="text-center text-2xl">Enter Car Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CarForm
                onSubmit={handleFormSubmit}
                onCancel={handleCancelEdit}
                initialData={selectedListing ? {
                  ...selectedListing,
                  model: selectedListing.modelName,
                } : undefined}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right column - Value Analysis */}
        <div className="h-full">
          <div className="h-[calc(100%-2rem)]">
            {calculatedCar ? (
              <ResultsDisplay carData={calculatedCar} />
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500 h-full flex items-center justify-center">
                <div>
                  <p className="text-lg mb-2">No Car Selected</p>
                  <p>Enter car details or select a saved listing to see value analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section - Saved Listings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Saved Listings</h2>
        <SavedListings
          listings={savedListings.map(listing => ({
            ...listing,
            model: listing.modelName,
          }))}
          onDelete={handleDeleteListing}
          onSelect={handleSelectListing}
          onEdit={handleSelectListing}
          onClear={handleClearListings}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
