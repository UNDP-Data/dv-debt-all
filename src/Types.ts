export interface CategoryData {
  category: string;
  description: string;
  source: number;
}
export interface DebtGdp {
  region: string;
  year: string;
  totalDebtMean: number;
  totalDebtMedian: number;
  externalDebtMean: number;
  externalDebtMedian: number;
}
export interface DebtNetInterestType {
  region: string;
  option: string;
  period: string;
  percentages: [];
}
export interface DebtServiceType {
  region: string;
  year: string;
  number_revenue: number;
  percentage_revenue: number;
  number_exports: number;
  percentage_exports: number;
}
export interface RatingType {
  region: string;
  value: string;
}
export interface CreditRatingType extends RatingType {
  'Investment grade': number;
  'Non-investment grade': number;
  'Highly speculative': number;
  'Substantial risk or extremely speculative': number;
  'In default': number;
}
export interface DsaRatingType extends RatingType {
  'In debt distress': number;
  High: number;
  Moderate: number;
  Low: number;
}

export interface CountryType {
  label: string;
  value: string;
}
export interface CountryValueType {
  code: string;
  name: string;
  value: number;
}
export interface CountryCategoryType {
  code: string;
  name: string;
  category: string;
}
export interface CountryPercentType {
  code: string;
  year: number;
  percentage: number;
  million: number;
}
export interface CountryStatsType {
  debtMillion: string;
  debtPercent: string;
  debtYear: string;
  externalGovDebt: string;
  externalGovDebtYear: string;
  netInterestPayments: string;
  netInterestPaymentsYear: string;
  externalPPG: string;
  externalPPGYear: string;
}
export interface ExternalDebtType {
  code: string;
  year: number;
  multilateral: number;
  bilateral: number;
  bonds: number;
  'other private': number;
  total: number;
  'principal payments': number;
  'interest payment': number;
}
