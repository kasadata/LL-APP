
import React, { useState, useRef, useEffect } from 'react';
import { Step, Mode, Combination, FilterSettings } from './types';
import * as Logic from './utils';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.INITIAL);
  const [history, setHistory] = useState<Step[]>([]);
  
  const [allCombinations, setAllCombinations] = useState<Combination[]>([]);
  const [filteredCombinations, setFilteredCombinations] = useState<Combination[]>([]);
  
  // Custom states
  const [isCustomCountActive, setIsCustomCountActive] = useState(false);
  const [customCountValue, setCustomCountValue] = useState<string>("100");
  const [imgError, setImgError] = useState(false);

  const [settings, setSettings] = useState<FilterSettings>({
    sumRange: [130, 220],
    evenOddMode: 'exclude-skewed',
    sizeMode: 'exclude-skewed',
    consecutiveMode: 'allow-one-pair',
    zonesMode: { min: 2, max: 4 },
    tailMode: 'allow-one-pair',
  });

  const goToStep = (next: Step) => {
    setHistory(prev => [...prev, currentStep]);
    setCurrentStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length === 0) {
      setCurrentStep(Step.INITIAL);
      setMode(null);
      return;
    }
    const newHistory = [...history];
    const prevStep = newHistory.pop()!;
    setHistory(newHistory);
    setCurrentStep(prevStep);
    setIsCustomCountActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setMode(null);
    setCurrentStep(Step.INITIAL);
    setHistory([]);
    setAllCombinations([]);
    setFilteredCombinations([]);
    setIsCustomCountActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyAllFilters = (initial: Combination[]) => {
    let result = [...initial];
    result = Logic.filterBySum(result, settings.sumRange[0], settings.sumRange[1]);
    result = Logic.filterByEvenOdd(result, settings.evenOddMode);
    result = Logic.filterBySize(result, settings.sizeMode);
    result = Logic.filterByConsecutive(result, settings.consecutiveMode);
    result = Logic.filterByZones(result, settings.zonesMode.min, settings.zonesMode.max);
    result = Logic.filterByTail(result, settings.tailMode);
    return result;
  };

  const currentCount = filteredCombinations.length;
  const initialCount = allCombinations.length;
  const percentage = initialCount > 0 ? ((currentCount / initialCount) * 100).toFixed(1) : '0';

  const renderHeader = () => (
    <div className="flex flex-col items-center mb-6 md:mb-10 mt-2 md:mt-6">
      <div className="w-16 h-16 md:w-20 md:h-20 mb-4 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden border border-white/20 shadow-2xl">
        {!imgError ? (
          <img 
            src="logo.png" 
            alt="Logo" 
            className="w-full h-full object-contain p-1"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-600">
             <span className="text-black font-black text-2xl">PB</span>
          </div>
        )}
      </div>
      <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase text-center leading-none">
        LOTTO LOGIC <span className="text-yellow-500">PB</span>
      </h1>
      <p className="text-[10px] md:text-xs text-gray-500 mt-2 uppercase tracking-[0.3em] font-medium">Num-Generator Pro</p>
    </div>
  );

  const renderProgress = () => {
    if (currentStep === Step.INITIAL || currentStep === Step.RESULT) return null;
    return (
      <div className="w-full max-w-sm mx-auto mb-6 px-4">
        <div className="flex justify-between text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
          <span>Filter Step {currentStep}/7</span>
          <span className="text-yellow-500">{currentCount} Left</span>
        </div>
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(234,179,8,0.5)]"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case Step.INITIAL:
        return (
          <div className="flex flex-col gap-4 max-w-xs mx-auto px-4 w-full">
            <button 
              onClick={() => { setMode(Mode.STEP_BY_STEP); goToStep(Step.COUNT); }}
              className="group relative px-6 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-tighter shadow-xl overflow-hidden active:scale-95"
            >
              <span className="relative z-10">Step by Step Guide</span>
              <div className="absolute inset-0 bg-yellow-500 translate-y-full group-hover:translate-y-[90%] transition-transform duration-300 opacity-20"></div>
            </button>
            <button 
              onClick={() => { setMode(Mode.ONE_CLICK); goToStep(Step.COUNT); }}
              className="px-6 py-5 border-2 border-white/20 text-white font-bold rounded-2xl hover:bg-white hover:text-black transition-all uppercase tracking-tighter active:scale-95"
            >
              One-Click Direct
            </button>
          </div>
        );

      case Step.COUNT:
        const counts = [10, 20, 30, 40, 50];
        if (isCustomCountActive) {
          return (
            <div className="pb-glass p-6 md:p-8 rounded-[2rem] max-w-sm mx-auto text-center border-yellow-500/20 border mx-4">
              <h2 className="text-lg font-bold mb-6 uppercase tracking-tight text-gray-300">Set Custom Volume</h2>
              <input 
                type="number" 
                inputMode="numeric"
                pattern="[0-9]*"
                min="1" 
                max="100"
                value={customCountValue}
                onChange={(e) => setCustomCountValue(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-5 text-center text-5xl font-black text-yellow-500 mb-8 focus:border-yellow-500 outline-none transition-all shadow-inner"
                autoFocus
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsCustomCountActive(false)}
                  className="flex-1 py-4 bg-white/5 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const n = parseInt(customCountValue);
                    if (n > 0 && n <= 100) {
                      const combos = Logic.generateCombinations(n);
                      setAllCombinations(combos);
                      setFilteredCombinations(combos);
                      setIsCustomCountActive(false);
                      if (mode === Mode.STEP_BY_STEP) goToStep(Step.SUM);
                      else goToStep(Step.RESULT);
                    } else {
                      alert("Please enter a number between 1 and 100.");
                    }
                  }}
                  className="flex-1 py-4 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-yellow-500/20 active:scale-95 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          );
        }
        return (
          <div className="pb-glass p-6 md:p-8 rounded-[2rem] max-w-md mx-auto mx-4">
            <h2 className="text-lg font-bold mb-6 text-center uppercase tracking-tight text-white/90">Generation Volume</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {counts.map(c => (
                <button 
                  key={c}
                  onClick={() => {
                    const combos = Logic.generateCombinations(c);
                    setAllCombinations(combos);
                    setFilteredCombinations(combos);
                    if (mode === Mode.STEP_BY_STEP) goToStep(Step.SUM);
                    else goToStep(Step.RESULT);
                  }}
                  className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition font-black text-3xl text-white border border-white/5 active:scale-95"
                >
                  {c}
                </button>
              ))}
              <button 
                onClick={() => setIsCustomCountActive(true)}
                className="col-span-2 p-5 bg-yellow-500 text-black rounded-2xl hover:bg-yellow-400 transition font-black text-xl uppercase tracking-tighter shadow-lg shadow-yellow-500/20 active:scale-95"
              >
                Custom (Max 100)
              </button>
            </div>
          </div>
        );

      case Step.SUM:
      case Step.EVEN_ODD:
      case Step.SIZE:
      case Step.CONSECUTIVE:
      case Step.ZONES:
      case Step.TAIL:
        // Unified UI for filter steps to keep it clean on mobile
        const getStepData = () => {
          switch(currentStep) {
            case Step.SUM: return {
              title: "Sum Range (SUM)",
              desc: "Optimal sum for 5 PB white balls",
              options: [
                { label: '130 - 220 (Recommended)', action: () => {
                  setSettings({ ...settings, sumRange: [130, 220] });
                  setFilteredCombinations(Logic.filterBySum(filteredCombinations, 130, 220));
                  goToStep(Step.EVEN_ODD);
                }},
                { label: '135 - 215', action: () => {
                  setSettings({ ...settings, sumRange: [135, 215] });
                  setFilteredCombinations(Logic.filterBySum(filteredCombinations, 135, 215));
                  goToStep(Step.EVEN_ODD);
                }},
                { label: '140 - 210', action: () => {
                  setSettings({ ...settings, sumRange: [140, 210] });
                  setFilteredCombinations(Logic.filterBySum(filteredCombinations, 140, 210));
                  goToStep(Step.EVEN_ODD);
                }},
                { label: 'Custom Range', isCustom: true, action: () => {
                  const min = parseInt(prompt("Min sum?", "130") || "130");
                  const max = parseInt(prompt("Max sum?", "220") || "220");
                  setSettings({ ...settings, sumRange: [min, max] });
                  setFilteredCombinations(Logic.filterBySum(filteredCombinations, min, max));
                  goToStep(Step.EVEN_ODD);
                }}
              ]
            };
            case Step.EVEN_ODD: return {
              title: "Even : Odd Ratio",
              desc: "Balance of even and odd numbers",
              options: [
                { label: 'Exclude 5:0 / 0:5 (Recommended)', action: () => {
                  setSettings({ ...settings, evenOddMode: 'exclude-skewed' });
                  setFilteredCombinations(Logic.filterByEvenOdd(filteredCombinations, 'exclude-skewed'));
                  goToStep(Step.SIZE);
                }},
                { label: 'Only Keep 2:3 / 3:2', action: () => {
                  setSettings({ ...settings, evenOddMode: 'only-balanced' });
                  setFilteredCombinations(Logic.filterByEvenOdd(filteredCombinations, 'only-balanced'));
                  goToStep(Step.SIZE);
                }}
              ]
            };
            case Step.SIZE: return {
              title: "Big : Small Ratio",
              desc: "1-34 Small vs 35-69 Big",
              options: [
                { label: 'Exclude 5:0 / 0:5 (Recommended)', action: () => {
                  setSettings({ ...settings, sizeMode: 'exclude-skewed' });
                  setFilteredCombinations(Logic.filterBySize(filteredCombinations, 'exclude-skewed'));
                  goToStep(Step.CONSECUTIVE);
                }},
                { label: 'Only Keep 2:3 / 3:2', action: () => {
                  setSettings({ ...settings, sizeMode: 'only-balanced' });
                  setFilteredCombinations(Logic.filterBySize(filteredCombinations, 'only-balanced'));
                  goToStep(Step.CONSECUTIVE);
                }}
              ]
            };
            case Step.CONSECUTIVE: return {
              title: "Consecutive Numbers",
              desc: "Limit adjacent numbers (e.g. 12, 13)",
              options: [
                { label: 'Max 1 Pair (Recommended)', action: () => {
                  setSettings({ ...settings, consecutiveMode: 'allow-one-pair' });
                  setFilteredCombinations(Logic.filterByConsecutive(filteredCombinations, 'allow-one-pair'));
                  goToStep(Step.ZONES);
                }},
                { label: 'None Allowed', action: () => {
                  setSettings({ ...settings, consecutiveMode: 'none' });
                  setFilteredCombinations(Logic.filterByConsecutive(filteredCombinations, 'none'));
                  goToStep(Step.ZONES);
                }}
              ]
            };
            case Step.ZONES: return {
              title: "Sector Spread",
              desc: "Spread across 7 number clusters",
              options: [
                { label: '2 - 4 Zones (Recommended)', action: () => {
                  setSettings({ ...settings, zonesMode: { min: 2, max: 4 } });
                  setFilteredCombinations(Logic.filterByZones(filteredCombinations, 2, 4));
                  goToStep(Step.TAIL);
                }},
                { label: '1 - 5 Zones', action: () => {
                  setSettings({ ...settings, zonesMode: { min: 1, max: 5 } });
                  setFilteredCombinations(Logic.filterByZones(filteredCombinations, 1, 5));
                  goToStep(Step.TAIL);
                }},
                { label: 'Exactly 1 Zone', action: () => {
                  setSettings({ ...settings, zonesMode: { min: 1, max: 1 } });
                  setFilteredCombinations(Logic.filterByZones(filteredCombinations, 1, 1));
                  goToStep(Step.TAIL);
                }},
                { label: 'Exactly 5 Zones', action: () => {
                  setSettings({ ...settings, zonesMode: { min: 5, max: 5 } });
                  setFilteredCombinations(Logic.filterByZones(filteredCombinations, 5, 5));
                  goToStep(Step.TAIL);
                }},
                { label: 'Custom Zones', isCustom: true, action: () => {
                  const min = parseInt(prompt("Min zones?", "2") || "2");
                  const max = parseInt(prompt("Max zones?", "4") || "4");
                  setSettings({ ...settings, zonesMode: { min, max } });
                  setFilteredCombinations(Logic.filterByZones(filteredCombinations, min, max));
                  goToStep(Step.TAIL);
                }}
              ]
            };
            case Step.TAIL: return {
              title: "Tail Digit (TAIL)",
              desc: "Same ending digits (e.g. 12, 32)",
              options: [
                { label: 'Max 1 Pair (Recommended)', action: () => {
                  setSettings({ ...settings, tailMode: 'allow-one-pair' });
                  setFilteredCombinations(Logic.filterByTail(filteredCombinations, 'allow-one-pair'));
                  goToStep(Step.RESULT);
                }},
                { label: 'No Pairs Allowed', action: () => {
                  setSettings({ ...settings, tailMode: 'none' });
                  setFilteredCombinations(Logic.filterByTail(filteredCombinations, 'none'));
                  goToStep(Step.RESULT);
                }}
              ]
            };
            default: return { title: "", desc: "", options: [] };
          }
        };

        const stepData = getStepData();
        return (
          <div className="pb-glass p-6 md:p-8 rounded-[2rem] max-w-md mx-auto mx-4 border-white/5 border">
            <h2 className="text-xl font-black text-center uppercase tracking-tight text-white mb-1">{stepData.title}</h2>
            <p className="text-[10px] text-gray-500 mb-6 text-center uppercase tracking-widest font-bold">{stepData.desc}</p>
            <div className="flex flex-col gap-3">
              {stepData.options.map((opt, i) => (
                <button 
                  key={i}
                  onClick={opt.action}
                  className={`p-5 rounded-2xl text-left transition font-bold text-sm active:scale-[0.98] ${
                    opt.isCustom 
                    ? "bg-yellow-500/10 border border-yellow-500/40 text-yellow-500" 
                    : "bg-white/5 border border-white/5 text-gray-200 hover:bg-white/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      case Step.RESULT:
        const finalResults = mode === Mode.ONE_CLICK ? applyAllFilters(allCombinations) : filteredCombinations;
        return (
          <div className="pb-glass p-5 md:p-8 rounded-[2rem] w-full max-w-3xl mx-auto border-white/10 border mx-4 shadow-2xl">
            <div className="flex justify-between items-end mb-6 md:mb-8 border-b border-white/10 pb-4">
               <div>
                 <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">Results</h2>
                 <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-bold">Logic filtering complete</p>
               </div>
               <div className="text-right">
                  <div className="text-yellow-500 font-black text-3xl md:text-4xl leading-none">{finalResults.length}</div>
                  <div className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-widest mt-1 font-bold">Matches</div>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[45vh] md:max-h-[50vh] overflow-y-auto mb-6 pr-1 custom-scrollbar">
              {finalResults.length > 0 ? finalResults.map((combo, idx) => (
                <div key={idx} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex justify-between items-center group active:bg-yellow-500 transition-all">
                  <div className="flex gap-1.5 md:gap-2">
                    {combo.map(n => (
                      <span key={n} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/5 rounded-full font-black text-xs md:text-sm text-yellow-500 group-active:text-black group-active:bg-black/10 transition-colors">
                        {n}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-700 font-black uppercase tracking-tighter">#{idx+1}</div>
                </div>
              )) : (
                <div className="col-span-1 md:col-span-2 py-16 text-center text-gray-500 flex flex-col items-center">
                  <div className="w-12 h-12 mb-4 opacity-20 bg-white/20 rounded-full flex items-center justify-center">!</div>
                  <span className="font-bold text-xs uppercase tracking-widest">Zero Matches Found</span>
                  <span className="text-[10px] mt-2 opacity-50 uppercase tracking-tight">Parameters were too restrictive.</span>
                </div>
              )}
            </div>

            <button 
              onClick={reset}
              className="w-full py-4 md:py-5 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] text-xs md:text-sm hover:bg-yellow-500 transition-all shadow-xl active:scale-95"
            >
              Restart Session
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:justify-center p-4 bg-[#050505] overflow-x-hidden">
      <div className="w-full max-w-4xl flex flex-col">
        {renderHeader()}
        {renderProgress()}
        
        <main className="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderStepContent()}
        </main>

        {currentStep !== Step.INITIAL && (
          <div className="mt-8 flex justify-center mb-8">
             {currentStep !== Step.RESULT && !isCustomCountActive && (
               <button 
                 onClick={goBack}
                 className="flex items-center gap-2 text-gray-600 hover:text-white transition uppercase text-[10px] font-black tracking-[0.3em] active:scale-95 px-4 py-2 bg-white/5 rounded-full"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                 </svg>
                 Back
               </button>
             )}
          </div>
        )}
      </div>
      
      <footer className="mt-auto md:fixed md:bottom-4 text-center w-full text-[8px] md:text-[9px] text-gray-800 uppercase tracking-[0.4em] pointer-events-none font-black pb-4 md:pb-0">
        Lotto Logic Systems • Terminal PB-V2.5
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(1rem); } to { transform: translateY(0); } }
        .animate-in { animation: fade-in 0.3s ease-out, slide-in-from-bottom-4 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
