import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className = "", id }) => {
  return (
    <section id={id} className={`py-16 md:py-24 px-4 md:px-8 ${className}`}>
      <div className="container mx-auto max-w-6xl">
        {children}
      </div>
    </section>
  );
};