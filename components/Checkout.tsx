import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Lock } from 'lucide-react';

interface CheckoutProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onComplete, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">Secure Checkout</h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Unlock unlimited fixes for your resume.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="bg-blue-50 p-4 rounded-md mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-900">Single Fix Package</span>
                    <span className="text-lg font-bold text-blue-900">$0.99</span>
                </div>
                <ul className="text-xs text-blue-700 list-disc pl-4">
                    <li>ATS Keyword Optimization</li>
                    <li>Cover Letter Generation</li>
                    <li>PDF/DOCX Downloads</li>
                </ul>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white text-slate-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="card" className="block text-sm font-medium text-slate-700">
                Card Details
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="card"
                  id="card"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md p-2 border bg-white text-slate-900"
                  placeholder="0000 0000 0000 0000"
                  defaultValue="4242 4242 4242 4242" 
                />
              </div>
            </div>

            <div className="flex justify-between gap-4">
                 <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white text-slate-900" />
                 </div>
                 <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700">CVC</label>
                    <input type="text" placeholder="123" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white text-slate-900" />
                 </div>
            </div>

            <div className="flex items-center">
                <Lock className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-xs text-slate-500">Payments are secure and encrypted.</span>
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex w-full justify-center rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Pay $0.99'}
                </button>
            </div>
          </form>
        </div>
        <div className="mt-4 text-center">
            <ShieldCheck className="inline-block h-5 w-5 text-slate-400 mr-1" />
            <span className="text-sm text-slate-500">30-day money-back guarantee</span>
        </div>
      </div>
    </div>
  );
};
