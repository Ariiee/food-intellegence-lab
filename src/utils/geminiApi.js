// Multi-API Food Intelligence Fetcher
// Integrates:
// 1. Open Food Facts API (Free, unlimited real market brand search)
// 2. USDA FoodData Central API (Free government composition DB)
// 3. Google Gemini AI API (Handled via backend proxy - API key NOT exposed in frontend)

// IMPORTANT: API keys should be handled through your backend proxy.
// The frontend communicates with your own backend endpoints which
// securely handle the API keys and make requests to external services.

const getBackendApiUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_API_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/$/, "")}/api`;
  }
  return '/api';
};
const BACKEND_API_URL = getBackendApiUrl();
const OPEN_FOOD_FACTS_URL = 'https://world.openfoodfacts.org/cgi/search.pl';
const USDA_API_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

/**
 * Real-time fetch from Open Food Facts API for authentic commercial brand names worldwide
 * NOTE: Open Food Facts is free and doesn't require an API key, so direct access is acceptable
 */
export async function fetchOpenFoodFactsBrands(materialName) {
  try {
    const url = `${OPEN_FOOD_FACTS_URL}?search_terms=${encodeURIComponent(materialName)}&search_simple=1&action=process&json=1&page_size=8`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const products = data.products || [];

    const brandSamples = products.map((prod, idx) => {
      const brandName = prod.brands || prod.product_name || `Commercial Brand ${idx + 1}`;
      const prodName = prod.product_name || `${materialName} Packaged Item`;
      const originCountry = prod.countries || prod.origin || 'Global Market';

      return {
        id: `OFF-B${idx + 1}`,
        name: `${brandName} - ${prodName}`,
        origin: originCountry.split(',')[0].trim() || 'Global Market',
        isLiveScraped: true
      };
    }).filter(b => b.name);

    return brandSamples.slice(0, 8);
  } catch (e) {
    console.warn('Open Food Facts API fetch notice:', e);
    return [];
  }
}

/**
 * Real-time fetch from USDA FoodData Central API
 * NOTE: In production, replace this with a call to your backend endpoint
 * that securely handles the USDA API key
 */
export async function fetchUsdaFoodData(materialName) {
  try {
    // WARNING: This is for development only!
    // In production, REPLACE THIS and use a backend proxy instead
    console.warn('WARNING: Using frontend USDA API key is insecure! Use a backend proxy.');
    const usdaKey = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY';
    const url = `${USDA_API_URL}?query=${encodeURIComponent(materialName)}&pageSize=5&api_key=${usdaKey}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.foods || [];
  } catch (e) {
    console.warn('USDA API fetch notice:', e);
    return null;
  }
}

/**
 * Main Multi-API Material Extractor
 * NOTE: In production, replace these direct API calls with calls to your own backend endpoints
 * that securely handle the API keys.
 */
export async function fetchFoodProfileWithGemini(materialName) {
  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/food-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ materialName })
    });

    if (backendResponse.ok) {
      const backendData = await backendResponse.json();
      if (backendData.success && backendData.data) {
        return backendData.data;
      } else {
        throw new Error(backendData.message || backendData.details || backendData.error || "Failed to parse backend data");
      }
    } else {
      // Try to parse the error body if it exists
      let errorMessage = `Backend rejected the request. Status: ${backendResponse.status}`;
      try {
        const errorData = await backendResponse.json();
        if (errorData.details || errorData.error) {
          errorMessage = `Backend Error: ${errorData.details || errorData.error}`;
        }
      } catch (e) {
        // Ignore JSON parsing errors for error body
      }
      throw new Error(errorMessage);
    }
  } catch (backendError) {
    console.error('Backend proxy unavailable or failed:', backendError);
    alert(`Gemini AI Backend is disconnected or failed!\n\nError: ${backendError.message}\n\nPlease make sure your backend server is running on port 3000 and your Gemini API key is properly configured in the backend .env file. The app will NOT use fake fallback data anymore.`);
    return null;
  }
}