import React, { useState, useEffect, useRef } from 'react';
import { STATS_COUNTER_DATA } from '../data/constants';
import { Microscope, Atom, Globe2, BookOpen, ShieldCheck } from 'lucide-react';

const ICON_MAP = {
  Microscope: Microscope,
  Atom: Atom,
  Globe2: Globe2,
  BookOpen: BookOpen,
  ShieldCheck: ShieldCheck
};

export default function StatsCounter() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 border-y border-amber-200/80 bg-[#FAF7F2] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {STATS_COUNTER_DATA.map((item, idx) => {
            const IconComponent = ICON_MAP[item.icon] || Atom;
            return (
              <div 
                key={idx} 
                className="glass-panel p-6 rounded-2xl border border-amber-200/80 relative overflow-hidden group hover:border-amber-400 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3 text-amber-700">
                  <div className="p-2 rounded-lg bg-amber-100/80 border border-amber-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider font-semibold">{item.label}</span>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-sans tracking-tight">
                  {item.prefix}
                  <CounterValue value={item.value} animate={isVisible} />
                  <span className="text-amber-700 text-2xl font-light ml-1">{item.suffix}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

function CounterValue({ value, animate }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let start = 0;
    const end = parseFloat(value);
    const duration = 1500;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = start + (end - start) * easedProgress;

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, animate]);

  if (!animate) return <span>0</span>;
  return <span>{Number.isInteger(value) ? Math.round(count) : count.toFixed(1)}</span>;
}
