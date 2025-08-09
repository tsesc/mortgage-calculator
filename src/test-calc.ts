// 測試修正後的計算邏輯
import { calculateMortgage } from './utils/calculations/mortgageCalculator';
import type { LoanInput } from './types';

const input: LoanInput = {
  inputMode: 'loanAmount',
  loanAmount: 8000000,
  loanYears: 30,
  loanPlan: 'youth', // 新青安: 前2年1.775%, 第3年起2.075%
};

const result = calculateMortgage(input);

console.log('====================================');
console.log('貸款計算測試結果');
console.log('====================================');
console.log('輸入參數:');
console.log('  貸款本金:', input.loanAmount.toLocaleString());
console.log('  貸款年限:', input.loanYears, '年');
console.log('  總期數:', input.loanYears * 12, '期');
console.log('  利率方案: 新青安');
console.log('    第1-2年: 1.775%');
console.log('    第3年起: 2.075%');
console.log('');
console.log('計算結果:');
console.log('  總利息支出:', Math.round(result.totalInterest).toLocaleString());
console.log('  總還款金額:', Math.round(result.totalPayment).toLocaleString());
console.log('  利息佔比:', ((result.totalInterest / result.totalPayment) * 100).toFixed(2) + '%');
console.log('');
console.log('月付金分析:');
console.log('  平均月付金:', Math.round(result.averageMonthlyPayment).toLocaleString());
console.log('  最高月付金:', Math.round(result.maxMonthlyPayment).toLocaleString());
console.log('  最低月付金:', Math.round(result.minMonthlyPayment).toLocaleString());
console.log('');

// 檢查前幾期的詳細資料
console.log('前6期還款明細:');
for (let i = 0; i < 6; i++) {
  const payment = result.monthlyPayments[i];
  console.log(`  第${payment.month}期 - 月付金: ${Math.round(payment.totalPayment).toLocaleString()}, 本金: ${Math.round(payment.principal).toLocaleString()}, 利息: ${Math.round(payment.interest).toLocaleString()}, 利率: ${payment.currentRate}%`);
}

console.log('');
console.log('第25-30期還款明細 (利率轉換期):');
for (let i = 24; i < 30; i++) {
  const payment = result.monthlyPayments[i];
  console.log(`  第${payment.month}期 - 月付金: ${Math.round(payment.totalPayment).toLocaleString()}, 本金: ${Math.round(payment.principal).toLocaleString()}, 利息: ${Math.round(payment.interest).toLocaleString()}, 利率: ${payment.currentRate}%`);
}

// 驗證合理性
const interestRatio = (result.totalInterest / result.totalPayment) * 100;
console.log('');
console.log('====================================');
console.log('合理性檢查:');
if (interestRatio > 60) {
  console.log('❌ 利息佔比異常偏高 (' + interestRatio.toFixed(2) + '%)');
} else if (interestRatio < 10) {
  console.log('❌ 利息佔比異常偏低 (' + interestRatio.toFixed(2) + '%)');
} else {
  console.log('✅ 利息佔比合理 (' + interestRatio.toFixed(2) + '%)');
}

// 手動驗證第一期
const principal = 8000000;
const rate1 = 1.775 / 100 / 12; // 第一階段月利率
const n = 360; // 總期數

// 標準本息平均攤還公式
const expectedMonthlyPayment1 = principal * (rate1 * Math.pow(1 + rate1, n)) / (Math.pow(1 + rate1, n) - 1);
const firstInterest = principal * rate1;
const firstPrincipal = expectedMonthlyPayment1 - firstInterest;

console.log('');
console.log('第一期手動驗證:');
console.log('  預期月付金:', Math.round(expectedMonthlyPayment1).toLocaleString());
console.log('  實際月付金:', Math.round(result.monthlyPayments[0].totalPayment).toLocaleString());
console.log('  預期利息:', Math.round(firstInterest).toLocaleString());
console.log('  實際利息:', Math.round(result.monthlyPayments[0].interest).toLocaleString());
console.log('  預期本金:', Math.round(firstPrincipal).toLocaleString());
console.log('  實際本金:', Math.round(result.monthlyPayments[0].principal).toLocaleString());

// 輸出到瀏覽器 console
export function runDetailedTest() {
  return result;
}