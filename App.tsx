
import React, { useState, useEffect } from 'react';
import { Step, Combination, FilterSettings } from './types';
import * as Logic from './utils';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.COUNT);
  const [history, setHistory] = useState<Step[]>([]);
  const [allCombinations, setAllCombinations] = useState<Combination[]>([]);
  const [filteredCombinations, setFilteredCombinations] = useState<Combination[]>([]);
  
  // UI States
  const [isCustomInputActive, setIsCustomInputActive] = useState(false);
  const [customValue, setCustomValue] = useState<string>("100");
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
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevStep = newHistory.pop()!;
    setHistory(newHistory);
    setCurrentStep(prevStep);
    setIsCustomInputActive(false);
  };

  const reset = () => {
    setCurrentStep(Step.COUNT);
    setHistory([]);
    setAllCombinations([]);
    setFilteredCombinations([]);
    setIsCustomInputActive(false);
  };

  const currentCount = filteredCombinations.length;
  const initialCount = allCombinations.length;

  const renderHeader = () => (
    <div className="flex flex-col items-center mb-6 mt-4">
      <div className="w-16 h-16 mb-3 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
        {!imgError ? (
          <img 
            src="logo.png" 
            alt="Logo" 
            className="w-full h-full object-contain p-1"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600">
             <span className="text-black font-black text-xl">PB</span>
          </div>
        )}
      </div>
      <h1 className="text-xl font-black tracking-tight text-white uppercase text-center">
        POWERBALL <span className="text-yellow-500">WHITE NUMS</span>
      </h1>
      <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-[0.3em] font-bold italic">Smart Logic Filter</p>
    </div>
  );

  const renderProgress = () => {
    if (currentStep === Step.RESULT) return null;
    return (
      <div className="w-full max-w-xs mx-auto mb-6 px-2">
        <div className="flex justify-between text-[9px] text-gray-600 mb-1.5 uppercase font-black tracking-tighter">
          <span>STEP {currentStep + 1} / 7</span>
          <span className="text-yellow-600">{currentCount > 0 ? `${currentCount} MATCHES` : 'START'}</span>
        </div>
        <div className="w-full bg-white/5 h-1 rounded-full">
          <div 
            className="h-full bg-yellow-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / 7) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case Step.COUNT:
        if (isCustomInputActive) {
          return (
            <div className="pb-glass p-6 rounded-[2rem] max-w-xs mx-auto text-center border-yellow-500/20 border">
              <h2 className="text-sm font-bold mb-4 uppercase text-gray-400">Custom Generation Count</h2>
              <input 
                type="number" 
                inputMode="numeric"
                min="1" max="100"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full bg-black/40 border-b-2 border-yellow-500 py-4 text-center text-5xl font-black text-white mb-6 outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={() => setIsCustomInputActive(false)} className="flex-1 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase text-gray-500">Cancel</button>
                <button onClick={() => {
                  const n = parseInt(customValue);
                  if (n > 0 && n <= 100) {
                    const combos = Logic.generateCombinations(n);
                    setAllCombinations(combos);
                    setFilteredCombinations(combos);
                    goToStep(Step.SUM);
                  }
                }} className="flex-1 py-3 bg-yellow-500 text-black rounded-xl text-[10px] font-black uppercase shadow-lg shadow-yellow-500/20">Apply</button>
              </div>
            </div>
          );
        }
        return (
          <div className="pb-glass p-6 rounded-[2rem] max-w-xs mx-auto w-full">
            <h2 className="text-sm font-black mb-6 text-center uppercase tracking-widest text-white/80">Select Count</h2>
            <div className="grid grid-cols-2 gap-3">
              {[10, 20, 30, 40, 50].map(c => (
                <button 
                  key={c}
                  onClick={() => {
                    const combos = Logic.generateCombinations(c);
                    setAllCombinations(combos);
                    setFilteredCombinations(combos);
                    goToStep(Step.SUM);
                  }}
                  className="p-6 bg-white/5 rounded-2xl font-black text-2xl text-white border border-white/5 active:scale-95 transition-transform"
                >
                  {c}
                </button>
              ))}
              <button 
                onClick={() => setIsCustomInputActive(true)}
                className="p-6 bg-yellow-500 text-black rounded-2xl font-black text-sm uppercase tracking-tighter active:scale-95 transition-transform"
              >
                Custom
              </button>
            </div>
          </div>
        );

      case Step.SUM:
        return (
          <div className="pb-glass p-6 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border">
            <h2 className="text-sm font-black text-center uppercase text-white mb-1">Sum Filtering</h2>
            <p className="text-[9px] text-gray-500 mb-6 text-center uppercase font-bold">Total sum of 5 balls</p>
            <div className="flex flex-col gap-2">
              {[
                { label: '130 - 220 (Standard)', range: [130, 220] },
                { label: '135 - 215 (Tight)', range: [135, 215] },
                { label: '140 - 210 (Extreme)', range: [140, 210] }
              ].map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setSettings({ ...settings, sumRange: opt.range as [number, number] });
                    setFilteredCombinations(Logic.filterBySum(filteredCombinations, opt.range[0], opt.range[1]));
                    goToStep(Step.EVEN_ODD);
                  }}
                  className="p-4 bg-white/5 rounded-xl text-left font-bold text-xs text-gray-300 border border-white/5 active:bg-white/10"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      case Step.EVEN_ODD:
        return (
          <div className="pb-glass p-6 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border">
            <h2 className="text-sm font-black text-center uppercase text-white mb-1">Balance Ratio</h2>
            <p className="text-[9px] text-gray-500 mb-6 text-center uppercase font-bold">Even vs Odd balance</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => {
                setSettings({ ...settings, evenOddMode: 'exclude-skewed' });
                setFilteredCombinations(Logic.filterByEvenOdd(filteredCombinations, 'exclude-skewed'));
                goToStep(Step.SIZE);
              }} className="p-4 bg-white/5 rounded-xl text-left font-bold text-xs text-gray-300">Exclude 5:0 / 0:5</button>
              <button onClick={() => {
                setSettings({ ...settings, evenOddMode: 'only-balanced' });
                setFilteredCombinations(Logic.filterByEvenOdd(filteredCombinations, 'only-balanced'));
                goToStep(Step.SIZE);
              }} className="p-4 bg-white/5 rounded-xl text-left font-bold text-xs text-gray-300">Only 2:3 or 3:2</button>
            </div>
          </div>
        );

      case Step.SIZE:
        return (
          <div className="pb-glass p-6 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border">
            <h2 className="text-sm font-black text-center uppercase text-white mb-1">Magnitude</h2>
            <p className="text-[9px] text-gray-500 mb-6 text-center uppercase font-bold">Small (1-34) vs Big (35-69)</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => {
                setSettings({ ...settings, sizeMode: 'exclude-skewed' });
                setFilteredCombinations(Logic.filterBySize(filteredCombinations, 'exclude-skewed'));
                goToStep(Step.CONSECUTIVE);
              }} className="p-4 bg-white/5 rounded-xl text-left font-bold text-xs text-gray-300">Exclude 5:0 / 0:5</button>
              <button onClick={() => {
                setSettings({ ...settings, sizeMode: 'only-balanced' });
                setFilteredCombinations(Logic.filterBySize(filteredCombinations, 'only-balanced'));
                goToStep(Step.CONSECUTIVE);
              }} className="p-4 bg-white/5 rounded-xl text-left font-bold text-xs text-gray-300">Only 2:3 or 3:2</button>
            </div>
          </div>
        );

      case Step.CONSECUTIVE:
        return (
          <div className="pb-glass p-6 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border">
            <h2 className="text-sm font-black text-center uppercase text-white mb-1">Neighbor Links</h2>
            <p className="text-[9px] text-gray-500 mb-6 text-center uppercase font-bold">Limit consecutive numbers</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => {
                setSettings({ ...settings, consecutiveMode: 'allow-one-pair' });
                setFilteredCombinations(Logic.filterByConsecutive(filteredCombinations, 'allow-one-pair'));
                goToStep(Step.ZONES);
              }} className="p-4 bg-white/5 rounded-xl text-left font-bold text-xs text-gray-300">Allow Max 1 Pair</button>
              <button onClick={() => {
                setSettings({ ...settings, consecutiveMode: 'none' });
                setFilteredCombinations(Logic.filterByConsecutive(filteredCombinations, 'none'));
                goToStep(Step.ZONES);
              }} className="p-4 bg-white/5 rounded-xl text-left font-bold text-xs text-gray-300">Zero Consecutive</button>
            </div>
          </div>
        );

      case Step.ZONES:
        return (
          <div className="pb-glass p-6 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border">
            <h2 className="text-sm font-black text-center uppercase text-white mb-1">Sector Spread</h2>
            <p className="text-[9px] text-gray-500 mb-6 text-center uppercase font-bold">Distribution across 7 zones</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => {
                setSettings({ ...settings, zonesMode: { min: 2, max: 4 } });
                setFilteredCombinations(Logic.filterByZones(filteredCombinations, 2, 4));
                goToStep(Step.TAIL);
              }} className="p-4 bg-white/5 rounded-xl text-left font-bold text-xs text-gray-300">2 - 4 Zones (Optimal)</button>
              <button onClick={() => {
                setSettings({ ...settings, zonesMode: { min: 3, max: 5 } });
                setFilteredCombinations(Logic.filterByZones(filteredCombinations, 3, 5));
                goToStep(Step.TAIL);
              }} className="p-4 bg-white/5 rounded-xl text-left font-bold text-xs text-gray-300">3 - 5 Zones (High Spread)</button>
            </div>
          </div>
        );

      case Step.TAIL:
        return (
          <div className="pb-glass p-6 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border">
            <h2 className="text-sm font-black text-center uppercase text-white mb-1">End Digits</h2>
            <p className="text-[9px] text-gray-500 mb-6 text-center uppercase font-bold">Same tail matching (e.g. 12, 32)</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => {
                setSettings({ ...settings, tailMode: 'allow-one-pair' });
                setFilteredCombinations(Logic.filterByTail(filteredCombinations, 'allow-one-pair'));
                goToStep(Step.RESULT);
              }} className="p-4 bg-white/5 rounded-xl text-left font-bold text-xs text-gray-300">Allow Max 1 Tail Pair</button>
              <button onClick={() => {
                setSettings({ ...settings, tailMode: 'none' });
                setFilteredCombinations(Logic.filterByTail(filteredCombinations, 'none'));
                goToStep(Step.RESULT);
              }} className="p-4 bg-white/5 rounded-xl text-left font-bold text-xs text-gray-300">Unique Tails Only</button>
            </div>
          </div>
        );

      case Step.RESULT:
        return (
          <div className="pb-glass p-5 rounded-[2rem] w-full max-w-md mx-auto border-white/10 border shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
            <div className="flex justify-between items-end mb-4 border-b border-white/5 pb-4 px-2">
               <div>
                 <h2 className="text-sm font-black uppercase text-white">Generated Lists</h2>
                 <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">Filter complete</p>
               </div>
               <div className="text-right">
                  <div className="text-yellow-500 font-black text-2xl leading-none">{filteredCombinations.length}</div>
                  <div className="text-gray-500 text-[8px] uppercase font-bold">Matches</div>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 pr-1 custom-scrollbar">
              {filteredCombinations.length > 0 ? filteredCombinations.map((combo, idx) => (
                <div key={idx} className="bg-white/[0.03] border border-white/5 p-3 rounded-xl flex justify-between items-center mb-2">
                  <div className="flex gap-1">
                    {combo.map(n => (
                      <span key={n} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full font-black text-[10px] text-yellow-500">
                        {n}
                      </span>
                    ))}
                  </div>
                  <div className="text-[9px] text-gray-700 font-black uppercase italic">P#{idx+1}</div>
                </div>
              )) : (
                <div className="py-12 text-center text-gray-600 flex flex-col items-center">
                  <span className="font-black text-[10px] uppercase tracking-[0.2em]">No Matches</span>
                  <span className="text-[8px] mt-1 opacity-50 uppercase">Try broad filters next time.</span>
                </div>
              )}
            </div>

            <button onClick={reset} className="w-full py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest text-[10px] active:scale-95 transition-transform shadow-lg">New Batch</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-start p-4 bg-[#050505] text-white overflow-x-hidden selection:bg-yellow-500/30">
      <div className="w-full max-w-lg flex flex-col h-full">
        {renderHeader()}
        {renderProgress()}
        
        <main className="flex-1 w-full flex flex-col justify-start">
          {renderStepContent()}
        </main>

        {currentStep !== Step.COUNT && currentStep !== Step.RESULT && (
          <div className="mt-6 flex justify-center mb-4">
             <button onClick={goBack} className="flex items-center gap-2 text-gray-600 hover:text-white transition uppercase text-[9px] font-black tracking-widest px-4 py-2 bg-white/5 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
               </svg>
               Back
             </button>
          </div>
        )}
      </div>
      
      <footer className="mt-auto text-[8px] text-gray-800 uppercase tracking-[0.4em] font-black pb-4 text-center">
        POWERBALL FILTER PB-V2.5
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        body { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
};

export default App;
