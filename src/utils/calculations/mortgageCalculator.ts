import type { LoanInput, LoanCalculationResult, MonthlyPayment, RatePeriod, RepaymentMethod } from '../../types';

function getRateForMonth(month: number, rates: RatePeriod[]): number {
  for (const period of rates) {
    if (month >= period.startMonth && (!period.endMonth || month <= period.endMonth)) {
      return period.rate;
    }
  }
  return rates[rates.length - 1].rate;
}

function calculateEqualPrincipalAndInterest(
  principal: number,
  totalMonths: number,
  rates: RatePeriod[],
  graceMonths: number = 0
): MonthlyPayment[] {
  const monthlyPayments: MonthlyPayment[] = [];
  let remainingBalance = principal;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;
  
  // 寬限期內的計算
  for (let month = 1; month <= graceMonths; month++) {
    const currentRate = getRateForMonth(month, rates);
    const monthlyRate = currentRate / 100 / 12;
    const interestPayment = remainingBalance * monthlyRate;
    
    cumulativeInterest += interestPayment;
    
    monthlyPayments.push({
      month,
      principal: 0,
      interest: interestPayment,
      totalPayment: interestPayment,
      remainingBalance,
      cumulativePrincipal,
      cumulativeInterest,
      currentRate,
      isGracePeriod: true
    });
  }
  
  // 寬限期後的計算
  const remainingMonthsAfterGrace = totalMonths - graceMonths;
  
  if (remainingMonthsAfterGrace > 0) {
    // 為每個利率期間計算固定月付金
    let currentMonth = graceMonths + 1;
    
    while (currentMonth <= totalMonths) {
      // 找出當前利率期間
      const currentRate = getRateForMonth(currentMonth, rates);
      const monthlyRate = currentRate / 100 / 12;
      
      // 找出這個利率期間的結束月份
      let periodEndMonth = totalMonths;
      for (const rate of rates) {
        if (rate.startMonth <= currentMonth && (!rate.endMonth || rate.endMonth >= currentMonth)) {
          if (rate.endMonth && rate.endMonth < totalMonths) {
            periodEndMonth = rate.endMonth;
          }
          break;
        }
      }
      
      // 計算這個期間的月數
      const periodMonths = periodEndMonth - currentMonth + 1;
      const remainingMonths = totalMonths - currentMonth + 1;
      const monthsToCalculate = Math.min(periodMonths, remainingMonths);
      
      // 計算這個利率期間的固定月付金
      let monthlyPayment: number;
      if (monthlyRate === 0) {
        // 零利率的特殊處理
        monthlyPayment = remainingBalance / remainingMonths;
      } else {
        monthlyPayment = remainingBalance * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
                        (Math.pow(1 + monthlyRate, remainingMonths) - 1);
      }
      
      // 產生這個利率期間的每月還款記錄
      for (let i = 0; i < monthsToCalculate; i++) {
        const month = currentMonth + i;
        const interestPayment = remainingBalance * monthlyRate;
        let principalPayment = monthlyPayment - interestPayment;
        
        // 確保最後一期清償所有餘額
        if (month === totalMonths) {
          principalPayment = remainingBalance;
          const totalPmt = principalPayment + interestPayment;
          
          cumulativePrincipal += principalPayment;
          cumulativeInterest += interestPayment;
          
          monthlyPayments.push({
            month,
            principal: principalPayment,
            interest: interestPayment,
            totalPayment: totalPmt,
            remainingBalance: 0,
            cumulativePrincipal,
            cumulativeInterest,
            currentRate,
            isGracePeriod: false
          });
          break;
        } else {
          // 避免因浮點數誤差導致本金超過餘額
          if (principalPayment > remainingBalance) {
            principalPayment = remainingBalance;
          }
          
          remainingBalance -= principalPayment;
          cumulativePrincipal += principalPayment;
          cumulativeInterest += interestPayment;
          
          monthlyPayments.push({
            month,
            principal: principalPayment,
            interest: interestPayment,
            totalPayment: monthlyPayment,
            remainingBalance: Math.max(0, remainingBalance),
            cumulativePrincipal,
            cumulativeInterest,
            currentRate,
            isGracePeriod: false
          });
        }
      }
      
      currentMonth += monthsToCalculate;
    }
  }
  
  return monthlyPayments;
}

function calculateEqualPrincipal(
  principal: number,
  totalMonths: number,
  rates: RatePeriod[],
  graceMonths: number = 0
): MonthlyPayment[] {
  const monthlyPayments: MonthlyPayment[] = [];
  let remainingBalance = principal;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;
  
  // 寬限期內的計算
  for (let month = 1; month <= graceMonths; month++) {
    const currentRate = getRateForMonth(month, rates);
    const monthlyRate = currentRate / 100 / 12;
    const interestPayment = remainingBalance * monthlyRate;
    
    cumulativeInterest += interestPayment;
    
    monthlyPayments.push({
      month,
      principal: 0,
      interest: interestPayment,
      totalPayment: interestPayment,
      remainingBalance,
      cumulativePrincipal,
      cumulativeInterest,
      currentRate,
      isGracePeriod: true
    });
  }
  
  // 寬限期後的計算
  const remainingMonthsAfterGrace = totalMonths - graceMonths;
  const monthlyPrincipal = remainingMonthsAfterGrace > 0 ? principal / remainingMonthsAfterGrace : 0;
  
  for (let month = graceMonths + 1; month <= totalMonths; month++) {
    const currentRate = getRateForMonth(month, rates);
    const monthlyRate = currentRate / 100 / 12;
    const interestPayment = remainingBalance * monthlyRate;
    
    remainingBalance -= monthlyPrincipal;
    cumulativePrincipal += monthlyPrincipal;
    cumulativeInterest += interestPayment;
    
    monthlyPayments.push({
      month,
      principal: monthlyPrincipal,
      interest: interestPayment,
      totalPayment: monthlyPrincipal + interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
      cumulativePrincipal,
      cumulativeInterest,
      currentRate,
      isGracePeriod: false
    });
  }
  
  return monthlyPayments;
}

export function calculateMortgage(
  input: LoanInput,
  method: RepaymentMethod = 'equalPrincipalAndInterest'
): LoanCalculationResult {
  const totalMonths = input.loanYears * 12;
  const graceMonths = (input.graceYears || 0) * 12;
  let rates: RatePeriod[] = [];
  
  if (input.loanPlan === 'youth') {
    rates = [
      { startMonth: 1, endMonth: 24, rate: 1.775 },
      { startMonth: 25, rate: 2.075 }
    ];
  } else {
    rates = input.customRates || [{ startMonth: 1, rate: 2.0 }];
  }
  
  const monthlyPayments = method === 'equalPrincipalAndInterest'
    ? calculateEqualPrincipalAndInterest(input.loanAmount, totalMonths, rates, graceMonths)
    : calculateEqualPrincipal(input.loanAmount, totalMonths, rates, graceMonths);
  
  const totalInterest = monthlyPayments.reduce((sum, payment) => sum + payment.interest, 0);
  const totalPayment = input.loanAmount + totalInterest;
  const averageMonthlyPayment = totalPayment / totalMonths;
  
  // 計算寬限期後的平均月付金
  const paymentsAfterGrace = monthlyPayments.filter(p => !p.isGracePeriod);
  const averagePaymentAfterGrace = paymentsAfterGrace.length > 0
    ? paymentsAfterGrace.reduce((sum, p) => sum + p.totalPayment, 0) / paymentsAfterGrace.length
    : 0;
  
  const maxMonthlyPayment = Math.max(...monthlyPayments.map(p => p.totalPayment));
  const minMonthlyPayment = Math.min(...monthlyPayments.map(p => p.totalPayment));
  
  return {
    monthlyPayments,
    totalInterest,
    totalPayment,
    averageMonthlyPayment: graceMonths > 0 ? averagePaymentAfterGrace : averageMonthlyPayment,
    maxMonthlyPayment,
    minMonthlyPayment
  };
}

export function calculateLoanAmount(totalPrice: number, loanRatio: number): number {
  return totalPrice * (loanRatio / 100);
}

export function calculateTotalPrice(loanAmount: number, loanRatio: number): number {
  return loanAmount / (loanRatio / 100);
}