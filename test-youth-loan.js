// 測試新青安貸款計算

const principal = 8000000;  // 800萬
const years = 30;           // 30年
const graceYears = 5;       // 5年寬限期
const totalMonths = years * 12;  // 360期
const graceMonths = graceYears * 12;  // 60期

// 新青安利率: 前2年1.775%, 第3年起2.075%
let totalInterest = 0;
let remainingBalance = principal;

// 寬限期利息計算（60期）
let gracePeriodInterest = 0;
for (let month = 1; month <= graceMonths; month++) {
  let rate;
  if (month <= 24) {
    rate = 1.775 / 100 / 12;  // 前2年
  } else {
    rate = 2.075 / 100 / 12;  // 第3年起
  }
  const interest = remainingBalance * rate;
  gracePeriodInterest += interest;
  totalInterest += interest;
}

console.log('寬限期利息總額:', gracePeriodInterest.toLocaleString());
console.log('平均每月寬限期利息:', (gracePeriodInterest / graceMonths).toLocaleString());

// 寬限期後的本息攤還（從第61期開始）
// 使用2.075%的利率計算（因為已經過了前2年）
const remainingMonths = totalMonths - graceMonths;  // 300期
const rateAfterGrace = 2.075 / 100 / 12;
const monthlyPayment = principal * (rateAfterGrace * Math.pow(1 + rateAfterGrace, remainingMonths)) / 
                       (Math.pow(1 + rateAfterGrace, remainingMonths) - 1);

console.log('寬限期後每月還款金額:', monthlyPayment.toLocaleString());

// 計算寬限期後的總利息
const totalPaymentAfterGrace = monthlyPayment * remainingMonths;
const interestAfterGrace = totalPaymentAfterGrace - principal;
totalInterest = gracePeriodInterest + interestAfterGrace;

console.log('寬限期後利息:', interestAfterGrace.toLocaleString());
console.log('總利息支出:', totalInterest.toLocaleString());
console.log('利息佔比:', ((totalInterest / principal) * 100).toFixed(2) + '%');

// 如果整個貸款期間都使用較高的利率呢？
console.log('\n=== 如果使用更高的利率組合 ===');
// 假設前2年4.5%，第3年起5.5%
let highRateInterest = 0;
remainingBalance = principal;

// 寬限期（前60期）
gracePeriodInterest = 0;
for (let month = 1; month <= graceMonths; month++) {
  let rate;
  if (month <= 24) {
    rate = 4.5 / 100 / 12;  // 前2年
  } else {
    rate = 5.5 / 100 / 12;  // 第3年起
  }
  const interest = remainingBalance * rate;
  gracePeriodInterest += interest;
}

// 寬限期後使用5.5%計算
const highRate = 5.5 / 100 / 12;
const highMonthlyPayment = principal * (highRate * Math.pow(1 + highRate, remainingMonths)) / 
                           (Math.pow(1 + highRate, remainingMonths) - 1);
const highInterestAfterGrace = highMonthlyPayment * remainingMonths - principal;
highRateInterest = gracePeriodInterest + highInterestAfterGrace;

console.log('高利率總利息:', highRateInterest.toLocaleString());
console.log('高利率利息佔比:', ((highRateInterest / principal) * 100).toFixed(2) + '%');