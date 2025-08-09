import { calculateMortgage, calculateLoanAmount } from './utils/calculations/mortgageCalculator';
import { validateLoanInput } from './utils/validations/inputValidator';
import type { LoanInput } from './types';

// 測試基本貸款計算
const testBasicCalculation = () => {
  const input: LoanInput = {
    inputMode: 'loanAmount',
    loanAmount: 8000000,
    loanYears: 30,
    loanPlan: 'youth',
  };
  
  const result = calculateMortgage(input);
  console.log('基本計算測試:', {
    貸款金額: input.loanAmount,
    貸款年限: input.loanYears,
    平均月付金: result.averageMonthlyPayment,
    總利息: result.totalInterest,
    總付款: result.totalPayment
  });
};

// 測試寬限期功能
const testGracePeriod = () => {
  const input: LoanInput = {
    inputMode: 'loanAmount',
    loanAmount: 10000000,
    loanYears: 30,
    graceYears: 2,
    loanPlan: 'youth',
  };
  
  const result = calculateMortgage(input);
  const gracePeriodPayments = result.monthlyPayments.slice(0, 24);
  const normalPayments = result.monthlyPayments.slice(24, 26);
  
  console.log('寬限期測試:', {
    貸款金額: input.loanAmount,
    貸款年限: input.loanYears,
    寬限期: input.graceYears + ' 年',
    寬限期月付金: gracePeriodPayments[0].totalPayment,
    寬限期本金: gracePeriodPayments[0].principal,
    寬限期利息: gracePeriodPayments[0].interest,
    寬限期後月付金: normalPayments[0]?.totalPayment,
    總利息: result.totalInterest
  });
};

// 測試新青安利率
const testYouthLoanRates = () => {
  const input: LoanInput = {
    inputMode: 'loanAmount',
    loanAmount: 10000000,
    loanYears: 40,
    loanPlan: 'youth',
  };
  
  const result = calculateMortgage(input);
  const firstYearPayment = result.monthlyPayments[0];
  const thirdYearPayment = result.monthlyPayments[25]; // 第26期 = 第3年第2個月
  
  console.log('新青安利率測試:', {
    第一年月付金: firstYearPayment.totalPayment,
    第一年利率: firstYearPayment.currentRate,
    第三年月付金: thirdYearPayment.totalPayment,
    第三年利率: thirdYearPayment.currentRate,
  });
};

// 測試輸入驗證
const testValidation = () => {
  const invalidInput: Partial<LoanInput> = {
    inputMode: 'loanAmount',
    loanAmount: 15000000, // 超過新青安上限
    loanYears: 50, // 超過年限
    loanPlan: 'youth',
  };
  
  const errors = validateLoanInput(invalidInput);
  console.log('驗證測試 - 錯誤數量:', errors.length);
  errors.forEach(error => {
    console.log(`  ${error.field}: ${error.message}`);
  });
};

// 測試貸款金額計算
const testLoanAmountCalculation = () => {
  const totalPrice = 12000000;
  const loanRatio = 80;
  const loanAmount = calculateLoanAmount(totalPrice, loanRatio);
  
  console.log('貸款金額計算:', {
    房屋總價: totalPrice,
    貸款成數: loanRatio + '%',
    計算貸款金額: loanAmount,
    預期貸款金額: totalPrice * loanRatio / 100
  });
};

// 執行所有測試
export const runTests = () => {
  console.log('=== 開始執行測試 ===');
  testBasicCalculation();
  console.log('---');
  testGracePeriod();
  console.log('---');
  testYouthLoanRates();
  console.log('---');
  testValidation();
  console.log('---');
  testLoanAmountCalculation();
  console.log('=== 測試完成 ===');
};

// 自動執行測試（開發模式）
if (import.meta.env.DEV) {
  runTests();
}