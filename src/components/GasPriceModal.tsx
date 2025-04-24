import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fuel } from "lucide-react";
import { useState } from "react";

interface GasPriceModalProps {
  gasPrice: number;
  onGasPriceChange: (price: number) => void;
}

export function GasPriceModal({ gasPrice, onGasPriceChange }: GasPriceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempPrice, setTempPrice] = useState(gasPrice);

  const handleSave = () => {
    onGasPriceChange(tempPrice);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2 text-white hover:text-white/90">
          <Fuel className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Gas Price</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gasPrice" className="text-right">
              Price per gallon
            </Label>
            <Input
              id="gasPrice"
              type="number"
              step="0.01"
              min="0"
              value={tempPrice}
              onChange={(e) => setTempPrice(parseFloat(e.target.value) || 0)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 