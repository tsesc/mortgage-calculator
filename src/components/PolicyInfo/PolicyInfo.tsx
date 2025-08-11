import React from 'react';
import { YOUTH_LOAN_POLICY } from '../../constants';
import { FaCheckCircle, FaExclamationTriangle, FaGift, FaClipboardList } from 'react-icons/fa';

const PolicyInfo: React.FC = () => {
  return (
    <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
      <div className="bg-white p-3 sm:p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
          <FaClipboardList className="mr-2 text-blue-600 text-sm sm:text-base" />
          申請資格
        </h4>
        <ul className="space-y-2">
          {YOUTH_LOAN_POLICY.requirements.map((req, index) => (
            <li key={index} className="flex items-start">
              <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0 text-sm" />
              <span className="text-gray-700 text-sm leading-relaxed">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
          <FaGift className="mr-2 text-green-600 text-sm sm:text-base" />
          優惠內容
        </h4>
        <ul className="space-y-2">
          {YOUTH_LOAN_POLICY.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-600 mr-2 text-sm mt-1">•</span>
              <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
          <FaExclamationTriangle className="mr-2 text-yellow-600 text-sm sm:text-base" />
          注意事項
        </h4>
        <ul className="space-y-2">
          {YOUTH_LOAN_POLICY.notes.map((note, index) => (
            <li key={index} className="flex items-start">
              <span className="text-yellow-600 mr-2 text-sm mt-1 font-bold">!</span>
              <span className="text-gray-700 text-sm leading-relaxed">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg">
        <p className="text-sm text-indigo-700 leading-relaxed">
          <strong>貸款額度：</strong>最高 {(YOUTH_LOAN_POLICY.maxAmount / 10000).toLocaleString()} 萬元
        </p>
        <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
          <strong>貸款年限：</strong>最長 {YOUTH_LOAN_POLICY.maxYears} 年
        </p>
      </div>
    </div>
  );
};

export default PolicyInfo;