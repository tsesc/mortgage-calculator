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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('yearly')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg ${
              viewMode === 'yearly'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            年度統計
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg ${
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
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full py-2 align-middle sm:px-0 px-4">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {viewMode === 'monthly' ? '期數' : '年度'}
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                    本金
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                    利息
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {viewMode === 'monthly' ? '月付金' : '年付金'}
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    剩餘本金
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                    利率
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((payment, index) => (
                  <tr key={index} className={payment.isGracePeriod ? "bg-amber-50 hover:bg-amber-100" : "hover:bg-gray-50"}>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span>
                          {viewMode === 'monthly' 
                            ? `第 ${payment.month} 期`
                            : `第 ${payment.month} 年`
                          }
                        </span>
                        {payment.isGracePeriod && viewMode === 'monthly' && (
                          <span className="mt-1 sm:mt-0 sm:ml-2 text-xs bg-amber-200 text-amber-800 px-1 sm:px-2 py-0.5 rounded inline-block">
                            寬限期
                          </span>
                        )}
                      </div>
                      {/* 手機版顯示本金和利息 */}
                      <div className="sm:hidden mt-1 text-xs text-gray-500">
                        <div>本金: {formatCurrency(payment.principal)}</div>
                        <div>利息: {formatCurrency(payment.interest)}</div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 text-right hidden sm:table-cell">
                      {formatCurrency(payment.principal)}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 text-right hidden sm:table-cell">
                      {formatCurrency(payment.interest)}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
                      {formatCurrency(payment.totalPayment)}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">
                      {formatCurrency(payment.remainingBalance)}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 text-right hidden md:table-cell">
                      {formatPercent(payment.currentRate, 3)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900">
                    總計
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 text-right hidden sm:table-cell">
                    {formatCurrency(
                      displayData[displayData.length - 1]?.cumulativePrincipal || 0
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 text-right hidden sm:table-cell">
                    {formatCurrency(
                      displayData[displayData.length - 1]?.cumulativeInterest || 0
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
                    {formatCurrency(
                      (displayData[displayData.length - 1]?.cumulativePrincipal || 0) +
                      (displayData[displayData.length - 1]?.cumulativeInterest || 0)
                    )}
                  </td>
                  <td className="hidden sm:table-cell" colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;