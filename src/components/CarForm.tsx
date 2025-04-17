
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CAR_MAKES, getModelsByMake } from "@/data/carData";

export interface CarFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
}

interface CarFormProps {
  onSubmit: (data: CarFormData) => void;
}

export function CarForm({ onSubmit }: CarFormProps) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [price, setPrice] = useState(0);
  const [mileage, setMileage] = useState(0);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  
  // Update available models when make changes
  useEffect(() => {
    if (make) {
      const models = getModelsByMake(make);
      setAvailableModels(models);
      setModel(models.length > 0 ? models[0] : "");
    } else {
      setAvailableModels([]);
      setModel("");
    }
  }, [make]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      make,
      model,
      year,
      price,
      mileage
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Card className="w-full max-w-md shadow-lg border-blue-200">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Select
              value={make}
              onValueChange={setMake}
              required
            >
              <SelectTrigger id="make" className="w-full">
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent>
                {CAR_MAKES.map((carMake) => (
                  <SelectItem key={carMake.name} value={carMake.name}>
                    {carMake.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={model}
              onValueChange={setModel}
              disabled={!make || availableModels.length === 0}
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

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select
              value={year.toString()}
              onValueChange={(value) => setYear(parseInt(value))}
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

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              min="1"
              step="100"
              placeholder="25000"
              value={price || ""}
              onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
              required
              className="w-full"
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
              value={mileage || ""}
              onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
              required
              className="w-full"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-700 hover:bg-blue-800 text-white"
            disabled={!make || !model || !year || !price || !mileage}
          >
            Calculate Value
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
