import { Need, Volunteer, MatchResult } from '../../server/models/types.js';

export async function analyzeText(text: string): Promise<Need> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function matchVolunteers(need: Need): Promise<{ matches: MatchResult[], volunteers: Volunteer[] }> {
  const res = await fetch('/api/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ need })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function explainMatch(volunteer_id: number, need: Need): Promise<string> {
  const res = await fetch('/api/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ volunteer_id, need })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.explanation;
}

export async function getVolunteers(): Promise<Volunteer[]> {
  const res = await fetch('/api/volunteers');
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
