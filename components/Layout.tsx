import React from 'react';
import { Briefcase, FileText, History as HistoryIcon, LogOut } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const isPublic = currentView === AppView.LANDING || currentView === AppView.CHECKOUT;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {!isPublic && (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
                <Briefcase className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold tracking-tight text-slate-900">ATS Resume<span className="text-blue-600">Fixer</span></span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setView(AppView.DASHBOARD)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === AppView.DASHBOARD ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="inline-block w-4 h-4 mr-1" />
                  Dashboard
                </button>
                <button
                  onClick={() => setView(AppView.HISTORY)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === AppView.HISTORY ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HistoryIcon className="inline-block w-4 h-4 mr-1" />
                  History
                </button>
                 <button
                  onClick={() => setView(AppView.LANDING)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="inline-block w-4 h-4 mr-1" />
                  Exit
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className={isPublic ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {children}
      </main>
    </div>
  );
};
