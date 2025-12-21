import React from 'react';
import { Section } from './Section';
import { Users, ClipboardList, Send } from 'lucide-react';

export const VolunteerPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="relative bg-slate-900 h-[300px] overflow-hidden">
        <img 
          src="https://picsum.photos/id/1015/1920/600" 
          alt="Volunteers" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-[#1F4E6F]/80 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Join Our Global Team</h1>
          <p className="text-blue-100 max-w-xl text-lg">
            Use your skills to protect human rights and provide humanitarian aid.
          </p>
        </div>
      </div>

      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800">Volunteer Application</h2>
            <p className="text-slate-500">Fill out the form below to get started. We review applications weekly.</p>
          </div>

          <form className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <input type="tel" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Area of Interest</label>
              <select className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none">
                <option>Field Operations</option>
                <option>Medical Support</option>
                <option>Legal Advocacy</option>
                <option>Fundraising & Events</option>
                <option>Remote / Digital Support</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Relevant Skills / Experience</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none"></textarea>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 p-4 rounded-lg">
              <ClipboardList className="w-5 h-5 text-[#1F4E6F]" />
              <p>By submitting, you agree to our volunteer code of conduct.</p>
            </div>

            <button type="button" className="w-full bg-[#1F4E6F] hover:bg-[#163a55] text-white font-bold py-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> Submit Application
            </button>
          </form>
        </div>
      </Section>
    </div>
  );
};