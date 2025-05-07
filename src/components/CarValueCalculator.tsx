import { useState, useEffect, useCallback } from "react";
import { CarForm, CarFormData } from "./CarForm";
import { ResultsDisplay } from "./ResultsDisplay";
import { SavedListings } from "./SavedListings";
import { GuidedTour } from "./GuidedTour";
import { FAQ } from "./FAQ";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Copy } from "lucide-react";

const STORAGE_KEY = "savedCarListings";
const LISTS_STORAGE_KEY = "savedCarLists";

interface SavedList {
  name: string;
  listings: CarFormData[];
}

export function CarValueCalculator() {
  const [calculatedCar, setCalculatedCar] = useState<CarFormData | null>(null);
  const [savedListings, setSavedListings] = useState<CarFormData[]>([]);
  const [editingListing, setEditingListing] = useState<CarFormData | null>(null);
  const [editingListingIndex, setEditingListingIndex] = useState<number | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [currentListName, setCurrentListName] = useState<string>("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareData, setShareData] = useState("");
  const [gasPrice, setGasPrice] = useState(0);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(() => {
    return !localStorage.getItem(STORAGE_KEY) && !localStorage.getItem(LISTS_STORAGE_KEY);
  });

  const handleFormSubmit = (data: CarFormData) => {
    if (editingListing && editingListingIndex !== null) {
      // Update existing listing
      const updatedListings = savedListings.map((listing, index) => {
        if (index === editingListingIndex) {
          // Keep the pinned status when updating
          return { ...data, pinned: listing.pinned };
        }
        return listing;
      });
      setSavedListings(updatedListings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedListings));
      setEditingListing(null);
      setEditingListingIndex(null);
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

  const handleEditListing = (listing: CarFormData, index: number) => {
    setEditingListing(listing);
    setEditingListingIndex(index);
    setCalculatedCar(listing);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingListing(null);
    setEditingListingIndex(null);
    setCalculatedCar(null);
  };

  const handleDeleteListings = (indices: number[]) => {
    const newListings = savedListings.filter((_, index) => !indices.includes(index));
    setSavedListings(newListings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));
    setSelectedIndices([]);
    toast.success(`Deleted ${indices.length} listing${indices.length > 1 ? 's' : ''}`);
  };

  const handleTogglePin = (index: number) => {
    const newListings = savedListings.map((listing, i) => {
      if (i === index) {
        return { ...listing, pinned: !listing.pinned };
      }
      return listing;
    });
    setSavedListings(newListings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));
  };

  const handleSaveList = (name: string, listings: CarFormData[], existingIndex?: number) => {
    if (existingIndex !== undefined) {
      // Replace existing list
      const updatedLists = savedLists.map((list, index) => 
        index === existingIndex ? { name, listings } : list
      );
      setSavedLists(updatedLists);
      localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(updatedLists));
      setCurrentListName(name);
      toast.success(`Updated list "${name}"`);
    } else {
      // Add new list
      const newList = { name, listings };
      const updatedLists = [...savedLists, newList];
      setSavedLists(updatedLists);
      localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(updatedLists));
      setCurrentListName(name);
      toast.success(`Saved list "${name}"`);
    }
  };

  const handleLoadList = (listings: CarFormData[], name: string) => {
    // Update the current listings
    setSavedListings([...listings]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    
    // Update the current list name
    setCurrentListName(name);
    
    // Reset editing state
    setEditingListing(null);
    setEditingListingIndex(null);
    setCalculatedCar(null);
    
    toast.success(`Loaded list "${name}"`);
  };

  const handleDeleteList = (name: string) => {
    const updatedLists = savedLists.filter(l => l.name !== name);
    setSavedLists(updatedLists);
    localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(updatedLists));
    if (currentListName === name) {
      setCurrentListName("");
    }
    toast.success(`Deleted list "${name}"`);
  };

  const handleShare = (listings?: CarFormData[]) => {
    try {
      const dataToShare = listings || savedListings;
      const cleanListings = dataToShare.map(listing => ({
        make: listing.make,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        mileage: listing.mileage,
        condition: listing.condition,
        url: listing.url,
        pinned: listing.pinned
      }));

      const exportData = [{
        name: currentListName || "My Listings",
        listings: cleanListings
      }];

      const jsonStr = JSON.stringify(exportData, null, 2);
      setShareData(jsonStr);
      setShowShareDialog(true);
    } catch (error) {
      toast.error("Failed to prepare data for sharing");
      console.error('Error preparing data for share:', error);
    }
  };

  const handleImport = (data: string) => {
    try {
      const importedData = JSON.parse(data);
      
      if (!Array.isArray(importedData)) {
        throw new Error("Invalid import data: Expected an array");
      }

      importedData.forEach((list, index) => {
        if (!list.name || !Array.isArray(list.listings)) {
          throw new Error(`Invalid list at index ${index}: Missing name or listings`);
        }

        list.listings.forEach((listing: any, listingIndex: number) => {
          if (!listing.make || !listing.model || !listing.year || 
              typeof listing.price !== 'number' || typeof listing.mileage !== 'number') {
            throw new Error(`Invalid listing in list "${list.name}" at index ${listingIndex}`);
          }
        });
      });

      // Import the first list's listings
      if (importedData.length > 0) {
        const firstList = importedData[0];
        setSavedListings(firstList.listings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(firstList.listings));
        setCurrentListName(firstList.name);
        toast.success(`Imported list "${firstList.name}"`);
      }
    } catch (error) {
      toast.error("Failed to import data");
      console.error('Error importing data:', error);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedListsData = localStorage.getItem(LISTS_STORAGE_KEY);

    if (!savedData && !savedListsData) {
      // Set flag for guided tour
      localStorage.setItem('shouldShowGuidedTour', 'true');
      // Create sample car listings
      const sampleListings = [
        {
          make: "Jeep",
          model: "Compass 4WD",
          year: 2021,
          price: 14000,
          mileage: 35000,
          condition: "Excellent",
          url: "",
          pinned: false
        },
        {
          make: "Ford",
          model: "Explorer AWD",
          year: 2013,
          price: 11000,
          mileage: 112000,
          condition: "Excellent",
          url: "",
          pinned: false
        },
        {
          make: "Honda",
          model: "Accord",
          year: 2013,
          price: 5800,
          mileage: 215000,
          condition: "Good",
          url: "",
          pinned: false
        }
      ] as const;

      // Import the listings (inline logic)
      const newListings = [...savedListings, ...sampleListings];
      setSavedListings(newListings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));

      // Create and save the sample list separately
      const sampleList = {
        name: "Sample Cars",
        listings: [...sampleListings]
      };
      setSavedLists([sampleList]);
      localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify([sampleList]));
    } else {
      // Load existing data if available
      if (savedData) {
        setSavedListings(JSON.parse(savedData));
      }
      if (savedListsData) {
        setSavedLists(JSON.parse(savedListsData));
      }
    }
  }, [savedListings]);

  return (
    <div className="container mx-auto px-4 py-8">
      <GuidedTour isFirstTimeUser={isFirstTimeUser} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <div className="flex-1">
            <CarForm 
              onSubmit={handleFormSubmit} 
              onChange={handleFormChange}
              initialData={editingListing || undefined}
              onCancel={handleCancel}
            />
          </div>
        </div>
        
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <ResultsDisplay 
              carData={calculatedCar} 
              gasPrice={gasPrice}
              onGasPriceChange={setGasPrice}
            />
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
          currentListName={currentListName}
          gasPrice={gasPrice}
        />
      </div>

      <footer className="mt-12 mb-8 text-center text-gray-500 border-t border-gray-100 pt-8">
        <FAQ />
        <div className="max-w-2xl mx-auto mt-8">
          <p className="text-sm">
            Have feedback, found an issue, or want to suggest an improvement?{" "}
            <a 
              href="mailto:support@workpool.app?subject=Carpool Feedback" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Email us
            </a>
          </p>
        </div>
      </footer>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Listings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Export Listings</h3>
              <div className="relative">
                <textarea
                  className="w-full h-32 p-2 border rounded"
                  value={shareData}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-blue-700 hover:bg-blue-800 text-white hover:text-white border-0"
                  onClick={() => {
                    navigator.clipboard.writeText(shareData);
                    toast.success("Copied to clipboard!");
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
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
