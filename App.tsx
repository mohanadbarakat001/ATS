import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Checkout } from './components/Checkout';
import { ResultsView } from './components/ResultsView';
import { AppView, OptimizationResult } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [history, setHistory] = useState<OptimizationResult[]>([]);
  const [activeResult, setActiveResult] = useState<OptimizationResult | null>(null);

  useEffect(() => {
    // Load history from local storage on mount
    const saved = localStorage.getItem('resume-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveToHistory = (result: OptimizationResult) => {
    const updated = [result, ...history];
    setHistory(updated);
    localStorage.setItem('resume-history', JSON.stringify(updated));
  };

  const handleCheckoutComplete = () => {
      setCurrentView(AppView.DASHBOARD);
  };

  const handleLoadHistoryItem = (item: OptimizationResult) => {
      setActiveResult(item);
      // We render ResultsView slightly differently when loading from history (just passing the data)
      // Ideally we'd navigate to DASHBOARD/RESULTS state, but for simplicity:
      setCurrentView(AppView.DASHBOARD); 
  };

  const renderContent = () => {
    // Special handling if we have an active result loaded from history and we are on dashboard
    if (currentView === AppView.DASHBOARD && activeResult) {
        return (
            <ResultsView 
                result={activeResult} 
                onReset={() => {
                    setActiveResult(null);
                }} 
            />
        );
    }

    switch (currentView) {
      case AppView.LANDING:
        return <LandingPage onGetStarted={() => setCurrentView(AppView.CHECKOUT)} />;
      case AppView.CHECKOUT:
        return <Checkout onComplete={handleCheckoutComplete} onCancel={() => setCurrentView(AppView.LANDING)} />;
      case AppView.DASHBOARD:
        return <Dashboard onSaveToHistory={saveToHistory} />;
      case AppView.HISTORY:
        return <History items={history} onLoadItem={handleLoadHistoryItem} />;
      default:
        return <LandingPage onGetStarted={() => setCurrentView(AppView.CHECKOUT)} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={(view) => {
        setCurrentView(view);
        setActiveResult(null); // Clear active history item on nav
    }}>
      {renderContent()}
    </Layout>
  );
}

export default App;
