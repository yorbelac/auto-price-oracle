import { useState, useEffect } from "react";
import { CarForm, CarFormData } from "./CarForm";
import { ResultsDisplay } from "./ResultsDisplay";
import { SavedListings } from "./SavedListings";
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

  // Load saved listings and lists from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setSavedListings(JSON.parse(savedData));
    }

    const savedListsData = localStorage.getItem(LISTS_STORAGE_KEY);
    if (savedListsData) {
      setSavedLists(JSON.parse(savedListsData));
    }
  }, []);

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

  const handleShare = async (indices: number[]) => {
    const selectedListings = savedListings.filter((_, index) => indices.includes(index));
    const text = selectedListings.map(listing => 
      `${listing.year} ${listing.make} ${listing.model}\n` +
      `Price: $${listing.price.toLocaleString()}\n` +
      `Mileage: ${listing.mileage.toLocaleString()}\n` +
      (listing.url ? `Listing: ${listing.url}\n` : '') +
      '---'
    ).join('\n\n');

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
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
              onCancel={handleCancel}
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
          currentListName={currentListName}
        />
      </div>

      <footer className="mt-12 mb-8 text-center text-gray-500 border-t border-gray-100 pt-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm">
            Have feedback, found an issue, or want to suggest an improvement?{" "}
            <a 
              href="mailto:yorbelac@gmail.com?subject=Carpool Feedback" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Email me
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
