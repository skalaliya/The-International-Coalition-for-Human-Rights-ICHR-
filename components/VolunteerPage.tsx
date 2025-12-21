import React from 'react';
import { PageHeader } from './PageHeader';
import { Section } from './Section';
import { Send } from 'lucide-react';

/**
 * Institutional Volunteer Page
 * Minimal, professional application form
 */
export const VolunteerPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Volunteer With Us"
        subtitle="Join our global team of professionals working to protect human rights and provide humanitarian assistance."
      />

      <Section width="content" spacing="lg">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">Application Form</h2>
            <p className="text-sm text-slate-600">
              We review applications on a rolling basis and will contact qualified candidates.
            </p>
          </div>

          <form className="bg-white p-8 rounded-lg border border-slate-200 space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                <input type="text" className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                <input type="text" className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm" />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input type="email" className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                <input type="tel" className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm" />
              </div>
            </div>

            {/* Area of Interest */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Area of Interest</label>
              <select className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm bg-white">
                <option>Select an area...</option>
                <option>Field Operations</option>
                <option>Legal Advocacy</option>
                <option>Documentation & Research</option>
                <option>Communications</option>
                <option>Fundraising</option>
                <option>Remote / Digital Support</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Relevant Experience</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2.5 rounded border border-slate-200 focus:border-[#1a4a68] focus:outline-none text-sm resize-none"
                placeholder="Briefly describe your relevant skills and experience..."
              />
            </div>

            {/* Consent */}
            <div className="bg-slate-50 p-4 rounded text-sm text-slate-600">
              By submitting this application, you agree to our volunteer code of conduct
              and acknowledge that placement is subject to availability and vetting requirements.
            </div>

            {/* Submit */}
            <button
              type="button"
              className="w-full bg-[#1a4a68] hover:bg-[#133549] text-white font-medium py-3 rounded transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Application
            </button>
          </form>
        </div>
      </Section>
    </div>
  );
};