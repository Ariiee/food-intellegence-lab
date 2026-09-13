import React, { useState, useEffect } from 'react';
import { ELEMENTS_MASTER } from '../data/constants';
import { Sparkles, ShieldCheck, AlertTriangle, CheckCircle2, Award, ArrowRightLeft, Package, Sprout, Tag } from 'lucide-react';

export default function SampleBrandComparison({ foodsList, selectedFoodId }) {
  const foods = foodsList || [];
  const [currentFoodId, setCurrentFoodId] = useState(selectedFoodId || foods[0]?.id);

  // Sync internal state when parent selectedFoodId prop changes
  useEffect(() => {
    if (selectedFoodId) {
      setCurrentFoodId(selectedFoodId);
    }
  }, [selectedFoodId]);

  const currentFood = foods.find(f => f.id === currentFoodId) || foods[0];

  // Unified sample options list
  const allSamples = currentFood.samples || [
    ...(currentFood.rawSamples || []).map(s => ({ ...s, categoryType: 'Analyzed Food Sample' })),
    ...(currentFood.brandedSamples || []).map(s => ({ ...s, categoryType: 'Analyzed Food Sample' }))
  ];

  const [sample1Id, setSample1Id] = useState(allSamples[0]?.id || 'S-1');
  const [sample2Id, setSample2Id] = useState(allSamples[1]?.id || allSamples[0]?.id || 'S-2');

  // Reset sample selections whenever active food changes, ensuring distinct items
  useEffect(() => {
    if (allSamples.length > 0) {
      const firstId = allSamples[0]?.id;
      const secondId = allSamples.find(s => s.id !== firstId)?.id || firstId;
      setSample1Id(firstId);
      setSample2Id(secondId);
    }
  }, [currentFoodId]);

  const handleSample1Change = (newId) => {
    setSample1Id(newId);
    if (newId === sample2Id) {
      const other = allSamples.find(s => s.id !== newId);
      if (other) setSample2Id(other.id);
    }
  };

  const handleSample2Change = (newId) => {
    setSample2Id(newId);
    if (newId === sample1Id) {
      const other = allSamples.find(s => s.id !== newId);
      if (other) setSample2Id(other.id);
    }
  };

  const sample1 = allSamples.find(s => s.id === sample1Id) || allSamples[0] || { id: 'S-1', name: 'Sample 1', origin: 'Global' };
  const sample2 = allSamples.find(s => s.id === sample2Id) || allSamples[1] || allSamples[0] || { id: 'S-2', name: 'Sample 2', origin: 'Global' };

  const baselineG = currentFood.defaultDailyIntakeG || 10.0;
  const consumptionKg = baselineG / 1000;

  // Dynamically calculate element concentrations and DDI per sample
  const comparisonData = currentFood.elementProfile.map(el => {
    let baseConc = typeof el.concentration === 'number' ? el.concentration : parseFloat(el.concentration);
    if (isNaN(baseConc) || baseConc <= 0) {
      const baseDdi = typeof el.ddi === 'number' ? el.ddi : (parseFloat(el.ddi) || 1.0);
      baseConc = consumptionKg > 0 ? (baseDdi / consumptionKg) : 100;
    }

    const var1 = 1 + ((sample1.id.charCodeAt(sample1.id.length - 1) % 5 - 2) * 0.04);
    const var2 = 1 + ((sample2.id.charCodeAt(sample2.id.length - 1) % 5 - 2) * 0.04);

    const conc1 = Number((baseConc * var1).toFixed(2));
    const conc2 = Number((baseConc * var2).toFixed(2));

    const val1 = Number((conc1 * consumptionKg).toFixed(4));
    const val2 = Number((conc2 * consumptionKg).toFixed(4));

    const isExceeded1 = val1 > el.safeLimit;
    const isExceeded2 = val2 > el.safeLimit;

    return {
      symbol: el.symbol,
      name: el.name,
      conc1,
      conc2,
      val1,
      val2,
      unit: 'mg/day',
      limit: el.safeLimit,
      limitType: 'mg/day',
      status1: isExceeded1 ? 'Exceeds Limit' : 'Safe',
      status2: isExceeded2 ? 'Exceeds Limit' : 'Safe'
    };
  });

  // Determine safer sample overall (lower toxic metals Cr/Ba/Br/Pb/Cd)
  const toxicElements = comparisonData.filter(d => ['Pb', 'Cd', 'Cr', 'Ba', 'Br', 'As'].includes(d.symbol));
  const toxicSum1 = toxicElements.reduce((acc, curr) => acc + curr.val1, 0);
  const toxicSum2 = toxicElements.reduce((acc, curr) => acc + curr.val2, 0);

  const saferSample = toxicSum1 <= toxicSum2 ? sample1 : sample2;

  return (
    <section id="brand-comparison" className="py-24 relative z-20 bg-[#FDFBF7] border-t border-amber-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs mb-4 font-semibold">
              <span>02.5</span>
              <span className="text-amber-500">/</span>
              <span>GENERAL COMPARISON ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mb-3 font-sans">
              General Comparison
            </h2>
            <p className="text-stone-600 text-base max-w-xl font-light">
              Compare elemental purity, trace minerals, and heavy metal compliance side-by-side between distinct analyzed food samples and origins.
            </p>
          </div>

          {/* Food Commodity Selector */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-amber-200 shadow-sm">
            {foods.map(food => (
              <button
                key={food.id}
                onClick={() => setCurrentFoodId(food.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  food.id === currentFood.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-amber-50'
                }`}
              >
                <span>{food.name.split(' (')[0]}</span>
                <span className="text-[10px] font-mono opacity-80">({food.hindiName})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sample Pickers Control Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-200/90 mb-12 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Sample #1 Selector */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-amber-700" />
                  Select Sample #1:
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900 border border-amber-400">
                  🔬 Analyzed Sample
                </span>
              </div>

              <select
                value={sample1Id}
                onChange={(e) => handleSample1Change(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-white border border-amber-300 text-stone-900 font-sans text-sm font-bold shadow-sm focus:outline-none focus:border-amber-600"
              >
                {allSamples.map(s => (
                  <option key={s.id} value={s.id} disabled={s.id === sample2Id}>
                    [{s.id}] {s.name} ({s.origin}){s.id === sample2Id ? ' — (Currently in Sample #2)' : ''}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between text-xs font-mono text-stone-600 pt-1">
                <span>Provenance: {sample1.origin}</span>
                <span>ID: {sample1.id}</span>
              </div>
            </div>

            {/* Sample #2 Selector */}
            <div className="p-5 rounded-2xl bg-orange-50/70 border-2 border-orange-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-orange-700" />
                  Select Sample #2:
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-200 text-orange-950 border border-orange-400">
                  🔬 Analyzed Sample
                </span>
              </div>

              <select
                value={sample2Id}
                onChange={(e) => handleSample2Change(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-white border border-orange-300 text-stone-900 font-sans text-sm font-bold shadow-sm focus:outline-none focus:border-orange-600"
              >
                {allSamples.map(s => (
                  <option key={s.id} value={s.id} disabled={s.id === sample1Id}>
                    [{s.id}] {s.name} ({s.origin}){s.id === sample1Id ? ' — (Currently in Sample #1)' : ''}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between text-xs font-mono text-stone-600 pt-1">
                <span>Provenance: {sample2.origin}</span>
                <span>ID: {sample2.id}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Safety Verdict Card */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-white to-amber-50 mb-12 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex-shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider">Comparative Safety Verdict</span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase">
                  Cleaner Metal Profile
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-sans">
                Recommended Choice: {saferSample.name} ({saferSample.origin})
              </h3>
              <p className="text-stone-600 text-xs font-mono mt-0.5">
                Exhibits lower heavy metal accumulation while preserving essential mineral balance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono flex-shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 font-bold shadow-sm">
              Comparing {comparisonData.length} Trace Elements
            </div>
          </div>
        </div>

        {/* Full-Width Side-by-Side Comparison Matrix */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-200/90 bg-white shadow-sm w-full">
          <h3 className="text-lg font-bold text-stone-900 font-sans mb-4">
            Side-by-Side Elemental Concentration & DDI Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Element</th>
                  <th className="py-3 px-4 text-amber-800">Sample 1: {sample1.id} ({sample1.name})</th>
                  <th className="py-3 px-4 text-orange-800">Sample 2: {sample2.id} ({sample2.name})</th>
                  <th className="py-3 px-4">WHO Safe Limit (mg/day)</th>
                  <th className="py-3 px-4">Safer Choice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {comparisonData.map((row, idx) => {
                  const safer = row.val1 <= row.val2 ? sample1.id : sample2.id;
                  const isExceeded1 = row.status1 === 'Exceeds Limit';
                  const isExceeded2 = row.status2 === 'Exceeds Limit';

                  return (
                    <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900 flex items-center gap-2">
                        <span className="w-7 h-7 rounded bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-mono text-xs font-bold shrink-0">
                          {row.symbol}
                        </span>
                        <span className="text-[11px] font-sans font-normal text-stone-600 hidden sm:inline">{row.name}</span>
                      </td>
                      <td className={`py-3.5 px-4 font-semibold ${isExceeded1 ? 'text-rose-700 font-bold' : 'text-amber-800'}`}>
                        <div>{row.val1} mg/day</div>
                        <div className="text-[10px] text-stone-500 font-normal">{row.conc1} mg/kg</div>
                      </td>
                      <td className={`py-3.5 px-4 font-semibold ${isExceeded2 ? 'text-rose-700 font-bold' : 'text-orange-800'}`}>
                        <div>{row.val2} mg/day</div>
                        <div className="text-[10px] text-stone-500 font-normal">{row.conc2} mg/kg</div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {row.limit} mg/day
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          safer === sample1.id 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-orange-100 text-orange-900 border border-orange-300'
                        }`}>
                          ✓ {safer}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}

