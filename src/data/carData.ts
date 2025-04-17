
// Sample car makes and models data

export interface CarMake {
  name: string;
  models: string[];
}

export const CAR_MAKES: CarMake[] = [
  {
    name: "Toyota",
    models: ["Camry", "Corolla", "RAV4", "Highlander", "4Runner", "Tacoma", "Tundra", "Prius", "Sienna"]
  },
  {
    name: "Honda",
    models: ["Accord", "Civic", "CR-V", "Pilot", "Odyssey", "HR-V", "Ridgeline", "Fit"]
  },
  {
    name: "Ford",
    models: ["F-150", "Escape", "Explorer", "Mustang", "Edge", "Ranger", "Bronco", "Expedition"]
  },
  {
    name: "Chevrolet",
    models: ["Silverado", "Equinox", "Tahoe", "Traverse", "Malibu", "Suburban", "Colorado", "Camaro", "Corvette"]
  },
  {
    name: "BMW",
    models: ["3 Series", "5 Series", "X3", "X5", "X7", "7 Series", "X1", "X6"]
  },
  {
    name: "Mercedes-Benz",
    models: ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLS", "A-Class", "G-Class"]
  },
  {
    name: "Audi",
    models: ["A4", "A6", "Q5", "Q7", "A3", "Q3", "Q8", "e-tron"]
  },
  {
    name: "Volkswagen",
    models: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "ID.4", "Taos", "Arteon"]
  },
  {
    name: "Lexus",
    models: ["RX", "ES", "NX", "GX", "IS", "LX", "UX", "LS"]
  },
  {
    name: "Subaru",
    models: ["Outback", "Forester", "Crosstrek", "Ascent", "Impreza", "Legacy", "WRX", "BRZ"]
  },
  {
    name: "Hyundai",
    models: ["Elantra", "Tucson", "Santa Fe", "Kona", "Palisade", "Sonata", "Venue", "Ioniq"]
  },
  {
    name: "Kia",
    models: ["Sorento", "Sportage", "Telluride", "Forte", "Soul", "Seltos", "Carnival", "K5"]
  },
  {
    name: "Nissan",
    models: ["Rogue", "Altima", "Sentra", "Pathfinder", "Murano", "Kicks", "Frontier", "Titan"]
  },
  {
    name: "Mazda",
    models: ["CX-5", "Mazda3", "CX-9", "CX-30", "Mazda6", "MX-5 Miata", "CX-50"]
  },
  {
    name: "Jeep",
    models: ["Grand Cherokee", "Wrangler", "Cherokee", "Compass", "Renegade", "Gladiator", "Wagoneer"]
  }
];

// Get all car makes as a simple array
export const getAllMakes = (): string[] => {
  return CAR_MAKES.map(make => make.name);
};

// Get all models for a specific make
export const getModelsByMake = (make: string): string[] => {
  const foundMake = CAR_MAKES.find(m => m.name.toLowerCase() === make.toLowerCase());
  return foundMake ? foundMake.models : [];
};
