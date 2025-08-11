import React from 'react';
import type { LoanInput, ValidationError, RepaymentMethod, RatePeriod } from '../../types';
import { INPUT_MODES, LOAN_PLANS, REPAYMENT_METHODS, YOUTH_LOAN_POLICY } from '../../constants';
import { parseNumericInput, formatCurrency, formatPercent } from '../../utils/validations/inputValidator';
import { FaHome, FaMoneyBillWave, FaCalendarAlt, FaPercent, FaInfoCircle, FaClock, FaPlus, FaTrash } from 'react-icons/fa';
import clsx from 'clsx';

interface LoanInputFormProps {
  loanInput: Partial<LoanInput>;
  errors: ValidationError[];
  onChange: (updates: Partial<LoanInput>) => void;
  repaymentMethod: RepaymentMethod;
  onRepaymentMethodChange: (method: RepaymentMethod) => void;
}

const LoanInputForm: React.FC<LoanInputFormProps> = ({
  loanInput,
  errors,
  onChange,
  repaymentMethod,
  onRepaymentMethodChange
}) => {
  const getFieldError = (field: string): string | undefined => {
    const error = errors.find(e => e.field === field);
    return error?.message;
  };

  const handleNumericChange = (field: keyof LoanInput, value: string) => {
    const parsed = parseNumericInput(value);
    if (parsed !== null) {
      onChange({ [field]: parsed });
    }
  };

  const handleRateChange = (index: number, updates: Partial<RatePeriod>) => {
    const newRates = [...(loanInput.customRates || [])];
    newRates[index] = { ...newRates[index], ...updates };
    onChange({ customRates: newRates });
  };

  const addRatePeriod = () => {
    const currentRates = loanInput.customRates || [];
    const lastPeriod = currentRates[currentRates.length - 1];
    const startMonth = lastPeriod?.endMonth ? lastPeriod.endMonth + 1 : 1;
    
    onChange({
      customRates: [
        ...currentRates,
        { startMonth, rate: 2.0, description: `第 ${currentRates.length + 1} 段利率` }
      ]
    });
  };

  const removeRatePeriod = (index: number) => {
    const newRates = (loanInput.customRates || []).filter((_, i) => i !== index);
    onChange({ customRates: newRates });
  };

  // 將月份轉換為年月顯示
  const formatMonthToYear = (month: number): string => {
    const years = Math.floor(month / 12);
    const months = month % 12;
    if (months === 0) {
      return `第 ${years} 年`;
    }
    return `第 ${years} 年 ${months} 月`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          輸入模式
        </label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={() => onChange({ inputMode: INPUT_MODES.TOTAL_PRICE })}
            className={clsx(
              'px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base touch-manipulation',
              loanInput.inputMode === INPUT_MODES.TOTAL_PRICE
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            <FaHome className="inline mr-1 sm:mr-2 text-xs sm:text-sm" />
            <span className="block sm:inline">房屋總價</span>
          </button>
          <button
            onClick={() => onChange({ inputMode: INPUT_MODES.LOAN_AMOUNT })}
            className={clsx(
              'px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base touch-manipulation',
              loanInput.inputMode === INPUT_MODES.LOAN_AMOUNT
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            <FaMoneyBillWave className="inline mr-1 sm:mr-2 text-xs sm:text-sm" />
            <span className="block sm:inline">貸款金額</span>
          </button>
        </div>
      </div>

      {loanInput.inputMode === INPUT_MODES.TOTAL_PRICE && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaHome className="inline mr-2" />
              房屋總價
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={loanInput.totalPrice || ''}
                onChange={(e) => handleNumericChange('totalPrice', e.target.value)}
                className={clsx(
                  'w-full px-3 sm:px-4 py-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base sm:text-sm touch-manipulation',
                  getFieldError('totalPrice') ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="例：10,000,000"
              />
              {loanInput.totalPrice && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {formatCurrency(loanInput.totalPrice)}
                </div>
              )}
            </div>
            {getFieldError('totalPrice') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('totalPrice')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPercent className="inline mr-2" />
              貸款成數 (%)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={loanInput.loanRatio || ''}
              onChange={(e) => handleNumericChange('loanRatio', e.target.value)}
              className={clsx(
                'w-full px-3 sm:px-4 py-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base sm:text-sm touch-manipulation',
                getFieldError('loanRatio') ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="例：80"
              min="0"
              max="100"
            />
            {getFieldError('loanRatio') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('loanRatio')}</p>
            )}
            {loanInput.totalPrice && loanInput.loanRatio && (
              <p className="mt-1 text-sm text-gray-600">
                貸款金額：{formatCurrency(loanInput.totalPrice * (loanInput.loanRatio / 100))}
              </p>
            )}
          </div>
        </>
      )}

      {loanInput.inputMode === INPUT_MODES.LOAN_AMOUNT && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaMoneyBillWave className="inline mr-2" />
            貸款金額
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={loanInput.loanAmount || ''}
              onChange={(e) => handleNumericChange('loanAmount', e.target.value)}
              className={clsx(
                'w-full px-3 sm:px-4 py-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base sm:text-sm touch-manipulation',
                getFieldError('loanAmount') ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="例：8,000,000"
            />
            {loanInput.loanAmount && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {formatCurrency(loanInput.loanAmount)}
              </div>
            )}
          </div>
          {getFieldError('loanAmount') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('loanAmount')}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaCalendarAlt className="inline mr-2" />
            貸款年限 (年)
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={loanInput.loanYears || ''}
            onChange={(e) => handleNumericChange('loanYears', e.target.value)}
            className={clsx(
              'w-full px-3 sm:px-4 py-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base sm:text-sm touch-manipulation',
              getFieldError('loanYears') ? 'border-red-500' : 'border-gray-300'
            )}
            placeholder="例：30"
            min="1"
            max={loanInput.loanPlan === LOAN_PLANS.YOUTH ? "40" : "30"}
          />
          {getFieldError('loanYears') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('loanYears')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaClock className="inline mr-2" />
            寬限期 (年)
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={loanInput.graceYears || ''}
            onChange={(e) => handleNumericChange('graceYears', e.target.value)}
            className={clsx(
              'w-full px-3 sm:px-4 py-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base sm:text-sm touch-manipulation',
              getFieldError('graceYears') ? 'border-red-500' : 'border-gray-300'
            )}
            placeholder="例：2"
            min="0"
            max="5"
            step="0.5"
          />
          {getFieldError('graceYears') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('graceYears')}</p>
          )}
          {loanInput.graceYears && loanInput.graceYears > 0 && (
            <p className="mt-1 text-sm text-amber-600">
              寬限期內只需支付利息，不需償還本金
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          貸款方案
        </label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={() => onChange({ loanPlan: LOAN_PLANS.YOUTH })}
            className={clsx(
              'px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base touch-manipulation',
              loanInput.loanPlan === LOAN_PLANS.YOUTH
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            新青安貸款
          </button>
          <button
            onClick={() => onChange({ loanPlan: LOAN_PLANS.CUSTOM })}
            className={clsx(
              'px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base touch-manipulation',
              loanInput.loanPlan === LOAN_PLANS.CUSTOM
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            自訂利率
          </button>
        </div>
      </div>

      {loanInput.loanPlan === LOAN_PLANS.YOUTH && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900 mb-1">新青安利率說明</p>
              <ul className="text-blue-700 space-y-1">
                {YOUTH_LOAN_POLICY.rates.map((rate, index) => (
                  <li key={index}>
                    • {rate.description}: {rate.rate}%
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-blue-700">
                最高貸款額度：1,000 萬 | 最長年限：40 年 | 寬限期：最長 5 年
              </p>
            </div>
          </div>
        </div>
      )}

      {loanInput.loanPlan === LOAN_PLANS.CUSTOM && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              自訂利率區間
            </label>
            <button
              onClick={addRatePeriod}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center touch-manipulation"
            >
              <FaPlus className="mr-1" />
              新增區間
            </button>
          </div>
          
          {(!loanInput.customRates || loanInput.customRates.length === 0) && (
            <div className="text-center py-4 text-gray-500 text-sm">
              請點擊「新增區間」來設定利率
            </div>
          )}
          
          <div className="space-y-3">
            {(loanInput.customRates || []).map((rate, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    第 {index + 1} 段利率
                  </span>
                  {(loanInput.customRates?.length || 0) > 1 && (
                    <button
                      onClick={() => removeRatePeriod(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">起始月份</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={rate.startMonth}
                      onChange={(e) => handleRateChange(index, { startMonth: parseInt(e.target.value) })}
                      className="w-full px-2 py-2 sm:py-1 border border-gray-300 rounded text-sm touch-manipulation"
                      placeholder="1"
                      min="1"
                    />
                    <span className="text-xs text-gray-500 block mt-1">
                      {rate.startMonth && formatMonthToYear(rate.startMonth)}
                    </span>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">結束月份</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={rate.endMonth || ''}
                      onChange={(e) => handleRateChange(index, { 
                        endMonth: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="w-full px-2 py-2 sm:py-1 border border-gray-300 rounded text-sm touch-manipulation"
                      placeholder="無限制"
                    />
                    <span className="text-xs text-gray-500 block mt-1">
                      {rate.endMonth ? formatMonthToYear(rate.endMonth) : '至結束'}
                    </span>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">年利率 (%)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={rate.rate}
                      onChange={(e) => handleRateChange(index, { rate: parseFloat(e.target.value) })}
                      className="w-full px-2 py-2 sm:py-1 border border-gray-300 rounded text-sm touch-manipulation"
                      placeholder="2.0"
                      step="0.001"
                      min="0"
                      max="20"
                    />
                    <span className="text-xs text-gray-500 block mt-1">
                      {rate.rate && formatPercent(rate.rate, 3)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <label className="text-xs text-gray-600 mb-1 block">說明（選填）</label>
                  <input
                    type="text"
                    value={rate.description || ''}
                    onChange={(e) => handleRateChange(index, { description: e.target.value })}
                    className="w-full px-2 py-2 sm:py-1 border border-gray-300 rounded text-sm touch-manipulation"
                    placeholder="例：政府補貼期間"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {loanInput.customRates && loanInput.customRates.length > 0 && (
            <div className="mt-3 p-2 bg-amber-50 rounded text-xs text-amber-700">
              提示：利率區間會按照起始月份自動排序，請確保時間不重疊
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          還款方式
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={() => onRepaymentMethodChange(REPAYMENT_METHODS.EQUAL_PRINCIPAL_AND_INTEREST)}
            className={clsx(
              'px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base touch-manipulation',
              repaymentMethod === REPAYMENT_METHODS.EQUAL_PRINCIPAL_AND_INTEREST
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            本息平均攤還
          </button>
          <button
            onClick={() => onRepaymentMethodChange(REPAYMENT_METHODS.EQUAL_PRINCIPAL)}
            className={clsx(
              'px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base touch-manipulation',
              repaymentMethod === REPAYMENT_METHODS.EQUAL_PRINCIPAL
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            本金平均攤還
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          {repaymentMethod === REPAYMENT_METHODS.EQUAL_PRINCIPAL_AND_INTEREST
            ? '每月繳納固定金額（本金+利息），前期利息較多'
            : '每月繳納固定本金，利息逐月遞減，總利息較少'}
        </p>
      </div>
    </div>
  );
};

export default LoanInputForm;