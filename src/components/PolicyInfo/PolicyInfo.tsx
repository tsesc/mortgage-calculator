import React from 'react';
import { YOUTH_LOAN_POLICY } from '../../constants';
import { FaCheckCircle, FaExclamationTriangle, FaGift, FaClipboardList } from 'react-icons/fa';

const PolicyInfo: React.FC = () => {
  return (
    <div className="mt-4 space-y-4">
      <div className="bg-white p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <FaClipboardList className="mr-2 text-blue-600" />
          申請資格
        </h4>
        <ul className="space-y-2">
          {YOUTH_LOAN_POLICY.requirements.map((req, index) => (
            <li key={index} className="flex items-start">
              <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <FaGift className="mr-2 text-green-600" />
          優惠內容
        </h4>
        <ul className="space-y-2">
          {YOUTH_LOAN_POLICY.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span className="text-gray-700 text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <FaExclamationTriangle className="mr-2 text-yellow-600" />
          注意事項
        </h4>
        <ul className="space-y-2">
          {YOUTH_LOAN_POLICY.notes.map((note, index) => (
            <li key={index} className="flex items-start">
              <span className="text-yellow-600 mr-2">!</span>
              <span className="text-gray-700 text-sm">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm text-indigo-700">
          <strong>貸款額度：</strong>最高 {(YOUTH_LOAN_POLICY.maxAmount / 10000).toLocaleString()} 萬元
        </p>
        <p className="text-sm text-indigo-700 mt-1">
          <strong>貸款年限：</strong>最長 {YOUTH_LOAN_POLICY.maxYears} 年
        </p>
      </div>
    </div>
  );
};

export default PolicyInfo;