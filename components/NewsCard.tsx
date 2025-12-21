import React from 'react';
import { NewsItem } from '../types';
import { Calendar, ArrowRight } from 'lucide-react';

export const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col h-full cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-md">
          <Calendar className="w-3 h-3 mr-1" />
          {item.date}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-rose-600 transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {item.summary}
        </p>
        <div className="flex items-center text-rose-500 font-semibold text-sm mt-auto">
          Read More <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};