import React, { useState } from 'react';
import { ELEMENTS_MASTER } from '../data/constants';
import { Search, ShieldCheck, AlertTriangle, CheckCircle2, Info, BarChart2, BookOpen, Atom, Sparkles, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function TraceElementEngine({ foodsList, selectedFoodId, onFoodChange, onCompareClick, scrapedHighlightId }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const foods = foodsList || [];
  const currentFood = foods.find(f => f.id === selectedFoodId) || foods[0];

  const filteredElements = currentFood.elementProfile.filter(item => {
    const masterInfo = ELEMENTS_MASTER.find(e => e.symbol === item.symbol) || {};
    const matchesSearch = item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (masterInfo.name && masterInfo.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (categoryFilter === 'toxic') return masterInfo.category?.includes('Toxic') || item.status === 'Exceeds Limit';
    if (categoryFilter === 'essential') return masterInfo.category?.includes('Essential');
    if (categoryFilter === 'rare') return masterInfo.category?.includes('Rare');
    return true;
  });

  const baselineG = currentFood.defaultDailyIntakeG || 10.0;
  const consumptionKg = baselineG / 1000;

  const chartData = currentFood.elementProfile.map(item => {
    const ddi = typeof item.ddi === 'number' ? item.ddi : (parseFloat(item.ddi) || (parseFloat(item.concentration) * consumptionKg) || 0);
    const concentration = typeof item.concentration === 'number' ? item.concentration : (parseFloat(item.concentration) || (consumptionKg > 0 ? ddi / consumptionKg : 0));
    const safeLimit = typeof item.safeLimit === 'number' ? item.safeLimit : parseFloat(item.safeLimit) || 0;

    return {
      symbol: item.symbol,
      DDI: Number(ddi.toFixed(4)),
      Concentration: Number(concentration.toFixed(2)),
      SafeLimit: Number(safeLimit.toFixed(4)),
      unit: item.unit || 'mg/day'
    };
  });

  const allSamples = currentFood.samples || [
    ...(currentFood.rawSamples || []),
    ...(currentFood.brandedSamples || [])
  ];

  return (
    <section id="trace-engine" className="py-24 relative z-20 bg-[#FAF7F2] border-t border-amber-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs mb-4 font-semibold">
              <span>02</span>
              <span className="text-amber-500">/</span>
              <span>TRACE ELEMENT ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mb-3 font-sans">
              Elemental Profile & Trace Elements
            </h2>
            <p className="text-stone-600 text-base max-w-xl font-light">
              Explore {currentFood.elementProfile.length} targeted minor and trace element concentrations digitized specifically for {currentFood.name}.
            </p>
          </div>

          {/* Food Selector */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-amber-200 shadow-sm">
            {foods.map(food => (
              <button
                key={food.id}
                onClick={() => onFoodChange(food.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  food.id === currentFood.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-amber-50'
                }`}
              >
                <span>{food.name.split(' (')[0]}</span>
                <span className="text-[10px] font-mono opacity-80">({food.elementProfile?.length || 0} Elements)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Food Overview Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-200/90 mb-10 relative overflow-hidden bg-white/90">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 font-sans">{currentFood.name}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                  {currentFood.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                  🔬 {currentFood.elementProfile.length} Measured Elements
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-stone-100 text-stone-700 border border-stone-200">
                  {allSamples.length} Samples Analyzed
                </span>
              </div>
              <p className="text-stone-700 text-sm font-light leading-relaxed max-w-3xl mb-4">
                {currentFood.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-stone-500 font-semibold mr-2">Key Adulteration Risks:</span>
                {currentFood.primaryAdulterants.map((adj, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
                    ⚠️ {adj}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onCompareClick}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs border border-amber-700 flex items-center gap-2 transition-all shadow-sm"
              >
                <Layers className="w-4 h-4" />
                Cross-Country Comparison
              </button>
            </div>
          </div>
        </div>

        {/* View Toggles & Search Bar Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-amber-600 text-white'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              Element Grid
            </button>
            <button
              onClick={() => setActiveTab('intake_chart')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'intake_chart'
                  ? 'bg-amber-600 text-white'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Intake & Limit Chart
            </button>
            <button
              onClick={() => setActiveTab('samples_list')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'samples_list'
                  ? 'bg-amber-600 text-white'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Sample Registry ({allSamples.length})
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter elements (e.g. Cr, Fe)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-xl glass-input w-64 focus:w-72 transition-all font-mono border-amber-200"
                />
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200 text-xs font-mono shadow-sm">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1 rounded-lg font-semibold ${categoryFilter === 'all' ? 'bg-amber-100 text-amber-900' : 'text-stone-600'}`}
                >
                  All ({currentFood.elementProfile.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('toxic')}
                  className={`px-3 py-1 rounded-lg font-semibold ${categoryFilter === 'toxic' ? 'bg-rose-100 text-rose-900' : 'text-stone-600'}`}
                >
                  High Risk
                </button>
                <button
                  onClick={() => setCategoryFilter('essential')}
                  className={`px-3 py-1 rounded-lg font-semibold ${categoryFilter === 'essential' ? 'bg-emerald-100 text-emerald-900' : 'text-stone-600'}`}
                >
                  Essential
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Methodological Baseline Consumption Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs font-mono text-amber-900 mb-8 flex items-center gap-3 shadow-xs">
          <Info className="w-5 h-5 text-amber-700 flex-shrink-0" />
          <div>
            <span className="font-bold">DDI Calculation Standard:</span> Daily Dietary Intake is calculated using <span className="font-bold underline">DDI (mg/day) = Element concentration (mg/kg) × Food consumption ({baselineG} g/day = {consumptionKg} kg/day)</span> for {currentFood.name.split(' (')[0]}.
            <span className="text-stone-600 ml-1 font-normal">(Concentrations are in mg/kg; intake and regulatory reference values are in mg/day).</span>
          </div>
        </div>

        {/* TAB 1: Element Grid */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElements.map((el, i) => {
              const masterInfo = ELEMENTS_MASTER.find(e => e.symbol === el.symbol) || {};
              
              // Consistent DDI and concentration derivation
              const ddiVal = el.ddi !== undefined && el.ddi !== null 
                ? Number(el.ddi) 
                : (el.concentration ? Number((el.concentration * consumptionKg).toFixed(4)) : 0);
              
              const concentrationVal = el.concentration !== undefined && el.concentration !== null 
                ? Number(el.concentration) 
                : (consumptionKg > 0 ? Number((ddiVal / consumptionKg).toFixed(2)) : 0);

              const limitVal = el.safeLimit || 1.0;
              const ratio = ddiVal / limitVal;

              let calculatedStatus = 'Safe';
              if (ratio > 1.0) {
                calculatedStatus = 'Exceeds Limit';
              } else if (ratio >= 0.85) {
                calculatedStatus = 'Near Limit';
              } else {
                calculatedStatus = 'Safe';
              }

              const isExceeded = calculatedStatus === 'Exceeds Limit';
              const isNearLimit = calculatedStatus === 'Near Limit';

              const sourceLabel = el.limitSource || 'WHO/FAO Permissible Intake Limit';

              return (
                <div 
                  key={i}
                  className={`glass-panel p-6 rounded-2xl border transition-all duration-300 relative group hover:-translate-y-1 bg-white/90 ${
                    isExceeded 
                      ? 'border-rose-300 bg-rose-50/40 shadow-sm' 
                      : isNearLimit 
                        ? 'border-amber-300 bg-amber-50/40 shadow-sm'
                        : 'border-amber-200/80 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl font-bold font-mono text-amber-900 group-hover:scale-105 transition-transform shadow-sm">
                        {el.symbol}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-stone-900 font-sans">{masterInfo.name || el.symbol}</h4>
                        <span className="text-[11px] font-mono text-stone-500">{masterInfo.category || 'Trace Mineral'}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1 ${
                      isExceeded 
                        ? 'bg-rose-100 text-rose-900 border border-rose-300' 
                        : isNearLimit 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {isExceeded && <AlertTriangle className="w-3 h-3 text-rose-700" />}
                      {isNearLimit && <Info className="w-3 h-3 text-amber-700" />}
                      {!isExceeded && !isNearLimit && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                      {calculatedStatus}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs font-mono mb-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600">Calculated DDI:</span>
                      <span className="font-semibold text-amber-900">{ddiVal} mg/day</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-600">Element Concentration:</span>
                      <span className="font-semibold text-stone-900">{concentrationVal} mg/kg</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                      <span className="text-stone-600 text-[11px]">{sourceLabel}:</span>
                      <span className="font-semibold text-stone-800">{el.safeLimit} mg/day</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-2 border-t border-stone-200">
                    <span className="flex items-center gap-1 text-stone-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      {el.isLiveUpdated ? 'Live Pipeline Verified' : 'Tier 1 • Verified Standard'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: Intake & Regulatory Limit Chart */}
        {activeTab === 'intake_chart' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-200/90 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-sans mb-1">
                  Daily Dietary Intake & WHO/FAO Permissible Limit Overview
                </h3>
                <p className="text-xs text-stone-600 font-mono">
                  Quantification of DDI (mg/day) across {currentFood.elementProfile.length} elements in {currentFood.name} vs. regulatory safety limits.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-600 rounded"></div>
                  <span className="text-stone-800 font-semibold">Calculated DDI (mg/day)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-600 rounded"></div>
                  <span className="text-stone-800 font-semibold">WHO Safe Limit (mg/day)</span>
                </div>
              </div>
            </div>

            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DCCB" opacity={0.8} />
                  <XAxis dataKey="symbol" stroke="#44403C" fontStyle="mono" tickLine={false} />
                  <YAxis stroke="#44403C" fontStyle="mono" tickLine={false} scale="log" domain={['auto', 'auto']} allowDataOverflow />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FDFBF7', borderColor: '#D97706', borderRadius: '12px', color: '#1C1917' }}
                    formatter={(value, name) => [`${value} mg/day`, name === 'DDI' ? 'Calculated DDI' : 'WHO Safe Limit']}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="DDI" fill="#D97706" radius={[4, 4, 0, 0]} name="Calculated DDI (mg/day)" />
                  <Bar dataKey="SafeLimit" fill="#059669" radius={[4, 4, 0, 0]} name="Regulatory Limit (mg/day)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 3: Sample Registry */}
        {activeTab === 'samples_list' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-200/90 bg-white">
            <h3 className="text-lg font-bold text-stone-900 mb-6 flex items-center gap-2 font-sans">
              <span className="w-3 h-3 rounded-full bg-amber-600"></span>
              Analyzed Food Samples ({allSamples.length} Registered Assays)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allSamples.map(sample => (
                <div 
                  key={sample.id} 
                  className={`p-4 rounded-xl flex items-center justify-between transition-all ${
                    sample.isLiveScraped || sample.id === scrapedHighlightId
                      ? 'bg-amber-50 border-2 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                      : 'bg-stone-50 border border-stone-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-amber-800 font-bold">{sample.id}</span>
                      {sample.isLiveScraped && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-600 text-white uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> LIVE SCRAPED
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-stone-900">{sample.name}</span>
                  </div>
                  <span className="text-xs font-mono bg-white px-2.5 py-1 rounded text-stone-600 border border-stone-200">
                    {sample.origin}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
