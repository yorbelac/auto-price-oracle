import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { MAX_MILEAGE_BY_MAKE } from "@/utils/carCalculations";
import React from "react";

export function MaxMileageModal() {
  // Split the makes into two columns
  const makes = Object.entries(MAX_MILEAGE_BY_MAKE).sort(([a], [b]) => a.localeCompare(b));
  const midPoint = Math.ceil(makes.length / 2);
  const leftColumn = makes.slice(0, midPoint);
  const rightColumn = makes.slice(midPoint);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Maximum Mileage Estimates</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-4">
              These estimates are based on general brand reliability data and represent typical maximum mileage expectations. 
              Actual vehicle lifespan can vary significantly based on:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Model year and technological improvements</li>
              <li>Maintenance history and care</li>
              <li>Driving conditions and climate</li>
              <li>Model-specific reliability</li>
            </ul>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            {/* Headers */}
            <div className="font-semibold py-2 border-b">Make</div>
            <div className="text-right font-semibold py-2 border-b">Max Miles</div>
            <div className="font-semibold py-2 border-b">Make</div>
            <div className="text-right font-semibold py-2 border-b">Max Miles</div>
            
            {/* Left column data */}
            {leftColumn.map(([make, miles]) => (
              <React.Fragment key={make}>
                <div className="py-2 capitalize">{make}</div>
                <div className="text-right py-2">{miles.toLocaleString()}</div>
              </React.Fragment>
            ))}
            
            {/* Right column data */}
            {rightColumn.map(([make, miles]) => (
              <React.Fragment key={make}>
                <div className="py-2 capitalize">{make}</div>
                <div className="text-right py-2">{miles.toLocaleString()}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 