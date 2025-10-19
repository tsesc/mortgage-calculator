import type { YouthLoanPolicy } from '../types';

export const YOUTH_LOAN_POLICY: YouthLoanPolicy = {
  name: '新青年安心成家優惠房貸',
  maxAmount: 10000000,
  maxYears: 40,
  rates: [
    { startMonth: 1, endMonth: 24, rate: 1.775, description: '第 1-2 年優惠利率' },
    { startMonth: 25, rate: 2.075, description: '第 3 年起利率' }
  ],
  requirements: [
    '借款人年齡需在 18 歲以上',
    '借款人與其配偶及未成年子女均無自有住宅',
    '借款人與配偶所購住宅應為申請日前 6 個月起所購置',
    '申請一生一次為限'
  ],
  benefits: [
    '最高貸款額度 1,000 萬元',
    '貸款年限最長 40 年',
    '寬限期最長 5 年',
    '前 2 年享 1.775% 優惠利率'
  ],
  notes: [
    '實際貸款條件以各承辦銀行核定為準',
    '利率可能隨央行政策調整',
    '提前還款可能有違約金',
    '需要提供相關財力證明'
  ]
};

export const DEFAULT_RATES = {
  STANDARD: 2.0,
  PRIME: 1.8,
  INVESTMENT: 2.5
};

export const LOAN_LIMITS = {
  MIN_AMOUNT: 100000,
  MAX_AMOUNT: 100000000,
  MIN_YEARS: 1,
  MAX_YEARS: 50,
  MAX_YOUTH_YEARS: 40,
  MAX_GRACE_YEARS: 5,
  MIN_RATIO: 10,
  MAX_RATIO: 90
};

export const INPUT_MODES = {
  TOTAL_PRICE: 'totalPrice' as const,
  LOAN_AMOUNT: 'loanAmount' as const
};

export const LOAN_PLANS = {
  YOUTH: 'youth' as const,
  CUSTOM: 'custom' as const
};

export const REPAYMENT_METHODS = {
  EQUAL_PRINCIPAL_AND_INTEREST: 'equalPrincipalAndInterest' as const,
  EQUAL_PRINCIPAL: 'equalPrincipal' as const
};