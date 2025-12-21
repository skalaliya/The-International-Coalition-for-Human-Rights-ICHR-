import React from 'react';
import { Section } from './Section';
import { WorldMap, locations } from './WorldMap';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export const LocationsPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Page Hero */}
      <section className="relative h-[400px] bg-slate-900 overflow-hidden">
        <img
          src="/images/locations-world-map.jpg"
          alt="Global network visualization showing international presence"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E6F]/90 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">Our Global Presence</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Coordinating humanitarian efforts and legal advocacy through our network of field offices and strategic hubs worldwide.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <Section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1F4E6F] mb-4">Interactive Global Map</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Explore our active missions, headquarters, and emergency response units.
          </p>
        </div>
        <WorldMap />
      </Section>

      {/* Locations Grid */}
      <div className="bg-slate-50 border-t border-slate-100">
        <Section>
          <h2 className="text-3xl font-bold text-[#1F4E6F] mb-12 text-center">Regional Offices & Missions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((loc) => (
              <div key={loc.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 transition-all group">
                {/* Card Header */}
                <div className="bg-[#1F4E6F] p-4 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 bg-white/10 px-2 py-1 rounded">
                      {loc.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">{loc.title}</h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="text-slate-600 text-sm mb-6 min-h-[40px]">
                    {loc.description}
                  </p>

                  <div className="space-y-4 mb-6">
                    {loc.address && (
                      <div className="flex items-start text-sm text-slate-500">
                        <MapPin className="w-4 h-4 mr-3 mt-0.5 text-rose-500 flex-shrink-0" />
                        <span>{loc.address}</span>
                      </div>
                    )}
                    {loc.phone && (
                      <div className="flex items-center text-sm text-slate-500">
                        <Phone className="w-4 h-4 mr-3 text-rose-500 flex-shrink-0" />
                        <a href={`tel:${loc.phone}`} className="hover:text-rose-600 transition-colors">{loc.phone}</a>
                      </div>
                    )}
                    {loc.email && (
                      <div className="flex items-center text-sm text-slate-500">
                        <Mail className="w-4 h-4 mr-3 text-rose-500 flex-shrink-0" />
                        <a href={`mailto:${loc.email}`} className="hover:text-rose-600 transition-colors truncate">{loc.email}</a>
                      </div>
                    )}
                  </div>

                  <a
                    href={loc.link}
                    className="flex items-center justify-center w-full py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:text-white hover:bg-[#1F4E6F] hover:border-[#1F4E6F] transition-all group-hover:shadow-md"
                  >
                    View Office Details <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Local Partner CTA */}
      <Section className="!py-20">
        <div className="bg-[#1F4E6F] rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Partner with us locally</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Are you a local NGO or civil society organisation? We build capacity and provide funding for partners aligned with our mission.
            </p>
            <button className="bg-white text-[#1F4E6F] font-bold py-3 px-8 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-colors">
              Become a Partner
            </button>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
      </Section>
    </div>
  );
};