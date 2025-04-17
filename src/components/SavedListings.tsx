
import { Link as LinkIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/utils/carCalculations";
import { CarFormData } from "./CarForm";

interface SavedListingsProps {
  listings: CarFormData[];
  onClear: () => void;
}

export function SavedListings({ listings, onClear }: SavedListingsProps) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-blue-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Saved Listings</CardTitle>
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {listings.map((listing, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            <div>
              <h3 className="font-medium">
                {listing.year} {listing.make} {listing.model}
              </h3>
              <p className="text-sm text-gray-600">
                {formatCurrency(listing.price)} • {formatNumber(listing.mileage)} miles
              </p>
            </div>
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
        ))}
      </CardContent>
    </Card>
  );
}
