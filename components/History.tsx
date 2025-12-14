import React from 'react';
import { OptimizationResult } from '../types';
import { Clock, ArrowRight, FileText } from 'lucide-react';

interface HistoryProps {
  items: OptimizationResult[];
  onLoadItem: (item: OptimizationResult) => void;
}

export const History: React.FC<HistoryProps> = ({ items, onLoadItem }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="mx-auto h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-12 w-12 text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No history yet</h3>
        <p className="mt-1 text-slate-500">Generate your first optimized resume to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Your History</h2>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group">
            <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${item.analysis.matchScore > 75 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <span className={`font-bold text-lg ${item.analysis.matchScore > 75 ? 'text-green-700' : 'text-yellow-700'}`}>
                        {item.analysis.matchScore}
                    </span>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-900">{item.targetRole || 'Unknown Role'}</h3>
                    <p className="text-sm text-slate-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                    </p>
                </div>
            </div>
            <button 
                onClick={() => onLoadItem(item)}
                className="flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            >
                View Details <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
