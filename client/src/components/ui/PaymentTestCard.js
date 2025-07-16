import React from 'react';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

const PaymentTestCard = () => {
  const testCards = [
    {
      name: 'Visa (Success)',
      number: '4242424242424242',
      description: 'Standard successful payment'
    },
    {
      name: 'Visa (Declined)',
      number: '4000000000000002',
      description: 'Card declined'
    },
    {
      name: 'Visa (Insufficient Funds)',
      number: '4000000000009995',
      description: 'Insufficient funds'
    },
    {
      name: 'Visa (Expired)',
      number: '4000000000000069',
      description: 'Expired card'
    },
    {
      name: 'Visa (Incorrect CVC)',
      number: '4000000000000127',
      description: 'Incorrect CVC'
    },
    {
      name: 'Visa (Processing Error)',
      number: '4000000000000119',
      description: 'Processing error'
    }
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-3">
        <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-blue-900">Test Payment Cards</h3>
      </div>
      
      <p className="text-blue-700 mb-4 text-sm">
        Use these test card numbers to simulate different payment scenarios. 
        Any future date for expiry and any 3-digit CVC will work.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {testCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white border border-blue-200 rounded p-3 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{card.name}</h4>
                <p className="text-gray-600 text-xs mt-1">{card.description}</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 block font-mono">
                  {card.number}
                </code>
              </div>
              <div className="ml-2">
                {card.name.includes('Success') ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <div className="flex items-start">
          <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Important:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Use any future expiry date (MM/YY)</li>
              <li>Use any 3-digit CVC</li>
              <li>Use any valid postal code</li>
              <li>These cards only work in test mode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTestCard; 