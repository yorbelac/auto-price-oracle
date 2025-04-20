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
    if (editingListing) {
      // Update existing listing
      const updatedListings = savedListings.map(listing => 
        listing === editingListing ? data : listing
      );
      setSavedListings(updatedListings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedListings));
      setEditingListing(null);
      setCalculatedCar(null);
      toast.success("Listing updated successfully!");
    } else {
      // Add new listing
      const newListings = [...savedListings, data];
      setSavedListings(newListings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));
      toast.success("Listing saved successfully!");
    }
  };

  const handleFormChange = (data: CarFormData) => {
    setCalculatedCar(data);
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

  const handleTogglePin = (index: number) => {
    const updatedListings = savedListings.map((listing, i) => 
      i === index ? { ...listing, pinned: !listing.pinned } : listing
    );
    setSavedListings(updatedListings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedListings));
    toast.success(updatedListings[index].pinned ? "Listing pinned!" : "Listing unpinned");
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <div className="flex-1">
            <CarForm 
              onSubmit={handleFormSubmit} 
              onChange={handleFormChange}
              initialData={editingListing || undefined}
            />
          </div>
        </div>
        
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <ResultsDisplay carData={calculatedCar} />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <SavedListings 
          listings={savedListings} 
          onClear={handleClearListings}
          onEdit={handleEditListing}
          onDelete={handleDeleteListings}
          onTogglePin={handleTogglePin}
        />
      </div>
    </div>
  );
}
