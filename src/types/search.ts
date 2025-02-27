export interface AdvancedSearchForm {
  parcelNumber: number | null;
  propertyClassCode: number | null;
  pricePerSfMin: number | null;
  pricePerSfMax: number | null;
  totalSfMin: number | null;
  totalSfMax: number | null;
  excludePtaboa: boolean;
  acreageMin: number | null;
  acreageMax: number | null;
  valuationMin: number | null;
  valuationMax: number | null;
}
