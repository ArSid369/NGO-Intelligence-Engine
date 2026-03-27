import express from 'express';
import { analyzeNeedText, explainDecision } from '../services/gemini_service.js';
import { matchVolunteer } from '../services/matching_service.js';
import { Need, Volunteer } from '../models/types.js';

const router = express.Router();

router.use(express.json());

// Mock Volunteers Data
const MOCK_VOLUNTEERS: Volunteer[] = [
  { id: 1, name: "Alice Smith", location: "Downtown", skills: ["first aid", "medical"], lat: 40.7128, lng: -74.0060 },
  { id: 2, name: "Bob Jones", location: "Uptown", skills: ["cooking", "food distribution"], lat: 40.7300, lng: -73.9900 },
  { id: 3, name: "Charlie Brown", location: "Westside", skills: ["construction", "shelter"], lat: 40.7500, lng: -74.0200 },
  { id: 4, name: "Diana Prince", location: "Eastside", skills: ["logistics", "other"], lat: 40.7200, lng: -73.9800 },
];

// Simple geocoding mock
function geocodeLocation(location: string) {
  // Return random coordinates around NYC for mock purposes
  return {
    lat: 40.7 + (Math.random() * 0.1 - 0.05),
    lng: -74.0 + (Math.random() * 0.1 - 0.05)
  };
}

router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    const needData = await analyzeNeedText(text);
    
    // Add mock coordinates based on location
    const coords = geocodeLocation(needData.location);
    needData.lat = coords.lat;
    needData.lng = coords.lng;

    res.json(needData);
  } catch (error: any) {
    console.error("Analyze Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/match', (req, res) => {
  try {
    const { need } = req.body;
    if (!need) {
      return res.status(400).json({ error: "Need data is required" });
    }
    const matches = matchVolunteer(need, MOCK_VOLUNTEERS);
    res.json({ matches, volunteers: MOCK_VOLUNTEERS });
  } catch (error: any) {
    console.error("Match Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/explain', async (req, res) => {
  try {
    const { volunteer_id, need } = req.body;
    if (!volunteer_id || !need) {
      return res.status(400).json({ error: "volunteer_id and need are required" });
    }
    const volunteer = MOCK_VOLUNTEERS.find(v => v.id === volunteer_id);
    if (!volunteer) {
      return res.status(404).json({ error: "Volunteer not found" });
    }
    
    const explanation = await explainDecision(volunteer, need);
    res.json({ explanation });
  } catch (error: any) {
    console.error("Explain Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/volunteers', (req, res) => {
  res.json(MOCK_VOLUNTEERS);
});

export default router;
