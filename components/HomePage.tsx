import React from 'react';
import { Hero } from './Hero';
import { Section } from './Section';
import { WorldMap } from './WorldMap';
import { ArrowRight, Shield, FileText, HeartHandshake } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

/**
 * Institutional HomePage
 * Clear structure: Hero → Mandate → Pillars → Global Reach → CTA
 */
export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <>
      <Hero onNavigate={onNavigate} />

      {/* Mandate Section */}
      <Section width="prose" spacing="lg">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a4a68] mb-6">
            Our Mandate
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            The International Coalition for Human Rights (ICHR) is a global non-governmental
            organisation dedicated to the protection of human dignity and the advancement of
            justice worldwide. We bridge the gap between international policy and on-the-ground
            practice through coordinated civil society action.
          </p>
          <button
            onClick={() => onNavigate('about')}
            className="inline-flex items-center text-[#1a4a68] font-medium hover:text-[#2a6a96] transition-colors"
          >
            Read more about ICHR
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </Section>

      {/* What We Do - Three Pillars */}
      <Section bg="subtle" spacing="lg">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a4a68] mb-4">
            What We Do
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our operations encompass three core pillars designed to protect human rights
            and provide relief.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Human Rights Advocacy',
              text: 'Engaging with international bodies, governments, and the public to drive policy change and uphold international law.'
            },
            {
              icon: <FileText className="w-6 h-6" />,
              title: 'Documentation & Reporting',
              text: 'Systematically monitoring, verifying, and reporting on human rights violations to ensure factual accountability.'
            },
            {
              icon: <HeartHandshake className="w-6 h-6" />,
              title: 'Humanitarian Coordination',
              text: 'Facilitating rapid aid deployment and support mechanisms for communities in crisis zones and conflict areas.'
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-lg border border-slate-200"
            >
              <div className="w-12 h-12 bg-[#1a4a68]/10 text-[#1a4a68] rounded-lg flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Global Reach Section */}
      <Section spacing="lg">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a4a68] mb-4">
            Global Presence
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Headquartered in Geneva with administrative offices in Paris, we operate
            field missions across multiple continents.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <WorldMap />
        </div>
        <div className="text-center mt-8">
          <button
            onClick={() => onNavigate('locations')}
            className="inline-flex items-center text-[#1a4a68] font-medium hover:text-[#2a6a96] transition-colors"
          >
            View all locations
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </Section>

      {/* Support CTA - Restrained */}
      <Section bg="primary" spacing="lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Support Our Work
          </h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            Your contribution enables us to continue protecting human rights and
            providing humanitarian assistance to those in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('donate')}
              className="px-8 py-3 bg-white text-[#1a4a68] font-medium rounded hover:bg-slate-100 transition-colors"
            >
              Make a Donation
            </button>
            <button
              onClick={() => onNavigate('volunteer')}
              className="px-8 py-3 border border-white/40 text-white font-medium rounded hover:bg-white/10 transition-colors"
            >
              Volunteer With Us
            </button>
          </div>
        </div>
      </Section>
    </>
  );
};