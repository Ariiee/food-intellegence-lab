import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Trophy, Info, Award, HelpCircle, Activity } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  evaluateAndRankCountryOrigins, 
  generateDynamicVerdictText, 
  getActualCountryElementValue,
  ISO_CODES,
  WEIGHTS
} from '../utils/safetyScoring';

const COUNTRY_FLAGS = {
  'India': '🇮🇳',
  'China': '🇨🇳',
  'United States': '🇺🇸',
  'Japan': '🇯🇵',
  'Spain': '🇪🇸',
  'South Korea': '🇰🇷',
  'Turkey': '🇹🇷',
  'Egypt': '🇪🇬',
  'Sri Lanka': '🇱🇰',
  'Bangladesh': '🇧🇩',
  'Iran': '🇮🇷',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Pakistan': '🇵🇰',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'Italy': '🇮🇹',
  'Mexico': '🇲🇽',
  'Brazil': '🇧🇷',
  'Syria': '🇸🇾',
  'Myanmar': '🇲🇲',
  'Nigeria': '🇳🇬',
  'Indonesia': '🇮🇩',
  'France': '🇫🇷',
  'Russia': '🇷🇺',
  'United Arab Emirates': '🇦🇪',
  'Global': '🌐'
};

const RADAR_COLORS = ['#D97706', '#DC2626', '#059669', '#2563EB', '#7C3AED'];

export default function CountryComparison({ foodsList, foodId }) {
  const foods = foodsList || [];
  const currentFood = foods.find(f => f.id === foodId) || foods[0];

  const [selectedElement, setSelectedElement] = useState(currentFood?.elementProfile[0]?.symbol || 'Ba');
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Sync selected element whenever active food commodity changes
  useEffect(() => {
    if (currentFood && currentFood.elementProfile && currentFood.elementProfile.length > 0) {
      setSelectedElement(currentFood.elementProfile[0].symbol);
    }
  }, [foodId, currentFood?.id]);

  const activeCountries = currentFood.activeCountries || ['India', 'Sri Lanka', 'Bangladesh', 'Iran'];

  // Scientific Evaluation Engine: Evaluate and rank every active origin dynamically from the dataset
  const rankedCountries = evaluateAndRankCountryOrigins(activeCountries, currentFood);
  const rankOneCountry = rankedCountries[0] || {};
  const verdictParagraph = generateDynamicVerdictText(rankOneCountry, currentFood.name);

  // Dynamically compute Radar chart data for top active countries
  const radarData = (currentFood.elementProfile || []).slice(0, 6).map(e => {
    const item = { element: `${e.name || e.symbol} (${e.symbol})`, limit: e.safeLimit };
    activeCountries.forEach(c => {
      item[c] = getActualCountryElementValue(e, c, currentFood);
    });
    return item;
  });

  // Dynamic country comparison table for the selected element
  const getElementComparison = (symbol) => {
    const el = currentFood.elementProfile.find(e => e.symbol === symbol);
    if (!el) return [];

    return rankedCountries.map(cItem => {
      const val = getActualCountryElementValue(el, cItem.country, currentFood);
      const numVal = typeof val === 'number' ? val : parseFloat(val);
      const isExceeded = numVal > el.safeLimit;

      return {
        country: `${cItem.country} ${COUNTRY_FLAGS[cItem.country] || '🌐'}`,
        countryName: cItem.country,
        rank: cItem.rank,
        value: val,
        paper: `${currentFood.seedPaper}`,
        status: isNaN(numVal) ? 'No Data' : (isExceeded ? 'Exceeds Limit' : 'Safe')
      };
    });
  };

  const currentElementDetails = currentFood.elementProfile.find(e => e.symbol === selectedElement) || currentFood.elementProfile[0] || {};
  const countryComparisonList = getElementComparison(selectedElement);

  return (
    <section id="country-matrix" className="py-24 relative z-20 bg-[#FDFBF7] border-t border-amber-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs mb-4 font-semibold">
            <span>03</span>
            <span className="text-amber-500">/</span>
            <span>DATA-DRIVEN COUNTRY SAFETY MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mb-4 font-sans">
            Provenance & Country Safety Matrix for {currentFood.name}
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl font-light">
            Reproducible safety indices, regulatory WHO/FAO compliance rates, heavy metal indices, and mineral quality rankings computed for <strong className="text-stone-900 font-semibold">{currentFood.name}</strong> origins.
          </p>
        </div>

        {/* Top Summary Banner - Dynamic Rank #1 Verdict */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-300 mb-12 relative overflow-hidden bg-gradient-to-r from-amber-50 via-white to-orange-50 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-amber-500 text-white shadow-md flex-shrink-0 flex items-center justify-center font-mono font-extrabold text-xl">
                #1
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-amber-800 font-bold uppercase tracking-wider">Computed Safety Verdict</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] border border-emerald-300 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    Data-Driven Ranking
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-sans mb-1">
                  Rank #1 Origin for {currentFood.name.split(' (')[0]}: {rankOneCountry.country} {COUNTRY_FLAGS[rankOneCountry.country] || ''}
                </h3>
                <p className="text-stone-700 text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
                  {verdictParagraph}
                </p>
              </div>
            </div>

            {/* Country Ranking Overview Pills */}
            <div className="flex flex-wrap items-center gap-3">
              {rankedCountries.slice(0, 4).map((cItem) => (
                <div key={cItem.country} className="text-center px-4 py-3 rounded-2xl bg-white border border-amber-200 shadow-sm relative group">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      #{cItem.rank}
                    </span>
                    <span className="text-xs font-mono text-stone-500">{ISO_CODES[cItem.country] || 'GL'}</span>
                  </div>
                  <p className="text-xs font-bold text-stone-800 font-sans">{cItem.country} {COUNTRY_FLAGS[cItem.country] || ''}</p>
                  <p className="text-base font-extrabold text-amber-700 font-mono mt-0.5">{cItem.overallScore}<span className="text-[10px] text-stone-500 font-normal">/100</span></p>
                  <p className="text-[9px] font-mono text-stone-500">Overall Score</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scientifically Calculated Country Profile Cards */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-stone-900 font-sans flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-700" />
            Origin Safety Profiles & Index Cards
          </h3>
          
          <div className="relative font-mono text-xs text-stone-600 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Formula: 40% WHO + 30% Heavy Metals + 20% Minerals + 10% Confidence</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {rankedCountries.map((cItem) => {
            const isRankOne = cItem.rank === 1;

            return (
              <div 
                key={cItem.country}
                className={`glass-panel p-6 rounded-2xl border transition-all bg-white shadow-sm relative flex flex-col justify-between ${
                  isRankOne ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-amber-200/90 hover:border-amber-400'
                }`}
              >
                <div>
                  {/* Top Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{COUNTRY_FLAGS[cItem.country] || '🌐'}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-base font-bold text-stone-900 font-sans">{cItem.country}</h4>
                          <span className="text-[10px] font-mono font-bold text-stone-600 px-1 py-0.2 rounded bg-stone-100">
                            {cItem.isoCode}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-500">
                          {cItem.sampleCount} Sample{cItem.sampleCount !== 1 ? 's' : ''} Ingested
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-extrabold shadow-xs ${
                      isRankOne ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      #{cItem.rank}
                    </span>
                  </div>

                  {/* Confidence Badge */}
                  <div className="mb-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border inline-flex items-center gap-1 ${cItem.confidenceBadgeClass}`}>
                      {cItem.sampleCount < 3 && <AlertTriangle className="w-3 h-3 text-rose-700" />}
                      {cItem.confidenceLevel} ({cItem.sampleCount} N)
                    </span>
                  </div>

                  {/* Overall Score Highlight */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-stone-600 uppercase font-bold tracking-wider">Overall Safety Score</p>
                      <p className="text-2xl font-extrabold text-stone-900 font-mono">{cItem.overallScore}<span className="text-xs text-stone-500 font-normal"> / 100</span></p>
                    </div>
                    {isRankOne && (
                      <Trophy className="w-7 h-7 text-amber-600" />
                    )}
                  </div>

                  {/* Metrics List */}
                  <div className="space-y-2.5 text-xs font-mono border-t border-stone-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600 flex items-center gap-1">
                        WHO Compliance
                        <span className="text-[10px] text-stone-600">({cItem.passedCount}/{cItem.totalTested})</span>
                      </span>
                      <span className="font-bold text-emerald-700">{cItem.whoCompliancePct}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-600">Heavy Metal Safety</span>
                      <span className="font-bold text-stone-900">{cItem.heavyMetalScore} / 100</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-600">Mineral Quality Index</span>
                      <span className="font-bold text-amber-800">{cItem.mineralScore} / 100</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-600">Confidence Score</span>
                      <span className="font-semibold text-stone-700">{cItem.confidenceScore} / 100</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-stone-200 text-[10px] font-mono text-stone-500 flex items-center justify-between">
                  <span className="truncate">Standard: {currentFood.seedPaper}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Breakdown Table & Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-amber-200/90 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-sans">
                  Element Breakdown across Active Origins for {currentFood.name.split(' (')[0]}
                </h3>
                <p className="text-xs text-stone-600 font-mono">
                  Select an element to compare reported concentrations across active origins.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200">
                {currentFood.elementProfile.map(e => (
                  <button
                    key={e.symbol}
                    onClick={() => setSelectedElement(e.symbol)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      selectedElement === e.symbol
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    {e.symbol}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Rank & Origin</th>
                    <th className="py-3 px-4">Daily Intake ({selectedElement})</th>
                    <th className="py-3 px-4">WHO/FAO Limit</th>
                    <th className="py-3 px-4">Safety Verdict</th>
                    <th className="py-3 px-4">Safety Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {countryComparisonList.map((row, i) => (
                    <tr key={i} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-stone-900 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">#{row.rank}</span>
                        {row.country}
                      </td>
                      <td className="py-4 px-4 text-amber-800 font-semibold">
                        {typeof row.value === 'number' ? `${row.value} mg/day` : row.value}
                      </td>
                      <td className="py-4 px-4 text-stone-700">
                        {currentElementDetails.safeLimit || 1.0} mg/day
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1 ${
                          row.status === 'Exceeds Limit'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : row.status === 'Safe'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-stone-100 text-stone-600'
                        }`}>
                          {row.status === 'Exceeds Limit' && <AlertTriangle className="w-3 h-3" />}
                          {row.status === 'Safe' && <CheckCircle2 className="w-3 h-3" />}
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-stone-500 text-[11px] truncate max-w-[200px]">
                        {currentFood.seedPaper}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-amber-200/90 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-sans mb-1">
                Multi-Element Regional Radar
              </h3>
              <p className="text-xs text-stone-600 font-mono mb-6">
                Normalized trace element comparison for {currentFood.name.split(' (')[0]}.
              </p>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#E6DCCB" />
                    <PolarAngleAxis dataKey="element" stroke="#44403C" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#78716C" />
                    {activeCountries.slice(0, 4).map((c, idx) => (
                      <Radar key={c} name={`${c} ${COUNTRY_FLAGS[c] || ''}`} dataKey={c} stroke={RADAR_COLORS[idx % RADAR_COLORS.length]} fill={RADAR_COLORS[idx % RADAR_COLORS.length]} fillOpacity={0.25} />
                    ))}
                    <Tooltip contentStyle={{ backgroundColor: '#FDFBF7', borderColor: '#D97706', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-mono flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Rankings update dynamically as new food sample assays are ingested.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
