/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ArrowRightLeft, ChevronLeft, ChevronRight, Info, Moon, Sun } from 'lucide-react';
import { 
  gregorianToHijri, 
  hijriToGregorian, 
  HIJRI_MONTHS, 
  GREGORIAN_MONTHS,
  HijriDate
} from './utils/calendar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [mode, setMode] = useState<'gToH' | 'hToG'>('gToH');
  const [gDate, setGDate] = useState(new Date());
  const [hDate, setHDate] = useState<HijriDate>({ year: 1446, month: 8, day: 26 }); // Default to a current-ish date
  
  // Sync dates on mount
  useEffect(() => {
    const now = new Date();
    setGDate(now);
    setHDate(gregorianToHijri(now));
  }, []);

  const handleGDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setGDate(newDate);
      setHDate(gregorianToHijri(newDate));
    }
  };

  const handleHDateChange = (field: keyof HijriDate, value: number) => {
    const newHDate = { ...hDate, [field]: value };
    setHDate(newHDate);
    const newGDate = hijriToGregorian(newHDate.year, newHDate.month, newHDate.day);
    setGDate(newGDate);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'gToH' ? 'hToG' : 'gToH');
  };

  const formattedGDate = `${gDate.getDate()} ${GREGORIAN_MONTHS[gDate.getMonth()]} ${gDate.getFullYear()}`;
  const formattedHDate = `${hDate.day} ${HIJRI_MONTHS[hDate.month - 1]} ${hDate.year}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[32px] shadow-xl overflow-hidden border border-black/5"
      >
        {/* Header */}
        <div className="bg-blue-900 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="serif text-4xl md:text-5xl font-medium mb-2">Takvim Dönüştürücü</h1>
            <p className="opacity-80 text-sm md:text-base font-light tracking-wide uppercase">
              Hicri & Miladi Zaman Köprüsü
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Calendar size={120} strokeWidth={1} />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            {/* Left Side (Input/Output) */}
            <div className={cn(
              "flex-1 w-full transition-all duration-500",
              mode === 'hToG' ? "order-3" : "order-1"
            )}>
              <label className="block text-[11px] uppercase tracking-widest text-olive font-bold mb-4 opacity-60">
                Miladi Takvim
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  value={gDate.toISOString().split('T')[0]}
                  onChange={handleGDateChange}
                  className="w-full bg-warm-bg border-none rounded-2xl p-4 text-lg serif focus:ring-2 focus:ring-olive/20 outline-none transition-all"
                />
                <div className="mt-4 p-4 bg-olive/5 rounded-2xl border border-olive/10">
                  <div className="flex items-center gap-3 text-olive mb-1">
                    <Sun size={16} />
                    <span className="text-xs font-semibold uppercase tracking-tighter">Güneş Takvimi</span>
                  </div>
                  <p className="serif text-2xl text-olive">{formattedGDate}</p>
                </div>
              </div>
            </div>

            {/* Switch Button */}
            <div className="order-2">
              <button 
                onClick={toggleMode}
                className="w-12 h-12 rounded-full bg-olive text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-olive/20"
              >
                <ArrowRightLeft size={20} className={cn("transition-transform duration-500", mode === 'hToG' && "rotate-180")} />
              </button>
            </div>

            {/* Right Side (Input/Output) */}
            <div className={cn(
              "flex-1 w-full transition-all duration-500",
              mode === 'hToG' ? "order-1" : "order-3"
            )}>
              <label className="block text-[11px] uppercase tracking-widest text-olive font-bold mb-4 opacity-60">
                Hicri Takvim
              </label>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-olive/60 uppercase ml-1">Gün</span>
                    <select 
                      value={hDate.day}
                      onChange={(e) => handleHDateChange('day', parseInt(e.target.value))}
                      className="w-full bg-warm-bg border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-olive/20 outline-none"
                    >
                      {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-olive/60 uppercase ml-1">Ay</span>
                    <select 
                      value={hDate.month}
                      onChange={(e) => handleHDateChange('month', parseInt(e.target.value))}
                      className="w-full bg-warm-bg border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-olive/20 outline-none"
                    >
                      {HIJRI_MONTHS.map((m, i) => (
                        <option key={m} value={i + 1}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-olive/60 uppercase ml-1">Yıl</span>
                    <input 
                      type="number"
                      value={hDate.year}
                      onChange={(e) => handleHDateChange('year', parseInt(e.target.value))}
                      className="w-full bg-warm-bg border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-olive/20 outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-olive/5 rounded-2xl border border-olive/10">
                  <div className="flex items-center gap-3 text-olive mb-1">
                    <Moon size={16} />
                    <span className="text-xs font-semibold uppercase tracking-tighter">Ay Takvimi</span>
                  </div>
                  <p className="serif text-2xl text-olive">{formattedHDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-warm-bg/50 rounded-2xl p-6 border border-black/5">
            <div className="flex gap-4">
              <div className="mt-1 text-olive">
                <Info size={20} />
              </div>
              <div>
                <h3 className="serif text-xl font-medium text-olive mb-2">Biliyor muydunuz?</h3>
                <p className="text-sm text-olive/70 leading-relaxed">
                  Hicri takvim, Ay'ın evrelerine dayanır ve 354 veya 355 günden oluşur. 
                  Bu nedenle Miladi takvime göre her yıl yaklaşık 11 gün geriye kayar. 
                  Bu uygulama, astronomik hesaplamalar kullanarak en yakın tahmini dönüşümü sağlar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center border-t border-black/5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-olive/40 font-semibold">
            Geleneksel ve Modern Zamanın Buluşma Noktası
          </p>
        </div>
      </motion.div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-olive blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-olive-light blur-[120px]" />
      </div>
    </div>
  );
}
