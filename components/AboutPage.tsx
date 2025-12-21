import React from 'react';
import { PageHeader } from './PageHeader';
import { Section } from './Section';
import { Shield, Eye, MapPin } from 'lucide-react';

/**
 * Institutional About Page
 * Formal briefing structure for governance & mandate
 */
export const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="About ICHR"
        subtitle="The International Coalition for Human Rights is a global non-governmental organisation dedicated to the protection of human dignity and the advancement of justice worldwide."
      />

      {/* Mandate Section */}
      <Section width="prose" spacing="lg">
        <h2 className="text-xl md:text-2xl font-bold text-[#1a4a68] mb-6">
          Our Mandate
        </h2>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
          <p>
            Founded to bridge the gap between international policy and on-the-ground practice,
            ICHR operates as an international coalition of civil society actors, legal experts,
            and humanitarian workers. We provide a unified platform to address systemic human
            rights violations and coordinate effective response mechanisms across borders.
          </p>
          <p>
            Our strength lies in our unique coalition-based structure, which allows us to leverage
            diverse expertise and local knowledge while maintaining a cohesive international strategy.
            From documenting violations to providing essential aid, ICHR stands as a pillar of support
            for those whose voices are silenced.
          </p>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section bg="subtle" spacing="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Mission */}
          <div className="bg-white p-8 rounded-lg border border-slate-200">
            <div className="w-12 h-12 bg-[#1a4a68]/10 rounded-lg flex items-center justify-center mb-5">
              <Shield className="w-6 h-6 text-[#1a4a68]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a4a68] mb-3">Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To coordinate civil society efforts, document violations, and provide immediate
              humanitarian response. We strive to embed universal human values into the fabric
              of global governance, ensuring accountability, justice, and protection for
              vulnerable populations.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-lg border border-slate-200">
            <div className="w-12 h-12 bg-[#1a4a68]/10 rounded-lg flex items-center justify-center mb-5">
              <Eye className="w-6 h-6 text-[#1a4a68]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a4a68] mb-3">Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              A world where universal human rights are respected, protected, and fulfilled for
              every individual, regardless of race, religion, or nationality. A robust global
              civil society capable of holding power to account and delivering justice.
            </p>
          </div>
        </div>
      </Section>

      {/* Strategic Objectives */}
      <Section width="content" spacing="lg">
        <h2 className="text-xl md:text-2xl font-bold text-[#1a4a68] mb-8">
          Strategic Objectives
        </h2>
        <div className="space-y-4">
          {[
            'Humanitarian coordination and rapid response deployment',
            'Systematic monitoring and documenting of human rights violations',
            'Capacity building of local civil society organisations',
            'Advocacy for policy reform and international accountability',
            'Amplifying voices of marginalised communities'
          ].map((objective, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a4a68] text-white text-sm font-medium flex items-center justify-center">
                {idx + 1}
              </span>
              <p className="text-slate-700 pt-1">{objective}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Global Presence */}
      <Section bg="primary" spacing="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-8 text-center">
            Global Presence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Geneva */}
            <div className="bg-white/10 p-6 rounded-lg border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#1a4a68]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Geneva, Switzerland</h3>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-3">International Headquarters</p>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Positioned to engage directly with UN mechanisms, international agencies,
                    and diplomatic missions.
                  </p>
                </div>
              </div>
            </div>

            {/* Paris */}
            <div className="bg-white/10 p-6 rounded-lg border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#1a4a68]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Paris, France</h3>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-3">Administrative Office</p>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Coordinating European operations, strategic partnerships, and
                    administrative oversight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Guiding Principles */}
      <Section width="content" spacing="lg">
        <h2 className="text-xl md:text-2xl font-bold text-[#1a4a68] mb-8 text-center">
          Guiding Principles
        </h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {['Neutrality', 'Independence', 'Accountability', 'Transparency', 'Respect for International Law'].map((principle, i) => (
            <span
              key={i}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded"
            >
              {principle}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
};