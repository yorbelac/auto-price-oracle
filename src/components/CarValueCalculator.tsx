import { useState, useEffect } from "react";
import { CarForm, CarFormData } from "./CarForm";
import { ResultsDisplay } from "./ResultsDisplay";
import { SavedListings } from "./SavedListings";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2 } from "lucide-react";

const STORAGE_KEY = "savedCarListings";
const SAVED_LISTS_KEY = "savedCarListsCollection";

export function CarValueCalculator() {
  const [calculatedCar, setCalculatedCar] = useState<CarFormData | null>(null);
  const [savedListings, setSavedListings] = useState<CarFormData[]>([]);
  const [editingListing, setEditingListing] = useState<CarFormData | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareData, setShareData] = useState("");
  const [savedLists, setSavedLists] = useState<Array<{ name: string; listings: CarFormData[] }>>([]);

  // Load saved listings and lists from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSavedListings(JSON.parse(saved));
    }
    const savedListsData = localStorage.getItem(SAVED_LISTS_KEY);
    if (savedListsData) {
      setSavedLists(JSON.parse(savedListsData));
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
    // Only clear selected listings
    const newListings = savedListings.filter((_, index) => !selectedIndices.includes(index));
    setSavedListings(newListings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));
    toast.success(`Deleted ${selectedIndices.length} listing${selectedIndices.length > 1 ? 's' : ''}`);
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

  const handleShare = () => {
    const dataToShare = JSON.stringify(savedListings);
    setShareData(dataToShare);
    setShowShareDialog(true);
  };

  const handleSaveList = (name: string, listings: CarFormData[], existingIndex?: number) => {
    let updatedLists;
    if (existingIndex !== undefined) {
      // Replace existing list
      updatedLists = savedLists.map((list, index) => 
        index === existingIndex ? { name, listings } : list
      );
    } else {
      // Add new list
      updatedLists = [...savedLists, { name, listings }];
    }
    setSavedLists(updatedLists);
    localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify(updatedLists));
    toast.success(`List "${name}" ${existingIndex !== undefined ? 'updated' : 'saved'} successfully!`);
  };

  const handleLoadList = (listings: CarFormData[]) => {
    setSavedListings(listings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    toast.success("List loaded successfully!");
  };

  const handleDeleteList = (index: number) => {
    const updatedLists = savedLists.filter((_, i) => i !== index);
    setSavedLists(updatedLists);
    localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify(updatedLists));
    toast.success("List deleted successfully!");
  };

  const handleImport = (data: string) => {
    try {
      const importedListings = JSON.parse(data);
      if (Array.isArray(importedListings)) {
        const newListings = [...savedListings, ...importedListings];
        setSavedListings(newListings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));
        toast.success("Listings imported successfully!");
        setShowShareDialog(false);
      } else {
        toast.error("Invalid data format");
      }
    } catch (error) {
      toast.error("Failed to import listings");
    }
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
              onNewCar={handleNewCar}
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
          onShare={handleShare}
          onSaveList={handleSaveList}
          onLoadList={handleLoadList}
          onDeleteList={handleDeleteList}
          savedLists={savedLists}
        />
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Listings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Export Listings</h3>
              <textarea
                className="w-full h-32 p-2 border rounded"
                value={shareData}
                readOnly
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Import Listings</h3>
              <textarea
                className="w-full h-32 p-2 border rounded"
                placeholder="Paste listings data here"
                onChange={(e) => handleImport(e.target.value)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
