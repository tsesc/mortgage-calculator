import React, { useState } from 'react';
import type { MonthlyPayment } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/validations/inputValidator';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaymentTableProps {
  payments: MonthlyPayment[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({ payments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('yearly');
  const itemsPerPage = 12;
  
  const getDisplayData = () => {
    if (viewMode === 'monthly') {
      return payments;
    }
    
    const yearlyData: MonthlyPayment[] = [];
    for (let i = 0; i < payments.length; i += 12) {
      const yearPayments = payments.slice(i, i + 12);
      const yearNumber = Math.floor(i / 12) + 1;
      
      const yearTotal = yearPayments.reduce((acc, p) => ({
        principal: acc.principal + p.principal,
        interest: acc.interest + p.interest,
        totalPayment: acc.totalPayment + p.totalPayment
      }), { principal: 0, interest: 0, totalPayment: 0 });
      
      yearlyData.push({
        month: yearNumber,
        principal: yearTotal.principal,
        interest: yearTotal.interest,
        totalPayment: yearTotal.totalPayment,
        remainingBalance: yearPayments[yearPayments.length - 1]?.remainingBalance || 0,
        cumulativePrincipal: yearPayments[yearPayments.length - 1]?.cumulativePrincipal || 0,
        cumulativeInterest: yearPayments[yearPayments.length - 1]?.cumulativeInterest || 0,
        currentRate: yearPayments[0]?.currentRate || 0
      });
    }
    return yearlyData;
  };
  
  const displayData = getDisplayData();
  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = displayData.slice(startIndex, endIndex);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('yearly')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'yearly'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            年度統計
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'monthly'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            月度明細
          </button>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm text-gray-600">
              第 {currentPage} / {totalPages} 頁
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {viewMode === 'monthly' ? '期數' : '年度'}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                本金
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                利息
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                {viewMode === 'monthly' ? '月付金' : '年付金'}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                剩餘本金
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                利率
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((payment, index) => (
              <tr key={index} className={payment.isGracePeriod ? "bg-amber-50 hover:bg-amber-100" : "hover:bg-gray-50"}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {viewMode === 'monthly' 
                    ? `第 ${payment.month} 期`
                    : `第 ${payment.month} 年`
                  }
                  {payment.isGracePeriod && viewMode === 'monthly' && (
                    <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded">
                      寬限期
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">
                  {formatCurrency(payment.principal)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">
                  {formatCurrency(payment.interest)}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                  {formatCurrency(payment.totalPayment)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">
                  {formatCurrency(payment.remainingBalance)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">
                  {formatPercent(payment.currentRate, 3)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                總計
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                {formatCurrency(
                  displayData[displayData.length - 1]?.cumulativePrincipal || 0
                )}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                {formatCurrency(
                  displayData[displayData.length - 1]?.cumulativeInterest || 0
                )}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                {formatCurrency(
                  (displayData[displayData.length - 1]?.cumulativePrincipal || 0) +
                  (displayData[displayData.length - 1]?.cumulativeInterest || 0)
                )}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;