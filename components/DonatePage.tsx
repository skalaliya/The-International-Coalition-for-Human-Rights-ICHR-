import React, { useState } from 'react';
import { Section } from './Section';
import { Heart, Shield, CheckCircle, CreditCard, Lock } from 'lucide-react';

export const DonatePage: React.FC = () => {
  const [amount, setAmount] = useState<number>(50);
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('monthly');

  return (
    <div className="animate-fade-in">
      <div className="bg-[#1F4E6F] text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Make a Difference Today</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">
          Your secure donation provides immediate relief to families in crisis zones.
        </p>
      </div>

      <Section>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Donation Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50">
                <div className="flex justify-center gap-4 mb-8">
                  <button
                    onClick={() => setFrequency('once')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${frequency === 'once' ? 'bg-[#1F4E6F] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}
                  >
                    Give Once
                  </button>
                  <button
                    onClick={() => setFrequency('monthly')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${frequency === 'monthly' ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}
                  >
                    Monthly (Most Impactful)
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
                  {[10, 25, 50, 100, 250, 500].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`py-3 rounded-lg font-bold border-2 transition-all ${amount === val ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 hover:border-slate-300 text-slate-700'}`}
                    >
                      ${val}
                    </button>
                  ))}
                  <div className="col-span-2 sm:col-span-2 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                      className="w-full h-full pl-8 pr-4 rounded-lg border-2 border-slate-200 focus:border-rose-500 focus:outline-none font-bold text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" /> Secure Payment Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CVC</label>
                    <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" />
                  </div>
                </div>

                <button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 fill-current" />
                  Donate ${amount} {frequency === 'monthly' ? '/ month' : ''}
                </button>

                <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> 256-bit SSL Encrypted Donation
                </p>
              </div>
            </div>
          </div>

          {/* Impact Info */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold text-[#1F4E6F] mb-4">Why donate to ICHR?</h3>
              <ul className="space-y-4">
                {[
                  "92% of funds go directly to field missions",
                  "Tax-deductible contributions",
                  "Monthly impact reports sent to donors",
                  "Immediate emergency response deployment"
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <img src="/images/impact-field-mission.jpg" alt="Humanitarian aid workers providing assistance to communities" className="w-full h-48 object-cover rounded-lg mb-4" />
              <p className="text-sm italic text-slate-600">
                "Your donation last month helped us provide clean water to 5,000 residents in Yemen."
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};