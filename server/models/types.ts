export interface Need {
  location: string;
  need_type: 'food' | 'medical' | 'shelter' | 'other';
  people: number;
  urgency: 'low' | 'medium' | 'high';
  lat?: number;
  lng?: number;
}

export interface Volunteer {
  id: number;
  name: string;
  location: string;
  skills: string[];
  lat: number;
  lng: number;
}

export interface MatchResult {
  volunteer_id: number;
  score: number;
  reason?: string;
}
