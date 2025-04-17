
import { Link as LinkIcon, ExternalLink, TrendingDown, TrendingUp, LayoutGrid, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatNumber, calculateValueScore, getRatingFromScore } from "@/utils/carCalculations";
import { CarFormData } from "./CarForm";
import { useState } from "react";

interface SavedListingsProps {
  listings: CarFormData[];
  onClear: () => void;
}

export function SavedListings({ listings, onClear }: SavedListingsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {listings.map((listing, index) => {
              const valueScore = calculateValueScore(listing.price, listing.mileage, listing.make);
              const rating = getRatingFromScore(valueScore);
              const pricePerMile = listing.mileage > 0 ? listing.price / listing.mileage : 0;

              return (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">
                      {listing.year} {listing.make} {listing.model}
                    </h3>
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
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{formatCurrency(listing.price)} • {formatNumber(listing.mileage)} miles</p>
                    <p>Price per mile: {formatCurrency(pricePerMile)}</p>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Price/Mile</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing, index) => {
                const valueScore = calculateValueScore(listing.price, listing.mileage, listing.make);
                const rating = getRatingFromScore(valueScore);
                const pricePerMile = listing.mileage > 0 ? listing.price / listing.mileage : 0;

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {listing.year} {listing.make} {listing.model}
                    </TableCell>
                    <TableCell>{formatCurrency(listing.price)}</TableCell>
                    <TableCell>{formatNumber(listing.mileage)}</TableCell>
                    <TableCell>{formatCurrency(pricePerMile)}</TableCell>
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
