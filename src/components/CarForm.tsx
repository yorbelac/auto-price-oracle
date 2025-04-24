import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";
import vehicleData from '@/data/vehicle-data.json';
import { VehicleData, getAvailableYears, getAvailableMakes, getAvailableModels } from '@/utils/vehicleDataTypes';

export interface CarFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  url?: string;
  pinned?: boolean;
  condition: "Fair" | "Good" | "Excellent";
}

interface CarFormProps {
  onSubmit?: (data: CarFormData) => void;
  onChange?: (data: CarFormData) => void;
  onCancel?: () => void;
  initialData?: CarFormData;
}

export function CarForm({ onSubmit, onChange, onCancel, initialData }: CarFormProps) {
  const defaultFormState: CarFormData = {
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    url: "",
    pinned: false,
    condition: "Good"
  };

  const [formData, setFormData] = useState<CarFormData>(defaultFormState);

  // Get available years from EPA data
  const years = getAvailableYears(vehicleData as VehicleData);
  
  // Get available makes for the selected year
  const makes = getAvailableMakes(vehicleData as VehicleData, formData.year.toString());
  
  // Get available models for the selected make and year
  const models = getAvailableModels(
    vehicleData as VehicleData,
    formData.year.toString(),
    formData.make
  );

  // Effect to update form when initialData changes
  useEffect(() => {
    if (initialData) {
      // First set the year and make
      setFormData(prev => ({
        ...prev,
        year: initialData.year || new Date().getFullYear(),
        make: initialData.make || "",
      }));
      
      // Then set the model after a small delay to ensure the models list is updated
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          model: initialData.model || "",
          price: initialData.price || 0,
          mileage: initialData.mileage || 0,
          url: initialData.url || "",
          pinned: initialData.pinned || false,
          condition: initialData.condition || "Good"
        }));
      }, 0);
    } else {
      setFormData(defaultFormState);
    }
  }, [initialData]);

  // Add a useEffect to emit changes
  useEffect(() => {
    // Emit changes if we have at least make and model
    if (formData.make && formData.model) {
      onChange?.({
        ...formData,
        // Ensure numeric fields are at least 0
        year: formData.year || new Date().getFullYear(),
        price: formData.price || 0,
        mileage: formData.mileage || 0
      });
    }
  }, [formData, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
      // Only reset form if we're not in edit mode
      if (!initialData) {
        setFormData(defaultFormState);
      }
    }
  };

  const handleCancel = () => {
    setFormData(defaultFormState);
    // Clear the initialData to switch to new car creation mode
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Card className="w-full h-full shadow-lg border-blue-200">
      <CardHeader className="bg-blue-700 text-white rounded-t-lg">
        <CardTitle className="text-center text-2xl">Enter Car Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
              <Select
                value={formData.year?.toString()}
                onValueChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    year: parseInt(value),
                    // Clear make and model when year changes
                    make: "",
                    model: ""
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>

          <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value: "Fair" | "Good" | "Excellent") => {
                  setFormData(prev => ({
                    ...prev,
                    condition: value
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Select
              value={formData.make}
              onValueChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  make: value,
                  // Clear model when make changes
                  model: ""
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={formData.model}
              onValueChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  model: value
                }));
              }}
              >
              <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Car value (e.g. 25000)"
                value={formData.price || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setFormData(prev => ({ ...prev, price: value }));
                }}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="Enter mileage"
                value={formData.mileage || ""}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  mileage: parseInt(e.target.value) || 0 
                }))}
                required
                className="w-full"
              />
            </div>
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
                className="w-full pl-9"
              />
              <Link className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="flex gap-2">
            {initialData && (
              <Button 
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              {initialData ? "Update Listing" : "Save Listing"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
