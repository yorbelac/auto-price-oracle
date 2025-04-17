import { Link as LinkIcon, ExternalLink, TrendingDown, TrendingUp, LayoutGrid, Table as TableIcon, Pencil, Trash2, ChevronUp, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatNumber, calculateValueScore, getRatingFromScore, getEstimatedLifetimeMiles } from "@/utils/carCalculations";
import { CarFormData } from "./CarForm";
import { useState, useMemo, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SavedListingsProps {
  listings: CarFormData[];
  onClear: () => void;
  onEdit: (listing: CarFormData) => void;
  onDelete: (indices: number[]) => void;
}

type SortField = 'vehicle' | 'price' | 'mileage' | 'pricePerMile' | 'score';
type SortDirection = 'asc' | 'desc';

export function SavedListings({ listings, onClear, onEdit, onDelete }: SavedListingsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('vehicle');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Static bounds
  const PRICE_MIN = 0;
  const PRICE_MAX = 100000;
  const PRICE_BREAKPOINT = 30000;  // Point where scale changes
  const PRICE_FIRST_STEP = 1000;   // $1k steps until breakpoint
  const PRICE_SECOND_STEP = 5000;  // $5k steps after breakpoint
  const MILEAGE_MIN = 0;
  const MILEAGE_MAX = 500000;
  const PPM_MIN = 0;
  const PPM_MAX = 1.00;
  const YEAR_MIN = new Date().getFullYear() - 30;  // 30 years old
  const YEAR_MAX = new Date().getFullYear();       // Current year

  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [mileageRange, setMileageRange] = useState<[number, number]>([MILEAGE_MIN, MILEAGE_MAX]);
  const [ppmRange, setPpmRange] = useState<[number, number]>([PPM_MIN, PPM_MAX]);
  const [yearRange, setYearRange] = useState<[number, number]>([YEAR_MIN, YEAR_MAX]);

  // Custom PPM scale handling
  const PPM_FIRST_BREAKPOINT = 0.30;  // Switch from 1¢ to 5¢ steps
  const PPM_SECOND_BREAKPOINT = 1.00;  // Switch from 5¢ to 20¢ steps
  const FINE_STEP = 0.01;      // 1¢ steps until first breakpoint
  const MEDIUM_STEP = 0.05;    // 5¢ steps between breakpoints
  
  // Convert slider value (0-100) to actual PPM value
  const sliderToPPM = (value: number): number => {
    // Calculate how many steps of each size fit in their respective ranges
    const fineSteps = PPM_FIRST_BREAKPOINT / FINE_STEP;
    const mediumSteps = (PPM_SECOND_BREAKPOINT - PPM_FIRST_BREAKPOINT) / MEDIUM_STEP;
    
    // Calculate total steps and value per step
    const totalSteps = fineSteps + mediumSteps;
    const valuePerStep = 100 / totalSteps;
    
    // Convert slider value to step index
    const step = Math.round(value / valuePerStep);
    
    // Determine which range we're in and calculate the value
    if (step <= fineSteps) {
      return step * FINE_STEP;
    } else {
      return PPM_FIRST_BREAKPOINT + (step - fineSteps) * MEDIUM_STEP;
    }
  };

  // Convert PPM value to slider value (0-100)
  const ppmToSlider = (ppm: number): number => {
    // Calculate how many steps of each size fit in their respective ranges
    const fineSteps = PPM_FIRST_BREAKPOINT / FINE_STEP;
    const mediumSteps = (PPM_SECOND_BREAKPOINT - PPM_FIRST_BREAKPOINT) / MEDIUM_STEP;
    
    // Calculate total steps and value per step
    const totalSteps = fineSteps + mediumSteps;
    const valuePerStep = 100 / totalSteps;
    
    // Calculate which step this ppm value corresponds to
    let steps = 0;
    if (ppm <= PPM_FIRST_BREAKPOINT) {
      steps = Math.round(ppm / FINE_STEP);
    } else {
      steps = fineSteps + Math.round((ppm - PPM_FIRST_BREAKPOINT) / MEDIUM_STEP);
    }
    
    return steps * valuePerStep;
  };

  // Handle PPM slider changes
  const handlePPMChange = (values: [number, number]) => {
    setPpmRange([sliderToPPM(values[0]), sliderToPPM(values[1])]);
  };

  // Get slider values from PPM range
  const ppmSliderValue: [number, number] = [
    ppmToSlider(ppmRange[0]),
    ppmToSlider(ppmRange[1])
  ];

  // Convert slider value (0-100) to actual price value
  const sliderToPrice = (value: number): number => {
    // Calculate how many steps of each size fit in their respective ranges
    const firstSteps = PRICE_BREAKPOINT / PRICE_FIRST_STEP;
    const secondSteps = (PRICE_MAX - PRICE_BREAKPOINT) / PRICE_SECOND_STEP;
    
    // Calculate total steps and value per step
    const totalSteps = firstSteps + secondSteps;
    const valuePerStep = 100 / totalSteps;
    
    // Convert slider value to step index
    const step = Math.round(value / valuePerStep);
    
    // Determine which range we're in and calculate the value
    if (step <= firstSteps) {
      return step * PRICE_FIRST_STEP;
    } else {
      return PRICE_BREAKPOINT + (step - firstSteps) * PRICE_SECOND_STEP;
    }
  };

  // Convert price value to slider value (0-100)
  const priceToSlider = (price: number): number => {
    // Calculate how many steps of each size fit in their respective ranges
    const firstSteps = PRICE_BREAKPOINT / PRICE_FIRST_STEP;
    const secondSteps = (PRICE_MAX - PRICE_BREAKPOINT) / PRICE_SECOND_STEP;
    
    // Calculate total steps and value per step
    const totalSteps = firstSteps + secondSteps;
    const valuePerStep = 100 / totalSteps;
    
    // Calculate which step this price value corresponds to
    let steps = 0;
    if (price <= PRICE_BREAKPOINT) {
      steps = Math.round(price / PRICE_FIRST_STEP);
    } else {
      steps = firstSteps + Math.round((price - PRICE_BREAKPOINT) / PRICE_SECOND_STEP);
    }
    
    return steps * valuePerStep;
  };

  // Handle price slider changes
  const handlePriceChange = (values: [number, number]) => {
    setPriceRange([sliderToPrice(values[0]), sliderToPrice(values[1])]);
  };

  // Get slider values from price range
  const priceSliderValue: [number, number] = [
    priceToSlider(priceRange[0]),
    priceToSlider(priceRange[1])
  ];

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
      .filter((listing) => {
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
  }, [listings, searchQuery, priceRange, mileageRange, ppmRange, sortField, sortDirection, yearRange]);

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  if (listings.length === 0) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg border-blue-200 col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Saved Listings</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-blue-100' : ''}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? 'bg-blue-100' : ''}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          {selectedIndices.length > 0 ? (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>
          ) : (
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear All
          </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          {/* Sidebar with filters */}
          <div className="w-64 shrink-0 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Year Range</Label>
                <Slider
                  min={YEAR_MIN}
                  max={YEAR_MAX}
                  step={1}
                  value={yearRange}
                  onValueChange={setYearRange}
                  className="w-full"
                  colorRanges={[
                    { value: 100, color: 'rgb(0, 0, 0)' }
                  ]}
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
                  onValueChange={handlePriceChange}
                  className="w-full"
                  colorRanges={[
                    { value: 100, color: 'rgb(0, 0, 0)' }
                  ]}
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
                  onValueChange={setMileageRange}
                  className="w-full"
                  colorRanges={[
                    { value: 100, color: 'rgb(0, 0, 0)' }
                  ]}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatNumber(mileageRange[0])} miles</span>
                  <span>{formatNumber(mileageRange[1])} miles</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Price per Mile Range</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={ppmSliderValue}
                  onValueChange={handlePPMChange}
                  className="w-full"
                  colorRanges={[
                    { value: ppmToSlider(0.10), color: 'rgb(34 197 94)' },  // green-500
                    { value: ppmToSlider(0.50), color: 'rgb(234 179 8)' },  // yellow-500
                    { value: 100, color: 'rgb(239 68 68)' },  // red-500
                  ]}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>${ppmRange[0].toFixed(2)}/mile</span>
                  <span>${ppmRange[1].toFixed(2)}/mile</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
        {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAndSortedListings.map((listing, index) => {
              const valueScore = calculateValueScore(listing.price, listing.mileage, listing.make);
              const rating = getRatingFromScore(valueScore);
                  const pricePerMile = calculatePricePerRemainingMile(listing.price, listing.mileage, listing.make);
                  const lifetimeMiles = getEstimatedLifetimeMiles(listing.make);
                  const remainingMiles = Math.max(0, lifetimeMiles - listing.mileage);

              return (
                <div
                  key={index}
                      className={`p-4 rounded-lg ${selectedIndices.includes(index) ? 'bg-blue-50' : 'bg-gray-50'} hover:bg-gray-100 flex flex-col gap-2`}
                >
                  <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedIndices.includes(index)}
                            onCheckedChange={() => handleSelect(index)}
                          />
                    <h3 className="font-medium">
                      {listing.year} {listing.make} {listing.model}
                    </h3>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(listing)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                    {listing.url && (
                      <a
                        href={listing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                        </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{formatCurrency(listing.price)} • {formatNumber(listing.mileage)} miles</p>
                        <p>Remaining miles: {formatNumber(remainingMiles)}</p>
                        <p>Price per remaining mile: {pricePerMile > 0 ? `$${pricePerMile.toFixed(2)}` : 'N/A'}</p>
                    <div className="flex items-center gap-1">
                      Score: {rating}
                      {valueScore < 0.3 ? (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      )}
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
                      <TableHead>
                        Actions
                      </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                    {filteredAndSortedListings.map((listing, index) => {
                const valueScore = calculateValueScore(listing.price, listing.mileage, listing.make);
                const rating = getRatingFromScore(valueScore);
                      const pricePerMile = calculatePricePerRemainingMile(listing.price, listing.mileage, listing.make);
                      const lifetimeMiles = getEstimatedLifetimeMiles(listing.make);
                      const remainingMiles = Math.max(0, lifetimeMiles - listing.mileage);

                return (
                  <TableRow key={index}>
                          <TableCell>
                            <Checkbox
                              checked={selectedIndices.includes(index)}
                              onCheckedChange={() => handleSelect(index)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                      {listing.year} {listing.make} {listing.model}
                              {listing.url && (
                                <a href={listing.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                                </a>
                              )}
                            </div>
                    </TableCell>
                    <TableCell>{formatCurrency(listing.price)}</TableCell>
                    <TableCell>{formatNumber(listing.mileage)}</TableCell>
                          <TableCell>{pricePerMile > 0 ? `$${pricePerMile.toFixed(2)}` : 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {rating}
                        {valueScore < 0.3 ? (
                          <TrendingDown className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(listing)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
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
    </Card>
  );
}
