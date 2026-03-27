import { Need, Volunteer, MatchResult } from '../models/types.js';

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Simple Euclidean distance for mock purposes, scaled to a reasonable "distance" score
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)) * 100;
}

export function matchVolunteer(need: Need, volunteers: Volunteer[]): MatchResult[] {
  const urgencyScores = { 'high': 3, 'medium': 2, 'low': 1 };
  const urgencyScore = urgencyScores[need.urgency] || 1;

  const results: MatchResult[] = volunteers.map(volunteer => {
    // Skill match: 1 if volunteer has a skill related to the need type, 0 otherwise
    const skillMatch = volunteer.skills.some(skill => 
      skill.toLowerCase().includes(need.need_type.toLowerCase()) || 
      (need.need_type === 'medical' && skill.toLowerCase().includes('first aid')) ||
      (need.need_type === 'food' && skill.toLowerCase().includes('cooking')) ||
      (need.need_type === 'shelter' && skill.toLowerCase().includes('construction'))
    ) ? 1 : 0;

    const distance = calculateDistance(need.lat || 0, need.lng || 0, volunteer.lat, volunteer.lng);

    // score = (urgency_score * 3) + (skill_match * 2) - distance
    const score = (urgencyScore * 3) + (skillMatch * 2) - (distance / 10); // Scale distance down so it doesn't overpower

    return {
      volunteer_id: volunteer.id,
      score: score
    };
  });

  // Sort by highest score
  results.sort((a, b) => b.score - a.score);
  return results;
}
