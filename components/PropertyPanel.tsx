
import React, { useState, useMemo } from 'react';
import { ElementData, AtomState } from '../types';
import { ELEMENTS } from '../constants';
import PeriodicTable from './PeriodicTable';

interface PropertyPanelProps {
  state: AtomState;
  onSelectElement: (protons: number, neutrons: number, electrons: number) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ state, onSelectElement }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const element: ElementData | undefined = ELEMENTS[state.protons];
  
  const charge = state.protons - state.electrons;
  const chargeText = charge === 0 ? "Neutral" : charge > 0 ? `Cation (${charge}+)` : `Anion (${Math.abs(charge)}-)`;
  const chargeColor = charge === 0 ? "text-slate-400" : charge > 0 ? "text-red-600" : "text-blue-600";
  
  const massNumber = state.protons + state.neutrons;
  
  const filteredElements = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    return Object.values(ELEMENTS).filter(
      e => e.name.toLowerCase() === query || e.symbol.toLowerCase() === query
    );
  }, [searchQuery]);

  const handleSelect = (e: ElementData) => {
    const neutrons = Math.round(e.mass) - e.number;
    onSelectElement(e.number, neutrons, e.number);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const getShells = () => {
    let remaining = state.electrons;
    const shells = [];
    const capacities = [2, 8, 18, 32, 50];
    for (const cap of capacities) {
      if (remaining > 0) {
        const count = Math.min(remaining, cap);
        shells.push(count);
        remaining -= count;
      } else {
        break;
      }
    }
    return shells;
  };

  const getDetailedConfiguration = (electronCount: number) => {
    if (electronCount === 0) return "No electrons";
    
    const subshells = [
      { name: '1s', cap: 2 }, { name: '2s', cap: 2 }, { name: '2p', cap: 6 },
      { name: '3s', cap: 2 }, { name: '3p', cap: 6 }, { name: '4s', cap: 2 },
      { name: '3d', cap: 10 }, { name: '4p', cap: 6 }, { name: '5s', cap: 2 },
      { name: '4d', cap: 10 }, { name: '5p', cap: 6 }
    ];

    let remaining = electronCount;
    const result = [];

    for (const sub of subshells) {
      if (remaining <= 0) break;
      const fill = Math.min(remaining, sub.cap);
      
      if (sub.name.endsWith('p') && fill > 0 && electronCount <= 10) {
          const orbitals = ['x', 'y', 'z'];
          let pRem = fill;
          const pParts = [];
          for (let i = 0; i < 3; i++) {
              if (pRem <= 0) break;
              let actualCount = 0;
              if (fill <= 3) actualCount = 1; 
              else if (fill === 4) actualCount = i === 0 ? 2 : 1;
              else if (fill === 5) actualCount = i < 2 ? 2 : 1;
              else actualCount = 2;

              if (i >= fill && fill <= 3) continue; 
              
              const finalCount = Math.min(pRem, actualCount);
              if (finalCount > 0) {
                pParts.push(`${sub.name}${orbitals[i]}${toSuperscript(finalCount)}`);
                pRem -= finalCount;
              }
          }
          pParts.length > 0 ? result.push(...pParts) : null;
      } else {
          result.push(`${sub.name}${toSuperscript(fill)}`);
          remaining -= fill;
      }
    }
    return result.join(', ');
  };

  const toSuperscript = (num: number) => {
    const map: Record<string, string> = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return num.toString().split('').map(char => map[char] || char).join('');
  };

  const shells = getShells();
  const valenceElectrons = shells.length > 0 ? shells[shells.length - 1] : 0;
  const detailedConfig = getDetailedConfiguration(state.electrons);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Fixed Periodic Table at Top */}
      <div className="p-3 border-b border-gray-100 bg-white">
        <PeriodicTable onSelectElement={onSelectElement} currentProtons={state.protons} />
      </div>

      {/* Scrollable Content Below */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-5">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm"></i>
          </div>
          <input
            type="text"
            placeholder="Search element (exact name or symbol)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
          />
          {isSearchFocused && filteredElements.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden">
              {filteredElements.map((e) => (
                <button key={e.number} onClick={() => handleSelect(e)} className="w-full px-5 py-3 text-left hover:bg-blue-50 flex items-center justify-between text-sm">
                  <span><span className="font-bold">{e.name}</span> ({e.symbol})</span>
                  <span className="text-xs font-mono opacity-50">Z={e.number}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {state.protons === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-30">
            <i className="fa-solid fa-atom text-5xl mb-3"></i>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Atomic Void</h2>
            <p className="text-[10px] mt-1 italic">Select an element to begin</p>
          </div>
        ) : !element ? (
          <div className="bg-red-50 p-5 rounded-xl border border-red-100 text-center">
            <p className="text-red-600 font-bold text-sm uppercase italic">Unstable Core / Out of Bounds</p>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl font-black text-slate-900 leading-none">{element.name}</h1>
                <span className="text-base font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg">{element.symbol}</span>
              </div>
              <div className="text-right">
                <p className={`${chargeColor} font-black text-xs uppercase tracking-tight`}>{chargeText}</p>
                <p className="text-xs font-mono text-slate-400">ID #{element.number}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mb-1">Atomic No</p>
                <p className="text-lg font-mono font-black text-slate-800">{element.number}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mb-1">Mass No</p>
                <p className="text-lg font-mono font-black text-slate-800">{massNumber}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mb-1">Period</p>
                <p className="text-lg font-mono font-black text-slate-800">{element.period}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mb-1">Group</p>
                <p className="text-lg font-mono font-black text-slate-800">{element.group}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl shadow-inner border border-slate-800">
              <h4 className="text-[11px] font-black text-yellow-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 Subshell Configuration
              </h4>
              <p className="text-sm font-mono font-bold text-blue-200 tracking-tight whitespace-nowrap overflow-x-auto custom-scrollbar-thin pb-1">
                {detailedConfig}
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex-1 p-2 bg-white border border-gray-100 rounded-xl flex items-center gap-3 overflow-x-auto">
                {shells.map((count, i) => (
                  <div key={i} className="flex flex-col items-center min-w-[32px]">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center border border-blue-100 shadow-sm">
                      {count}
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase mt-1">{['K','L','M','N','O'][i]}</span>
                  </div>
                ))}
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100 flex flex-col items-center min-w-[54px] shadow-sm">
                 <span className="text-[9px] font-black text-amber-600 uppercase mb-0.5">Valence</span>
                 <div className="text-lg font-black text-amber-700 leading-none">{valenceElectrons}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter mb-1">Ionization</span>
                <span className="text-sm font-black text-slate-800">{element.ionizationEnergy || '-'} <span className="text-[10px] font-normal opacity-50">kJ/mol</span></span>
              </div>
              <div className="flex flex-col p-2.5 bg-amber-50/50 rounded-lg border border-amber-100">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter mb-1">Affinity</span>
                <span className="text-sm font-black text-slate-800">{element.electronAffinity !== undefined ? element.electronAffinity : '-'} <span className="text-[10px] font-normal opacity-50">kJ/mol</span></span>
              </div>
              <div className="flex flex-col p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter mb-1">Radius</span>
                <span className="text-sm font-black text-slate-800">{element.atomicRadius || '-'} <span className="text-[10px] font-normal opacity-50">pm</span></span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-black uppercase tracking-wide border border-slate-200">{element.category}</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-black uppercase tracking-wide border border-slate-200">{element.phase}</span>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50/30 to-white rounded-xl border border-gray-100 border-l-4 border-l-blue-500 shadow-sm">
              <h5 className="text-[10px] font-black text-blue-600 uppercase mb-2">Chemical Behavior</h5>
              <p className="text-sm text-slate-700 leading-relaxed italic font-medium">
                <i className="fa-solid fa-quote-left mr-2 opacity-20 text-blue-600"></i>
                {element.reactivity}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;
