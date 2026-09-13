const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { toNodeHandler } = require("better-auth/node");
const { auth } = require("./auth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : "";

// Middleware
app.use(cors({
  origin: [frontendUrl, `${frontendUrl}/`, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Better Auth Express Integration
app.all("/api/auth/*", toNodeHandler(auth));

// Proxy endpoint for Gemini API
app.post('/api/food-profile', async (req, res) => {
  try {
    console.log('Incoming headers to /food-profile:', req.headers);
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session) {
      console.log('No session found! Returning 401.');
      return res.status(401).json({ error: 'Unauthorized. Please sign in to use this feature.' });
    }

    const { materialName } = req.body;

    if (!materialName) {
      return res.status(400).json({ error: 'Material name is required' });
    }

    // Get API keys from environment variables and trim whitespace/newlines
    const geminiApiKey = (process.env.VITE_GEMINI_API_KEY || '').trim();
    const usdaApiKey = (process.env.VITE_USDA_API_KEY || '').trim();

    if (!geminiApiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured on server' });
    }

    // For now, we'll proxy to the existing frontend logic but with secure API keys
    // In a production implementation, you would move the actual API calls here

    // List of active candidate models in order of speed and stability
    const candidateModels = [
      'gemini-flash-lite-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.6-flash'
    ];

    let geminiResponse = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`Attempting Gemini API query with model: ${modelName}...`);
        geminiResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`,
          {
            contents: [{
              parts: [{ text: `You are a food safety radiochemistry and spectrometry expert.
Analyze the food material: "${materialName}".

CRITICAL INSTRUCTIONS:
1. Identify EXACTLY the top 7 countries in the world where "${materialName}" is grown or produced.
2. Generate between 4 and 15 distinct trace elements (heavy metals, essential minerals, etc.) that are relevant and found in this food. DO NOT hardcode exactly 7 elements; vary based on scientific reality.
3. For the food, generate 6 representative laboratory analyzed samples across the top countries with their origin and region.
4. For EACH element in the profile:
   - Provide the actual element concentration in mg/kg ("concentration").
   - Provide the standard Daily Dietary Intake ("ddi" in mg/day) calculated as: concentration (mg/kg) * (defaultDailyIntakeG / 1000).
   - Provide the authoritative WHO, FAO, Codex, or UL daily permissible intake limit in mg/day ("safeLimit"). If the standard regulatory limit is originally a food concentration in mg/kg, convert it to equivalent mg/day using: limit (mg/kg) * (defaultDailyIntakeG / 1000).
   - Provide the regulatory limit source ("limitSource", e.g., "WHO/FAO Permissible Limit", "Codex Alimentarius", "Tolerable Upper Intake Level (UL)").
   - Provide realistic daily intake data (in mg/day) for ALL 7 countries inside a "countryData" object.

Use the JSON schema below as a STRUCTURAL TEMPLATE ONLY. DO NOT copy the example values! Make sure the safe limits and concentrations are scientifically realistic so they don't incorrectly trigger extreme danger warnings unless actually toxic.

Return ONLY a valid JSON object matching this structural schema exactly (no markdown formatting):
{
  "id": "food-dynamic-id",
  "name": "Actual Food Name",
  "hindiName": "Actual local name",
  "category": "Actual Category",
  "description": "Actual technical summary.",
  "defaultDailyIntakeG": 10.0,
  "activeCountries": ["Country 1", "Country 2", "Country 3", "Country 4", "Country 5", "Country 6", "Country 7"],
  "riskLevel": "Low | Moderate | High",
  "primaryAdulterants": ["Actual Adulterant 1", "Actual Adulterant 2"],
  "samples": [
    { "id": "S-1", "name": "Actual local harvest region or commercial brand", "origin": "Country 1" }
  ],
  "elementProfile": [
    { 
      "symbol": "Pb", 
      "name": "Lead", 
      "concentration": 2.5,
      "concentrationUnit": "mg/kg",
      "ddi": 0.025, 
      "unit": "mg/day", 
      "safeLimit": 0.05, 
      "limitType": "mg/day", 
      "limitSource": "WHO/FAO Maximum Permissible Limit",
      "countryData": {
        "Country 1": 0.025,
        "Country 2": 0.020,
        "Country 3": 0.035,
        "Country 4": 0.015,
        "Country 5": 0.030,
        "Country 6": 0.018,
        "Country 7": 0.028
      }
    }
  ]
}` }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 8192,
              responseMimeType: "application/json"
            }
          },
          { timeout: 20000 }
        );
        if (geminiResponse && geminiResponse.data) {
          console.log(`Successfully generated response using model: ${modelName}`);
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed or timed out:`, err.response ? err.response.data : err.message);
      }
    }

    if (!geminiResponse || !geminiResponse.data) {
      throw lastError || new Error('All Gemini model candidates failed to respond');
    }

    // Extract and return the parsed food data
    const text = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    let jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No JSON object found in Gemini response');
    }

    const jsonStr = jsonMatch[0];
    const parsedData = JSON.parse(jsonStr);

    const defaultDailyIntakeG = Number(parsedData.defaultDailyIntakeG) || 10.0;
    const consumptionKg = defaultDailyIntakeG / 1000;

    // Normalize samples array
    const samples = (parsedData.samples || parsedData.brandedSamples || parsedData.rawSamples || []).map((s, idx) => ({
      id: s.id || `S-${idx + 1}`,
      name: s.name || `Sample ${idx + 1}`,
      origin: s.origin || 'Global Market'
    }));

    // Return successful response
    res.json({
      success: true,
      data: {
        food: {
          id: `food-${parsedData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: parsedData.name,
          hindiName: parsedData.hindiName || parsedData.name,
          category: parsedData.category || 'Botanical Culinary Commodity',
          description: parsedData.description || `Elemental concentration profile and heavy metal safety metrics for ${parsedData.name}.`,
          defaultDailyIntakeG: defaultDailyIntakeG,
          activeCountries: parsedData.activeCountries || [],
          riskLevel: parsedData.riskLevel || 'Moderate',
          primaryAdulterants: parsedData.primaryAdulterants || [],
          samples: samples,
          rawSamples: samples,
          brandedSamples: samples,
          elementProfile: (parsedData.elementProfile || []).map((elem, index) => {
            // Strictly enforce DDI (mg/day) = concentration (mg/kg) * consumption (kg/day)
            let concentration = Number(elem.concentration);
            let ddiVal = Number(elem.ddi);

            if (isNaN(concentration) || concentration <= 0) {
              if (!isNaN(ddiVal) && ddiVal > 0) {
                concentration = Number((ddiVal / consumptionKg).toFixed(2));
              } else {
                concentration = 1.0;
              }
            }

            // Ensure DDI strictly matches formula: concentration * (consumptionG / 1000)
            ddiVal = Number((concentration * consumptionKg).toFixed(4));

            const safeLimit = Number(elem.safeLimit) || 1.0;
            const initialStatus = (ddiVal > safeLimit) ? 'Exceeds Limit' : (ddiVal >= safeLimit * 0.85) ? 'Near Limit' : 'Safe';
            
            return {
              ...elem,
              id: `${parsedData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-elem-${index + 1}`,
              concentration: Number(concentration.toFixed(2)),
              concentrationUnit: 'mg/kg',
              ddi: ddiVal,
              unit: 'mg/day',
              safeLimit: safeLimit,
              limitType: 'mg/day',
              limitSource: elem.limitSource || 'WHO/FAO Permissible Limit',
              status: initialStatus
            };
          })
        },
        source: {
          id: `src-ai-${Date.now()}`,
          title: `AI-Generated Profile for ${parsedData.name}`,
          authors: 'Food Intelligence Lab AI Analysis',
          year: 2024,
          journal: 'AI-Generated Food Safety Profile',
          doi: `NEI-AI-2024-${Date.now() % 9000 + 1000}`,
          url: '#',
          country: 'Multiple',
          trustTier: 'Tier 3',
          method: 'Google Gemini AI Analysis (via Backend Proxy)',
          isLiveScraped: false
        },
        isAiGenerated: true
      }
    });
  } catch (error) {
    const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error('Error in food profile proxy:', errorDetails);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch food profile',
      details: `Axios Error: ${error.message} - API Response: ${errorDetails}`
    });
  }
});

// --- Admin Middleware ---
async function requireAdmin(req, res, next) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Check if the user's role is admin
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    
    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// --- Inquiry Routes ---
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, topic, message } = req.body;
    if (!name || !email || !topic || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const inquiry = await prisma.inquiry.create({
      data: { name, email, topic, message }
    });

    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// --- Admin Routes ---
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.patch('/api/admin/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (role !== 'admin' && role !== 'user') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Prevent self-demotion
    if (id === req.adminUser.id && role === 'user') {
      return res.status(400).json({ error: 'You cannot demote yourself' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

app.get('/api/admin/inquiries', requireAdmin, async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ inquiries });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

app.patch('/api/admin/inquiries/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { status }
    });
    
    res.json({ success: true, inquiry: updatedInquiry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inquiry status' });
  }
});


// Root route handler - redirect to frontend app UI
app.get('/', (req, res) => {
  res.redirect(frontendUrl || 'http://localhost:3000');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Proxying API requests to external services`);
});