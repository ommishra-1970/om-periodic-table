
import React, { useState } from 'react';
import { ELEMENTS } from '../constants';
import { ElementData } from '../types';

interface PeriodicTableProps {
  onSelectElement: (protons: number, neutrons: number, electrons: number) => void;
  currentProtons: number;
}

type FilterType = 'ALL' | 'METAL' | 'NONMETAL' | 'METALLOID' | 'SOLID' | 'LIQUID' | 'GAS' | 'S-BLOCK' | 'P-BLOCK' | 'D-BLOCK' | 'F-BLOCK';

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onSelectElement, currentProtons }) => {
  const [filter, setFilter] = useState<FilterType>('ALL');

  const positions: Record<number, [number, number]> = {
    1: [2, 1], 2: [2, 18],
    3: [3, 1], 4: [3, 2], 5: [3, 13], 6: [3, 14], 7: [3, 15], 8: [3, 16], 9: [3, 17], 10: [3, 18],
    11: [4, 1], 12: [4, 2], 13: [4, 13], 14: [4, 14], 15: [4, 15], 16: [4, 16], 17: [4, 17], 18: [4, 18],
    19: [5, 1], 20: [5, 2], 21: [5, 3], 22: [5, 4], 23: [5, 5], 24: [5, 6], 25: [5, 7], 26: [5, 8], 27: [5, 9], 28: [5, 10], 29: [5, 11], 30: [5, 12], 31: [5, 13], 32: [5, 14], 33: [5, 15], 34: [5, 16], 35: [5, 17], 36: [5, 18],
    37: [6, 1], 38: [6, 2], 39: [6, 3], 40: [6, 4], 41: [6, 5], 42: [6, 6], 43: [6, 7], 44: [6, 8], 45: [6, 9], 46: [6, 10], 47: [6, 11], 48: [6, 12], 49: [6, 13], 50: [6, 14], 51: [6, 15], 52: [6, 16], 53: [6, 17], 54: [6, 18],
    55: [7, 1], 56: [7, 2], 71: [7, 3], 72: [7, 4], 73: [7, 5], 74: [7, 6], 75: [7, 7], 76: [7, 8], 77: [7, 9], 78: [7, 10], 79: [7, 11], 80: [7, 12], 81: [7, 13], 82: [7, 14], 83: [7, 15], 84: [7, 16], 85: [7, 17], 86: [7, 18],
    87: [8, 1], 88: [8, 2], 103: [8, 3], 104: [8, 4], 105: [8, 5], 106: [8, 6], 107: [8, 7], 108: [8, 8], 109: [8, 9], 110: [8, 10], 111: [8, 11], 112: [8, 12], 113: [8, 13], 114: [8, 14], 115: [8, 15], 116: [8, 16], 117: [8, 17], 118: [8, 18],
    57: [10, 4], 58: [10, 5], 59: [10, 6], 60: [10, 7], 61: [10, 8], 62: [10, 9], 63: [10, 10], 64: [10, 11], 65: [10, 12], 66: [10, 13], 67: [10, 14], 68: [10, 15], 69: [10, 16], 70: [10, 17],
    89: [11, 4], 90: [11, 5], 91: [11, 6], 92: [11, 7], 93: [11, 8], 94: [11, 9], 95: [11, 10], 96: [11, 11], 97: [11, 12], 98: [11, 13], 99: [11, 14], 100: [11, 15], 101: [11, 16], 102: [11, 17]
  };

  const getElementBlock = (e: ElementData): string => {
    const num = e.number;
    const grp = e.group;
    if ((num >= 57 && num <= 71) || (num >= 89 && num <= 103)) return 'f';
    if (grp === 1 || grp === 2 || num === 2) return 's';
    if (grp >= 13 && grp <= 18) return 'p';
    if (grp >= 3 && grp <= 12) return 'd';
    return '';
  };

  const isElementVisible = (e: ElementData) => {
    if (filter === 'ALL') return true;
    const cat = e.category.toLowerCase();
    const phase = e.phase.toLowerCase();
    const block = getElementBlock(e);

    if (filter === 'METAL') return cat.includes('metal') || cat.includes('actinide') || cat.includes('lanthanide');
    if (filter === 'NONMETAL') return cat.includes('nonmetal') || cat.includes('noble gas') || cat.includes('halogen');
    if (filter === 'METALLOID') return cat.includes('metalloid');
    if (filter === 'SOLID') return phase === 'solid';
    if (filter === 'LIQUID') return phase === 'liquid';
    if (filter === 'GAS') return phase === 'gas';
    if (filter === 'S-BLOCK') return block === 's';
    if (filter === 'P-BLOCK') return block === 'p';
    if (filter === 'D-BLOCK') return block === 'd';
    if (filter === 'F-BLOCK') return block === 'f';
    return true;
  };

  const handleClick = (e: ElementData) => {
    const neutrons = Math.round(e.mass) - e.number;
    onSelectElement(e.number, neutrons, e.number);
  };

  const getCategoryStyles = (category: string, isActive: boolean, isFilteredOut: boolean) => {
    const base = "border transition-all duration-200 ease-out shadow-sm ";
    const opacity = isFilteredOut ? "opacity-10 grayscale scale-90 pointer-events-none" : "opacity-100";
    
    let color = 'bg-slate-600 text-white border-slate-400 hover:bg-slate-500';
    if (category.includes('Noble Gas')) color = isActive ? 'bg-indigo-700 text-white border-white' : 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500';
    else if (category.includes('Alkali Metal')) color = isActive ? 'bg-rose-700 text-white border-white' : 'bg-rose-600 text-white border-rose-400 hover:bg-rose-500';
    else if (category.includes('Alkaline Earth')) color = isActive ? 'bg-orange-700 text-white border-white' : 'bg-orange-600 text-white border-orange-400 hover:bg-orange-500';
    else if (category.includes('Transition Metal')) color = isActive ? 'bg-amber-600 text-white border-white' : 'bg-amber-500 text-white border-amber-300 hover:bg-amber-400';
    else if (category.includes('Metalloid')) color = isActive ? 'bg-emerald-700 text-white border-white' : 'bg-emerald-600 text-white border-emerald-400 hover:bg-emerald-500';
    else if (category.includes('Halogen')) color = isActive ? 'bg-sky-700 text-white border-white' : 'bg-sky-600 text-white border-sky-400 hover:bg-sky-500';
    else if (category.includes('Lanthanide')) color = isActive ? 'bg-fuchsia-700 text-white border-white' : 'bg-fuchsia-600 text-white border-fuchsia-400 hover:bg-fuchsia-500';
    else if (category.includes('Actinide')) color = isActive ? 'bg-pink-800 text-white border-white' : 'bg-pink-700 text-white border-pink-500 hover:bg-pink-600';
    else if (category.includes('Reactive Nonmetal')) color = isActive ? 'bg-green-700 text-white border-white' : 'bg-green-600 text-white border-green-400 hover:bg-green-500';
    else if (category.includes('Post-transition')) color = isActive ? 'bg-cyan-700 text-white border-white' : 'bg-cyan-600 text-white border-cyan-400 hover:bg-cyan-500';

    return `${base} ${color} ${opacity}`;
  };

  const FilterButton = ({ type, label }: { type: FilterType, label: string }) => (
    <button 
      onClick={() => setFilter(type)}
      className={`px-1.5 py-0.5 rounded text-[8px] font-black transition-all border shrink-0 ${
        filter === type 
          ? 'bg-blue-600 text-white border-blue-400 shadow-sm' 
          : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 shadow-2xl flex flex-col gap-2 w-full max-w-full">
      <div className="flex flex-col gap-1.5 px-0.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 shrink-0">
            <i className="fa-solid fa-flask-vial text-blue-500"></i>
            PERIODIC TABLE
          </h3>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            <FilterButton type="ALL" label="ALL" />
            <FilterButton type="METAL" label="METALS" />
            <FilterButton type="NONMETAL" label="NON-MET" />
            <FilterButton type="METALLOID" label="METLD" />
          </div>
        </div>
        <div className="flex items-center justify-start gap-1 overflow-x-auto no-scrollbar border-t border-slate-900 pt-1.5">
          <FilterButton type="SOLID" label="SOLID" />
          <FilterButton type="LIQUID" label="LIQ" />
          <FilterButton type="GAS" label="GAS" />
          <div className="w-[1px] h-3 bg-slate-800 mx-1 shrink-0" />
          <FilterButton type="S-BLOCK" label="s-block" />
          <FilterButton type="P-BLOCK" label="p-block" />
          <FilterButton type="D-BLOCK" label="d-block" />
          <FilterButton type="F-BLOCK" label="f-block" />
        </div>
      </div>
      
      <div 
        className="grid grid-cols-18 gap-[1px] relative select-none w-full bg-slate-900/50 p-1 rounded-sm" 
        style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
      >
        {/* Separator Gap */}
        <div style={{ gridRow: 9, gridColumn: 1, gridColumnEnd: 19 }} className="h-1" />

        {/* Labels for Lanthanides and Actinides - NOW BRIGHT WHITE */}
        <div style={{ gridRow: 10, gridColumn: 1, gridColumnEnd: 4 }} className="flex items-center justify-end pr-1 text-[7px] font-black text-white uppercase italic tracking-tighter">
          Lanthanides
        </div>
        <div style={{ gridRow: 11, gridColumn: 1, gridColumnEnd: 4 }} className="flex items-center justify-end pr-1 text-[7px] font-black text-white uppercase italic tracking-tighter">
          Actinides
        </div>

        {Object.values(ELEMENTS).map((e) => {
          const pos = positions[e.number];
          if (!pos) return null;
          const [row, col] = pos;
          const isActive = currentProtons === e.number;
          const isFilteredOut = !isElementVisible(e);
          
          return (
            <button
              key={e.number}
              onClick={() => handleClick(e)}
              style={{ gridRow: row, gridColumn: col }}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-[1px] relative
                group active:scale-90 transition-all
                ${isActive ? 'z-30 ring-1 ring-white scale-110 shadow-lg' : 'z-10 hover:z-40 hover:scale-[1.5]'}
                ${getCategoryStyles(e.category, isActive, isFilteredOut)}
              `}
              title={`${e.name} (${e.symbol})`}
            >
              <span className={`font-black leading-none pointer-events-none ${isActive ? 'text-[11px]' : 'text-[10px]'}`}>
                {e.symbol}
              </span>
              <span className={`leading-none mt-0.5 font-bold opacity-60 pointer-events-none ${isActive ? 'text-[6.5px]' : 'text-[5.5px]'}`}>
                {e.number}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PeriodicTable;
