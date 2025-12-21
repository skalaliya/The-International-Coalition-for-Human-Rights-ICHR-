import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LocationsPage } from './components/LocationsPage';
import { DonatePage } from './components/DonatePage';
import { VolunteerPage } from './components/VolunteerPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { DataProvider } from './context/DataContext';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('home');

  const scrollToTop = () => window.scrollTo(0, 0);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    scrollToTop();
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-white font-sans text-slate-600 flex flex-col">
        {activePage !== 'admin' && (
          <Header activePage={activePage} onNavigate={handleNavigate} />
        )}
        
        <main className="flex-1">
          {activePage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {activePage === 'about' && <AboutPage />}
          {activePage === 'locations' && <LocationsPage />}
          {activePage === 'donate' && <DonatePage />}
          {activePage === 'volunteer' && <VolunteerPage />}
          {activePage === 'contact' && <ContactPage />}
          {activePage === 'admin' && <AdminDashboard onLogout={() => handleNavigate('home')} />}
        </main>

        {activePage !== 'admin' && (
          <Footer onNavigate={handleNavigate} />
        )}
      </div>
    </DataProvider>
  );
};

export default App;