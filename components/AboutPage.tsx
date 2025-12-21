import React from 'react';
import { Section } from './Section';
import { Shield, Globe, Scale, FileText, HeartHandshake, MapPin, Eye } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-[#1F4E6F] text-white py-16 md:py-24 text-center px-4 relative overflow-hidden">
        {/* Abstract bg element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-rose-500 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
           <h1 className="text-3xl md:text-5xl font-bold mb-6">About The International Coalition for Human Rights (ICHR)</h1>
           <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto font-light">
             The International Coalition for Human Rights (ICHR) is a global non-governmental organisation dedicated to the protection of human dignity and the advancement of justice worldwide.
           </p>
        </div>
      </div>

      {/* Who We Are */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1F4E6F] mb-8 relative inline-block">
            Who We Are
            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-rose-500 rounded-full"></span>
          </h2>
          <div className="prose prose-lg text-slate-600 max-w-none">
            <p className="mb-6 leading-relaxed">
              Founded to bridge the gap between international policy and on-the-ground practice, ICHR operates as an international coalition of civil society actors, legal experts, and humanitarian workers. We provide a unified platform to address systemic human rights violations and coordinate effective response mechanisms across borders.
            </p>
            <p className="leading-relaxed">
              Our strength lies in our unique coalition-based structure, which allows us to leverage diverse expertise and local knowledge while maintaining a cohesive international strategy. From documenting war crimes to providing essential aid in refugee camps, ICHR stands as a pillar of support for those whose voices are silenced.
            </p>
          </div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <div className="bg-slate-50 border-y border-slate-100">
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Mission */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-8 rotate-3 transition-transform hover:rotate-6">
                 <Shield className="w-7 h-7 text-rose-500" />
               </div>
               <h3 className="text-2xl font-bold text-[#1F4E6F] mb-4">Our Mission</h3>
               <p className="text-slate-600 leading-relaxed flex-grow">
                 To coordinate civil society efforts, document violations, and provide immediate humanitarian response. We strive to embed universal human values into the fabric of global governance, ensuring accountability, justice, and protection for vulnerable populations through rigorous monitoring and steadfast advocacy.
               </p>
            </div>
            
            {/* Vision */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 -rotate-3 transition-transform hover:-rotate-6">
                 <Eye className="w-7 h-7 text-[#1F4E6F]" />
               </div>
               <h3 className="text-2xl font-bold text-[#1F4E6F] mb-4">Our Vision</h3>
               <p className="text-slate-600 leading-relaxed flex-grow">
                 We envision a world where universal human rights are respected, protected, and fulfilled for every individual, regardless of race, religion, or nationality. We strive for a robust global civil society capable of holding power to account and delivering justice to the most vulnerable communities on Earth.
               </p>
            </div>
          </div>
        </Section>
      </div>

      {/* What We Do */}
      <Section>
        <div className="max-w-6xl mx-auto">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-[#1F4E6F] mb-4">What We Do</h2>
             <p className="text-slate-500 max-w-2xl mx-auto">
               Our operations encompass a wide spectrum of activities designed to protect human rights and provide relief.
             </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { 
                  icon: <Scale className="w-8 h-8"/>, 
                  title: "Human Rights Advocacy", 
                  text: "Engaging with international bodies, governments, and the public to drive policy change and uphold international law." 
                },
                { 
                  icon: <FileText className="w-8 h-8"/>, 
                  title: "Documentation & Reporting", 
                  text: "Systematically monitoring, verifying, and reporting on human rights violations to ensure factual accountability." 
                },
                { 
                  icon: <HeartHandshake className="w-8 h-8"/>, 
                  title: "Humanitarian Coordination", 
                  text: "Facilitating rapid aid deployment and support mechanisms for communities in crisis zones and conflict areas." 
                },
              ].map((item, i) => (
                 <div key={i} className="text-center p-8 rounded-2xl bg-white border border-slate-100 hover:border-rose-200 hover:shadow-lg transition-all group">
                    <div className="w-20 h-20 mx-auto bg-[#1F4E6F]/5 text-[#1F4E6F] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1F4E6F] group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.text}</p>
                 </div>
              ))}
           </div>
           
           <div className="bg-slate-50 p-8 md:p-12 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-[#1F4E6F] mb-6 border-b border-slate-200 pb-4">Additionally, we provide:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2.5 rounded-full bg-rose-500 flex-shrink-0"/> 
                  Legal and policy engagement to shape international frameworks
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2.5 rounded-full bg-rose-500 flex-shrink-0"/> 
                  Direct support for displaced persons, refugees, and vulnerable communities
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2.5 rounded-full bg-rose-500 flex-shrink-0"/> 
                  Capacity building and training for local civil society actors
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2.5 rounded-full bg-rose-500 flex-shrink-0"/> 
                  Strategic litigation and victim support services
                </li>
              </ul>
           </div>
        </div>
      </Section>

      {/* Our Presence */}
      <div className="bg-[#1F4E6F] text-white py-20 px-4">
         <div className="container mx-auto max-w-5xl">
           <h2 className="text-3xl font-bold mb-12 text-center">Our Global Presence</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
             {/* Geneva */}
             <div className="bg-white/10 p-8 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                   <MapPin className="w-6 h-6 text-[#1F4E6F]" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold">Geneva, Switzerland</h3>
                   <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Head Office (International HQ)</span>
                 </div>
               </div>
               <p className="text-blue-100 leading-relaxed pl-16">
                 Ideally situated to engage directly with UN mechanisms, international agencies, and diplomatic missions to drive global advocacy.
               </p>
             </div>

             {/* Paris */}
             <div className="bg-white/10 p-8 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                   <MapPin className="w-6 h-6 text-[#1F4E6F]" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold">Paris, France</h3>
                   <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Head Office (Administrative HQ)</span>
                 </div>
               </div>
               <p className="text-blue-100 leading-relaxed pl-16">
                 Coordinating European operations, strategic partnerships, fundraising, and administrative oversight for our global missions.
               </p>
             </div>
           </div>

           <div className="text-center border-t border-white/10 pt-10">
             <div className="inline-flex items-center gap-2 bg-blue-900/50 px-6 py-3 rounded-full border border-blue-400/30">
               <Globe className="w-5 h-5 text-blue-300" />
               <p className="text-blue-100">
                 We also maintain <strong>Regional Offices and Field Missions</strong> operating in conflict zones and developing regions worldwide.
               </p>
             </div>
           </div>
         </div>
      </div>

      {/* Our Principles */}
      <Section>
        <div className="max-w-5xl mx-auto text-center">
           <h2 className="text-3xl font-bold text-[#1F4E6F] mb-12">Our Guiding Principles</h2>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['Neutrality', 'Independence', 'Accountability', 'Transparency', 'Respect for International Law'].map((p, i) => (
                <div key={i} className="p-6 border border-slate-200 rounded-xl hover:border-[#1F4E6F] hover:bg-slate-50 transition-all cursor-default flex items-center justify-center h-full">
                  <span className="font-bold text-slate-700 text-sm md:text-base leading-tight">{p}</span>
                </div>
              ))}
           </div>
        </div>
      </Section>
    </div>
  );
};