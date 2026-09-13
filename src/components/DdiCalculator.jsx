import React, { useState, useEffect } from 'react';
import { ELEMENTS_MASTER, ELEMENT_DISEASES } from '../data/constants';
import { Calculator, ShieldAlert, CheckCircle2, AlertTriangle, Info, Sliders, Zap, HeartPulse } from 'lucide-react';

export default function DdiCalculator({ foodsList, foodId }) {
  const foods = foodsList || [];
  const currentFood = foods.find(f => f.id === foodId) || foods[0];

  const isStapleFood = currentFood.category?.toLowerCase().includes('staple') || 
                      currentFood.category?.toLowerCase().includes('grain') ||
                      currentFood.name.toLowerCase().includes('rice') ||
                      currentFood.name.toLowerCase().includes('wheat');

  const baselineG = currentFood.defaultDailyIntakeG || (isStapleFood ? 150.0 : 10.0);
  const [dailyIntakeG, setDailyIntakeG] = useState(baselineG);
  const [selectedCountry, setSelectedCountry] = useState(currentFood.activeCountries?.[0] || 'Global');

  // Update daily intake baseline and selected country whenever selected food changes
  useEffect(() => {
    const base = currentFood.defaultDailyIntakeG || (isStapleFood ? 150.0 : 10.0);
    setDailyIntakeG(base);
    setSelectedCountry(currentFood.activeCountries?.[0] || 'Global');
  }, [foodId, currentFood]);

  const minSlider = isStapleFood ? 10 : 0.5;
  const maxSlider = isStapleFood ? 500 : 50;
  const stepSlider = isStapleFood ? 10 : 0.5;

  const consumptionKg = dailyIntakeG / 1000;
  const baselineKg = baselineG / 1000;

  const recalculatedElements = currentFood.elementProfile.map(item => {
    // 1. Determine element concentration in mg/kg
    let concentration = typeof item.concentration === 'number' ? item.concentration : parseFloat(item.concentration);
    
    if (isNaN(concentration) || concentration <= 0) {
      const baseDdi = typeof item.ddi === 'number' ? item.ddi : (parseFloat(item.ddi) || 0);
      concentration = baselineKg > 0 ? (baseDdi / baselineKg) : 0;
    }

    // 2. Adjust concentration if country-specific intake data is selected
    const countryIntake = item.countryData ? item.countryData[selectedCountry] : null;
    if (countryIntake !== null && countryIntake !== undefined) {
      concentration = baselineKg > 0 ? (Number(countryIntake) / baselineKg) : concentration;
    }

    // 3. Calculate DDI (mg/day) = Element concentration (mg/kg) * Food consumption (kg/day)
    const calculatedDDI = concentration * consumptionKg;
    const effectiveDailyLimit = item.safeLimit || 1.0;

    // Percentage of limit utilized based on configured daily consumption
    const pctOfLimit = (effectiveDailyLimit > 0)
      ? (calculatedDDI / effectiveDailyLimit) * 100
      : 0;

    let status = 'Safe';
    if (pctOfLimit > 100) {
      status = 'Exceeds Limit';
    } else if (pctOfLimit >= 85) {
      status = 'Near Limit';
    }

    // Lookup associated health risks / disease details for this element
    const diseaseInfo = ELEMENT_DISEASES[item.symbol] || {
      disease: `${item.name} Toxicity & Metabolic Imbalance`,
      details: `Excessive accumulation of ${item.name} beyond WHO safety bounds can cause physiological distress and cellular toxicity.`,
      riskCategory: 'Elemental Toxicity'
    };

    return {
      ...item,
      concentration: Number(concentration.toFixed(2)),
      calculatedDDI: Number(calculatedDDI.toFixed(4)),
      effectiveDailyLimit,
      isIntakeLimit: true,
      status,
      pctOfLimit,
      diseaseInfo
    };
  });

  const safeElements = recalculatedElements.filter(e => e.status === 'Safe');
  const exceededElements = recalculatedElements.filter(e => e.status === 'Exceeds Limit');
  const nearLimitElements = recalculatedElements.filter(e => e.status === 'Near Limit');

  const formattedDailyIntake = Number(dailyIntakeG).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const formattedConsumptionKg = Number(consumptionKg).toLocaleString('en-US', { maximumFractionDigits: 4 });

  return (
    <section id="ddi-calculator" className="py-24 relative z-20 bg-[#FAF7F2] border-t border-amber-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs mb-4 font-semibold">
            <span>04</span>
            <span className="text-amber-500">/</span>
            <span>LIVE DDI CALCULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mb-4 font-sans">
            Personalized Daily Dietary Intake (DDI) Engine
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl font-light">
            Adjust your personal daily intake for <strong className="text-stone-900 font-semibold">{currentFood.name}</strong> to dynamically calculate dietary intake using <code className="text-amber-900 bg-amber-100/70 px-1 py-0.5 rounded font-mono text-sm">DDI (mg/day) = Concentration (mg/kg) × Consumption (kg/day)</code> against WHO/FAO maximum daily safety limits.
          </p>
        </div>

        {/* Calculator Control Console */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-200/90 mb-12 relative overflow-hidden bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-6">
              
              {/* Top Row: Title + Manual Numeric Input */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <label className="text-base font-bold text-stone-900 font-sans flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-700" />
                  Your Daily {currentFood.name.split(' (')[0]} Consumption:
                </label>

                {/* Manual Numeric Entry Field */}
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border-2 border-amber-400 shadow-sm">
                  <span className="text-xs font-mono text-stone-500 font-bold">Manual Input:</span>
                  <input
                    type="number"
                    step={isStapleFood ? "5" : "0.5"}
                    min="0.1"
                    max="1000"
                    value={dailyIntakeG}
                    onChange={(e) => setDailyIntakeG(Math.min(1000, Math.max(0.1, parseFloat(e.target.value) || 0.1)))}
                    className="w-24 bg-transparent text-right font-mono text-xl font-extrabold text-amber-900 focus:outline-none focus:text-amber-700"
                  />
                  <span className="text-xs font-mono text-amber-900 font-bold shrink-0">g / day</span>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={minSlider}
                  max={maxSlider}
                  step={stepSlider}
                  value={Math.min(dailyIntakeG, maxSlider)}
                  onChange={(e) => setDailyIntakeG(parseFloat(e.target.value))}
                  className="w-full h-3 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                
                {/* Dynamic Preset Buttons based on Staple vs Spice */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-stone-500 font-semibold">Presets:</span>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {isStapleFood ? (
                      <>
                        <button onClick={() => setDailyIntakeG(50)} className={`px-2.5 py-1 rounded-lg border ${dailyIntakeG === 50 ? 'bg-amber-600 text-white font-bold' : 'bg-stone-50 text-stone-700 border-stone-200'}`}>50g (Half Bowl)</button>
                        <button onClick={() => setDailyIntakeG(150)} className={`px-2.5 py-1 rounded-lg border ${dailyIntakeG === 150 ? 'bg-amber-600 text-white font-bold' : 'bg-stone-50 text-stone-700 border-stone-200'}`}>150g (Standard Meal)</button>
                        <button onClick={() => setDailyIntakeG(250)} className={`px-2.5 py-1 rounded-lg border ${dailyIntakeG === 250 ? 'bg-amber-600 text-white font-bold' : 'bg-stone-50 text-stone-700 border-stone-200'}`}>250g (Full Daily Serving)</button>
                        <button onClick={() => setDailyIntakeG(400)} className={`px-2.5 py-1 rounded-lg border ${dailyIntakeG === 400 ? 'bg-amber-600 text-white font-bold' : 'bg-stone-50 text-stone-700 border-stone-200'}`}>400g (High Intake)</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setDailyIntakeG(0.5)} className={`px-2.5 py-1 rounded-lg border ${dailyIntakeG === 0.5 ? 'bg-amber-600 text-white font-bold' : 'bg-stone-50 text-stone-700 border-stone-200'}`}>0.5g (Pinch)</button>
                        <button onClick={() => setDailyIntakeG(2.0)} className={`px-2.5 py-1 rounded-lg border ${dailyIntakeG === 2.0 ? 'bg-amber-600 text-white font-bold' : 'bg-stone-50 text-stone-700 border-stone-200'}`}>2.0g (Small Serving)</button>
                        <button onClick={() => setDailyIntakeG(5.0)} className={`px-2.5 py-1 rounded-lg border ${dailyIntakeG === 5.0 ? 'bg-amber-600 text-white font-bold' : 'bg-stone-50 text-stone-700 border-stone-200'}`}>5.0g (Standard Use)</button>
                        <button onClick={() => setDailyIntakeG(10.0)} className={`px-2.5 py-1 rounded-lg border ${dailyIntakeG === 10.0 ? 'bg-amber-600 text-white font-bold' : 'bg-stone-50 text-stone-700 border-stone-200'}`}>10.0g (Baseline)</button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Formula & Configuration */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
                <div className="flex flex-col gap-1 text-xs font-mono text-stone-600">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-700" />
                    <span><strong>DDI (mg/day)</strong> = Element concentration (mg/kg) × Food consumption ({formattedDailyIntake} g/day = {formattedConsumptionKg} kg/day)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-stone-100 p-1.5 rounded-xl border border-stone-200 text-xs font-mono">
                  <span className="text-stone-500 px-1 font-semibold">Provenance:</span>
                  {currentFood.activeCountries && currentFood.activeCountries.length > 0 && (
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 font-bold outline-none cursor-pointer"
                    >
                      {currentFood.activeCountries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
              <h4 className="text-xs font-mono uppercase text-stone-600 tracking-wider font-bold">Live Intake Safety Summary</h4>
              
              <div className="flex items-center justify-between gap-2 overflow-hidden">
                <span className="text-sm font-medium text-stone-700 shrink-0">Configured Intake:</span>
                <span className="text-base sm:text-lg font-bold text-stone-900 font-mono truncate" title={`${formattedDailyIntake} g / day (${formattedConsumptionKg} kg/day)`}>
                  {formattedDailyIntake} g / day ({formattedConsumptionKg} kg/day)
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-stone-600">Safety Compliance:</span>
                  <span className={`font-bold ${exceededElements.length > 0 ? 'text-rose-700' : nearLimitElements.length > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {safeElements.length} / {recalculatedElements.length} Elements Safe
                  </span>
                </div>
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${exceededElements.length > 0 ? 'bg-rose-600' : nearLimitElements.length > 0 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                    style={{ width: `${(safeElements.length / recalculatedElements.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {exceededElements.length > 0 ? (
                <div className="p-3 rounded-xl bg-rose-100/90 border border-rose-300 text-rose-950 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-900">
                    <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Toxicity Warning ({exceededElements.length} Exceeded)</span>
                  </div>
                  <p className="text-[11px] leading-tight text-rose-900/90 font-sans">
                    Intake exceeds WHO safe limits for <strong>{exceededElements.map(e => e.name).join(', ')}</strong>! Prolonged exposure increases risk of health disorders.
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                  {dailyIntakeG > (isStapleFood ? 300 : 20) 
                    ? '⚠️ High daily consumption! Certain trace elements may approach WHO maximum daily thresholds.' 
                    : '✓ Normal dietary consumption within safe WHO maximum daily intake bounds.'}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Recalculated Elements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recalculatedElements.map((el, idx) => {
            const isExceeded = el.status === 'Exceeds Limit';
            const isNearLimit = el.status === 'Near Limit';

            return (
              <div
                key={idx}
                className={`glass-panel p-6 rounded-2xl border transition-all duration-300 relative bg-white shadow-sm flex flex-col justify-between ${
                  isExceeded
                    ? 'border-rose-300 bg-rose-50/50 shadow-sm'
                    : isNearLimit
                      ? 'border-amber-300 bg-amber-50/50 shadow-sm'
                      : 'border-amber-200/80 hover:border-amber-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 font-mono text-lg font-bold text-amber-900 flex items-center justify-center shrink-0">
                        {el.symbol}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 font-sans">{el.name}</h4>
                        <span className="text-[10px] font-mono text-stone-500">{el.concentration} mg/kg conc.</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 shrink-0 ${
                      isExceeded
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : isNearLimit
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {isExceeded && <AlertTriangle className="w-3 h-3 text-rose-700" />}
                      {isNearLimit && <Info className="w-3 h-3 text-amber-700" />}
                      {!isExceeded && !isNearLimit && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                      {el.status}
                    </span>
                  </div>

                  <div className="mb-4 bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600">Calculated DDI:</span>
                      <span className={`font-bold text-sm ${isExceeded ? 'text-rose-700' : isNearLimit ? 'text-amber-800' : 'text-amber-900'}`}>
                        {el.calculatedDDI} mg/day
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-stone-600">
                      <span>Element Concentration:</span>
                      <span className="font-semibold text-stone-900">{el.concentration} mg/kg</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                      <span>{el.limitSource || 'Regulatory Limit'}:</span>
                      <span className="font-semibold text-stone-700">{el.safeLimit} mg/day</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between text-stone-600">
                      <span className="flex items-center gap-1">
                        WHO Intake Limit Utilized:
                      </span>
                      <span className={`font-bold ${isExceeded ? 'text-rose-700' : 'text-stone-800'}`}>
                        {el.pctOfLimit.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden border border-stone-300">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isExceeded ? 'bg-rose-600' : isNearLimit ? 'bg-amber-500' : 'bg-amber-600'
                        }`}
                        style={{ width: `${Math.min(el.pctOfLimit, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Disease Risk Box displayed on Exceeded or Near Limit */}
                {(isExceeded || isNearLimit) && (
                  <div className={`mt-4 p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                    isExceeded 
                      ? 'bg-rose-100/90 border-rose-300 text-rose-950' 
                      : 'bg-amber-100/90 border-amber-300 text-amber-950'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold font-sans">
                      <HeartPulse className={`w-4 h-4 shrink-0 ${isExceeded ? 'text-rose-700' : 'text-amber-700'}`} />
                      <span>Associated Disease / Health Risk:</span>
                    </div>
                    <div className="font-bold text-xs font-sans text-rose-900">
                      {el.diseaseInfo.disease}
                    </div>
                    <p className="text-[11px] font-sans leading-relaxed opacity-95">
                      {el.diseaseInfo.details}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[10px] font-mono font-bold border-t border-stone-300/40">
                      <span className={`px-2 py-0.5 rounded ${isExceeded ? 'bg-rose-200 text-rose-950' : 'bg-amber-200 text-amber-950'}`}>
                        {el.diseaseInfo.riskCategory}
                      </span>
                      <span>{isExceeded ? 'High Hazard' : 'Moderate Risk'}</span>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

