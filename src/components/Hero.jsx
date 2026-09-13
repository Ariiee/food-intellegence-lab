import React, { useState } from 'react';
import { ShieldCheck, Search, Database, ArrowRight, FileText, CheckCircle2, Globe2, Activity, Sparkles, Scan, Zap, Layers } from 'lucide-react';
import CursorGrid from './CursorGrid';

export default function Hero({ onExploreClick, onAiSearch, isAiLoading }) {
  const [isScanning, setIsScanning] = useState(true);
  const [heroSearchQuery, setHeroSearchQuery] = useState('');

  return (
    <section id="hero" className="relative min-h-[calc(100vh-70px)] pt-12 sm:pt-16 pb-20 flex flex-col justify-start overflow-hidden bg-paper-texture bg-grid-pattern">
      
      {/* ReactBits CursorGrid Interactive Canvas Layer */}
      <div className="absolute inset-0 z-0 opacity-80">
        <CursorGrid
          cellSize={60}
          color="#D97706"
          radius={160}
          falloff="smooth"
          holdTime={500}
          fadeDuration={700}
          lineWidth={1.2}
          maxOpacity={0.8}
          fillOpacity={0.12}
          gridOpacity={0.04}
          cellRadius={8}
          clickPulse={true}
          pulseSpeed={700}
        />
      </div>

      {/* Background Radial Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-200/30 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* 2-Column Hero Grid: Left Content, Right Animated Cover Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Intelligence Badge (Moved into left column for perfect grid alignment) */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-mono shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-semibold">Food Intelligence Platform</span>
              <span className="bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded font-sans uppercase font-bold">Verified</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-stone-900 leading-[1.08] font-sans">
              Global Food & Spice <br />
              <span className="text-gradient-saffron">Elemental Safety Analyzer</span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 font-light leading-relaxed max-w-2xl">
              Real-time food intelligence platform tracking <strong className="text-stone-900 font-semibold">item-specific trace minerals and toxic heavy metals</strong> across spices, commodities, and staple grains worldwide with automated WHO/FAO compliance verification.
            </p>

            {/* Interactive Material Search Console */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border-2 border-amber-300 shadow-lg backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700 animate-pulse" />
                  Material Safety & Spectrum Search
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Comprehensive Material Search
                </span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (heroSearchQuery.trim() && onAiSearch) {
                    onAiSearch(heroSearchQuery);
                  }
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={heroSearchQuery}
                    onChange={(e) => setHeroSearchQuery(e.target.value)}
                    placeholder="Search any food or material (e.g. Cucumber, Cardamom, Garlic, Almonds)..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-amber-200 text-stone-900 font-sans text-xs focus:outline-none focus:border-amber-600 focus:bg-white transition-all shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAiLoading}
                  className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md flex-shrink-0 ${
                    isAiLoading
                      ? 'bg-stone-300 text-stone-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-md'
                  }`}
                >
                  {isAiLoading ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin text-white" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Search Material
                    </>
                  )}
                </button>
              </form>

              {/* Preset Material Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
                <span className="text-stone-500 font-semibold mr-1">Quick Presets:</span>
                {['Cardamom', 'Cinnamon', 'Garlic', 'Almonds', 'Spinach', 'Oats'].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setHeroSearchQuery(preset);
                      if (onAiSearch) onAiSearch(preset);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold transition-all hover:scale-105"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-amber-200/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-amber-700 shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono text-stone-500">Targeted Assays</p>
                  <p className="text-sm font-semibold text-stone-900">Per-Item Profiles</p>
                </div>
              </div>



              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-amber-700 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono text-stone-500">Safety Limits</p>
                  <p className="text-sm font-semibold text-stone-900">WHO Standard</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Cover Section Showcase Card (5 Cols) */}
          <div className="lg:col-span-5 relative">
            
            {/* Outer Glow Wrapper */}
            <div className="relative rounded-3xl p-3 bg-gradient-to-b from-amber-300 via-amber-100 to-orange-200 border-2 border-amber-400/90 shadow-2xl animate-glow-pulse">
              
              {/* Inner Image Container with Ken Burns Zoom & Laser Scanner */}
              <div className="relative rounded-2xl overflow-hidden h-[420px] sm:h-[480px] w-full group bg-stone-900">
                
                {/* Ken Burns Animated Cover Photo */}
                <img
                  src="/food-cover.jpg"
                  alt="Global Spices, Grains, Fruits & Foods Spectrum"
                  className="w-full h-full object-cover animate-ken-burns opacity-90 transition-opacity group-hover:opacity-100"
                />

                {/* Gradient Vignette Overlay for Professional Polish */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none"></div>

                {/* Animated Laser Scanning Line (Simulating Radiochemistry X-ray Scan) */}
                {isScanning && (
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-scan-laser shadow-[0_0_15px_#F59E0B] pointer-events-none z-20">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-2 px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-mono text-[9px] font-bold uppercase tracking-wider shadow-md">
                      ⚡ LIVE SPECTRAL SCAN
                    </div>
                  </div>
                )}

                {/* Floating HUD Badge #1: Top Left */}
                <div className="absolute top-4 left-4 z-30 animate-float-slow">
                  <div className="glass-panel px-3.5 py-2 rounded-2xl border border-amber-300/80 bg-white/90 shadow-lg flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-mono text-stone-500 font-bold uppercase tracking-wider">Element Spectrum</p>
                      <p className="text-xs font-bold text-stone-900 font-sans">Item-Specific Element Profiles</p>
                    </div>
                  </div>
                </div>



                {/* Bottom Control Bar on Card */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-stone-950/80 backdrop-blur-md border-t border-stone-800/80 z-30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-mono text-amber-200 font-semibold">Active Spectrum Scanner</span>
                  </div>

                  <button
                    onClick={() => setIsScanning(!isScanning)}
                    className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Scan className="w-3.5 h-3.5 text-amber-400" />
                    {isScanning ? 'Pause Scan' : 'Resume Scan'}
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
