import { useState, useEffect } from "react";
import { CarForm, CarFormData } from "./CarForm";
import { ResultsDisplay } from "./ResultsDisplay";
import { SavedListings } from "./SavedListings";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Copy } from "lucide-react";

const STORAGE_KEY = "savedCarListings";
const SAVED_LISTS_KEY = "savedCarListsCollection";
const CURRENT_LIST_NAME_KEY = "currentListName";

export function CarValueCalculator() {
  const [calculatedCar, setCalculatedCar] = useState<CarFormData | null>(null);
  const [savedListings, setSavedListings] = useState<CarFormData[]>([]);
  const [editingListing, setEditingListing] = useState<CarFormData | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareData, setShareData] = useState("");
  const [savedLists, setSavedLists] = useState<Array<{ name: string; listings: CarFormData[] }>>([]);
  const [currentListName, setCurrentListName] = useState<string>("");
  const [editingListingIndex, setEditingListingIndex] = useState<number | null>(null);

  // Load saved listings, lists, and current list name from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSavedListings(JSON.parse(saved));
    }
    const savedListsData = localStorage.getItem(SAVED_LISTS_KEY);
    if (savedListsData) {
      setSavedLists(JSON.parse(savedListsData));
    }
    const currentName = localStorage.getItem(CURRENT_LIST_NAME_KEY);
    if (currentName) {
      setCurrentListName(currentName);
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
    setCurrentListName(name);
    // Update current listings to match the saved list
    setSavedListings(listings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify(updatedLists));
    localStorage.setItem(CURRENT_LIST_NAME_KEY, name);
    toast.success(`List "${name}" ${existingIndex !== undefined ? 'updated' : 'saved'} successfully!`);
  };

  const handleLoadList = (listings: CarFormData[], name: string) => {
    setSavedListings(listings);
    setCurrentListName(name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    localStorage.setItem(CURRENT_LIST_NAME_KEY, name);
    toast.success("List loaded successfully!");
  };

  const handleDeleteList = (index: number) => {
    const updatedLists = savedLists.filter((_, i) => i !== index);
    setSavedLists(updatedLists);
    // If we're deleting the current list, clear the current list name
    if (savedLists[index].name === currentListName) {
      setCurrentListName("");
      localStorage.removeItem(CURRENT_LIST_NAME_KEY);
    }
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
