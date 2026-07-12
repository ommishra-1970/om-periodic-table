
import React, { useState, useCallback } from 'react';
import AtomVisualizer from './components/AtomVisualizer';
import PropertyPanel from './components/PropertyPanel';
import { AtomState } from './types';
import { MAX_PROTONS } from './constants';

const App: React.FC = () => {
  const [atomState, setAtomState] = useState<AtomState>({
    protons: 1,
    neutrons: 0,
    electrons: 1,
  });

  const updateParticle = useCallback((type: keyof AtomState, delta: number) => {
    setAtomState(prev => {
      const newValue = Math.max(0, prev[type] + delta);
      
      if (type === 'protons' && newValue > MAX_PROTONS) return prev;
      if (type === 'electrons' && newValue > 74) return prev;
      
      if (type === 'neutrons') {
        const stabilityLimit = prev.protons > 20 ? Math.ceil(prev.protons * 1.5) : 30;
        const finalLimit = Math.min(90, stabilityLimit);
        if (newValue > finalLimit) return prev;
      }
      
      if (type === 'protons' && delta < 0) {
        const newStabilityLimit = newValue > 20 ? Math.ceil(newValue * 1.5) : 30;
        const finalLimit = Math.min(90, newStabilityLimit);
        return { 
          ...prev, 
          protons: newValue, 
          neutrons: Math.min(prev.neutrons, finalLimit) 
        };
      }

      return { ...prev, [type]: newValue };
    });
  }, []);

  const handleSelectElement = useCallback((protons: number, neutrons: number, electrons: number) => {
    setAtomState({ protons, neutrons, electrons });
  }, []);

  const resetAtom = () => setAtomState({ protons: 0, neutrons: 0, electrons: 0 });

  const currentNeutronLimit = atomState.protons > 20 ? Math.ceil(atomState.protons * 1.5) : 30;
  const maxNeutrons = Math.min(90, currentNeutronLimit);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white overflow-hidden">
      <div className="flex-1 relative h-[40vh] lg:h-full flex items-center justify-center p-4 lg:p-8 overflow-hidden bg-gray-50/50">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)]"></div>
        
        <div className="z-10 w-full h-full max-w-4xl max-h-4xl">
          <AtomVisualizer state={atomState} />
        </div>

        {/* Minimized Control Panel Sticker */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 w-[90%] lg:w-60 bg-white/80 backdrop-blur-xl p-4 rounded-[1.5rem] border border-gray-200 shadow-xl z-20">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-100 border border-red-500/30 flex items-center justify-center text-red-600 text-sm font-bold shadow-sm">+</div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">Protons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => updateParticle('protons', -1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold transition-colors disabled:opacity-30" disabled={atomState.protons <= 0}>-</button>
                <button onClick={() => updateParticle('protons', 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold transition-colors disabled:opacity-30" disabled={atomState.protons >= MAX_PROTONS}>+</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-400 flex items-center justify-center text-slate-700 text-[10px] font-bold shadow-sm">n</div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">Neutrons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => updateParticle('neutrons', -1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors disabled:opacity-30" disabled={atomState.neutrons <= 0}>-</button>
                <button onClick={() => updateParticle('neutrons', 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors disabled:opacity-30" disabled={atomState.neutrons >= maxNeutrons}>+</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-500/30 flex items-center justify-center text-blue-600 text-sm font-bold shadow-sm">-</div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">Electrons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => updateParticle('electrons', -1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-bold transition-colors disabled:opacity-30" disabled={atomState.electrons <= 0}>-</button>
                <button onClick={() => updateParticle('electrons', 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-bold transition-colors disabled:opacity-30" disabled={atomState.electrons >= 74}>+</button>
              </div>
            </div>

            <button onClick={resetAtom} className="w-full py-2 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-lg mt-1">Clear Atom</button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[680px] bg-white h-full border-l border-gray-200 z-30 shadow-2xl overflow-hidden">
        <PropertyPanel state={atomState} onSelectElement={handleSelectElement} />
      </div>

      {/* App Header / Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 flex items-center gap-2 bg-white/70 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-white/50 z-30">
        <i className="fa-solid fa-atom text-blue-600 text-base"></i>
        <h1 className="text-sm font-black tracking-widest text-slate-800 uppercase italic">Om's Atom lab</h1>
      </div>
    </div>
  );
};

export default App;