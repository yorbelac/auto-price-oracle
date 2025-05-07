import { Link as LinkIcon, ExternalLink, TrendingDown, TrendingUp, LayoutGrid, Table as TableIcon, Pencil, Trash2, ChevronUp, ChevronDown, Search, AlertTriangle, Car, DollarSign, Pin, SlidersHorizontal, Share2, List, Grid, Save, RotateCcw, Copy, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatNumber, calculateValueScore, getRatingFromScore, getEstimatedLifetimeMiles } from "@/utils/carCalculations";
import { CarFormData } from "./CarForm";
import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import vehicleData from '@/data/vehicle-data.json';
import { VehicleData, getVehicleModelData } from '@/utils/vehicleDataTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { GasPriceModal } from "./GasPriceModal";
import { trackSaveList, trackImportList, trackExportList } from '@/utils/analytics';

interface SavedListingsProps {
  listings: CarFormData[];
  onClear: () => void;
  onEdit: (listing: CarFormData, index: number) => void;
  onDelete: (indices: number[]) => void;
  onTogglePin: (index: number) => void;
  onShare: (listings?: CarFormData[]) => void;
  onSaveList: (name: string, listings: CarFormData[], existingIndex?: number) => void;
  onLoadList: (listings: CarFormData[], name: string) => void;
  onDeleteList: (name: string) => void;
  onImportLists?: (lists: { name: string; listings: CarFormData[] }[]) => void;
  savedLists?: { name: string; listings: CarFormData[] }[];
  currentListName?: string;
  gasPrice: number;
}

type SortField = 'vehicle' | 'price' | 'mileage' | 'pricePerMile' | 'score';
type SortDirection = 'asc' | 'desc';

interface FilterControlsProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ppmRange: [number, number];
  ppmSliderValue: [number, number];
  onPPMChange: (values: [number, number]) => void;
  yearRange: [number, number];
  onYearChange: (values: [number, number]) => void;
  priceRange: [number, number];
  priceSliderValue: [number, number];
  onPriceChange: (values: [number, number]) => void;
  mileageRange: [number, number];
  onMileageChange: (values: [number, number]) => void;
  mpgRange: [number, number];
  onMpgChange: (values: [number, number]) => void;
  selectedConditions: string[];
  onConditionChange: (conditions: string[]) => void;
  onClearFilters: () => void;
}

// Constants moved outside component
const PRICE_MIN = 0;
const PRICE_MAX = 100000;
const PRICE_BREAKPOINT = 30000;
const PRICE_FIRST_STEP = 1000;
const PRICE_SECOND_STEP = 5000;
const MILEAGE_MIN = 0;
const MILEAGE_MAX = 300000;
const PPM_MIN = 0;
const PPM_MAX = 1.00;
const YEAR_MIN = new Date().getFullYear() - 30;
const YEAR_MAX = new Date().getFullYear();

const PPM_FIRST_BREAKPOINT = 0.30;
const PPM_SECOND_BREAKPOINT = 1.00;
const FINE_STEP = 0.01;
const MEDIUM_STEP = 0.05;

// Add new constants at the top with other constants
const MPG_MIN = 0;
const MPG_MAX = 60;

// Utility functions moved outside component
const sliderToPPM = (value: number): number => {
  const fineSteps = PPM_FIRST_BREAKPOINT / FINE_STEP;
  const mediumSteps = (PPM_SECOND_BREAKPOINT - PPM_FIRST_BREAKPOINT) / MEDIUM_STEP;
  const totalSteps = fineSteps + mediumSteps;
  const valuePerStep = 100 / totalSteps;
  const step = Math.round(value / valuePerStep);
  
  if (step <= fineSteps) {
    return step * FINE_STEP;
  } else {
    return PPM_FIRST_BREAKPOINT + (step - fineSteps) * MEDIUM_STEP;
  }
};

const ppmToSlider = (ppm: number): number => {
  const fineSteps = PPM_FIRST_BREAKPOINT / FINE_STEP;
  const mediumSteps = (PPM_SECOND_BREAKPOINT - PPM_FIRST_BREAKPOINT) / MEDIUM_STEP;
  const totalSteps = fineSteps + mediumSteps;
  const valuePerStep = 100 / totalSteps;
  
  let steps = 0;
  if (ppm <= PPM_FIRST_BREAKPOINT) {
    steps = Math.round(ppm / FINE_STEP);
  } else {
    steps = fineSteps + Math.round((ppm - PPM_FIRST_BREAKPOINT) / MEDIUM_STEP);
  }
  
  return steps * valuePerStep;
};

const sliderToPrice = (value: number): number => {
  const firstSteps = PRICE_BREAKPOINT / PRICE_FIRST_STEP;
  const secondSteps = (PRICE_MAX - PRICE_BREAKPOINT) / PRICE_SECOND_STEP;
  const totalSteps = firstSteps + secondSteps;
  const valuePerStep = 100 / totalSteps;
  const step = Math.round(value / valuePerStep);
  
  if (step <= firstSteps) {
    return step * PRICE_FIRST_STEP;
  } else {
    return PRICE_BREAKPOINT + (step - firstSteps) * PRICE_SECOND_STEP;
  }
};

const priceToSlider = (price: number): number => {
  const firstSteps = PRICE_BREAKPOINT / PRICE_FIRST_STEP;
  const secondSteps = (PRICE_MAX - PRICE_BREAKPOINT) / PRICE_SECOND_STEP;
  const totalSteps = firstSteps + secondSteps;
  const valuePerStep = 100 / totalSteps;
  
  let steps = 0;
  if (price <= PRICE_BREAKPOINT) {
    steps = Math.round(price / PRICE_FIRST_STEP);
  } else {
    steps = firstSteps + Math.round((price - PRICE_BREAKPOINT) / PRICE_SECOND_STEP);
  }
  
  return steps * valuePerStep;
};

// Memoized FilterControls component
const FilterControls = memo(function FilterControls({
  searchQuery,
  onSearchChange,
  ppmRange,
  ppmSliderValue,
  onPPMChange,
  yearRange,
  onYearChange,
  priceRange,
  priceSliderValue,
  onPriceChange,
  mileageRange,
  onMileageChange,
  mpgRange,
  onMpgChange,
  selectedConditions,
  onConditionChange,
  onClearFilters,
}: FilterControlsProps) {
  const handleConditionToggle = (condition: string) => {
    onConditionChange(
      selectedConditions.includes(condition)
        ? selectedConditions.filter(c => c !== condition)
        : [...selectedConditions, condition]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={onSearchChange}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onClearFilters}
          title="Clear all filters"
          className="shrink-0"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-center block">Condition</Label>
          <div className="flex items-center justify-center gap-6">
            <div 
              className={`w-6 h-6 rounded-full bg-red-500 cursor-pointer transition-all hover:ring-2 hover:ring-offset-2 hover:ring-red-500 ${
                selectedConditions.includes("Fair") 
                  ? "opacity-100 ring-2 ring-offset-2 ring-red-500" 
                  : "opacity-40"
              }`}
              onClick={() => handleConditionToggle("Fair")}
              title="Fair"
            />
            <div 
              className={`w-6 h-6 rounded-full bg-yellow-500 cursor-pointer transition-all hover:ring-2 hover:ring-offset-2 hover:ring-yellow-500 ${
                selectedConditions.includes("Good") 
                  ? "opacity-100 ring-2 ring-offset-2 ring-yellow-500" 
                  : "opacity-40"
              }`}
              onClick={() => handleConditionToggle("Good")}
              title="Good"
            />
            <div 
              className={`w-6 h-6 rounded-full bg-green-500 cursor-pointer transition-all hover:ring-2 hover:ring-offset-2 hover:ring-green-500 ${
                selectedConditions.includes("Excellent") 
                  ? "opacity-100 ring-2 ring-offset-2 ring-green-500" 
                  : "opacity-40"
              }`}
              onClick={() => handleConditionToggle("Excellent")}
              title="Excellent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Price per Mile Range</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={ppmSliderValue}
            onValueChange={onPPMChange}
            className="w-full"
            colorRanges={[
              { value: ppmToSlider(0.10), color: 'rgb(34 197 94)' },
              { value: ppmToSlider(0.50), color: 'rgb(234 179 8)' },
              { value: 100, color: 'rgb(239 68 68)' },
            ]}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${ppmRange[0].toFixed(2)}/mile</span>
            <span>${ppmRange[1].toFixed(2)}/mile</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>MPG Range</Label>
          <Slider
            min={MPG_MIN}
            max={MPG_MAX}
            step={1}
            value={mpgRange}
            onValueChange={onMpgChange}
            className="w-full"
            colorRanges={[{ value: 100, color: 'rgb(0, 0, 0)' }]}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{mpgRange[0]} MPG</span>
            <span>{mpgRange[1]} MPG</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Year Range</Label>
          <Slider
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={1}
            value={yearRange}
            onValueChange={onYearChange}
            className="w-full"
            colorRanges={[{ value: 100, color: 'rgb(0, 0, 0)' }]}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={priceSliderValue}
            onValueChange={onPriceChange}
            className="w-full"
            colorRanges={[{ value: 100, color: 'rgb(0, 0, 0)' }]}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mileage Range</Label>
          <Slider
            min={MILEAGE_MIN}
            max={MILEAGE_MAX}
            step={1000}
            value={mileageRange}
            onValueChange={onMileageChange}
            className="w-full"
            colorRanges={[{ value: 100, color: 'rgb(0, 0, 0)' }]}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatNumber(mileageRange[0])} miles</span>
            <span>{formatNumber(mileageRange[1])} miles</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export function SavedListings({ 
  listings, 
  onClear, 
  onEdit, 
  onDelete, 
  onTogglePin, 
  onShare, 
  onSaveList, 
  onLoadList,
  onDeleteList,
  onImportLists,
  savedLists = [],
  currentListName = "",
  gasPrice
}: SavedListingsProps) {
  const { toast } = useToast();
  // Component state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 'grid' : 'table';
    }
    return 'table';
  });
  
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('vehicle');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [mileageRange, setMileageRange] = useState<[number, number]>([MILEAGE_MIN, MILEAGE_MAX]);
  const [ppmRange, setPpmRange] = useState<[number, number]>([PPM_MIN, PPM_MAX]);
  const [yearRange, setYearRange] = useState<[number, number]>([YEAR_MIN, YEAR_MAX]);
  const [showListsView, setShowListsView] = useState(false);
  const [newListName, setNewListName] = useState(currentListName);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [listToReplace, setListToReplace] = useState<{ index: number, name: string } | null>(null);
  const [mpgRange, setMpgRange] = useState<[number, number]>([MPG_MIN, MPG_MAX]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(["Fair", "Good", "Excellent"]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareData, setShareData] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listToDelete, setListToDelete] = useState<{ index: number; name: string } | null>(null);

  // Update newListName when currentListName changes
  useEffect(() => {
    setNewListName(currentListName);
  }, [currentListName]);

  // Memoized handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handlePPMChange = useCallback((values: [number, number]) => {
    setPpmRange([sliderToPPM(values[0]), sliderToPPM(values[1])]);
  }, []);

  const handleYearChange = useCallback((values: [number, number]) => {
    setYearRange(values);
  }, []);

  const handlePriceChange = useCallback((values: [number, number]) => {
    setPriceRange([sliderToPrice(values[0]), sliderToPrice(values[1])]);
  }, []);

  const handleMileageChange = useCallback((values: [number, number]) => {
    setMileageRange(values);
  }, []);

  // Memoized slider values
  const ppmSliderValue = useMemo(() => [
    ppmToSlider(ppmRange[0]),
    ppmToSlider(ppmRange[1])
  ] as [number, number], [ppmRange]);

  const priceSliderValue = useMemo(() => [
    priceToSlider(priceRange[0]),
    priceToSlider(priceRange[1])
  ] as [number, number], [priceRange]);

  // Add clear filters handler
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setMileageRange([MILEAGE_MIN, MILEAGE_MAX]);
    setPpmRange([PPM_MIN, PPM_MAX]);
    setYearRange([YEAR_MIN, YEAR_MAX]);
    setMpgRange([MPG_MIN, MPG_MAX]);
    setSelectedConditions(["Fair", "Good", "Excellent"]);
  }, []);

  // Memoized filter props
  const filterProps = useMemo(() => ({
    searchQuery,
    onSearchChange: handleSearchChange,
    ppmRange,
    ppmSliderValue,
    onPPMChange: handlePPMChange,
    yearRange,
    onYearChange: handleYearChange,
    priceRange,
    priceSliderValue,
    onPriceChange: handlePriceChange,
    mileageRange,
    onMileageChange: handleMileageChange,
    mpgRange,
    onMpgChange: setMpgRange,
    selectedConditions,
    onConditionChange: setSelectedConditions,
    onClearFilters: handleClearFilters,
  }), [
    searchQuery,
    handleSearchChange,
    ppmRange,
    ppmSliderValue,
    handlePPMChange,
    yearRange,
    handleYearChange,
    priceRange,
    priceSliderValue,
    handlePriceChange,
    mileageRange,
    handleMileageChange,
    mpgRange,
    selectedConditions,
    handleClearFilters,
  ]);

  // Update view mode when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && viewMode === 'table') {
        setViewMode('grid');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const handleSelect = (index: number) => {
    setSelectedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    setSelectedIndices(prev => 
      prev.length === listings.length 
        ? [] 
        : listings.map((_, index) => index)
    );
  };

  const handleDeleteSelected = () => {
    onDelete(selectedIndices);
    setSelectedIndices([]);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate price per remaining mile
  const calculatePricePerRemainingMile = (price: number, mileage: number, make: string, year: string, model: string): number => {
    const lifetimeMiles = getEstimatedLifetimeMiles(make);
    const remainingMiles = Math.max(0, lifetimeMiles - mileage);
    const modelData = getVehicleModelData(vehicleData as VehicleData, year, make, model);
    
    if (remainingMiles <= 0) return 0;

    // Base cost per mile from purchase price
    const baseCostPerMile = price / remainingMiles;
    
    // Add fuel cost if we have MPG data AND a positive gas price
    if (modelData?.mpg.combined && gasPrice > 0) {
      const combinedMPG = parseFloat(modelData.mpg.combined);
      const fuelCostPerMile = gasPrice / combinedMPG;
      return baseCostPerMile + fuelCostPerMile;
    }
    
    return baseCostPerMile;
  };

  // Calculate filtered and sorted listings
  const filteredAndSortedListings = useMemo(() => {
    return listings
      .map((listing, index) => ({ ...listing, originalIndex: index }))
      .filter((listing) => {
        // Don't filter pinned items
        if (listing.pinned) return true;
        
        const matchesSearch = listing.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.model.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
        const matchesMileage = listing.mileage >= mileageRange[0] && listing.mileage <= mileageRange[1];
        const matchesYear = listing.year >= yearRange[0] && listing.year <= yearRange[1];
        const pricePerMile = calculatePricePerRemainingMile(listing.price, listing.mileage, listing.make, listing.year.toString(), listing.model);
        const matchesPPM = pricePerMile >= ppmRange[0] && pricePerMile <= ppmRange[1];
        
        // Add MPG filter
        const modelData = getVehicleModelData(vehicleData as VehicleData, listing.year.toString(), listing.make, listing.model);
        const mpg = modelData ? parseFloat(modelData.mpg.combined) : 0;
        const matchesMpg = mpg >= mpgRange[0] && mpg <= mpgRange[1];

        // Add condition filter
        const matchesCondition = selectedConditions.includes(listing.condition);
        
        return matchesSearch && matchesPrice && matchesMileage && matchesPPM && matchesYear && matchesMpg && matchesCondition;
      })
      .sort((a, b) => {
        // Sort pinned items to the top
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        
        const direction = sortDirection === 'asc' ? 1 : -1;
        switch (sortField) {
          case 'vehicle':
            const aVehicle = `${a.year} ${a.make} ${a.model}`;
            const bVehicle = `${b.year} ${b.make} ${b.model}`;
            return aVehicle.localeCompare(bVehicle) * direction;
          case 'price':
            return (a.price - b.price) * direction;
          case 'mileage':
            return (a.mileage - b.mileage) * direction;
          case 'pricePerMile':
            const aPricePerMile = calculatePricePerRemainingMile(a.price, a.mileage, a.make, a.year.toString(), a.model);
            const bPricePerMile = calculatePricePerRemainingMile(b.price, b.mileage, b.make, b.year.toString(), b.model);
            // Treat zero values (N/A) as infinity for sorting purposes
            const aValue = aPricePerMile === 0 ? Infinity : aPricePerMile;
            const bValue = bPricePerMile === 0 ? Infinity : bPricePerMile;
            return (aValue - bValue) * direction;
          case 'score':
            const aScore = calculateValueScore(a.price, a.mileage, a.make);
            const bScore = calculateValueScore(b.price, b.mileage, b.make);
            return (aScore - bScore) * direction;
          default:
            return 0;
        }
      });
  }, [listings, searchQuery, priceRange, mileageRange, yearRange, ppmRange, sortField, sortDirection, mpgRange, selectedConditions, gasPrice]);

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Add getRatingColor function
  const getRatingColor = (rating: string) => {
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

  // Add condition color mapping
  const getConditionColor = (condition: string) => {
    switch(condition) {
      case "Excellent": return "bg-green-500";
      case "Good": return "bg-yellow-500";
      case "Fair": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleSaveList = () => {
    if (!onSaveList) {
      console.error('onSaveList prop is not provided');
      return;
    }
    if (newListName.trim() && listings.length > 0) {
      // Find if a list with this name already exists
      const existingListIndex = savedLists.findIndex(list => list.name === newListName.trim());
      if (existingListIndex !== -1) {
        // Show confirmation dialog
        setListToReplace({ index: existingListIndex, name: newListName.trim() });
        setShowReplaceConfirm(true);
      } else {
        // No existing list, save directly
        onSaveList(newListName.trim(), listings);
        trackSaveList(newListName.trim(), listings.length);
        toast({
          title: "List saved",
          description: `The list "${newListName.trim()}" has been saved.`
        });
      }
    }
  };

  const handleConfirmReplace = () => {
    if (listToReplace) {
      // Pass the existing index to onSaveList for replacement
      onSaveList(listToReplace.name, listings, listToReplace.index);
      toast({
        title: "List replaced",
        description: `The list "${listToReplace.name}" has been replaced with the current listings.`
      });
      setShowReplaceConfirm(false);
      setListToReplace(null);
    }
  };

  const handleEditClick = (listing: CarFormData) => {
    // Find the index in the original listings array
    const index = listings.findIndex(l => 
      l.make === listing.make && 
      l.model === listing.model && 
      l.year === listing.year && 
      l.price === listing.price && 
      l.mileage === listing.mileage
    );
    if (index !== -1) {
      onEdit(listing, index);
    }
  };

  const handleImport = () => {
    try {
      const importedData = JSON.parse(importData);
      
      // Validate the imported data structure
      if (!Array.isArray(importedData)) {
        throw new Error("Invalid import data: Expected an array");
      }

      // Validate each list in the imported data
      importedData.forEach((list, index) => {
        if (!list.name || !Array.isArray(list.listings)) {
          throw new Error(`Invalid list at index ${index}: Missing name or listings`);
        }

        // Validate each listing in the list
        list.listings.forEach((listing: any, listingIndex: number) => {
          if (!listing.make || !listing.model || !listing.year || 
              typeof listing.price !== 'number' || typeof listing.mileage !== 'number') {
            throw new Error(`Invalid listing in list "${list.name}" at index ${listingIndex}`);
          }
        });
      });

      // Process each imported list
      importedData.forEach(list => {
        // Check if a list with this name already exists
        const existingListIndex = savedLists?.findIndex(existing => existing.name === list.name);
        
        if (existingListIndex !== undefined && existingListIndex >= 0) {
          // If it exists, append a number to make it unique
          let counter = 1;
          let newName = list.name;
          while (savedLists?.some(existing => existing.name === newName)) {
            newName = `${list.name} (${counter})`;
            counter++;
          }
          onSaveList(newName, list.listings);
        } else {
          // If it's a new name, save as is
          onSaveList(list.name, list.listings);
        }
      });

      setImportData("");
      setImportError(null);
      setShowImportDialog(false);
      
      // Track the import event
      trackImportList(importedData.length);
      
      toast({
        title: "Lists imported successfully",
        description: `Imported ${importedData.length} list${importedData.length === 1 ? '' : 's'}.`,
      });
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Invalid import data");
    }
  };

  const handleShare = (list: { name: string; listings: CarFormData[] }) => {
    try {
      // Create a clean version of the list without internal properties
      const cleanListings = list.listings.map(listing => ({
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
        name: list.name,
        listings: cleanListings
      }];

      // Convert to pretty JSON string
      const jsonStr = JSON.stringify(exportData, null, 2);
      setShareData(jsonStr);
      setShowShareDialog(true);
      
      // Track the export event
      trackExportList(list.name, list.listings.length);
      
      if (onShare) {
        onShare(list.listings);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error preparing data",
        description: "Failed to prepare the list data for sharing.",
      });
      console.error('Error preparing data for share:', error);
    }
  };

  // Add the import dialog
  const importDialog = (
    <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Import Saved Lists</DialogTitle>
          <DialogDescription>
            Paste your exported lists data below. The data should be in JSON format.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={importData}
            onChange={(e) => {
              setImportData(e.target.value);
              setImportError(null);
            }}
            placeholder="Paste your exported lists data here..."
            className="min-h-[200px] font-mono text-sm"
          />
          {importError && (
            <p className="text-red-500 text-sm mt-2">{importError}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowImportDialog(false);
              setImportData("");
              setImportError(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleImport}
            disabled={!importData.trim()}
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Add the share dialog
  const shareDialog = (
    <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share List</DialogTitle>
          <DialogDescription>
            Copy this data to share your list. Others can import it using the Import button.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="relative">
            <Textarea
              value={shareData}
              readOnly
              className="min-h-[300px] font-mono text-sm bg-gray-50 pr-12"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(shareData);
                  toast({
                    title: "Copied to clipboard",
                    description: "The list data has been copied and is ready to share.",
                  });
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Failed to copy",
                    description: "Please manually select and copy the text.",
                  });
                }
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setShowShareDialog(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Add delete confirmation dialog
  const deleteConfirmDialog = (
    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete List</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this list? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {listToDelete && (
            <p className="text-sm text-gray-500">
              List to delete: <span className="font-semibold">{listToDelete.name}</span>
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteConfirm(false);
              setListToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (listToDelete) {
                onDeleteList(listToDelete.name);
                toast({
                  title: "List deleted",
                  description: `The list "${listToDelete.name}" has been deleted.`
                });
                setShowDeleteConfirm(false);
                setListToDelete(null);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="shadow-lg border-blue-200">
      <CardHeader className="bg-blue-700 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Saved Listings</CardTitle>
          <div className="flex items-center gap-2">
            {showListsView && (
            <Button
              variant="ghost"
              size="icon"
                onClick={() => setShowImportDialog(true)}
                title="Import Lists"
                className="flex items-center gap-2 min-w-[80px] justify-center text-white hover:text-blue-700"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm">Import</span>
            </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowListsView(!showListsView)}
              title={showListsView ? "Show Listings" : "Show Lists"}
              className="flex items-center gap-2 min-w-[80px] justify-center text-white hover:text-blue-700"
            >
              {showListsView ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              <span className="text-sm">{showListsView ? "Listings" : "Lists"}</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {importDialog}
        {shareDialog}
        {deleteConfirmDialog}
        {showListsView ? (
          <div className="space-y-4">
            {savedLists.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No saved lists yet. Save your current listings as a new list!</p>
                {listings.length === 0 && (
                  <p className="text-gray-500 mt-2">Add some listings first to create a new list.</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>List Name</TableHead>
                      <TableHead>Listings</TableHead>
                      <TableHead className="w-[200px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedLists.map((list, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{list.name}</TableCell>
                        <TableCell>{list.listings.length} listings</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                onLoadList(list.listings, list.name);
                                setShowListsView(false);
                              }}
                            >
                              Load List
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleShare(list)}
                              title="Share List"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setListToDelete({ index, name: list.name });
                                setShowDeleteConfirm(true);
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete List"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No saved listings yet. Import some listings or add new ones!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-6">
              {/* Desktop sidebar with filters */}
              <div className="hidden md:block w-64 shrink-0">
                <FilterControls {...filterProps} />
              </div>

              {/* Main content area */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFiltersModal(true)}
                    className="md:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                  
                  {!showListsView && (
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        style={{ fontSize: '1.3em', marginLeft: '5px' }}
                        onClick={handleSaveList}
                        disabled={!newListName.trim() || listings.length === 0}
                        className="flex items-center"
                        title="Save List"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Input
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="Unnamed List"
                        style={{ fontSize: '1.3em', paddingLeft: '10px' }}
                        className={`
                          border-0 border-b border-gray-100 rounded-none text-2xl font-semibold 
                          focus-visible:ring-0 focus-visible:border-gray-200
                          ${!newListName ? "text-gray-400 italic" : "text-gray-900"}
                          hover:border-gray-200 transition-colors pl-[10px]
                        `}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className={`${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode('table')}
                        className={`${viewMode === 'table' ? 'bg-gray-100' : ''}`}
                      >
                        <TableIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="h-6 w-px bg-gray-200" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        onDelete(selectedIndices);
                        setSelectedIndices([]);
                      }}
                      title="Delete Selected"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAndSortedListings.map((listing, index) => {
                      const modelData = getVehicleModelData(vehicleData as VehicleData, listing.year.toString(), listing.make, listing.model);
                      const valueScore = calculateValueScore(listing.price, listing.mileage, listing.make);
                      const rating = getRatingFromScore(valueScore);
                      const maxMileage = getEstimatedLifetimeMiles(listing.make);
                      const remainingMiles = Math.max(0, maxMileage - listing.mileage);
                      const totalCostPerMile = calculatePricePerRemainingMile(
                        listing.price,
                        listing.mileage,
                        listing.make,
                        listing.year.toString(),
                        listing.model
                      );

                      return (
                        <div key={`${listing.make}-${listing.model}-${listing.year}-${listing.originalIndex}`} 
                          className={`bg-white rounded-lg overflow-hidden border border-gray-200 transition-colors ${
                            listing.pinned 
                              ? 'shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:border-red-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                              : 'shadow-md hover:border-blue-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                          }`}
                        >
                          <div className={`p-4 ${listing.pinned ? 'bg-red-50' : 'bg-blue-50'}`}>
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${getConditionColor(listing.condition)}`} />
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {listing.year} {listing.make} {listing.model}
                                  {modelData && (
                                    <span className="text-sm font-normal text-gray-500 ml-2">
                                      {modelData.mpg.combined} mpg
                                    </span>
                                  )}
                                </h3>
                              </div>
                              <div className="flex items-start gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onTogglePin(listing.originalIndex)}
                                  className={listing.pinned ? 'text-red-600' : 'text-gray-400'}
                                >
                                  <Pin className={`h-4 w-4 ${listing.pinned ? 'fill-current' : ''}`} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditClick(listing)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <p className="text-sm font-medium text-gray-600">Price</p>
                                <p className="text-lg font-semibold text-gray-900">{formatCurrency(listing.price)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-600">Value Rating</p>
                                <p className={`text-lg font-semibold ${getRatingColor(rating)}`}>{rating}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <p className="text-sm font-medium text-gray-600">Remaining Miles</p>
                                <p className="text-gray-900">{formatNumber(remainingMiles)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-600">Total Cost/Mile</p>
                                <p className="text-gray-900">
                                  ${totalCostPerMile.toFixed(2)}
                                </p>
                                {modelData && (
                                  <p className="text-xs text-gray-500">Includes fuel</p>
                                )}
                              </div>
                            </div>

                            {modelData && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-3 gap-2 text-center">
                                  <div>
                                    <p className="text-xs text-gray-600">City</p>
                                    <p className="text-sm font-semibold">{modelData.mpg.city} MPG</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600">Highway</p>
                                    <p className="text-sm font-semibold">{modelData.mpg.highway} MPG</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600">Combined</p>
                                    <p className="text-sm font-semibold">{modelData.mpg.combined} MPG</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-2">
                              {listing.url && (
                                <a 
                                  href={listing.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                  title="View Original Listing"
                                >
                                  <LinkIcon className="h-4 w-4" />
                                </a>
                              )}
                              <a
                                href={`https://www.carcomplaints.com/${listing.make.charAt(0).toUpperCase() + listing.make.slice(1).toLowerCase()}/${listing.model.charAt(0).toUpperCase() + listing.model.slice(1).toLowerCase()}/${listing.year}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 hover:text-orange-800"
                                title="View Car Complaints"
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </a>
                              <a
                                href={`https://www.kbb.com/${listing.make.toLowerCase()}/${listing.model.toLowerCase()}/${listing.year}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800"
                                title="View Kelley Blue Book Value"
                              >
                                <DollarSign className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedIndices.length === filteredAndSortedListings.length}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('vehicle')}>
                            <div className="flex items-center gap-2">
                              Vehicle {getSortIcon('vehicle')}
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                            <div className="flex items-center gap-2">
                              Price {getSortIcon('price')}
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('mileage')}>
                            <div className="flex items-center gap-2">
                              Miles {getSortIcon('mileage')}
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer bg-blue-50 font-bold" onClick={() => handleSort('pricePerMile')}>
                            <div className="flex items-center gap-2">
                              Total Cost/Mile {getSortIcon('pricePerMile')}
                            </div>
                          </TableHead>
                          <TableHead>Links</TableHead>
                          <TableHead className="w-[80px] text-center">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedListings.map((listing) => {
                          const modelData = getVehicleModelData(vehicleData as VehicleData, listing.year.toString(), listing.make, listing.model);
                          const totalCostPerMile = calculatePricePerRemainingMile(
                            listing.price,
                            listing.mileage,
                            listing.make,
                            listing.year.toString(),
                            listing.model
                          );

                          return (
                            <TableRow 
                              key={listing.originalIndex}
                              className={listing.pinned ? 'bg-red-50 hover:bg-red-100 border-t-2 border-b-2 border-red-300' : ''}
                            >
                              <TableCell>
                                <Checkbox
                                  checked={selectedIndices.includes(listing.originalIndex)}
                                  onCheckedChange={() => handleSelect(listing.originalIndex)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2.5 h-2.5 rounded-full ${getConditionColor(listing.condition)}`} />
                                  <div>
                                  {listing.year} {listing.make} {listing.model}
                                    {modelData && (
                                      <span className="text-sm text-gray-500 ml-2">
                                        {modelData.mpg.combined} mpg
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(listing.price)}</TableCell>
                              <TableCell>{formatNumber(listing.mileage)}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>${totalCostPerMile.toFixed(2)}</span>
                                  {modelData && (
                                    <span className="text-xs text-gray-500">Includes fuel</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 justify-end">
                                  {listing.url && (
                                    <a 
                                      href={listing.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800"
                                      title="View Original Listing"
                                    >
                                      <LinkIcon className="h-4 w-4" />
                                    </a>
                                  )}
                                  <a 
                                    href={`https://www.carcomplaints.com/${listing.make.charAt(0).toUpperCase() + listing.make.slice(1).toLowerCase()}/${listing.model.charAt(0).toUpperCase() + listing.model.slice(1).toLowerCase()}/${listing.year}/`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-orange-600 hover:text-orange-800"
                                    title="View Car Complaints"
                                  >
                                    <AlertTriangle className="h-4 w-4" />
                                  </a>
                                  <a 
                                    href={`https://www.kbb.com/${listing.make.toLowerCase()}/${listing.model.toLowerCase()}/${listing.year}/`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800"
                                    title="View Kelley Blue Book Value"
                                  >
                                    <DollarSign className="h-4 w-4" />
                                  </a>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 justify-end">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onTogglePin(listing.originalIndex)}
                                    className={listing.pinned ? 'text-red-600' : 'text-gray-400'}
                                    title={listing.pinned ? "Unpin" : "Pin"}
                                  >
                                    <Pin className={`h-4 w-4 ${listing.pinned ? 'fill-current' : ''}`} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditClick(listing)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Replace confirmation dialog */}
      <Dialog open={showReplaceConfirm} onOpenChange={setShowReplaceConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Replace Existing List?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>A list named "{listToReplace?.name}" already exists. Do you want to replace it with the current listings?</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowReplaceConfirm(false);
                setListToReplace(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleConfirmReplace}
            >
              Replace
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile filters modal */}
      <Dialog open={showFiltersModal} onOpenChange={setShowFiltersModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <FilterControls {...filterProps} />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
