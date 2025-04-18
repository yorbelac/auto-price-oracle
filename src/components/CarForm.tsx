import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CAR_MAKES, getModelsByMake } from "@/data/carData";
import { toast } from "@/components/ui/sonner";
import { Link } from "lucide-react";

export interface CarFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  url?: string;
}

interface CarFormProps {
  onSubmit: (data: CarFormData) => void;
  initialData?: CarFormData;
  onCancel?: () => void;
}

export function CarForm({ onSubmit, initialData, onCancel }: CarFormProps) {
  const [formData, setFormData] = useState<CarFormData>({
    make: initialData?.make || "",
    model: initialData?.model || "",
    year: initialData?.year || new Date().getFullYear(),
    price: initialData?.price || 0,
    mileage: initialData?.mileage || 0,
    url: initialData?.url || "",
  });
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Update available models when make changes
  useEffect(() => {
    if (formData.make) {
      const models = getModelsByMake(formData.make);
      setAvailableModels(models);
      // Only reset model if we're not editing and the current model isn't in the new list
      if (!initialData && (!formData.model || !models.includes(formData.model))) {
        setFormData(prev => ({ ...prev, model: models[0] || '' }));
      }
    } else {
      setAvailableModels([]);
      setFormData(prev => ({ ...prev, model: '' }));
    }
  }, [formData.make, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation with toast notifications
    if (formData.price < 500) {
      toast.error("Price too low", {
        description: "Car price must be at least $500."
      });
      return;
    }

    if (formData.price > 1000000) {
      toast.error("Price too high", {
        description: "Car price cannot exceed $1,000,000."
      });
      return;
    }

    onSubmit(formData);

    // Only clear form if we're not editing
    if (!initialData) {
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        url: "",
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Select
            value={formData.make}
            onValueChange={(value) => setFormData(prev => ({ ...prev, make: value }))}
          >
            <SelectTrigger id="make">
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {CAR_MAKES.map(make => (
                <SelectItem key={make.name} value={make.name}>
                  {make.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select
            value={formData.model}
            onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
            disabled={!formData.make || availableModels.length === 0}
          >
            <SelectTrigger id="model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((modelName) => (
                <SelectItem key={modelName} value={modelName}>
                  {modelName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select
            value={formData.year.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value) }))}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="500"
            max="1000000"
            step="100"
            placeholder="Car value (e.g. 25000)"
            value={formData.price || ""}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setFormData(prev => ({ ...prev, price: Math.max(0, Math.min(value, 1000000)) }));
            }}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            min="0"
            step="100"
            placeholder="50000"
            value={formData.mileage || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">Listing URL (optional)</Label>
          <div className="relative">
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              value={formData.url || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="pl-8"
            />
            <Link className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        {initialData ? (
          <>
            <Button variant="outline" type="button" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Listing
            </Button>
          </>
        ) : (
          <Button type="submit" className="w-full">
            Save Listing
          </Button>
        )}
      </div>
    </form>
  );
}
