import React, { useState } from 'react';
import { Step, Combination, GameType } from './types';
import * as Logic from './utils';

interface HistoryItem {
  step: Step;
  data: Combination[];
}

const App: React.FC = () => {
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.HOME);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [allCombinations, setAllCombinations] = useState<Combination[]>([]);
  const [filteredCombinations, setFilteredCombinations] = useState<Combination[]>([]);
  
    const logoUrl = `${import.meta.env.BASE_URL}Logo.jpeg`;

const [isCustomInputActive, setIsCustomInputActive] = useState(false);
  const [customValue, setCustomValue] = useState<string>("100");

  const goToStep = (next: Step, newData?: Combination[]) => {
    // Store current step and data state BEFORE applying the new filter
    setHistory(prev => [...prev, { step: currentStep, data: [...filteredCombinations] }]);
    
    if (newData) {
      setFilteredCombinations(newData);
    }
    
    setCurrentStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const lastState = newHistory.pop()!;
    
    setHistory(newHistory);
    setCurrentStep(lastState.step);
    setFilteredCombinations(lastState.data);
    
    setIsCustomInputActive(false);
    if (lastState.step === Step.HOME) {
      setGameType(null);
      setAllCombinations([]);
      setFilteredCombinations([]);
    }
  };

  const reset = () => {
    setCurrentStep(Step.HOME);
    setGameType(null);
    setHistory([]);
    setAllCombinations([]);
    setFilteredCombinations([]);
    setIsCustomInputActive(false);
  };

  const selectGame = (type: GameType) => {
    setGameType(type);
    goToStep(Step.COUNT);
  };

  const renderHeader = () => {
    if (!gameType) {
      return (
        <header className="w-full flex flex-col items-center pt-6 pb-2 px-6 z-20">
          <div className="text-center">
            <h1 className="text-[14px] font-black tracking-[0.8em] text-white uppercase opacity-90">LOTTO LOGIC</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-[1px] w-4 bg-yellow-500/30"></span>
              <p className="text-[9px] text-yellow-500/80 uppercase tracking-[0.3em] font-bold">Entropy Reduction Filter</p>
              <span className="h-[1px] w-4 bg-yellow-500/30"></span>
            </div>
          </div>
        </header>
      );
    }

    return (
      <header className="w-full flex flex-col items-center pt-1 pb-4 px-6 z-20">
        <div className="w-full max-w-sm mb-4 pb-glass border border-white/10 rounded-xl flex items-center justify-between px-3 py-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center p-0.5 overflow-hidden">
              <img 
                src={logoUrl} 
                alt="LL" 
                className="w-full h-full object-contain mix-blend-multiply"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-[8px] font-black text-black">LL</span>';
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black tracking-[0.1em] text-white">LOTTO LOGIC</span>
              <span className="text-[5px] font-bold tracking-[0.05em] text-white/30 uppercase leading-none">Enterprise Analysis</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[6px] text-yellow-500 font-black tracking-widest uppercase">Entropy Reduction</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">
            {gameType === GameType.POWERBALL ? 'POWER' : 'MEGA'}<span className="text-yellow-500">BALL</span>
          </h1>
          <div className="bg-white/5 px-3 py-1 rounded-full mt-1.5 border border-white/10">
            <p className="text-[8px] text-gray-400 uppercase tracking-[0.3em] font-black leading-none">WHITE NUMBER GENERATOR</p>
          </div>
        </div>
      </header>
    );
  };

  const renderProgress = () => {
    if (currentStep === Step.HOME || currentStep === Step.RESULT) return null;
    return (
      <div className="w-full max-w-xs mx-auto mb-4 px-4">
        <div className="flex justify-between text-[8px] text-gray-500 mb-1 uppercase font-black tracking-[0.2em]">
          <span>PHASE 0{currentStep}</span>
          <span className="text-yellow-500">{filteredCombinations.length} MATCHES REMAINING</span>
        </div>
        <div className="w-full bg-white/5 h-[1.5px] rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-out bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case Step.HOME:
        return (
          <div className="flex flex-col gap-4 w-full max-w-sm mx-auto px-6 py-2">
            <div className="flex flex-col items-center gap-3 pb-2">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2 overflow-hidden shadow-xl">
                <img
                  src={logoUrl}
                  alt="Lotto Logic"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-xs font-black text-black">LL</span>';
                    }
                  }}
                />
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">
                Choose a tool
              </p>
            </div>

            <button 
              onClick={() => selectGame(GameType.POWERBALL)}
              className="group relative h-36 bg-gradient-to-br from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] rounded-[2rem] overflow-hidden border border-white/20 active:scale-95 transition-all shadow-xl"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute top-8 left-8 text-white text-left z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-80 mb-1">Lottery Classic</p>
                <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter italic">Powerball</h2>
              </div>
              <div className="absolute -bottom-6 -right-6 text-white/10 font-black text-[10rem] italic select-none pointer-events-none">PB</div>
            </button>
            <button 
              onClick={() => selectGame(GameType.MEGA_MILLIONS)}
              className="group relative h-36 bg-gradient-to-br from-[#FFD700] via-[#DAA520] to-[#8B4513] rounded-[2rem] overflow-hidden border border-white/20 active:scale-95 transition-all shadow-xl"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute top-8 left-8 text-blue-950 text-left z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-80 mb-1">Jackpot Master</p>
                <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter italic">Mega Millions</h2>
              </div>
              <div className="absolute -bottom-6 -right-6 text-blue-950/5 font-black text-[10rem] italic select-none pointer-events-none">MM</div>
            </button>
          </div>
        );

      case Step.COUNT:
        if (isCustomInputActive) {
          return (
            <div className="pb-glass p-6 rounded-[2rem] max-w-xs mx-auto text-center border-yellow-500/30 border shadow-2xl">
              <h2 className="text-[9px] font-black mb-4 uppercase tracking-[0.3em] text-gray-500">Manual Entry</h2>
              <input 
                type="number" inputMode="numeric" min="1" max="500"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full bg-transparent border-b border-yellow-500 py-2 text-center text-6xl font-black text-white mb-6 outline-none"
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={() => setIsCustomInputActive(false)} className="flex-1 py-4 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500">Cancel</button>
                <button onClick={() => {
                  const n = parseInt(customValue);
                  if (n > 0 && n <= 500) {
                    const combos = Logic.generateCombinations(n, gameType!);
                    setAllCombinations(combos);
                    goToStep(Step.SUM, combos);
                  }
                }} className="flex-1 py-4 bg-yellow-500 text-black rounded-xl text-[9px] font-black uppercase tracking-widest">Confirm</button>
              </div>
            </div>
          );
        }
        return (
          <div className="pb-glass p-6 rounded-[2rem] max-w-xs mx-auto w-full shadow-2xl border border-white/5">
            <h2 className="text-[9px] font-black mb-6 text-center uppercase tracking-[0.4em] text-white/40">Initial Batch Size</h2>
            <div className="grid grid-cols-2 gap-3">
              {[10, 20, 30, 40, 50].map(c => (
                <button 
                  key={c}
                  onClick={() => {
                    const combos = Logic.generateCombinations(c, gameType!);
                    setAllCombinations(combos);
                    goToStep(Step.SUM, combos);
                  }}
                  className="p-6 bg-white/5 rounded-2xl font-black text-2xl text-white border border-white/5 active:scale-95 transition-all"
                >
                  {c}
                </button>
              ))}
              <button onClick={() => setIsCustomInputActive(true)} className="p-6 bg-yellow-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-tighter active:scale-95 transition-all">Custom</button>
            </div>
          </div>
        );

      case Step.SUM:
        if (gameType === GameType.POWERBALL) {
          return (
            <div className="pb-glass p-6 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border text-center shadow-2xl">
              <h2 className="text-[9px] font-black mb-2 uppercase tracking-[0.3em] text-white/40">Sum Range</h2>
              <div className="flex flex-col gap-2">
                <button onClick={() => {
                  goToStep(Step.EVEN_ODD, Logic.filterBySum(filteredCombinations, 130, 220));
                }} className="p-4 bg-yellow-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">Optimal: 130-220</button>
                <button onClick={() => {
                  goToStep(Step.EVEN_ODD, Logic.filterBySum(filteredCombinations, 135, 215));
                }} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white">Precise: 135-215</button>
                <button onClick={() => {
                  goToStep(Step.EVEN_ODD, Logic.filterBySum(filteredCombinations, 140, 210));
                }} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white">Narrow: 140-210</button>
                <button onClick={() => goToStep(Step.EVEN_ODD)} className="p-4 bg-transparent border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500">Skip Filter</button>
              </div>
            </div>
          );
        } else {
          return (
            <div className="pb-glass p-8 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border text-center shadow-2xl">
              <h2 className="text-[9px] font-black mb-2 uppercase tracking-[0.3em] text-white/40">Sum Range</h2>
              <div className="flex flex-col gap-3">
                <button onClick={() => {
                  goToStep(Step.EVEN_ODD, Logic.filterBySum(filteredCombinations, 132, 222));
                }} className="p-5 bg-yellow-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">Optimal: 132-222</button>
                <button onClick={() => goToStep(Step.EVEN_ODD)} className="p-5 bg-transparent border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500">Skip Filter</button>
              </div>
            </div>
          );
        }

      case Step.EVEN_ODD:
        const isPB_EO = gameType === GameType.POWERBALL;
        return (
          <div className="pb-glass p-8 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border text-center shadow-2xl">
            <h2 className="text-[9px] font-black mb-6 uppercase tracking-[0.3em] text-white/40">Even/Odd Ratio</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => {
                goToStep(Step.SIZE, Logic.filterByEvenOdd(filteredCombinations, isPB_EO ? 'exclude-skewed' : 'only-balanced'));
              }} className="p-5 bg-yellow-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">
                Optimal: {isPB_EO ? 'Exclude Extremes (0:5 / 5:0)' : 'Balanced Ratio (2:3 / 3:2)'}
              </button>
              <button onClick={() => {
                goToStep(Step.SIZE, Logic.filterByEvenOdd(filteredCombinations, isPB_EO ? 'only-balanced' : 'exclude-skewed'));
              }} className="p-5 bg-white/5 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">
                {isPB_EO ? 'Strict Balanced (2:3 / 3:2)' : 'Exclude Extremes (0:5 / 5:0)'}
              </button>
              <button onClick={() => goToStep(Step.SIZE)} className="p-5 bg-transparent border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500">Skip Step</button>
            </div>
          </div>
        );

      case Step.SIZE:
        const isPB_Size = gameType === GameType.POWERBALL;
        return (
          <div className="pb-glass p-8 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border text-center shadow-2xl">
            <h2 className="text-[9px] font-black mb-6 uppercase tracking-[0.3em] text-white/40">Big/Small Ratio</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => {
                goToStep(Step.CONSECUTIVE, Logic.filterBySize(filteredCombinations, isPB_Size ? 'exclude-skewed' : 'only-balanced', gameType!));
              }} className="p-5 bg-yellow-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">
                Optimal: {isPB_Size ? 'Exclude Extremes (0:5 / 5:0)' : 'Balanced Ratio (2:3 / 3:2)'}
              </button>
              <button onClick={() => {
                goToStep(Step.CONSECUTIVE, Logic.filterBySize(filteredCombinations, isPB_Size ? 'only-balanced' : 'exclude-skewed', gameType!));
              }} className="p-5 bg-white/5 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">
                {isPB_Size ? 'Strict Balanced (2:3 / 3:2)' : 'Exclude Extremes (0:5 / 5:0)'}
              </button>
              <button onClick={() => goToStep(Step.CONSECUTIVE)} className="p-5 bg-transparent border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500">Skip Step</button>
            </div>
          </div>
        );

      case Step.CONSECUTIVE:
        return (
          <div className="pb-glass p-8 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border text-center shadow-2xl">
            <h2 className="text-[9px] font-black mb-6 uppercase tracking-[0.3em] text-white/40">Consecutive Pairs</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => {
                goToStep(Step.ZONES, Logic.filterByConsecutive(filteredCombinations, 'allow-one-pair'));
              }} className="p-5 bg-yellow-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">Optimal: Max 1 Pair</button>
              <button onClick={() => {
                goToStep(Step.ZONES, Logic.filterByConsecutive(filteredCombinations, 'none'));
              }} className="p-5 bg-white/5 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">No Consecutive Pairs</button>
              <button onClick={() => goToStep(Step.ZONES)} className="p-5 bg-transparent border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500">Skip Step</button>
            </div>
          </div>
        );

      case Step.ZONES:
        return (
          <div className="pb-glass p-8 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border text-center shadow-2xl">
            <h2 className="text-[9px] font-black mb-3 uppercase tracking-[0.3em] text-white/40">Zone Coverage</h2>
            <p className="text-[10px] text-gray-400 mb-6 leading-relaxed font-medium">Distribution across sectors (0-9, 10-19...).</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => {
                goToStep(Step.TAIL, Logic.filterByZones(filteredCombinations, 3, 4));
              }} className="p-5 bg-yellow-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">Optimal: 3-4 Zones</button>
              {gameType === GameType.POWERBALL && (
              <button onClick={() => {
                goToStep(Step.TAIL, Logic.filterByZones(filteredCombinations, 5, 5));
              }} className="p-5 bg-white/5 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">Maximum: 5 Zones</button>
            )}
              <button onClick={() => goToStep(Step.TAIL)} className="p-5 bg-transparent border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500">Skip Step</button>
            </div>
          </div>
        );

      case Step.TAIL:
        return (
          <div className="pb-glass p-8 rounded-[2rem] max-w-xs mx-auto w-full border-white/5 border text-center shadow-2xl">
            <h2 className="text-[9px] font-black mb-3 uppercase tracking-[0.3em] text-white/40">Ending Digits</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => {
                goToStep(Step.RESULT, Logic.filterByTail(filteredCombinations, 'allow-one-pair'));
              }} className="p-5 bg-yellow-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">At least one same-tail pair</button>
              <button onClick={() => {
                goToStep(Step.RESULT, Logic.filterByTail(filteredCombinations, 'none'));
              }} className="p-5 bg-white/5 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">No same tail digits</button>
              <button onClick={() => goToStep(Step.RESULT)} className="p-5 bg-transparent border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500">Skip Step</button>
            </div>
          </div>
        );

      case Step.RESULT:
        return (
          <div className="w-full max-w-sm mx-auto px-6 pb-24">
            <div className="text-center mb-6">
              <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-yellow-500 mb-1">Algorithm Complete</h2>
              <p className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Qualified<br/>Selection</p>
            </div>
            
            <div className="flex flex-col gap-2.5">
              {filteredCombinations.length > 0 ? (
                filteredCombinations.map((combo, idx) => (
                  <div key={idx} className="pb-glass p-4 rounded-2xl flex justify-between items-center border border-white/10 group hover:border-yellow-500/50 transition-all duration-300">
                    <div className="flex gap-1.5">
                      {combo.map((n, i) => (
                        <div key={i} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[12px] font-black text-white border border-white/10 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                          {n}
                        </div>
                      ))}
                    </div>
                    <div className="text-[8px] font-black text-white/20 uppercase tracking-widest pl-2">#{idx + 1}</div>
                  </div>
                ))
              ) : (
                <div className="text-center p-10 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 text-gray-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                  </div>
                  <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed">No combinations survived<br/>the current filter set.</p>
                </div>
              )}
            </div>

            <button 
              onClick={reset}
              className="w-full mt-8 py-5 bg-white text-black rounded-full text-[9px] font-black uppercase tracking-[0.4em] shadow-lg active:scale-95 transition-all"
            >
              Start New Analysis
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden pb-16">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-red-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-yellow-500/5 blur-[150px] rounded-full" />
      </div>

      <nav className="relative z-30 flex justify-between items-center px-8 py-3 max-w-lg mx-auto">
        {currentStep !== Step.HOME ? (
          <button onClick={goBack} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 active:scale-90 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
        ) : <div className="w-8 h-8" />}
        
        <div className="flex-1" />
        
        {currentStep !== Step.HOME && (
          <button onClick={reset} className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 py-1.5 px-3 bg-white/5 rounded-lg border border-white/5">
            Reset
          </button>
        )}
      </nav>

      <main className="relative z-10">
        {renderHeader()}
        {renderProgress()}
        <div className="transition-all duration-700 ease-in-out">
          {renderStepContent()}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full py-3 text-center z-50 bg-black/80 backdrop-blur-xl border-t border-white/5">
        <a 
          href="https://www.youtube.com/@Lottologic" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-full transition-all duration-300 group"
        >
          <svg className="w-3 h-3 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="text-[8px] font-black uppercase tracking-[0.15em]">Lotto Logic on YouTube</span>
        </a>
      </footer>

      <style>{`
        .pb-glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        ::selection {
          background: #eab308;
          color: black;
        }
        body {
          overscroll-behavior-y: none;
          max-height: 100vh;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-top-4 {
          from { transform: translateY(-0.5rem); }
          to { transform: translateY(0); }
        }
        .animate-in {
          animation-duration: 500ms;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .slide-in-from-top-4 {
          animation-name: slide-in-from-top-4;
        }
      `}</style>
    </div>
  );
};

export default App;