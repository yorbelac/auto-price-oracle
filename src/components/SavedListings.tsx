import { Link as LinkIcon, ExternalLink, TrendingDown, TrendingUp, LayoutGrid, Table as TableIcon, Pencil, Trash2, ChevronUp, ChevronDown, Search, AlertTriangle, Car, DollarSign, Pin, SlidersHorizontal } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SavedListingsProps {
  listings: CarFormData[];
  onClear: () => void;
  onEdit: (listing: CarFormData) => void;
  onDelete: (indices: number[]) => void;
  onTogglePin: (index: number) => void;
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
}

// Constants moved outside component
const PRICE_MIN = 0;
const PRICE_MAX = 100000;
const PRICE_BREAKPOINT = 30000;
const PRICE_FIRST_STEP = 1000;
const PRICE_SECOND_STEP = 5000;
const MILEAGE_MIN = 0;
const MILEAGE_MAX = 500000;
const PPM_MIN = 0;
const PPM_MAX = 1.00;
const YEAR_MIN = new Date().getFullYear() - 30;
const YEAR_MAX = new Date().getFullYear();

const PPM_FIRST_BREAKPOINT = 0.30;
const PPM_SECOND_BREAKPOINT = 1.00;
const FINE_STEP = 0.01;
const MEDIUM_STEP = 0.05;

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
}: FilterControlsProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={onSearchChange}
          className="pl-9"
        />
      </div>

      <div className="space-y-6">
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

export function SavedListings({ listings, onClear, onEdit, onDelete, onTogglePin }: SavedListingsProps) {
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
  const calculatePricePerRemainingMile = (price: number, mileage: number, make: string): number => {
    const lifetimeMiles = getEstimatedLifetimeMiles(make);
    const remainingMiles = Math.max(0, lifetimeMiles - mileage);
    return remainingMiles > 0 ? price / remainingMiles : 0;
  };

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
        const pricePerMile = calculatePricePerRemainingMile(listing.price, listing.mileage, listing.make);
        const matchesPPM = pricePerMile >= ppmRange[0] && pricePerMile <= ppmRange[1];
        
        return matchesSearch && matchesPrice && matchesMileage && matchesPPM && matchesYear;
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
            const aPricePerMile = calculatePricePerRemainingMile(a.price, a.mileage, a.make);
            const bPricePerMile = calculatePricePerRemainingMile(b.price, b.mileage, b.make);
            return (aPricePerMile - bPricePerMile) * direction;
          case 'score':
            const aScore = calculateValueScore(a.price, a.mileage, a.make);
            const bScore = calculateValueScore(b.price, b.mileage, b.make);
            return (aScore - bScore) * direction;
          default:
            return 0;
        }
      });
  }, [listings, searchQuery, priceRange, mileageRange, yearRange, ppmRange, sortField, sortDirection]);

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

  if (listings.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg border-blue-200">
      <CardHeader className="bg-blue-700 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Saved Listings</CardTitle>
          <div className="flex items-center gap-2">
            {/* Mobile filters button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFiltersModal(true)}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            {/* Hide view toggle on mobile */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-white/20' : ''}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'bg-white/20' : ''}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" onClick={onClear}>Clear All</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex gap-6">
          {/* Desktop sidebar with filters */}
          <div className="hidden md:block w-64 shrink-0">
            <FilterControls {...filterProps} />
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {filteredAndSortedListings.map((listing) => {
                  const valueScore = calculateValueScore(listing.price, listing.mileage, listing.make);
                  const rating = getRatingFromScore(valueScore);
                  const maxMileage = getEstimatedLifetimeMiles(listing.make);
                  const remainingMiles = Math.max(0, maxMileage - listing.mileage);

                  return (
                    <div key={`${listing.make}-${listing.model}-${listing.year}-${listing.originalIndex}`} 
                      className={`bg-white rounded-lg overflow-hidden border border-gray-200 transition-colors ${
                        listing.pinned 
                          ? 'shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:border-red-300' 
                          : 'shadow-md hover:border-blue-300'
                      }`}
                    >
                      <div className={`p-4 ${listing.pinned ? 'bg-red-50' : 'bg-blue-50'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {listing.year} {listing.make} {listing.model}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {formatNumber(listing.mileage)} miles
                            </p>
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
                              onClick={() => onEdit(listing)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Price</p>
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(listing.price)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600">Value Rating</p>
                            <p className={`text-lg font-semibold ${getRatingColor(rating)}`}>{rating}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Remaining Miles</p>
                            <p className="text-gray-900">{formatNumber(remainingMiles)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600">Cost/Mile</p>
                            <p className="text-gray-900">${(listing.price / remainingMiles).toFixed(2)}</p>
                          </div>
                        </div>

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
                        Vehicle {getSortIcon('vehicle')}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                        Price {getSortIcon('price')}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('mileage')}>
                        Current Miles {getSortIcon('mileage')}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('pricePerMile')}>
                        Price/Mile {getSortIcon('pricePerMile')}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('score')}>
                        Score {getSortIcon('score')}
                      </TableHead>
                      <TableHead>Links</TableHead>
                      <TableHead>
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedListings.map((listing) => {
                      const valueScore = calculateValueScore(listing.price, listing.mileage, listing.make);
                      const rating = getRatingFromScore(valueScore);
                      const pricePerMile = calculatePricePerRemainingMile(listing.price, listing.mileage, listing.make);
                      const lifetimeMiles = getEstimatedLifetimeMiles(listing.make);
                      const remainingMiles = Math.max(0, lifetimeMiles - listing.mileage);

                      return (
                        <TableRow 
                          key={listing.originalIndex}
                          className={`${listing.pinned ? 'bg-red-50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : undefined}`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedIndices.includes(listing.originalIndex)}
                              onCheckedChange={() => handleSelect(listing.originalIndex)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {listing.year} {listing.make} {listing.model}
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(listing.price)}</TableCell>
                          <TableCell>{formatNumber(listing.mileage)}</TableCell>
                          <TableCell>{pricePerMile > 0 ? `$${pricePerMile.toFixed(2)}` : 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {rating}
                              <span className={getRatingColor(rating)}>
                                {valueScore < 0.3 ? (
                                  <TrendingDown className="h-4 w-4 text-green-600" />
                                ) : (
                                  <TrendingUp className="h-4 w-4 text-red-600" />
                                )}
                              </span>
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
                            <div className="flex items-center gap-2">
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
                                onClick={() => onEdit(listing)}
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
      </CardContent>

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
