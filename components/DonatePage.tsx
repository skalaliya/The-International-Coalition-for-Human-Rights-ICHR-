import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Section } from './Section';
import { CheckCircle, Lock } from 'lucide-react';

/**
 * Institutional Donate Page
 * Respectful tone, clean form, no emotional manipulation
 */
export const DonatePage: React.FC = () => {
  const [amount, setAmount] = useState<number>(50);
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Support Our Work"
        subtitle="Your contribution enables us to continue protecting human rights and providing humanitarian assistance."
      />

      <Section width="wide" spacing="lg">
        <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
          {/* Donation Form */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              {/* Frequency Toggle */}
              <div className="p-6 bg-slate-50 border-b border-slate-200">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setFrequency('once')}
                    className={`px-5 py-2 rounded font-medium text-sm transition-colors ${frequency === 'once'
                        ? 'bg-[#1a4a68] text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                  >
                    One-time
                  </button>
                  <button
                    onClick={() => setFrequency('monthly')}
                    className={`px-5 py-2 rounded font-medium text-sm transition-colors ${frequency === 'monthly'
                        ? 'bg-[#1a4a68] text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                  >
                    Monthly
                  </button>
                </div>

                {/* Amount Selection */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[25, 50, 100, 250, 500, 1000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`py-2.5 rounded font-medium text-sm border transition-colors ${amount === val
                          ? 'border-[#1a4a68] bg-[#1a4a68]/5 text-[#1a4a68]'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mt-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm"
                      placeholder="Other amount"
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                    <input type="text" className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                    <input type="text" className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input type="email" className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm" />
                </div>

                <button className="w-full bg-[#1a4a68] hover:bg-[#133549] text-white font-medium py-3 rounded transition-colors text-sm">
                  Donate ${amount}{frequency === 'monthly' ? '/month' : ''}
                </button>

                <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Secure, encrypted donation
                </p>
              </div>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">Your Impact</h3>
              <ul className="space-y-3">
                {[
                  '92% of funds go directly to field operations',
                  'Tax-deductible contributions',
                  'Quarterly impact reports',
                  'Immediate deployment capability'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 italic leading-relaxed">
                "Contributions from supporters like you enable our teams to respond rapidly
                to humanitarian crises and advocate for those who cannot speak for themselves."
              </p>
              <p className="text-xs text-slate-500 mt-3">— ICHR Field Operations</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};