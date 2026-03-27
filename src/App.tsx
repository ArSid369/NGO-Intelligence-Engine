import { useState } from 'react';
import InputPage from './pages/InputPage';
import ResultsPage from './pages/ResultsPage';
import { Need } from '../server/models/types';

export default function App() {
  const [need, setNeed] = useState<Need | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">N</span>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">NGO Intel Engine</span>
          </div>
        </div>
      </header>

      <main className="py-8">
        {!need ? (
          <InputPage onAnalyzeComplete={setNeed} />
        ) : (
          <ResultsPage need={need} onBack={() => setNeed(null)} />
        )}
      </main>
    </div>
  );
}
