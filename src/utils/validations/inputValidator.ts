import type { LoanInput, ValidationError } from '../../types';

export function validateLoanInput(input: Partial<LoanInput>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (input.inputMode === 'totalPrice') {
    if (!input.totalPrice || input.totalPrice <= 0) {
      errors.push({
        field: 'totalPrice',
        message: '房屋總價必須大於 0'
      });
    }
    
    if (input.totalPrice && input.totalPrice > 100000000) {
      errors.push({
        field: 'totalPrice',
        message: '房屋總價不能超過 1 億元'
      });
    }
    
    if (!input.loanRatio || input.loanRatio <= 0 || input.loanRatio > 100) {
      errors.push({
        field: 'loanRatio',
        message: '貸款成數必須在 1-100% 之間'
      });
    }
  }
  
  if (input.inputMode === 'loanAmount' || input.loanAmount !== undefined) {
    if (!input.loanAmount || input.loanAmount <= 0) {
      errors.push({
        field: 'loanAmount',
        message: '貸款金額必須大於 0'
      });
    }
    
    if (input.loanPlan === 'youth' && input.loanAmount && input.loanAmount > 10000000) {
      errors.push({
        field: 'loanAmount',
        message: '新青安貸款最高額度為 1,000 萬元'
      });
    }
    
    if (input.loanAmount && input.loanAmount > 100000000) {
      errors.push({
        field: 'loanAmount',
        message: '貸款金額不能超過 1 億元'
      });
    }
  }
  
  if (!input.loanYears || input.loanYears <= 0) {
    errors.push({
      field: 'loanYears',
      message: '貸款年限必須大於 0'
    });
  }
  
  if (input.loanPlan === 'youth' && input.loanYears && input.loanYears > 40) {
    errors.push({
      field: 'loanYears',
      message: '新青安貸款最長年限為 40 年'
    });
  } else if (input.loanYears && input.loanYears > 30) {
    errors.push({
      field: 'loanYears',
      message: '一般房貸最長年限為 30 年'
    });
  }
  
  // 驗證寬限期
  if (input.graceYears !== undefined) {
    if (input.graceYears < 0) {
      errors.push({
        field: 'graceYears',
        message: '寬限期年數不能為負數'
      });
    }
    
    if (input.graceYears > 5) {
      errors.push({
        field: 'graceYears',
        message: '寬限期最長為 5 年'
      });
    }
    
    if (input.loanYears && input.graceYears >= input.loanYears) {
      errors.push({
        field: 'graceYears',
        message: '寬限期不能超過或等於貸款年限'
      });
    }
  }
  
  if (input.loanPlan === 'custom' && input.customRates) {
    if (input.customRates.length === 0) {
      errors.push({
        field: 'customRates',
        message: '自訂利率至少需要一個期間'
      });
    }
    
    input.customRates.forEach((rate, index) => {
      if (rate.rate < 0 || rate.rate > 20) {
        errors.push({
          field: `customRates[${index}]`,
          message: `第 ${index + 1} 段利率必須在 0-20% 之間`
        });
      }
      
      if (rate.startMonth < 1) {
        errors.push({
          field: `customRates[${index}]`,
          message: `第 ${index + 1} 段起始月份必須大於 0`
        });
      }
      
      if (rate.endMonth && rate.endMonth < rate.startMonth) {
        errors.push({
          field: `customRates[${index}]`,
          message: `第 ${index + 1} 段結束月份必須大於起始月份`
        });
      }
    });
  }
  
  return errors;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercent(rate: number, decimals: number = 3): string {
  return `${rate.toFixed(decimals)}%`;
}

export function parseNumericInput(value: string): number | null {
  const cleaned = value.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}