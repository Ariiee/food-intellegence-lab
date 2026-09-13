import React, { useState, useEffect } from 'react';
import { Shield, Mail, Layers } from 'lucide-react';
import CardNav from './CardNav';

export default function Navbar({ onOpenCompare, isSignedIn = false, handleSignOut }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = ['hero', 'trace-engine', 'brand-comparison', 'country-matrix', 'ddi-calculator', 'fetch-pipeline', 'crm-data', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-amber-200/80 py-3 shadow-md shadow-amber-900/5' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo & Wordmark */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 group-hover:border-amber-500 group-hover:shadow-[0_0_15px_rgba(217,119,6,0.25)] transition-all">
            <Shield className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-stone-900 font-sans">
                FOOD <span className="text-amber-700 font-semibold">INTELLIGENCE</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono tracking-widest bg-amber-100 text-amber-800 border border-amber-300 rounded uppercase font-bold">
                LAB
              </span>
            </div>
            <p className="text-[10px] text-stone-500 tracking-wider uppercase font-mono hidden sm:block">
              Global Elemental Safety Analyzer
            </p>
          </div>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-amber-50/80 p-1.5 rounded-full border border-amber-200/80 backdrop-blur-md">
          <a
            href="#trace-engine"
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSection === 'trace-engine'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            Trace Engine
          </a>
          <a
            href="#brand-comparison"
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSection === 'brand-comparison'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            Brand Compare
          </a>
          <a
            href="#country-matrix"
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSection === 'country-matrix'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            Country Matrix
          </a>
          <a
            href="#ddi-calculator"
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSection === 'ddi-calculator'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            DDI Calculator
          </a>
          <a
            href="#fetch-pipeline"
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSection === 'fetch-pipeline'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            Live Scraper
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCompare}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-white hover:bg-amber-50 border border-stone-300 rounded-xl transition-all shadow-sm mr-2"
          >
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            Compare
          </button>

          {!isSignedIn ? (
            <>
              <a href="/login" className="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors hidden sm:block">
                Sign In
              </a>
              <a
                href="/login"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs transition-all shadow-sm hover:shadow-md"
              >
                Get Started
              </a>
            </>
          ) : (
            <CardNav handleSignOut={handleSignOut} />
          )}
        </div>

      </div>
    </header>
  );
}
