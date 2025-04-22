import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  pinned?: boolean;
}

interface CarFormProps {
  onSubmit: (data: CarFormData) => void;
  onChange?: (data: CarFormData) => void;
  initialData?: CarFormData;
}

export function CarForm({ onSubmit, onChange, initialData }: CarFormProps) {
  const [formData, setFormData] = useState<CarFormData>({
    make: initialData?.make || "",
    model: initialData?.model || "",
    year: initialData?.year || new Date().getFullYear(),
    price: initialData?.price || 0,
    mileage: initialData?.mileage || 0,
    url: initialData?.url || "",
    pinned: initialData?.pinned || false,
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

  // Update form fields when initialData changes
  useEffect(() => {
    if (initialData) {
      // First set the make
      setFormData(prev => ({ ...prev, make: initialData.make }));
      
      // Then get the available models for the make
      const models = getModelsByMake(initialData.make);
      setAvailableModels(models);
      
      // Finally set the rest of the form data including the model
      // This ensures the model is set after the available models are populated
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          model: initialData.model,
          year: initialData.year,
          mileage: initialData.mileage,
          price: initialData.price,
          url: initialData.url || '',
          pinned: initialData.pinned || false,
        }));
      }, 0);
    }
  }, [initialData]);

  // Debug logging
  useEffect(() => {
    console.log('Form Data:', formData);
    console.log('Available Models:', availableModels);
    console.log('Initial Data:', initialData);
  }, [formData, availableModels, initialData]);

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
    
    // Remove the price validation checks
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
        pinned: false,
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Card className="w-full h-full shadow-lg border-blue-200">
      <CardHeader className="bg-blue-700 text-white rounded-t-lg">
        <CardTitle className="text-center text-2xl">Enter Car Details</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            {/* Mobile native select */}
            <select
              id="make-mobile"
              value={formData.make}
              onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
            >
              <option value="">Select make</option>
              {CAR_MAKES.map(make => (
                <option key={make.name} value={make.name}>
                  {make.name}
                </option>
              ))}
            </select>
            {/* Desktop custom select */}
            <div className="hidden sm:block">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            {/* Mobile native select */}
            <select
              id="model-mobile"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              disabled={!formData.make || availableModels.length === 0}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
            >
              <option value="">Select model</option>
              {availableModels.map(modelName => (
                <option key={modelName} value={modelName}>
                  {modelName}
                </option>
              ))}
            </select>
            {/* Desktop custom select */}
            <div className="hidden sm:block">
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                disabled={!formData.make || availableModels.length === 0}
                required
              >
                <SelectTrigger id="model" className="w-full">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            {/* Mobile native select */}
            <select
              id="year-mobile"
              value={formData.year.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
            >
              <option value="">Select year</option>
              {years.map(year => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
            {/* Desktop custom select */}
            <div className="hidden sm:block">
              <Select
                value={formData.year.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value) }))}
                required
              >
                <SelectTrigger id="year" className="w-full">
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
          </div>

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
            <Button 
              type="submit" 
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
              disabled={!formData.make || !formData.model || !formData.year || !formData.price || !formData.mileage}
            >
              {initialData ? "Save Changes" : "Save Listing"}
            </Button>
            
            {initialData && (
              <Button 
                type="button"
                variant="outline"
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  setFormData({
                    make: "",
                    model: "",
                    year: new Date().getFullYear(),
                    price: 0,
                    mileage: 0,
                    url: "",
                    pinned: false,
                  });
                  onSubmit({
                    make: "",
                    model: "",
                    year: new Date().getFullYear(),
                    price: 0,
                    mileage: 0,
                    url: "",
                    pinned: false,
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
