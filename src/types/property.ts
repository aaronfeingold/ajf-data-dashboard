interface Valuation {
  id: number;
  year: number;
  landValue: string;
  improvementValue: string;
  totalValue: string;
  created: string;
  updated: string;
  propertyRecordCard: number;
}

interface Transfer {
  id: number;
  saleDate: string; // actually a datetime string eg 2020-07-20T00:00:00Z
  saleAmount: string;
  valid: boolean;
  grantor: string;
  saleType: string;
  created: string;
  updated: string;
  propertyRecordCard: number;
}

interface Use {
  id: number;
  sequence: number;
  use: string;
  sfArea: number;
  averageSize: number;
  units: number;
  created: string;
  updated: string;
  propertyRecordCard: number;
}

interface PropertyRecordCard {
  id: number;
  valuation: Valuation[];
  transfer: Transfer[];
  use: Use[];
  parcelNumber: number; // 1028557
  altParcelNumber: string; // "49-06-35-131-001.000-101"
  county: string;
  township: string;
  propertyClass: string;
  propertyClassCode: number;
  propertyClassDescription: string;
  taxDistrict: number;
  neighborhood: string;
  propertyStreetNumber: number;
  propertyStreetName: string;
  propertyCity: string;
  propertyCounty: string;
  propertyState: string;
  propertyZipcode: string;
  estimatedSquareFeet: number;
  ownerName: string;
  ownerAddress: string;
  ownerZipcode: string;
  camaParcelId: number;
  ownerAccountNumber: null | string;
  legalDescription: string;
  assessorDistrict: string;
  strSection: string;
  strTownship: string;
  strRange: string;
  acreage: number;
  shapeLength: string; // 1670.888669223009401 -> TODO: use Use a BigDecimal library like decimal.js:
  shapeArea: string; // 169419.547783389803953 -> stored as string for precision (js floats are not precise past 15)
  geometry: string; // a massively long string of coordinates, eg: SRID=2965;MULTIPOLYGON (((186887.04632959142 1651443.187253192, etc ec
  created: string;
  updated: string;
  mostRecentValuation: string;
  mostRecentLandValuation: string;
  mostRecentImprovementValuation: string;
  totalSf: number;
  pricePerSf: string;
  mostRecentSaleDate: string;
  mostRecentSaleAmount: string;
  mostRecentPtaboaDate: string | null;
  mostRecentPtaboaAmount: string | null;
  // TODO: remove where using lat and long in the map, make use of shapeArea and shapeLength and geometry
  latitude: number;
  longitude: number;
}

// Property classes: remove if not needed for prod ie an endpoint can provide all property classes
// otherwise for now, here is an UNOFFICIAL list of property classes (code: description)
export const propertyClasses: Record<string, string> = Object.freeze({
  "400": "COM VACANT LAND",
  "401": "COMM - APT 4 - 19 UNITS",
  "402": "COM - APT 20-39 UNITS",
  "403": "COM - APT 40 OR MORE UNITS",
  "409": "COM VAC SUPPORT LAND FOR ANOTHER PARCEL",
  "410": "COM MOTELS OR TOURIST CABINS",
  "411": "COM HOTELS",
  "412": "COM NURSING HOMES & HOSPITALS",
  "415": "COM MOBILE HOME PARKS",
  "420": "COM SMALL DET RETAIL (-10000)",
  "421": "COM SUPERMARKETS",
  "422": "COM DISCOUNT & JR DEPT STORS",
  "424": "COM FULL LINE DEPT STORES",
  "425": "COM NEIGHBORHOOD SHOP CENTER",
  "426": "COM COMMUNITY SHOPPING CENTER",
  "427": "COM REGIONAL SHOPPING CENTER",
  "429": "COM OTR RETAIL STRUCTURES",
  "430": "COM REST",
  "431": "COM FRANCHISE RESTAURANT",
  "441": "COM FUNERAL HOME",
  "442": "COM MEDICAL CLINIC OR OFFICES",
  "444": "COM FULL SERVICE BANKS",
  "445": "COM SAVINGS & LOAN",
  "447": "COM OFF BLDG 1 OR 2 STY",
  "448": "COM OFF O/147 - WALK UP",
  "449": "COM OFF O/147 - ELEVATOR",
  "450": "COM CONVENIENCE MARKET/GAS",
  "451": "COM CONVENIENCE/REST/GAS",
  "452": "COM AUTO SERVICE STATION",
  "453": "COM CAR WASHES",
  "454": "COM AUTO SALES & SERVICE",
  "455": "COMMERICAL GARAGES",
  "456": "COM PARKING LOT OR STRUCTURE",
  "460": "COM THEATERS",
  "462": "COM GOLF RANGE OR MIN COURSE",
  "463": "COM GOLF COURSES",
});

export type { PropertyRecordCard, Valuation, Transfer, Use };
