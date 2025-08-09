import React from 'react';
import type { LoanCalculationResult } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/validations/inputValidator';
import { FaMoneyBillWave, FaChartLine, FaCalendarCheck, FaCoins, FaClock } from 'react-icons/fa';

interface ResultSummaryProps {
  result: LoanCalculationResult;
  loanAmount: number;
  loanYears: number;
  graceYears?: number;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ result, loanAmount, loanYears, graceYears }) => {
  const interestRate = (result.totalInterest / loanAmount) * 100;
  const monthlyPaymentVariation = result.maxMonthlyPayment - result.minMonthlyPayment;
  const graceMonths = (graceYears || 0) * 12;
  const gracePeriodPayments = result.monthlyPayments.slice(0, graceMonths);
  const gracePeriodInterest = gracePeriodPayments.reduce((sum, p) => sum + p.interest, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-indigo-100">平均月付金</span>
            <FaMoneyBillWave className="text-2xl text-indigo-200" />
          </div>
          <div className="text-3xl font-bold">
            {formatCurrency(result.averageMonthlyPayment)}
          </div>
          {graceMonths > 0 && (
            <div className="text-sm mt-2 text-indigo-100">
              寬限期月付：{formatCurrency(gracePeriodPayments[0]?.totalPayment || 0)}
            </div>
          )}
          {monthlyPaymentVariation > 0 && (
            <div className="text-sm mt-2 text-indigo-100">
              範圍：{formatCurrency(result.minMonthlyPayment)} ~ {formatCurrency(result.maxMonthlyPayment)}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100">總支付金額</span>
            <FaCoins className="text-2xl text-green-200" />
          </div>
          <div className="text-3xl font-bold">
            {formatCurrency(result.totalPayment)}
          </div>
          <div className="text-sm mt-2 text-green-100">
            貸款 {loanYears} 年總計
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">詳細分析</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-gray-500 mr-3" />
              <span className="text-gray-600">貸款本金</span>
            </div>
            <span className="font-semibold text-gray-800">
              {formatCurrency(loanAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <div className="flex items-center">
              <FaChartLine className="text-gray-500 mr-3" />
              <span className="text-gray-600">總利息支出</span>
            </div>
            <span className="font-semibold text-gray-800">
              {formatCurrency(result.totalInterest)}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <div className="flex items-center">
              <FaCalendarCheck className="text-gray-500 mr-3" />
              <span className="text-gray-600">還款期數</span>
            </div>
            <span className="font-semibold text-gray-800">
              {loanYears * 12} 期 {graceMonths > 0 && `(含寬限期 ${graceMonths} 期)`}
            </span>
          </div>

          {graceMonths > 0 && (
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <div className="flex items-center">
                <FaClock className="text-gray-500 mr-3" />
                <span className="text-gray-600">寬限期利息總額</span>
              </div>
              <span className="font-semibold text-gray-800">
                {formatCurrency(gracePeriodInterest)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaCoins className="text-gray-500 mr-3" />
              <span className="text-gray-600">利息佔比</span>
            </div>
            <span className="font-semibold text-gray-800">
              {formatPercent(interestRate, 2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 mb-1">第一期月付金</div>
          <div className="text-xl font-bold text-blue-800">
            {formatCurrency(result.monthlyPayments[0]?.totalPayment || 0)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600 mb-1">最後一期月付金</div>
          <div className="text-xl font-bold text-purple-800">
            {formatCurrency(result.monthlyPayments[result.monthlyPayments.length - 1]?.totalPayment || 0)}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-yellow-800">
          <strong>提醒：</strong>
          實際貸款條件可能因個人信用狀況、銀行政策等因素而有所不同。
          本試算結果僅供參考，詳細資訊請洽詢各銀行。
        </p>
      </div>
    </div>
  );
};

export default ResultSummary;