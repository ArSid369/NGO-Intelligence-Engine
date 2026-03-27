import { useState } from 'react';
import { analyzeText } from '../services/api';
import { Need } from '../../server/models/types';
import { Loader2, AlertTriangle } from 'lucide-react';

interface InputPageProps {
  onAnalyzeComplete: (need: Need) => void;
}

export default function InputPage({ onAnalyzeComplete }: InputPageProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const need = await analyzeText(text);
      onAnalyzeComplete(need);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = () => {
    setText("URGENT: Major flooding reported in Downtown area. Approximately 50 people are stranded and require immediate medical assistance and shelter. Water levels rising rapidly.");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">NGO Intelligence Engine</h1>
        <p className="text-gray-600">Smart Resource Allocation System</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Raw NGO Report
        </label>
        <textarea
          className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Paste unstructured text from field agents here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Analyzing...' : 'Analyze & Structure Data'}
          </button>
          <button
            onClick={handleSimulate}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Simulate Crisis
          </button>
        </div>
      </div>
    </div>
  );
}
