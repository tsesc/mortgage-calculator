// 驗證用戶案例
// 貸款本金: $8,000,000
// 總利息支出: $8,579,465
// 還款期數: 360期 (含寬限期60期)
// 寬限期利息總額: $2,205,240

const principal = 8000000;
const totalInterestFromUser = 8579465;
const gracePeriodInterestFromUser = 2205240;
const totalMonths = 360;
const graceMonths = 60;
const remainingMonths = totalMonths - graceMonths;

console.log('=== 用戶提供的數據 ===');
console.log('貸款本金:', principal.toLocaleString());
console.log('總利息支出:', totalInterestFromUser.toLocaleString());
console.log('寬限期利息總額:', gracePeriodInterestFromUser.toLocaleString());
console.log('利息佔比:', ((totalInterestFromUser / principal) * 100).toFixed(2) + '%');

// 從寬限期利息反推利率
const avgGraceInterestPerMonth = gracePeriodInterestFromUser / graceMonths;
console.log('\n寬限期平均每月利息:', avgGraceInterestPerMonth.toLocaleString());

// 如果是固定利率，計算年利率
const impliedMonthlyRate = avgGraceInterestPerMonth / principal;
const impliedAnnualRate = impliedMonthlyRate * 12 * 100;
console.log('從寬限期利息推算的年利率:', impliedAnnualRate.toFixed(3) + '%');

// 寬限期後的利息
const interestAfterGrace = totalInterestFromUser - gracePeriodInterestFromUser;
console.log('\n寬限期後的利息總額:', interestAfterGrace.toLocaleString());

// 計算寬限期後的總還款金額
const totalPaymentAfterGrace = principal + interestAfterGrace;
const avgMonthlyPaymentAfterGrace = totalPaymentAfterGrace / remainingMonths;
console.log('寬限期後平均月付金:', avgMonthlyPaymentAfterGrace.toLocaleString());

// 使用本息平均攤還公式反推利率
// PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
// 這需要迭代求解，我們用二分法

function calculatePMT(P, r, n) {
  if (r === 0) return P / n;
  return P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// 找出產生相似總利息的利率
console.log('\n=== 尋找匹配的利率 ===');
let bestRate = 0;
let minDiff = Infinity;

for (let annualRate = 3.0; annualRate <= 7.0; annualRate += 0.1) {
  const monthlyRate = annualRate / 100 / 12;
  
  // 計算寬限期利息
  const graceInterest = principal * monthlyRate * graceMonths;
  
  // 計算寬限期後的月付金
  const monthlyPayment = calculatePMT(principal, monthlyRate, remainingMonths);
  const totalPaymentAfterGrace = monthlyPayment * remainingMonths;
  const interestAfterGrace = totalPaymentAfterGrace - principal;
  
  // 總利息
  const totalInterest = graceInterest + interestAfterGrace;
  
  const diff = Math.abs(totalInterest - totalInterestFromUser);
  if (diff < minDiff) {
    minDiff = diff;
    bestRate = annualRate;
    
    if (diff < 10000) {  // 誤差小於1萬時顯示
      console.log(`年利率 ${annualRate.toFixed(1)}%:`);
      console.log(`  寬限期利息: ${graceInterest.toLocaleString()}`);
      console.log(`  寬限期後利息: ${interestAfterGrace.toLocaleString()}`);
      console.log(`  總利息: ${totalInterest.toLocaleString()}`);
      console.log(`  誤差: ${diff.toLocaleString()}`);
    }
  }
}

console.log('\n最接近的固定利率:', bestRate.toFixed(2) + '%');

// 檢查是否可能是多段式利率
console.log('\n=== 多段式利率可能性 ===');
// 假設前期利率較高，後期利率較低（或相反）
// 寬限期5年的平均利率已知約5.513%
// 讓我們假設前2年和後3年的利率不同

const graceAvgRate = impliedAnnualRate;
console.log('寬限期平均利率:', graceAvgRate.toFixed(3) + '%');

// 可能的組合
const combinations = [
  { first2Years: 5.0, remaining: 5.75 },
  { first2Years: 4.5, remaining: 6.0 },
  { first2Years: 6.0, remaining: 5.2 },
  { first2Years: 5.5, remaining: 5.5 },
];

combinations.forEach(combo => {
  const rate1 = combo.first2Years / 100 / 12;
  const rate2 = combo.remaining / 100 / 12;
  
  // 寬限期利息（前24個月用rate1，後36個月用rate2）
  const graceInt1 = principal * rate1 * 24;
  const graceInt2 = principal * rate2 * 36;
  const totalGraceInt = graceInt1 + graceInt2;
  
  if (Math.abs(totalGraceInt - gracePeriodInterestFromUser) < 10000) {
    console.log(`可能組合: 前2年 ${combo.first2Years}%, 之後 ${combo.remaining}%`);
    console.log(`  寬限期利息: ${totalGraceInt.toLocaleString()}`);
    console.log(`  誤差: ${Math.abs(totalGraceInt - gracePeriodInterestFromUser).toLocaleString()}`);
  }
});