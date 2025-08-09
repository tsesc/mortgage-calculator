export interface RatePeriod {
  startMonth: number;
  endMonth?: number;
  rate: number;
  description?: string;
}

export interface LoanInput {
  inputMode: 'totalPrice' | 'loanAmount';
  totalPrice?: number;
  loanRatio?: number;
  loanAmount: number;
  loanYears: number;
  loanPlan: 'youth' | 'custom';
  customRates?: RatePeriod[];
  graceYears?: number;  // 寬限期年數
}

export interface MonthlyPayment {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
  currentRate: number;
  isGracePeriod?: boolean;  // 是否為寬限期
}

export interface LoanCalculationResult {
  monthlyPayments: MonthlyPayment[];
  totalInterest: number;
  totalPayment: number;
  averageMonthlyPayment: number;
  maxMonthlyPayment: number;
  minMonthlyPayment: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type RepaymentMethod = 'equalPrincipalAndInterest' | 'equalPrincipal';

export interface YouthLoanPolicy {
  name: string;
  maxAmount: number;
  maxYears: number;
  rates: RatePeriod[];
  requirements: string[];
  benefits: string[];
  notes: string[];
}