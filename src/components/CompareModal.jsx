import React, { useState, useEffect } from 'react';
import { X, Layers, Globe, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { getActualCountryElementValue, ISO_CODES } from '../utils/safetyScoring';

const COUNTRY_FLAGS = {
  'India': '🇮🇳',
  'Sri Lanka': '🇱🇰',
  'Bangladesh': '🇧🇩',
  'Iran': '🇮🇷',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Pakistan': '🇵🇰',
  'United States': '🇺🇸',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'Italy': '🇮🇹',
  'Mexico': '🇲🇽',
  'Brazil': '🇧🇷',
  'Turkey': '🇹🇷',
  'Egypt': '🇪🇬',
  'China': '🇨🇳',
  'Syria': '🇸🇾',
  'Global': '🌐'
};

export default function CompareModal({ isOpen, onClose, foodsList, initialFoodId }) {
  const foods = foodsList || [];
  const [selectedFoodId, setSelectedFoodId] = useState(initialFoodId || foods[0]?.id);
  
  // Safely determine current food and countries before using them in initial state
  const currentFood = foods.find(f => f.id === selectedFoodId) || foods[0] || {};
  const activeCountries = currentFood.activeCountries || ['India', 'Sri Lanka', 'Bangladesh', 'Iran'];

  const [country1, setCountry1] = useState(activeCountries[0] || 'India');
  const [country2, setCountry2] = useState(activeCountries[1] || activeCountries[0] || 'Sri Lanka');

  // Sync selected food when modal opens with a new initialFoodId
  useEffect(() => {
    if (isOpen && initialFoodId) {
      setSelectedFoodId(initialFoodId);
    }
  }, [isOpen, initialFoodId]);

  // Sync active countries when food commodity changes
  useEffect(() => {
    if (currentFood && currentFood.activeCountries && currentFood.activeCountries.length > 0) {
      setCountry1(currentFood.activeCountries[0]);
      setCountry2(currentFood.activeCountries[1] || currentFood.activeCountries[0]);
    }
  }, [selectedFoodId, currentFood]);

  if (!isOpen) return null;
  if (!currentFood || !currentFood.name) return null; // Safety fallback

  const foodCommonName = currentFood.name.split(' (')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-amber-200 p-6 sm:p-8 overflow-y-auto custom-scrollbar relative shadow-2xl bg-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-300">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 font-sans">Cross-Country Provenance Comparison</h3>
              <p className="text-xs text-stone-600 font-mono">
                Compare elemental profile & safety metrics for the SAME food across different country origins
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Commodity & Country Pickers */}
        <div className="space-y-4 mb-8">
          
          {/* 1. Food Item Selector */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <label className="block text-xs font-mono text-amber-900 mb-2 font-bold flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-700" />
              1. Select Commodity / Food Item to Compare Across Origins:
            </label>
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-amber-300 text-stone-900 font-sans text-sm font-semibold focus:outline-none focus:border-amber-600"
            >
              {foods.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.activeCountries.length} Origins Available)</option>
              ))}
            </select>
          </div>

          {/* 2. Country Pickers Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <label className="block text-xs font-mono text-amber-800 mb-2 font-bold">
                Origin #1 ({foodCommonName}):
              </label>
              <select
                value={country1}
                onChange={(e) => setCountry1(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-300 text-stone-900 font-sans text-sm font-semibold focus:outline-none focus:border-amber-600"
              >
                {activeCountries.map(c => (
                  <option key={c} value={c}>{c} {COUNTRY_FLAGS[c] || '🌐'} ({ISO_CODES[c] || 'GL'})</option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <label className="block text-xs font-mono text-orange-800 mb-2 font-bold">
                Origin #2 ({foodCommonName}):
              </label>
              <select
                value={country2}
                onChange={(e) => setCountry2(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-300 text-stone-900 font-sans text-sm font-semibold focus:outline-none focus:border-orange-600"
              >
                {activeCountries.map(c => (
                  <option key={c} value={c}>{c} {COUNTRY_FLAGS[c] || '🌐'} ({ISO_CODES[c] || 'GL'})</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Comparative Matrix Table for Same Food across 2 Origins */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-600 uppercase text-[10px] bg-stone-50 font-bold">
                <th className="py-3 px-4">Trace Element</th>
                <th className="py-3 px-4 text-amber-800">{foodCommonName} ({country1} {COUNTRY_FLAGS[country1] || ''})</th>
                <th className="py-3 px-4 text-orange-800">{foodCommonName} ({country2} {COUNTRY_FLAGS[country2] || ''})</th>
                <th className="py-3 px-4">REGULATORY LIMIT / UL</th>
                <th className="py-3 px-4">PROVENANCE SAFETY VERDICT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {(currentFood.elementProfile || []).map(el => {
                const sym = el.symbol;
                const val1 = getActualCountryElementValue(el, country1, currentFood);
                const val2 = getActualCountryElementValue(el, country2, currentFood);
                const limit = el.safeLimit;
                const unit = el.unit;
                const limitType = el.limitType;

                const ESSENTIAL_MINERALS = ['Ca', 'Fe', 'K', 'Zn', 'Na', 'Rb', 'Sc'];
                const isEssential = ESSENTIAL_MINERALS.includes(sym);

                const ex1 = limit ? val1 > limit : false;
                const ex2 = limit ? val2 > limit : false;

                let verdictText = 'Equal Baseline';
                let verdictCountry = null;

                if (ex1 && !ex2) {
                  verdictText = `✓ Compliant (${country2})`;
                  verdictCountry = country2;
                } else if (ex2 && !ex1) {
                  verdictText = `✓ Compliant (${country1})`;
                  verdictCountry = country1;
                } else if (isEssential) {
                  // For essential minerals, higher concentration within safe limits = richer nutrient source
                  if (val1 > val2) {
                    verdictText = `✓ Richer Nutrient (${country1})`;
                    verdictCountry = country1;
                  } else if (val2 > val1) {
                    verdictText = `✓ Richer Nutrient (${country2})`;
                    verdictCountry = country2;
                  }
                } else {
                  // For toxic heavy metals, lower concentration = cleaner origin
                  if (val1 < val2) {
                    verdictText = `✓ Cleaner Origin (${country1})`;
                    verdictCountry = country1;
                  } else if (val2 < val1) {
                    verdictText = `✓ Cleaner Origin (${country2})`;
                    verdictCountry = country2;
                  }
                }

                return (
                  <tr key={sym} className="hover:bg-amber-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-mono text-xs font-bold">
                        {sym}
                      </span>
                      <span>{el.name || sym}</span>
                    </td>
                    <td className="py-3.5 px-4 text-amber-800 font-semibold">
                      {val1} mg/day
                    </td>
                    <td className="py-3.5 px-4 text-orange-800 font-semibold">
                      {val2} mg/day
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {limit} mg/day
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold inline-block ${
                        verdictCountry === country1 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : verdictCountry === country2
                            ? 'bg-orange-100 text-orange-900 border border-orange-300'
                            : 'bg-stone-100 text-stone-700 border border-stone-300'
                      }`}>
                        {verdictText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono text-amber-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>Cross-country comparison evaluates the same food item across different geographical harvesting origins to identify regional soil contamination & nutrient richness.</span>
        </div>

      </div>
    </div>
  );
}
