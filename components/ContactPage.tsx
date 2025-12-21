import React from 'react';
import { PageHeader } from './PageHeader';
import { Section } from './Section';
import { MapPin, Phone, Mail, Shield } from 'lucide-react';

/**
 * Institutional Contact Page
 * Clear contact channels, professional form
 */
export const ContactPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Contact Us"
        subtitle="For media inquiries, partnerships, or emergency assistance, please reach out through the channels below."
      />

      <Section width="wide" spacing="lg">
        <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">

          {/* Contact Info Column */}
          <div className="lg:w-1/3 space-y-8">
            {/* Head Offices */}
            <div>
              <h2 className="text-lg font-semibold text-[#1a4a68] mb-4">Head Offices</h2>
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#1a4a68] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-slate-800 text-sm">Geneva, Switzerland</h3>
                      <p className="text-xs text-slate-500 mt-1">International Headquarters</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#1a4a68] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-slate-800 text-sm">Paris, France</h3>
                      <p className="text-xs text-slate-500 mt-1">Administrative Office</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Channels */}
            <div>
              <h2 className="text-lg font-semibold text-[#1a4a68] mb-4">Contact Channels</h2>
              <div className="space-y-4">
                <a href="tel:+33768851066" className="flex items-center gap-3 text-slate-600 hover:text-[#1a4a68] transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#1a4a68]/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-[#1a4a68]" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">General / Emergency</span>
                    <span className="font-medium text-slate-800 text-sm">+33 7 68 85 10 66</span>
                  </div>
                </a>

                <a href="mailto:ichr.geneva@gmail.com" className="flex items-center gap-3 text-slate-600 hover:text-[#1a4a68] transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#1a4a68]/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#1a4a68]" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">Email</span>
                    <span className="font-medium text-slate-800 text-sm">ichr.geneva@gmail.com</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:flex-1">
            <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Send a Message</h2>
              <p className="text-sm text-slate-500 mb-6">Your inquiry will be directed to the appropriate department.</p>

              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                    <input type="text" className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Organisation (Optional)</label>
                    <input type="text" className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                    <input type="email" className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                    <select className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm bg-white">
                      <option>General Inquiry</option>
                      <option>Press / Media</option>
                      <option>Partnership</option>
                      <option>Report a Violation</option>
                      <option>Donation Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                  <textarea rows={5} className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm resize-none" />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded">
                  <Shield className="w-3.5 h-3.5 text-green-600" />
                  <p>Your data is protected. ICHR follows strict privacy protocols.</p>
                </div>

                <button type="button" className="w-full bg-[#1a4a68] hover:bg-[#133549] text-white font-medium py-3 rounded transition-colors text-sm">
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