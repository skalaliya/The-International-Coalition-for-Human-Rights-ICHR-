import React from 'react';
import { Section } from './Section';
import { MapPin, Phone, Mail, Clock, Shield } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-[#1F4E6F] text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">
          For media inquiries, partnerships, or emergency assistance, please contact our headquarters below.
        </p>
      </div>

      <Section>
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Contact Info Column */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1F4E6F] mb-6">Head Offices</h2>
              
              <div className="space-y-6">
                {/* Geneva */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="flex items-start mb-3">
                    <MapPin className="w-5 h-5 text-rose-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-800">Geneva (International HQ)</h3>
                      <p className="text-slate-600 text-sm mt-1">
                        123 Humanitarian Avenue<br/>
                        Geneva, Switzerland 1202
                      </p>
                    </div>
                  </div>
                </div>

                {/* Paris */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="flex items-start mb-3">
                    <MapPin className="w-5 h-5 text-rose-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-800">Paris (Administrative HQ)</h3>
                      <p className="text-slate-600 text-sm mt-1">
                        25 Rue de la Paix<br/>
                        75002 Paris, France
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1F4E6F] mb-6">Direct Channels</h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1F4E6F]/10 flex items-center justify-center mr-4">
                    <Phone className="w-5 h-5 text-[#1F4E6F]" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase">24/7 Emergency / General</span>
                    <span className="text-lg font-bold text-slate-800">+33 7 68 85 10 66</span>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1F4E6F]/10 flex items-center justify-center mr-4">
                    <Mail className="w-5 h-5 text-[#1F4E6F]" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase">Email Enquiries</span>
                    <a href="mailto:ichr.geneva@gmail.com" className="text-lg font-bold text-slate-800 hover:text-rose-500 transition-colors">ichr.geneva@gmail.com</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Column */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Send a Secure Message</h2>
              <p className="text-slate-500 mb-8">Your communication is protected and directed to the appropriate department.</p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Organization (Optional)</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none bg-white">
                      <option>General Inquiry</option>
                      <option>Press / Media</option>
                      <option>Partnership Proposal</option>
                      <option>Report a Violation</option>
                      <option>Donation Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea rows={6} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none"></textarea>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                  <p>This form is encrypted. ICHR adheres to strict data privacy protocols.</p>
                </div>

                <button type="button" className="w-full bg-[#1F4E6F] hover:bg-[#163a55] text-white font-bold py-4 rounded-lg shadow-md transition-all">
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </Section>
    </div>
  );
};