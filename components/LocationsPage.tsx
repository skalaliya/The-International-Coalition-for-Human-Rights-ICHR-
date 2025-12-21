import React from 'react';
import { PageHeader } from './PageHeader';
import { Section } from './Section';
import { WorldMap, locations } from './WorldMap';
import { MapPin, Mail, Phone } from 'lucide-react';

/**
 * Institutional Locations Page
 * Head offices prominent, map as support element
 */
export const LocationsPage: React.FC = () => {
  // Separate head offices from field missions (match actual category names)
  const headOffices = locations.filter(loc =>
    loc.category.includes('Headquarters')
  );
  const fieldOffices = locations.filter(loc =>
    !loc.category.includes('Headquarters')
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Global Presence"
        subtitle="Coordinating humanitarian efforts and legal advocacy through our network of offices and field missions worldwide."
      />

      {/* Head Offices */}
      <Section width="content" spacing="lg">
        <h2 className="text-xl md:text-2xl font-bold text-[#1a4a68] mb-8 text-center">
          Head Offices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {headOffices.map((office) => (
            <div
              key={office.id}
              className="bg-slate-50 p-6 rounded-lg border border-slate-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#1a4a68] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">{office.title}</h3>
                  <p className="text-xs text-[#1a4a68] uppercase tracking-wider font-medium mb-3">
                    {office.category}
                  </p>
                  <p className="text-sm text-slate-600 mb-4">{office.description}</p>

                  {office.address && (
                    <p className="text-sm text-slate-500 mb-2">{office.address}</p>
                  )}

                  <div className="flex flex-col gap-1.5 text-sm">
                    {office.email && (
                      <a
                        href={`mailto:${office.email}`}
                        className="text-slate-600 hover:text-[#1a4a68] transition-colors flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4 text-slate-400" />
                        {office.email}
                      </a>
                    )}
                    {office.phone && (
                      <a
                        href={`tel:${office.phone}`}
                        className="text-slate-600 hover:text-[#1a4a68] transition-colors flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4 text-slate-400" />
                        {office.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Interactive Map */}
      <Section bg="subtle" spacing="lg">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#1a4a68] mb-3">
            Regional Presence
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm">
            Explore our field missions and regional offices across multiple continents.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <WorldMap />
        </div>
      </Section>

      {/* Field Offices Grid */}
      {fieldOffices.length > 0 && (
        <Section width="wide" spacing="lg">
          <h2 className="text-xl md:text-2xl font-bold text-[#1a4a68] mb-8 text-center">
            Field Offices & Missions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fieldOffices.map((office) => (
              <div
                key={office.id}
                className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#1a4a68]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{office.title}</h3>
                    <p className="text-xs text-slate-500">{office.category}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{office.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Partner CTA */}
      <Section bg="primary" spacing="lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            Partner With Us
          </h2>
          <p className="text-white/80 mb-6 text-sm leading-relaxed">
            Are you a local NGO or civil society organisation? We build capacity and
            provide support for partners aligned with our mission.
          </p>
          <button className="px-6 py-2.5 bg-white text-[#1a4a68] font-medium rounded hover:bg-slate-100 transition-colors text-sm">
            Become a Partner
          </button>
        </div>
      </Section>
    </div>
  );
};