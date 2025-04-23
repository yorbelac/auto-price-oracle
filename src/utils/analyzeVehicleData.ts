interface VehicleData {
  [year: string]: {
    [make: string]: {
      [model: string]: {
        mpg: number;
        // Add other fields as we discover them
      };
    };
  };
}

const vehicleData: VehicleData = require('../data/vehicle-data.json');

// Analyze the structure of the vehicle data
function analyzeVehicleData() {
  const years = Object.keys(vehicleData);
  console.log('Years available:', years);

  // Get a sample year's data structure
  const sampleYear = years[years.length - 1]; // Get the most recent year
  const yearData = vehicleData[sampleYear];
  
  if (Object.keys(yearData).length > 0) {
    const firstMake = Object.keys(yearData)[0];
    console.log('\nSample make structure:', firstMake);
    console.log('Sample make data:', JSON.stringify(yearData[firstMake], null, 2));
  } else {
    console.log('No data found for sample year');
  }
}

analyzeVehicleData(); 