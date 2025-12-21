import React from 'react';
import { Hero } from './Hero';
import { Section } from './Section';
import { NewsCard } from './NewsCard';
import { WorldMap } from './WorldMap';
import { Heart, Users, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { newsItems } = useData();

  // Get the latest 3 items for the main grid
  const mainNews = newsItems.slice(0, 3);
  
  // Get items for the sidebar list (skipping the first 3 if enough exist)
  const sidebarNews = newsItems.length > 3 ? newsItems.slice(3, 7) : newsItems.slice(0, 4);

  return (
    <>
      <Hero onNavigate={onNavigate} />

      {/* About Us Section */}
      <Section className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F4E6F] mb-8 relative inline-block">
          About Us
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-rose-500 rounded-full"></span>
        </h2>
        <div className="space-y-6 text-lg leading-relaxed text-slate-600 mb-8">
          <p>
            The International Coalition for Human Rights (ICHR) is dedicated to protecting human dignity and ensuring justice for all. 
            Founded on the principles of universal human rights, we work tirelessly across borders to support 
            vulnerable communities and uphold international law.
          </p>
          <p>
            We believe that every individual deserves safety, freedom, and the opportunity to thrive. Through 
            direct humanitarian action, legal advocacy, and grassroots empowerment, we bridge the gap between 
            policy and people, ensuring that no voice goes unheard in the fight for equality.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('about')} 
          className="inline-flex items-center text-rose-500 font-bold hover:text-rose-600 transition-colors group"
        >
          Read More About ICHR <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </Section>

      {/* Our Mission Section - Slightly gray background */}
      <div className="bg-slate-50">
        <Section>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1F4E6F] mb-6">Our Mission</h2>
            <p className="text-xl text-slate-700 leading-relaxed font-light">
              To coordinate civil society efforts, document violations, and provide immediate humanitarian response. 
              We strive to embed universal human values into the fabric of global governance, ensuring accountability 
              and protection for the marginalized through rigorous monitoring and steadfast advocacy.
            </p>
          </div>
        </Section>
      </div>

      {/* Strategic Objectives Section */}
      <Section>
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl font-bold text-[#1F4E6F] mb-4">Our Strategic Objectives</h2>
            <div className="h-1 w-20 bg-rose-500 mb-6"></div>
            <p className="text-slate-600 mb-6">
              Our roadmap for the next decade focuses on systemic change and immediate relief, guided by five key pillars of action.
            </p>
          </div>
          <div className="w-full md:w-2/3">
            <div className="space-y-6">
              {[
                "Humanitarian coordination and rapid response deployment.",
                "Systematic monitoring and documenting of human rights violations.",
                "Capacity building of local civil society organisations.",
                "Advocacy for policy reform and international accountability.",
                "Giving a collective, amplified voice to marginalised communities."
              ].map((obj, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1F4E6F]/10 text-[#1F4E6F] font-bold flex items-center justify-center mr-4 mt-1">
                    {idx + 1}
                  </span>
                  <p className="text-lg text-slate-700 pt-2 border-b border-slate-100 pb-4 w-full">
                    {obj}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Our Reach / Map Section */}
      <Section className="bg-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1F4E6F] mb-4">Our Global Reach</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            We operate in over 40 countries, providing critical aid and advocacy where it is needed most. 
            Explore our operational locations on the map below.
          </p>
        </div>
        <WorldMap />
      </Section>

      {/* Top News Section */}
      <div className="bg-slate-50">
        <Section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1F4E6F] mb-2">Latest Field Reports</h2>
            <p className="text-slate-500">Stay updated with our latest impact stories from around the globe</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {mainNews.map(item => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center">
            <button className="bg-white border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white font-semibold py-3 px-10 rounded-full transition-colors">
              View All Reports
            </button>
          </div>
        </Section>
      </div>

      {/* Newsletter & Latest News Split */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left: Newsletter */}
          <div>
            <h3 className="text-2xl font-bold text-[#1F4E6F] mb-4">Stay informed about new and upcoming causes</h3>
            <p className="text-slate-600 mb-8">
              Join our community of over 50,000 advocates. Receive weekly updates on our missions, 
              urgent alerts, and ways you can make a difference directly from your inbox.
            </p>
            
            <form className="space-y-4 bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none" />
              </div>
              <button type="button" className="w-full bg-[#1F4E6F] hover:bg-[#163a55] text-white font-bold py-4 rounded-lg transition-colors mt-2">
                Subscribe Newsletter
              </button>
              <p className="text-xs text-center text-slate-400 mt-4">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          </div>

          {/* Right: Latest News List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#1F4E6F]">Latest News</h3>
              <a href="#" className="text-sm font-semibold text-rose-500 hover:underline">View Archive</a>
            </div>
            
            <div className="space-y-6">
              {sidebarNews.map((news) => (
                <div key={news.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
                    <img 
                      src={news.imageUrl} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-slate-800 group-hover:text-rose-600 transition-colors leading-tight mb-2">
                      {news.title}
                    </h4>
                    <div className="flex items-center text-xs text-slate-400 space-x-2">
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium">{news.source || 'NGO News'}</span>
                      <span>•</span>
                      <span>{news.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Banner */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
            <img 
            src="https://picsum.photos/id/1025/1920/600" 
            alt="Join Us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1F4E6F]/80"></div>
        </div>
        <div className="relative container mx-auto text-center text-white z-10 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Stand for Human Dignity</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 font-light">
            Your support can provide life-saving aid to families in crisis. Join our global movement today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => onNavigate('donate')}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-12 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-current" />
              Donate Now
            </button>
            <button 
              onClick={() => onNavigate('volunteer')}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-[#1F4E6F] text-white font-bold py-4 px-12 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Volunteer
            </button>
          </div>
        </div>
      </section>
    </>
  );
};