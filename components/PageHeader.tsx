import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

/**
 * Institutional page header component
 * Clean, centered title with optional subtitle
 * Uses design system tokens
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
    return (
        <header className="bg-[#1a4a68] text-white py-16 md:py-20 px-6 text-center">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl md:text-[2rem] font-bold mb-3 leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}
            </div>
        </header>
    );
};
