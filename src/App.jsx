import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import TraceElementEngine from './components/TraceElementEngine';
import SampleBrandComparison from './components/SampleBrandComparison';
import CountryComparison from './components/CountryComparison';
import DdiCalculator from './components/DdiCalculator';
import CrmConfidence from './components/CrmConfidence';
import ContactFooter from './components/ContactFooter';
import CompareModal from './components/CompareModal';
import { Filter, Shield } from 'lucide-react';
import { fetchFoodProfileWithGemini } from './utils/geminiApi';
import { useSession, signOut } from './utils/authClient';
import AuthModal from './components/AuthModal';
import CardNav from './components/CardNav';
import LineSidebar from './components/LineSidebar';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [foodsList, setFoodsList] = useState([]);
  const [sourcesList, setSourcesList] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [scrapedSampleHighlight, setScrapedSampleHighlight] = useState(null);
  const [activeSidebarItem, setActiveSidebarItem] = useState(0);

  // Authentication State
  const { data: session, isPending } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Scroll Spy for Sidebar
  useEffect(() => {
    const handleScroll = () => {
      if (!isSearchActive) return;
      const sectionIds = [
        'section-elemental',
        'section-brands',
        'section-countries',
        'section-ddi',
        'section-quality'
      ];
      
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      let currentActive = 0;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && scrollPosition >= el.offsetTop) {
          currentActive = i;
          break;
        }
      }
      
      if (currentActive !== activeSidebarItem) {
        setActiveSidebarItem(currentActive);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSearchActive, activeSidebarItem]);

  // Material Search Handler - Fetches multi-brand & raw samples
  const handleMaterialSearch = async (materialName) => {
    if (!materialName || !materialName.trim()) return;

    if (!session) {
      setPendingAction(() => () => handleMaterialSearch(materialName));
      setIsAuthModalOpen(true);
      return;
    }

    const cleanTerm = materialName.trim();
    setIsAiLoading(true);

    try {
      const result = await fetchFoodProfileWithGemini(cleanTerm);
      if (result && result.food) {
        const newFood = result.food;
        const newSource = result.source;

        setFoodsList(prev => {
          const existsIndex = prev.findIndex(f => f.id === newFood.id || f.name.toLowerCase() === newFood.name.toLowerCase());
          if (existsIndex >= 0) {
            const updated = [...prev];
            updated[existsIndex] = newFood;
            return updated;
          }
          return [...prev, newFood];
        });

        if (newSource) {
          setSourcesList(prev => [newSource, ...prev]);
        }

        setSelectedFoodId(newFood.id);
        setIsSearchActive(true);

        setTimeout(() => {
          const el = document.getElementById('section-elemental');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } catch (err) {
      console.error('Error during material search:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const resetToBrowse = () => {
    setIsSearchActive(false);
    setSelectedFoodId(null);
  };

  // Dynamic Ingestion Handler called when user triggers live scraper console
  const handleIngestNewData = ({ newSource, newSample, foodId, foodName, hindiName, category, description, country, method, elementProfile }) => {
    if (newSource) {
      setSourcesList(prev => [newSource, ...prev]);
    }

    const defaultDailyG = foodName.toLowerCase().includes('rice') ? 150.0 : (foodName.toLowerCase().includes('wheat') ? 200.0 : 10.0);
    const consumptionKg = defaultDailyG / 1000;

    setFoodsList(prevFoods => {
      const existingFood = prevFoods.find(f => f.id === foodId || f.name.toLowerCase().includes(foodName.toLowerCase()));

      if (existingFood) {
        return prevFoods.map(food => {
          if (food.id === existingFood.id) {
            const updatedSamples = [newSample, ...(food.samples || food.rawSamples || food.brandedSamples || [])];

            return {
              ...food,
              samples: updatedSamples,
              rawSamples: updatedSamples,
              brandedSamples: updatedSamples,
              activeCountries: Array.from(new Set([...food.activeCountries, country])),
              elementProfile: elementProfile || food.elementProfile
            };
          }
          return food;
        });
      } else {
        const samples = [newSample];
        const newFoodObj = {
          id: foodId,
          name: foodName,
          hindiName: hindiName || foodName,
          category: category || 'Agricultural Commodity',
          description: description || `Trace element and heavy metal safety assay for ${foodName} sourced from ${country}.`,
          defaultDailyIntakeG: defaultDailyG,
          seedPaper: newSource ? newSource.title : 'Live Scraper Extracted Assay',
          activeCountries: [country],
          riskLevel: 'Moderate',
          primaryAdulterants: ['Heavy Metals', 'Soil Runoff Bioaccumulation', 'Industrial Processing Residue'],
          samples: samples,
          rawSamples: samples,
          brandedSamples: samples,
          elementProfile: elementProfile || [
            { symbol: 'Pb', name: 'Lead', concentration: 2.5, concentrationUnit: 'mg/kg', ddi: Number((2.5 * consumptionKg).toFixed(4)), unit: 'mg/day', safeLimit: 0.05, limitType: 'mg/day', limitSource: 'WHO/FAO Maximum Permissible Limit', status: 'Safe' },
            { symbol: 'Cr', name: 'Chromium', concentration: 4.5, concentrationUnit: 'mg/kg', ddi: Number((4.5 * consumptionKg).toFixed(4)), unit: 'mg/day', safeLimit: 0.1, limitType: 'mg/day', limitSource: 'Codex Alimentarius', status: 'Safe' },
            { symbol: 'Fe', name: 'Iron', concentration: 520, concentrationUnit: 'mg/kg', ddi: Number((520 * consumptionKg).toFixed(4)), unit: 'mg/day', safeLimit: 45.0, limitType: 'mg/day', limitSource: 'Tolerable Upper Intake Level', status: 'Safe' },
            { symbol: 'Ca', name: 'Calcium', concentration: 2200, concentrationUnit: 'mg/kg', ddi: Number((2200 * consumptionKg).toFixed(4)), unit: 'mg/day', safeLimit: 2500, limitType: 'mg/day', limitSource: 'WHO Guideline', status: 'Safe' },
            { symbol: 'K',  name: 'Potassium', concentration: 2400, concentrationUnit: 'mg/kg', ddi: Number((2400 * consumptionKg).toFixed(4)), unit: 'mg/day', safeLimit: 3500, limitType: 'mg/day', limitSource: 'WHO/FAO Standard', status: 'Safe' },
            { symbol: 'Mn', name: 'Manganese', concentration: 220, concentrationUnit: 'mg/kg', ddi: Number((220 * consumptionKg).toFixed(4)), unit: 'mg/day', safeLimit: 11.0, limitType: 'mg/day', limitSource: 'WHO Guideline', status: 'Safe' },
            { symbol: 'Zn', name: 'Zinc', concentration: 31.5, concentrationUnit: 'mg/kg', ddi: Number((31.5 * consumptionKg).toFixed(4)), unit: 'mg/day', safeLimit: 15.0, limitType: 'mg/day', limitSource: 'Codex Alimentarius', status: 'Safe' },
            { symbol: 'Cu', name: 'Copper', concentration: 7.5, concentrationUnit: 'mg/kg', ddi: Number((7.5 * consumptionKg).toFixed(4)), unit: 'mg/day', safeLimit: 10.0, limitType: 'mg/day', limitSource: 'WHO Guideline', status: 'Safe' },
            { symbol: 'Cd', name: 'Cadmium', concentration: 0.15, concentrationUnit: 'mg/kg', ddi: Number((0.15 * consumptionKg).toFixed(4)), unit: 'mg/day', safeLimit: 0.007, limitType: 'mg/day', limitSource: 'WHO/FAO Permissible Limit', status: 'Safe' }
          ]
        };

        return [...prevFoods, newFoodObj];
      }
    });

    setSelectedFoodId(foodId);
    setScrapedSampleHighlight(newSample.id);
  };

  // Determine what to show based on search state
  const isShowingSearchResults = isSearchActive;
  const displayedFoodsList = isShowingSearchResults
    ? foodsList.filter(f => f.id === selectedFoodId)
    : foodsList;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans relative selection:bg-amber-200 selection:text-stone-900">
      {/* Top Navigation & Auth Area */}
      <nav className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-stone-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] px-4 sm:px-6 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Logo & Wordmark */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 shadow-sm shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 font-sans">
                FOOD <span className="text-amber-700 font-semibold">INTELLIGENCE</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono tracking-widest bg-amber-100 text-amber-800 border border-amber-300 rounded uppercase font-bold shrink-0">
                LAB
              </span>
            </div>
          </div>

          {/* Right: Auth Section */}
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center font-bold text-amber-800 shadow-inner text-sm shrink-0">
                  {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <CardNav 
                  handleSignOut={signOut} 
                  userRole={session.user?.role} 
                  onOpenAdmin={() => setIsAdminPanelOpen(true)} 
                />
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-sm hover:shadow-md transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Material Search Input (ALWAYS SHOWN) */}
      <header className="mb-16">
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('section-elemental');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onAiSearch={handleMaterialSearch}
          isAiLoading={isAiLoading}
        />
      </header>

      {/* MAIN CONTENT AREA - Only shown after searching or if history exists */}
      {foodsList.length > 0 && (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar Navigation - only in search results mode */}
            {isShowingSearchResults && (
              <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-[88px] z-40">
                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-amber-100/90 backdrop-blur-md border border-amber-300 shadow-sm">
                  <h3 className="text-xs font-mono font-bold text-amber-900 uppercase mb-4 px-1 tracking-wider">Navigation</h3>
                  <div className="pl-4">
                    <LineSidebar
                      items={[
                        'Elemental Analysis',
                        'General Comparison',
                        'Geographic Safety',
                        'Daily Intake Calculator',
                        'Quality Metrics'
                      ]}
                      accentColor="#b45309"
                      textColor="#78350f"
                      markerColor="#d97706"
                      showIndex={true}
                      showMarker={true}
                      proximityRadius={100}
                      maxShift={15}
                      falloff="smooth"
                      markerLength={30}
                      markerGap={0}
                      tickScale={0.5}
                      scaleTick={true}
                      itemGap={24}
                      fontSize={0.875}
                      smoothing={100}
                      activeItem={activeSidebarItem}
                      onItemClick={(index, label) => {
                        const sectionIds = [
                          'section-elemental',
                          'section-brands',
                          'section-countries',
                          'section-ddi',
                          'section-quality'
                        ];
                        document.getElementById(sectionIds[index])?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-amber-200/50">
                    <button
                      onClick={resetToBrowse}
                      className="w-full px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 text-xs font-mono font-bold border border-amber-300 shadow-sm transition-all text-center"
                    >
                      Back to All Foods
                    </button>
                  </div>
                </div>
              </aside>
            )}

            {/* Main Content Sections */}
            <div className="flex-1 min-w-0 w-full">
              <section className="space-y-16">

          {/* Core Trace Element Engine */}
          <div id="section-elemental" className="scroll-mt-40">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              {isShowingSearchResults ? 'Elemental Analysis' : 'Elemental Analysis Database'}
            </h2>
            <TraceElementEngine
              foodsList={displayedFoodsList}
              selectedFoodId={selectedFoodId}
              onFoodChange={setSelectedFoodId}
              onCompareClick={() => setIsCompareOpen(true)}
              scrapedHighlightId={scrapedSampleHighlight}
            />
          </div>

          {/* Brand-Wise & Raw Sample Item Comparison */}
          <div id="section-brands" className="scroll-mt-40">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              {isShowingSearchResults ? 'General Comparison' : 'General Comparison Database'}
            </h2>
            <SampleBrandComparison
              foodsList={displayedFoodsList}
              selectedFoodId={selectedFoodId}
            />
          </div>

          {/* Country-vs-Country Safety Matrix */}
          <div id="section-countries" className="scroll-mt-40">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              {isShowingSearchResults ? 'Geographic Safety Analysis' : 'Global Safety Database'}
            </h2>
            <CountryComparison
              foodsList={displayedFoodsList}
              foodId={selectedFoodId}
            />
          </div>

          {/* Dynamic DDI Calculator */}
          <div id="section-ddi" className="scroll-mt-40">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              {isShowingSearchResults ? 'Personal Daily Intake Calculator' : 'Dietary Intake Calculator'}
            </h2>
            <DdiCalculator
              foodsList={displayedFoodsList}
              foodId={selectedFoodId}
            />
          </div>

          {/* CRM Quality Confidence */}
          <div id="section-quality" className="scroll-mt-40">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              {isShowingSearchResults ? 'Quality Assurance Metrics' : 'Quality Control Database'}
            </h2>
            <CrmConfidence
              foodsList={displayedFoodsList}
              foodId={selectedFoodId}
            />
          </div>
              </section>
            </div>
          </div>
        </main>
      )}

      {/* ALWAYS VISIBLE: Contact & Footer Section */}
      <footer className="border-t border-amber-200/80 mt-20">
        <ContactFooter />
      </footer>

      {/* ALWAYS AVAILABLE: Modal for Cross-Country Comparison */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        foodsList={foodsList}
        initialFoodId={selectedFoodId}
      />

      <AdminPanel 
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />

      {/* Cinematic Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        onAuthenticated={handleAuthSuccess}
      />
    </div>
  );
}