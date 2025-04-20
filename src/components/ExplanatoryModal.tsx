import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export function ExplanatoryModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>How It Works</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-gray-700">
          <p>
            Our calculator estimates a car's value using a simple yet effective formula:
          </p>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="font-mono text-center">
              Value Score = Price ÷ Remaining Miles
            </p>
            <p className="text-sm text-center mt-2">
              where Remaining Miles = Maximum Expected Miles - Current Mileage
            </p>
          </div>
          <p>
            A <strong>lower score</strong> indicates a better value for your money, as you're paying less for each remaining mile of the car's estimated life.
          </p>
          <p>
            Different car makes have different expected lifespans based on reliability data. For example, Toyota and Honda vehicles typically have longer expected lifespans than some luxury brands.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 