import React, { useState, useEffect, useCallback } from 'react';
import type { LoanInput, LoanCalculationResult, ValidationError, RepaymentMethod } from '../../types';
import { calculateMortgage, calculateLoanAmount } from '../../utils/calculations/mortgageCalculator';
import { validateLoanInput } from '../../utils/validations/inputValidator';
import { INPUT_MODES, LOAN_PLANS, YOUTH_LOAN_POLICY, REPAYMENT_METHODS } from '../../constants';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import LoanInputForm from '../InputFields/LoanInputForm';
import ResultSummary from '../Results/ResultSummary';
import PaymentTable from '../Results/PaymentTable';
import PolicyInfo from '../PolicyInfo/PolicyInfo';

// 預設值
const DEFAULT_LOAN_INPUT: Partial<LoanInput> = {
  inputMode: INPUT_MODES.TOTAL_PRICE,
  totalPrice: 10000000,
  loanRatio: 80,
  loanAmount: 8000000,
  loanYears: 30,
  graceYears: 0,
  loanPlan: LOAN_PLANS.YOUTH,
  customRates: [{ startMonth: 1, rate: 2.0, description: '第一段利率' }]
};

const MortgageCalculator: React.FC = () => {
  // 使用 localStorage 儲存貸款輸入資料
  const [loanInput, setLoanInput] = useLocalStorage<Partial<LoanInput>>(
    'mortgageCalculatorInput',
    DEFAULT_LOAN_INPUT
  );

  // 使用 localStorage 儲存還款方式
  const [repaymentMethod, setRepaymentMethod] = useLocalStorage<RepaymentMethod>(
    'mortgageCalculatorMethod',
    REPAYMENT_METHODS.EQUAL_PRINCIPAL_AND_INTEREST
  );
  
  // 使用 localStorage 儲存顯示狀態
  const [showPaymentDetails, setShowPaymentDetails] = useLocalStorage(
    'mortgageCalculatorShowDetails',
    false
  );
  
  const [showPolicyInfo, setShowPolicyInfo] = useLocalStorage(
    'mortgageCalculatorShowPolicy',
    false
  );
  
  // 這些不需要持久化
  const [calculationResult, setCalculationResult] = useState<LoanCalculationResult | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const calculate = useCallback(() => {
    const validationErrors = validateLoanInput(loanInput);
    setErrors(validationErrors);
    
    if (validationErrors.length > 0) {
      setCalculationResult(null);
      return;
    }
    
    let finalLoanAmount = loanInput.loanAmount || 0;
    
    if (loanInput.inputMode === INPUT_MODES.TOTAL_PRICE) {
      finalLoanAmount = calculateLoanAmount(
        loanInput.totalPrice || 0,
        loanInput.loanRatio || 80
      );
    }
    
    const input: LoanInput = {
      ...loanInput as LoanInput,
      loanAmount: finalLoanAmount
    };
    
    const result = calculateMortgage(input, repaymentMethod);
    setCalculationResult(result);
  }, [loanInput, repaymentMethod]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  // 測試計算結果（僅在開發模式）
  useEffect(() => {
    if (import.meta.env.DEV && calculationResult && loanInput.loanAmount === 8000000 && loanInput.loanYears === 30 && loanInput.loanPlan === 'youth') {
      const interestRatio = (calculationResult.totalInterest / calculationResult.totalPayment) * 100;
      console.log('=== 計算結果測試 ===');
      console.log('貸款本金:', loanInput.loanAmount);
      console.log('總利息:', Math.round(calculationResult.totalInterest));
      console.log('總還款:', Math.round(calculationResult.totalPayment));
      console.log('利息佔比:', interestRatio.toFixed(2) + '%');
      console.log('平均月付金:', Math.round(calculationResult.averageMonthlyPayment));
      
      if (interestRatio > 60) {
        console.error('❌ 利息佔比異常偏高!');
      } else if (interestRatio < 10) {
        console.error('❌ 利息佔比異常偏低!');
      } else {
        console.log('✅ 利息佔比合理');
      }
    }
  }, [calculationResult, loanInput]);

  const handleInputChange = (updates: Partial<LoanInput>) => {
    setLoanInput(prev => {
      const newInput = { ...prev, ...updates };
      
      if (updates.inputMode === INPUT_MODES.TOTAL_PRICE && updates.totalPrice && prev.loanRatio) {
        newInput.loanAmount = calculateLoanAmount(updates.totalPrice, prev.loanRatio);
      } else if (updates.totalPrice && updates.loanRatio) {
        newInput.loanAmount = calculateLoanAmount(
          updates.totalPrice || prev.totalPrice || 0,
          updates.loanRatio || prev.loanRatio || 80
        );
      }
      
      if (updates.loanPlan === LOAN_PLANS.YOUTH) {
        if ((newInput.loanAmount || 0) > YOUTH_LOAN_POLICY.maxAmount) {
          newInput.loanAmount = YOUTH_LOAN_POLICY.maxAmount;
        }
        if ((newInput.loanYears || 0) > YOUTH_LOAN_POLICY.maxYears) {
          newInput.loanYears = YOUTH_LOAN_POLICY.maxYears;
        }
      }
      
      return newInput;
    });
  };

  // 重置功能
  const handleReset = () => {
    if (window.confirm('確定要重置所有輸入值嗎？')) {
      setLoanInput(DEFAULT_LOAN_INPUT);
      setRepaymentMethod(REPAYMENT_METHODS.EQUAL_PRINCIPAL_AND_INTEREST);
      setShowPaymentDetails(false);
      setShowPolicyInfo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            房屋貸款計算機
          </h1>
          <p className="text-gray-600">
            快速試算您的房貸月付金，支援新青安優惠方案
          </p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            重置所有設定
          </button>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  貸款資訊輸入
                </h2>
                <div className="text-xs text-gray-500">
                  資料會自動儲存
                </div>
              </div>
              <LoanInputForm
                loanInput={loanInput}
                errors={errors}
                onChange={handleInputChange}
                repaymentMethod={repaymentMethod}
                onRepaymentMethodChange={setRepaymentMethod}
              />
            </div>

            {loanInput.loanPlan === LOAN_PLANS.YOUTH && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <button
                  onClick={() => setShowPolicyInfo(!showPolicyInfo)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-semibold text-blue-800">
                    新青安貸款政策說明
                  </span>
                  <span className="text-blue-600">
                    {showPolicyInfo ? '收起' : '展開'}
                  </span>
                </button>
                {showPolicyInfo && <PolicyInfo />}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {calculationResult && (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    試算結果
                  </h2>
                  <ResultSummary
                    result={calculationResult}
                    loanAmount={loanInput.loanAmount || 0}
                    loanYears={loanInput.loanYears || 30}
                    graceYears={loanInput.graceYears}
                  />
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      還款明細表
                    </h3>
                    <button
                      onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {showPaymentDetails ? '隱藏明細' : '顯示明細'}
                    </button>
                  </div>
                  {showPaymentDetails && (
                    <PaymentTable payments={calculationResult.monthlyPayments} />
                  )}
                </div>
              </>
            )}

            {errors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="font-semibold text-red-800 mb-2">請修正以下錯誤：</p>
                <ul className="list-disc list-inside text-red-700">
                  {errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;