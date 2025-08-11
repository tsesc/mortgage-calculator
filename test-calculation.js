// 測試計算邏輯

// 貸款參數
const principal = 8000000;  // 800萬
const years = 30;           // 30年
const graceYears = 5;       // 5年寬限期
const totalMonths = years * 12;  // 360期
const graceMonths = graceYears * 12;  // 60期

// 假設使用固定利率 4.5%
const annualRate = 4.5;
const monthlyRate = annualRate / 100 / 12;

// 寬限期利息計算
const gracePeriodInterest = principal * monthlyRate * graceMonths;
console.log('寬限期利息（假設4.5%固定利率）:', gracePeriodInterest.toLocaleString());
console.log('每月寬限期利息:', (principal * monthlyRate).toLocaleString());

// 寬限期後的本息平均攤還計算
const remainingMonths = totalMonths - graceMonths;  // 300期
const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
                       (Math.pow(1 + monthlyRate, remainingMonths) - 1);

console.log('寬限期後每月還款金額:', monthlyPayment.toLocaleString());

// 計算總利息
const totalPaymentAfterGrace = monthlyPayment * remainingMonths;
const totalInterest = gracePeriodInterest + (totalPaymentAfterGrace - principal);
console.log('總利息支出:', totalInterest.toLocaleString());
console.log('利息佔比:', ((totalInterest / principal) * 100).toFixed(2) + '%');

// 驗證不同利率下的情況
console.log('\n=== 不同利率下的利息佔比 ===');
[3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0].forEach(rate => {
  const r = rate / 100 / 12;
  const graceInt = principal * r * graceMonths;
  const pmt = principal * (r * Math.pow(1 + r, remainingMonths)) / 
              (Math.pow(1 + r, remainingMonths) - 1);
  const totalInt = graceInt + (pmt * remainingMonths - principal);
  const ratio = (totalInt / principal) * 100;
  console.log(`年利率 ${rate}%: 總利息 ${totalInt.toLocaleString()}, 利息佔比 ${ratio.toFixed(2)}%`);
});