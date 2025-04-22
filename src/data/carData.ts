// Sample car makes and models data

export interface CarMake {
  name: string;
  models: string[];
}

export const CAR_MAKES: CarMake[] = [
  {
    name: "Acura",
    models: ["CL", "CSX", "EL", "ILX", "ILX Hybrid", "Integra", "Legend", "MDX", "MDX Sport Hybrid", "NSX", "RDX", "RL", "RLX", "RLX Sport Hybrid", "RSX", "SLX", "TL", "TLX", "TSX", "Vigor", "ZDX"]
  },
  {
    name: "Alfa Romeo",
    models: ["146", "156", "164", "4C", "Giulia", "Giulia Quadrifoglio", "Graduate", "Spider", "Stelvio", "Tonale"]
  },
  {
    name: "AMC",
    models: ["Gremlin"]
  },
  {
    name: "Audi",
    models: ["100", "200", "4000", "5000", "90", "A1", "A3", "A4", "A4 allroad", "A5", "A6", "A6 allroad", "A7", "A8", "allroad", "Cabriolet", "e-tron", "Q2", "Q3", "Q5", "Q7", "Q8", "Quattro", "R8", "RS 3", "RS 4", "RS 5", "RS 6", "RS 7", "RS Q8", "RS3", "S3", "S4", "S5", "S6", "S7", "S8", "SQ5", "SQ7", "TT", "TTS"]
  },
  {
    name: "Bentley",
    models: ["Arnage", "Continental", "Flying Spur", "Mulsanne", "Turbo RL"]
  },
  {
    name: "BMW",
    models: ["116i", "120d", "128", "135", "218i", "220d", "228", "228i Xdrive Gran", "230i", "316", "316d", "316i", "318", "318d", "318i", "320", "320d", "320i", "323", "325", "328", "328d", "330", "330d", "330e", "330i", "335", "335d", "335i", "340", "428", "428i", "430", "430i", "435", "520", "520D", "525", "525 TDS", "525i", "528", "530", "530d", "530E", "535", "535d", "540", "540i", "550", "620d", "630d", "630i", "640", "640i", "650", "650i", "728", "735", "740", "740i", "745", "750", "760", "760i", "ActiveHybrid 3", "ActiveHybrid 5", "ActiveHybrid 7", "ActiveHybrid 740", "i3", "i4", "i7", "i8", "iX", "M2", "M235i", "M3", "M340i", "M340i X-Drive", "M4", "M5", "M550", "M6", "X1", "X2", "X3", "X4", "X5", "X5 eDrive", "X5 Hybrid", "X5 XDRIVE 50e", "X6", "X7", "Z3", "Z4"]
  },
  {
    name: "Buick",
    models: ["Cascada", "Century", "Electra", "Enclave", "Encore", "Encore GX", "Envision", "LaCrosse", "LeSabre", "Lucerne", "Park Avenue", "Rainier", "Reatta", "Regal", "Regal TourX", "Rendezvous", "Riviera", "Roadmaster", "Skyhawk", "Skylark", "Somerset", "Terraza", "Verano"]
  },
  {
    name: "Cadillac",
    models: ["Allante", "Ambulance", "ATS", "ATS-V", "Brougham", "Catera", "CT4", "CT5", "CT6", "CT6-V", "CTS", "CTS-V", "DeVille", "DTS", "Eldorado", "ELR", "Escalade", "Escalade ESV", "Escalade EXT", "Escalade Hybrid", "Fleetwood", "Lyriq", "SeVille", "Sixty Special", "SLS", "SRX", "STS", "XLR", "XT4", "XT5", "XT6", "XTS"]
  },
  {
    name: "Chevrolet",
    models: ["Alero", "Astro Van", "Avalanche", "Aveo", "Beat", "Beretta", "Blazer", "Bolt", "C 1500", "C-10 Pickup", "C-20", "C/K 1500", "C/K 2500", "C/K 3500", "Camaro", "Capitva", "Caprice", "Caprice Classic", "Captiva", "Cavalier", "Celebrity", "Chevelle", "Chevette", "Cheyenne", "Citation", "City Express", "Cobalt", "Colorado", "Conversion Van", "Corsica", "Corvette", "Corvette Stingray", "Cruze", "El Camino", "Epica", "Equinox", "Equinox EV", "Express", "G20", "HHR", "II Nova", "Impala", "Iroc-Z", "JOY", "K5 Blazer", "Kodiak", "Lanos", "Lumina", "Malibu", "Malibu Classic", "Malibu Hybrid", "Malibu Maxx", "Meriva", "Metro", "Monte Carlo", "Motorhome", "Nova", "Optra", "Optra Magnum", "Orlando", "Prizm", "S-10 Blazer", "S-10 Pickup", "Scottsdale", "Silverado", "Silverado 1500", "Silverado 1500 Hybrid", "Silverado 2500", "Silverado 3500", "Sonic", "Spark", "Spark EV", "Spectrum", "Sprint", "SS", "SSR", "Suburban", "Tahoe", "Tahoe Hybrid", "Tavera", "Tavera Neo 3", "Tracker", "Trailblazer", "Trailblazer EXT", "Trans Am", "Traverse", "Trax", "Uplander", "VAN", "Vectra", "Venture", "Volt"]
  },
  {
    name: "Chrysler",
    models: ["200", "200 S", "200C", "200S", "300", "300C", "300M", "300S", "Aspen", "Cirrus", "Concorde", "Crossfire", "Fifth Avenue", "Grand Caravan", "Grand Voyager", "Imperial", "Intrepid", "Laser", "LeBaron", "LHS", "Neon", "New Yorker", "Pacifica", "Pacifica Hybird", "Pacifica Hybrid", "Pacifica Plug-in Hybrid", "PT Cruiser", "Sebring", "Town & Country", "Voyager"]
  },
  {
    name: "Dodge",
    models: ["600", "Aries", "Avenger", "B150 Van", "B250", "B2500 Cargo Van", "Caliber", "Caravan", "Cargo Van", "Challenger", "Charger", "Colt", "Conversion Van", "D100", "D150", "D200", "D2500", "Dakota", "Dart", "Daytona", "Durango", "Dynasty", "Grand Caravan", "Hornet", "Intrepid", "Journey", "Magnum", "Neon", "Nitro", "Omni", "Power Ram 50", "Pro Master", "Promaster", "Ram 100", "Ram 150", "Ram 1500", "Ram 250", "Ram 2500", "Ram 2500 Power Wagon", "Ram 350", "Ram 3500", "Ram 4500", "Ram 50", "Ram 5500", "Ram Conversion Van", "Ram Van 1500", "Ram Van 2500", "Ram Van 3500", "Rebel", "Shadow", "Spirit", "Sprinter", "SRT Viper", "Stealth", "Stratus", "SX 2.0", "Viper"]
  },
  {
    name: "Ford",
    models: ["Aerostar", "Aspire", "Bantam", "Bronco", "Bronco II", "Bronco Sport", "C-Max", "C-Max Energi", "C-Max Hybrid", "Contour", "Corsica", "Country Squire", "Crown Victoria", "E-150", "E-250", "E-350", "E-450", "Econoline", "EcoSport", "Edge", "Escape", "Escape Hybrid", "Escort", "Everest", "Excursion", "Expedition", "Explorer", "Explorer Sport Trac", "F-100", "F-150", "F-150 Lightning", "F-250", "F-350", "F-450", "F-550", "F-59", "F-600", "F-750", "Fairlane", "Fairmont", "Falcon", "Festiva", "Fiesta", "Fiesta Encore", "Figo", "Five Hundred", "Flex", "Focus", "Focus Electric", "Freestar", "Freestyle", "Fusion", "Fusion Energi", "Fusion Hybrid", "Fusion Plug-In Hybrid", "Galaxie", "GT", "Ikon", "KA", "Kuga", "Laser", "LCF", "LTD", "Maverick", "Maverick Hybrid", "Meteor", "Mondeo", "Mustang", "Mustang Mach-E", "Mystique", "Pace Arrow", "Probe", "Ranger", "S-MAX", "Sierra", "Taurus", "Taurus X", "Tempo", "Territory", "Thunderbird", "Topaz", "Tourneo Custom Van", "Transit", "Transit 250", "Transit Connect", "Windstar"]
  },
  {
    name: "Genesis",
    models: ["G70", "G80", "G90", "GV70", "GV80"]
  },
  {
    name: "GMC",
    models: ["Acadia", "C4500", "C6500 Topkick", "Canyon", "Denali", "Envoy", "Envoy XL", "Jimmy", "S-15 Jimmy", "Safari", "Savana", "Savana 3500", "Sierra", "Sierra 1500", "Sierra 1500 Hybrid", "Sierra 2500", "Sierra 3500", "Sonoma", "Suburban", "Terrain", "Vandura 2500", "Yukon", "Yukon Hybrid"]
  },
  {
    name: "Honda",
    models: ["Accord", "Accord Crosstour", "Accord Hybrid", "Accord Plug-in Hybrid", "Activa", "Airwave", "Amaze", "Ballade", "Brio", "Brio Amaze", "City", "Civic", "Civic Hatchback", "Civic Hybrid", "Clarity Electric", "Clarity Fuel Cell", "Clarity Plug-In Hybrid", "CR-V", "CR-V Hybrid", "CR-Z", "Crosstour", "CRX", "Del Sol", "Element", "FCX Clarity", "Fit", "Fit EV", "Freed", "HR-V", "HR-V Sport AWD", "HRV", "Insight", "Inspire", "Jazz", "Luxline", "Mobilio", "Odyssey", "Orthia", "Passport", "Pilot", "Prelude", "Prologue", "Ridgeline", "S2000", "WR-V"]
  },
  {
    name: "Hyundai",
    models: ["Accent", "Atos", "Atos Prime", "Azera", "Elantra", "Elantra GT", "Elantra Hybrid", "Elantra Touring", "Entourage", "EON", "Equus", "Excel", "Fludic Verna", "G80", "G90", "Genesis", "Genesis Coupe", "Genesis G80", "Getz", "Grand i10", "I10", "i20", "I20 Active", "I30", "i40", "iLoad", "Ioniq", "IONIQ 5", "Ioniq 5 N", "IONIQ 6", "Ioniq Electric", "Ioniq HEV", "Ioniq Hybrid", "Ioniq Plug-in Hybrid", "IX20", "IX35", "Kona", "Kona Electric", "Matrix", "NEXO", "Palisade", "Santa Cruz", "Santa Fe", "Santa Fe Hybrid", "Santa Fe Sport", "Santro Xing", "Scoupe", "Sonata", "Sonata Hybrid", "Sonata Plug-in Hybrid", "Stargazer", "Stargazer X", "Terracan", "Tiburon", "Tucson", "Tucson Hybrid", "Tuscan HYBRID SEL", "Veloster", "Veloster N", "Venue", "Veracruz", "Verna", "Xcent", "XG300", "XG350"]
  },
  {
    name: "Infiniti",
    models: ["EX35", "EX37", "FX35", "FX37", "FX45", "FX50", "G20", "G25", "G35", "G35X", "G37", "GS35", "I30", "I35", "J30", "JX35", "M30d", "M35", "M35h", "M35X", "M37", "M45", "M56", "Q40", "Q45", "Q50", "Q50 Hybrid", "Q60", "Q70", "Q70h", "Q70L", "QX 60", "QX30", "QX4", "QX50", "QX56", "QX60", "QX60 Hybrid", "QX70", "QX80"]
  },
  {
    name: "Jeep",
    models: ["Cherokee", "CJ-7", "Comanche", "Commander", "Compass", "Gladiator", "Grand Cherokee", "Grand Cherokee 4xe", "Grand Cherokee L", "Grand Wagoneer", "Liberty", "Patriot", "Renegade", "Rubicon", "Sport", "Wagoneer", "Wagoneer S", "Wrangler", "Wrangler 4XE"]
  },
  {
    name: "Kia",
    models: ["Amanti", "Borrego", "Cadenza", "Carens", "Carnival", "Ceed", "Cerato", "Cerato Hatch", "EV6", "EV9", "Forte", "Forte Koup", "FORTE5", "K4", "K5", "K900", "Magentis", "Niro", "Niro EV", "Niro PHEV", "Niro Plug-in Hybrid", "Optima", "Optima Hybrid", "Optima Plug-in Hybrid", "Picanto", "Plug-in Hybrid", "Rio", "Rio5", "Rondo", "Sedona", "Seltos", "Sephia", "Shuma 2", "Sorento", "Sorento Hybrid", "Soul", "Soul EV", "Spectra", "Sportage", "Stinger", "Telluride"]
  },
  {
    name: "Lexus",
    models: ["470", "CT 200h", "ES 250", "ES 300", "ES 300h", "ES 330", "ES 350", "ES 350 F", "GS 200t", "GS 300", "GS 350", "GS 450h", "GS F", "GX", "GX 460", "GX 470", "GX460", "GX470", "HS 250h", "IS 200t", "IS 250", "IS 300", "IS 350", "IS 500", "IS F", "IS250", "LC 500", "LFA", "LS 400", "LS 430", "LS 460", "LS 500", "LS 500h", "LS 600h", "LS 600h L", "LS430", "LS460", "LX 470", "LX 570", "LX 600", "NX", "NX 200t", "NX 300", "NX 300h", "NX200T", "NX250", "NX350", "RC 200t", "RC 300", "RC 350", "RC F", "RX 300", "RX 330", "RX 350", "RX 350H", "RX 400h", "RX 450h", "RX 450HL", "RX300", "RX400H", "RZ 300e", "RZ 450e", "SC 300", "SC 400", "SC 430", "SC400", "TX", "UX"]
  },
  {
    name: "Lincoln",
    models: ["Aviator", "Continental", "Corsair", "Corsair Hybrid", "LS", "Mark LT", "Mark VII", "Mark VIII", "MKC", "MKS", "MKT", "MKX", "MKZ", "MKZ Hybrid", "Nautilus", "Navigator", "Town Car", "Zephyr"]
  },
  {
    name: "Mazda",
    models: ["3", "323", "5", "626", "929", "Atenza", "B2100", "B2200", "B2300", "B2500", "B2600", "B3000", "B4000", "BT-50", "Capella", "CX", "CX-3", "CX-30", "CX-5", "CX-50", "CX-60", "CX-7", "CX-70", "CX-9", "CX-90", "CX-90 Hybrid", "CX5", "CX9", "E2000", "Familia", "MAZDA2", "MAZDA3", "MAZDA5", "MAZDA6", "MAZDASPEED3", "MAZDASPEED6", "Millenia", "MPV", "Murano", "MX-3", "MX-30", "MX-30 EV", "MX-5 Miata", "MX-5 Miata RF", "MX-6", "Navajo", "Protege", "Protege5", "Revue", "RX-7", "RX-8", "Sentia", "Tribute"]
  },
  {
    name: "Mercedes-Benz",
    models: ["190", "190E", "240C", "240D", "260", "260E", "300", "300 CE", "300D", "300E", "300SE", "320", "380", "450SLC", "500", "560", "A140", "A160", "A190", "A220", "AMG C43", "AMG C63S", "AMG E53", "AMG GLB35", "AMG GT", "B-Class Electric Drive", "B150", "B200", "B200T", "C180", "C200", "C200K", "C220", "C230", "C240", "C250", "C280", "C300", "C320", "C350", "C400", "C63 AMG", "CL500", "CLA220", "CLA250", "CLA45 AMG", "CLK", "CLK230", "CLK240", "CLK320", "CLK350", "CLK430", "CLK500", "CLK550", "CLS", "CLS400", "CLS450", "CLS500", "CLS55", "CLS550", "CLS63", "E-250", "E-300", "E-320", "E-400", "E-430", "E-500", "E-550", "E220", "E250", "E250 BlueTec", "E280", "E300", "E300 Bluetec Hybrid", "E320", "E320 CDI", "E350", "E400", "E400 Hybrid", "E420", "E450", "E500", "E550", "E63", "EQS 450+", "G55 AMG", "G550", "GL320", "GL350", "GL350 BlueTec", "GL450", "GLA250", "GLB250", "GLC220D", "GLC300", "GLC350", "GLC350e", "GLE 350", "GLE350", "GLE450", "GLK 250", "GLK250", "GLK350", "GLS", "GLS450", "GLS550", "GLS580", "Metris", "ML300", "ML320", "ML320 CDI", "ML350", "ML350 Bluetec", "ML430", "ML500", "ML55", "ML550", "R320", "R320 CDI", "R350", "S-Class", "S320", "S350", "S430", "S450", "S55", "S550", "S560", "S560e", "S600", "S63", "SL", "SL450", "SL500", "SL55", "SL550", "SLC300", "SLK", "SLK230", "SLK250", "SLK280", "SLK300", "SLK320", "SLK350", "Smart Fortwo", "Sprinter", "V220 CDI", "Vito", "W124 300TD"]
  },
  {
    name: "Mercury",
    models: ["Bobcat", "Capri", "Cougar", "Grand Marquis", "Lynx", "Marauder", "Mariner", "Mariner Hybrid", "Milan", "Montego", "Monterey", "Mountaineer", "Mystique", "Sable", "Topaz", "Tracer", "Villager"]
  },
  {
    name: "MINI",
    models: ["Clubman", "Convertible", "Cooper", "Cooper Clubman", "Cooper Countryman", "Cooper Coupe", "Cooper Paceman", "Cooper Roadster", "Cooper S", "Cooper S Clubman", "Countryman", "Hardtop", "John Cooper Works", "Paceman"]
  },
  {
    name: "Mitsubishi",
    models: ["3000 GT", "ASX", "Attrage", "Colt", "Colt Cabriolet", "Colt Space Star", "Cordia", "Delica Space Gear", "Diamante", "Eclipse", "Eclipse Cross", "Endeavor", "Expo", "Galant", "i-MiEV", "L200", "Lancer", "Lancer Evolution", "Mighty Max", "Mirage", "Mirage G4", "Montero", "Outlander", "Outlander PHEV", "Outlander SEL Black Edition", "Outlander Sport", "Pajero", "Pick Up", "Raider", "Speranza", "Triton"]
  },
  {
    name: "Nissan",
    models: ["200SX", "240SX", "300ZX", "350Z", "370Z", "AD", "Almera", "Altima", "Altima Hybrid", "ARIYA", "Armada", "Axxess", "Bluebird Sylphy", "Cube", "D21", "Datsun", "Dualis", "Elgrand", "Evalia", "F14 Silvia", "Frontier", "Grand Livina", "GT-R", "Hardbody", "Juke", "Kicks", "Leaf", "Livina", "March", "Maxima", "Micra", "Murano", "Murano CrossCabriolet", "Murano Hybrid", "Navara", "Note", "NV", "NV 2500", "NV Cargo", "NV Passenger", "NV200", "NV2500", "NV3500", "Pathfinder", "Pathfinder Hybrid", "Patrol", "Pickup", "Presea", "Primera", "Pulsar", "Qashqai", "Quest", "Rogue", "Rogue Hybrid", "Rogue Select", "Rogue Sport", "Sentra", "Skyline", "Stanza", "Sunny", "Sunny Spacewagon", "Terrano", "Tiida", "Titan", "Versa", "Versa Note", "X-Trail", "Xterra", "Z"]
  },
  {
    name: "Oldsmobile",
    models: ["Achieva", "Alero", "Aurora", "Bravada", "Calais", "Cutlass", "Cutlass Calais", "Cutlass Ciera", "Cutlass Cruiser", "Cutlass Supreme", "Delta 88", "Eighty Eight", "Intrigue", "LSS", "Ninety Eight", "Omega", "Regency", "Royale 88", "Silhouette", "Toronado"]
  },
  {
    name: "Plymouth",
    models: ["Acclaim", "Breeze", "Caravelle", "Colt", "Duster", "Grand Voyager", "Horizon", "Laser", "Neon", "Reliant", "Sundance", "Valiant", "Voyager"]
  },
  {
    name: "Pontiac",
    models: ["6000", "Aztek", "Bonneville", "Calais", "Fiero", "Firebird", "Firefly", "G3", "G5", "G6", "G8", "Grand Am", "Grand Prix", "GTO", "LeMans", "Montana", "Phoenix", "Pursuit", "Pursuit G5", "Solstice", "Sunbird", "Sunfire", "Tempest", "Torrent", "Trans Am", "Trans Sport", "Ventura", "Vibe", "Wave"]
  },
  {
    name: "Porsche",
    models: ["718 Boxster", "718 Cayman", "911", "918 Spyder", "944", "Boxster", "Carrera GT", "Cayenne", "Cayenne EV", "Cayenne Hybrid", "Cayman", "Macan", "Macan Electric", "Panamera", "Panamera Hybrid", "Taycan"]
  },
  {
    name: "Ram",
    models: ["1500", "1500 Classic", "2500", "3500", "4500", "5500", "C/V Tradesman", "Cargo", "ProMaster", "ProMaster 1500", "ProMaster 2500", "ProMaster 3500", "ProMaster City"]
  },
  {
    name: "Rivian",
    models: ["R1S", "R1T"]
  },
  {
    name: "Scion",
    models: ["FR-S", "iA", "iM", "iQ", "tC", "xA", "xB", "xD"]
  },
  {
    name: "Subaru",
    models: ["Ascent", "B9 Tribeca", "Baja", "BRZ", "Crosstrek", "Crosstrek Hybrid", "DL", "Forester", "GL", "Impreza", "Impreza WRX", "Impreza WRX STI", "Legacy", "Loyale", "Outback", "Solterra", "SVX", "Tribeca", "WRX", "WRX STI", "XT", "XV Crosstrek", "XV Crosstrek Hybrid"]
  },
  {
    name: "Tesla",
    models: ["Cybertruck", "Model 3", "Model S", "Model X", "Model Y", "Roadster", "S", "X"]
  },
  {
    name: "Toyota",
    models: ["4Runner", "86", "Aurion", "Auris", "Avalon", "Avalon Hybrid", "Avanza", "Avensis", "bZ4X", "C-HR", "Camry", "Camry Hybrid", "Carib", "Carina", "Cavalier", "Celica", "Corolla", "Corolla Cross", "Corolla Cross Hybrid", "Corolla Hatchback", "Corolla Hybrid", "Corolla Verso", "Cressida", "Crown", "Dyna", "Echo", "Etios", "Etios Liva", "FJ Cruiser", "FJ40", "Fortuner", "GR Corolla", "GR Supra", "GR86", "Grand Highlander", "Grand Highlander Hybrid", "Harrier", "Hiace", "Highlander", "Highlander Hybrid", "Hilux", "Innova", "iQ2", "King Cab", "Land Cruiser", "Mark X", "Matrix", "Mirai", "MR2", "Paseo", "Pickup", "Prado", "Premio", "Previa", "Prius", "Prius c", "Prius Plug-in", "Prius Prime", "Prius v", "Raum", "RAV4", "RAV4 EV", "RAV4 Hybrid", "RAV4 Prime", "Scion", "Sequoia", "Sienna", "Sienna Hybrid", "Solara", "Sprinter", "Supra", "T100", "Tacoma", "Tarago", "Tercel", "Tundra", "Tundra Hybrid", "Van", "Venza", "Verso", "Vitz", "Windom", "Yaris", "Yaris Hatchback", "Yaris Verso"]
  },
  {
    name: "Volkswagen",
    models: ["Amarok", "Ameo", "Arteon", "Atlas", "Atlas Cross Sport", "Beetle", "Cabrio", "Cabriolet", "Caddy", "Caravelle", "CC", "Citi Golf", "Crossfox", "e-Golf", "Eos", "Eurovan", "Fox", "GLI", "Golf", "Golf Alltrack", "Golf GTI", "Golf R", "Golf SportWagen", "GTI", "ID. Buzz", "ID.4", "ID.5", "Jetta", "Jetta GLI", "Jetta Hybrid", "Jetta SportWagen", "Microbus", "Multivan", "Passat", "Phaeton", "Polo", "Polo GTI", "Rabbit", "Routan", "Scirocco", "Sharan", "Taigun", "Taos", "Tiguan", "Touareg", "Touareg Hybrid", "Touran", "Transporter", "UP!", "Vanagon", "Vento"]
  },
  {
    name: "Volvo",
    models: ["240", "244DL", "340", "440", "480", "740", "850", "940", "940 Sedan", "960", "C30", "C40 Recharge", "C70", "EC40", "EM90", "EX30", "EX40", "EX90", "S40", "S60", "S60 Cross Country", "S60 Inscription", "S60 Recharge", "S70", "S80", "S90", "S90 Recharge", "V40", "V50", "V60", "V60 Cross Country", "V60 Recharge", "V70", "V90", "V90 Cross Country", "XC40", "XC40 Recharge", "XC60", "XC60 Recharge", "XC70", "XC90", "XC90 Hybrid", "XC90 Recharge"]
  },
  {
    name: "Mahindra",
    models: ["Bolero", "NuvoSport", "Scorpio"]
  },
  {
    name: "Maruti",
    models: ["ZEN", "ZEN D", "Zen Estilo"]
  },
  {
    name: "Maserati",
    models: ["Ghebli", "Ghibli", "GranCabrio", "GranTurismo", "Levante", "Quattroporte"]
  },
  {
    name: "Opel",
    models: ["Astra", "Corsa", "Grandland X", "Insignia", "Manza", "Mariva", "Meriva", "Vectra"]
  },
  {
    name: "Peugeot",
    models: ["106", "2008", "206", "206 GLX", "206 GTI", "207", "207CC", "208", "3008", "306", "307", "308 XT", "405", "406", "407", "408", "508", "607", "807", "RCZ"]
  },
  {
    name: "Renault",
    models: ["19", "Captur", "Captur Dynamique", "Clio", "Duster", "Fluence", "Kangoo", "Kiger", "Koleos", "Laguna", "Megan", "Megane", "Modus", "Sandero Stepway", "Senic", "Vel Satis"]
  },
  {
    name: "Chery",
    models: ["A1", "B14FL", "E5", "J11", "J3", "QQ"]
  },
  {
    name: "Daewoo",
    models: ["Lanos", "Leganza", "Matiz", "Neberia", "Nubira"]
  },
  {
    name: "Datsun",
    models: ["280ZX", "B210", "GO", "GO LUX", "Pickup", "Redi Go T"]
  },
  {
    name: "Eagle",
    models: ["Eagle", "Medallion", "Premier", "Summit", "Talon", "Vision"]
  },
  {
    name: "Ferrari",
    models: ["488", "488 Spider", "812 Superfast", "F355 Spyder", "F8 Tributo", "GTC4Lusso", "GTC4Lusso T"]
  },
  {
    name: "Fiat",
    models: ["124 Spider", "500", "500c", "500e", "500L", "500X", "Brava", "Brava - ELX", "Cinquecento", "Doblo", "Linea", "Marea", "Palio", "Panda", "Punto", "Punto Classic", "Qubo", "Ulysse", "Uno", "Uno Pacer", "X19"]
  },
  {
    name: "Geo",
    models: ["Metro", "Prizm", "Storm", "Tracker"]
  },
  {
    name: "Holden",
    models: ["Barina", "Commodore", "Crewman", "Cruze", "Epica", "Rodeo", "Spark"]
  },
  {
    name: "HSV",
    models: ["GTS"]
  },
  {
    name: "Hummer",
    models: ["H1", "H2", "H3", "H3T"]
  },
  {
    name: "Isuzu",
    models: ["Amigo", "Ascender", "Axiom", "Bighorn", "D MAX", "Hombre", "I-Mark", "Impulse", "MU-X", "MU-X LS-T", "Odyssey", "Panther", "Pickup", "Rodeo", "Stylus", "T15 Pickup", "Trooper", "Trooper II"]
  },
  {
    name: "Jaguar",
    models: ["E-PACE", "F-PACE", "F-TYPE", "I-PACE", "S-TYPE", "Super", "X-TYPE", "XE", "XF", "XJ", "XJL", "XJR", "XK", "XK8", "XKR"]
  },
  {
    name: "Kenworth",
    models: ["W923"]
  },
  {
    name: "Lamborghini",
    models: ["Aventador", "Gallardo", "Huracan", "Urus"]
  },
  {
    name: "Land Rover",
    models: ["214", "Defender", "Defender 90", "Discovery", "Discovery II", "Discovery Sport", "Freelander", "LR2", "LR3", "LR4", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"]
  },
  {
    name: "Lotus",
    models: ["Elise", "Evora", "Exige"]
  },
  {
    name: "Rover",
    models: ["214", "2", "Mini"]
  },
  {
    name: "Saab",
    models: ["9-2X", "8", "9-3", "9-3X", "9-4X", "9-5", "9-7X", "900", "9000"]
  },
  {
    name: "Saturn",
    models: ["Astra", "Aura", "Ion", "L100", "L200", "L300", "LS", "LW1", "LW2", "Outlook", "Relay", "SC", "Sky", "SL", "SW", "Vue"]
  },
  {
    name: "Seat",
    models: ["Altea", "Ibiza", "Leon"]
  },
  {
    name: "Skoda",
    models: ["Fabia", "Felicia", "Octavia", "Roomster", "Superb"]
  },
  {
    name: "Smart",
    models: ["fortwo", "fortwo electric drive"]
  },
  {
    name: "Ssangyong",
    models: ["Stavic"]
  },
  {
    name: "Suzuki",
    models: ["Aerio", "Celerio", "DL1000", "Equator", "Escudo", "Esteem", "Estilo", "Forenza", "Grand Vitara", "Kizashi", "Liana", "Margalla", "Maruti", "Reno", "S-Cross", "Samurai", "Sidekick", "Swift", "SX4", "Verona", "Vitara", "Vitara S", "XL7"]
  },
  {
    name: "Tata",
    models: ["Indica Vista", "Indigo", "Indigo Manza", "Nexon"]
  },
  {
    name: "Vauxhall",
    models: ["Astra", "Astra Club", "Carlton", "Cavalier", "Combo", "Corsa", "Grandland X", "Meriva", "Mokka", "Monaro", "Omega MV6 Estate", "Tigra", "Vectra", "Zafira"]
  },
  {
    name: "Yugo",
    models: ["GV"]
  },
  {
    name: "Zimmer",
    models: ["Golden Spirit"]
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
