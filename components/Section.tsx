import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Container width variant */
  width?: 'prose' | 'content' | 'wide' | 'full';
  /** Vertical padding variant */
  spacing?: 'sm' | 'default' | 'lg' | 'none';
  /** Background color */
  bg?: 'white' | 'subtle' | 'primary';
}

const widthClasses = {
  prose: 'max-w-[680px]',
  content: 'max-w-[960px]',
  wide: 'max-w-6xl',
  full: 'max-w-full',
};

const spacingClasses = {
  none: 'py-0',
  sm: 'py-8 md:py-12',
  default: 'py-12 md:py-20',
  lg: 'py-16 md:py-24',
};

const bgClasses = {
  white: 'bg-white',
  subtle: 'bg-slate-50',
  primary: 'bg-[#1a4a68] text-white',
};

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  width = 'wide',
  spacing = 'default',
  bg = 'white',
}) => {
  return (
    <section
      id={id}
      className={`px-6 md:px-8 ${spacingClasses[spacing]} ${bgClasses[bg]} ${className}`}
    >
      <div className={`mx-auto ${widthClasses[width]}`}>
        {children}
      </div>
    </section>
  );
};