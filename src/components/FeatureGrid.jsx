import React from 'react';
import { Microscope, Globe2, Calculator, ShieldAlert, Cpu, Award, ArrowUpRight } from 'lucide-react';

const FEATURES = [
  {
    num: '01',
    icon: Microscope,
    title: 'Elemental Profiles & Concentrations',
    description: 'Precision quantification of minor and trace element concentrations (mg/kg) with standardized Daily Dietary Intake (mg/day) calculations.',
    tag: 'Spectrometry Core',
    color: 'from-amber-100/50 to-orange-100/30',
    borderColor: 'group-hover:border-amber-500'
  },
  {
    num: '02',
    icon: Globe2,
    title: 'Multi-Country Provenance Matrix',
    description: 'Side-by-side elemental profiles across India, Sri Lanka, Bangladesh, and Iran to detect regional heavy metal variations and soil uptake anomalies.',
    tag: 'Global Scope',
    color: 'from-emerald-100/50 to-teal-100/30',
    borderColor: 'group-hover:border-emerald-500'
  },
  {
    num: '03',
    icon: Calculator,
    title: 'Dynamic WHO/FAO DDI Engine',
    description: 'Interactive Daily Dietary Intake (DDI) recalculation based on user intake (g/day) with instant WHO/FAO maximum permissible limit validation.',
    tag: 'Live Intake Math',
    color: 'from-orange-100/50 to-amber-100/30',
    borderColor: 'group-hover:border-orange-500'
  },
  {
    num: '04',
    icon: ShieldAlert,
    title: 'Adulterant & Heavy Metal Flags',
    description: 'Real-time safety verdict engine classifying element concentrations into Safe, Near Limit, or Exceeds Limit (e.g., Chromium contamination in Sri Lankan samples).',
    tag: 'Automated Verdict',
    color: 'from-rose-100/50 to-amber-100/30',
    borderColor: 'group-hover:border-rose-500'
  },
  {
    num: '05',
    icon: Cpu,
    title: 'Multi-Source Search & Web Scraper',
    description: 'Continuous web pipeline scanning peer-reviewed journals, national food composition databases, and brand records with strict country & citation tagging.',
    tag: 'Live Data Pipeline',
    color: 'from-amber-100/50 to-yellow-100/30',
    borderColor: 'group-hover:border-amber-500'
  }
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 relative z-20 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs mb-4 font-semibold">
            <span>01</span>
            <span className="text-amber-500">/</span>
            <span>CORE SYSTEM CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mb-4 font-sans">
            Elemental Intelligence Architecture
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl font-light">
            Engineered to transform raw food analysis data into actionable dietary safety metrics.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className={`glass-panel p-8 rounded-3xl border border-amber-200/80 relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 shadow-sm ${feat.borderColor}`}
              >
                {/* Background Tint Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 group-hover:scale-110 transition-all shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs text-stone-400 font-bold group-hover:text-amber-800 transition-colors">
                    {feat.num}
                  </span>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono text-[10px] uppercase tracking-wider mb-3 border border-stone-200 font-semibold">
                  {feat.tag}
                </div>

                <h3 className="text-xl font-bold text-stone-900 mb-3 font-sans group-hover:text-amber-800 transition-colors flex items-center justify-between">
                  {feat.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-amber-700 transition-opacity" />
                </h3>

                <p className="text-stone-600 text-sm leading-relaxed font-light">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
