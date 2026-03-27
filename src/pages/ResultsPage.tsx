import { useState, useEffect } from 'react';
import { Need, Volunteer, MatchResult } from '../../server/models/types';
import { matchVolunteers, explainMatch, getVolunteers } from '../services/api';
import Map from '../components/Map';
import { ArrowLeft, CheckCircle2, Loader2, MapPin, Users, AlertCircle, Info } from 'lucide-react';

interface ResultsPageProps {
  need: Need;
  onBack: () => void;
}

export default function ResultsPage({ need, onBack }: ResultsPageProps) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [assignedId, setAssignedId] = useState<number | undefined>();
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial volunteers
    getVolunteers().then(setVolunteers).catch(console.error);
  }, []);

  const handleAllocate = async () => {
    setLoading(true);
    try {
      const { matches, volunteers } = await matchVolunteers(need);
      setMatches(matches);
      setVolunteers(volunteers);
      
      if (matches.length > 0) {
        const topMatch = matches[0];
        setAssignedId(topMatch.volunteer_id);
        
        const exp = await explainMatch(topMatch.volunteer_id, need);
        setExplanation(exp);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const urgencyColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Input
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Need Details & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Structured Need Data
            </h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500 block mb-1">Location</span>
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {need.location}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Type</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {need.need_type}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Urgency</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${urgencyColors[need.urgency]}`}>
                    {need.urgency}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-500 block mb-1">People Affected</span>
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <Users className="w-4 h-4 text-gray-400" />
                  {need.people}
                </div>
              </div>
            </div>

            <button
              onClick={handleAllocate}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {loading ? 'Running Allocation...' : 'Allocate Resources'}
            </button>
          </div>

          {/* Explanation Card */}
          {explanation && (
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
              <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" /> AI Decision Explanation
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                {explanation}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Map & Results */}
        <div className="lg:col-span-2 space-y-6">
          <Map need={need} volunteers={volunteers} assignedVolunteerId={assignedId} />
          
          {matches.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900">Allocation Results</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {matches.map((match, idx) => {
                  const v = volunteers.find(v => v.id === match.volunteer_id);
                  if (!v) return null;
                  const isAssigned = assignedId === v.id;
                  
                  return (
                    <div key={v.id} className={`p-4 flex items-center justify-between transition-colors ${isAssigned ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isAssigned ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {v.name}
                            {isAssigned && <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Assigned</span>}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {v.location} • Skills: {v.skills.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{match.score.toFixed(1)}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Match Score</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
