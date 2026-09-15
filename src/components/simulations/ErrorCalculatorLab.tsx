import React, { useState, useMemo } from 'react';
import { Calculator, CheckCircle2, RefreshCw, BookOpen } from 'lucide-react';
import { Latex } from '../Latex';

export const ErrorCalculatorLab: React.FC = () => {
  // Mode: Vernier Caliper practice vs Error Data Calculation
  const [caliperValue, setCaliperValue] = useState<number>(18.45); // mm

  // Measurement trials data (5 trials)
  const [trials, setTrials] = useState<number[]>([18.4, 18.5, 18.4, 18.6, 18.5]);
  const [instrumentError, setInstrumentError] = useState<number>(0.05); // mm
  const [unit, setUnit] = useState<string>('mm');
  const [quantityName, setQuantityName] = useState<string>('d (Đường kính bi thép)');

  // Presets
  const applyPreset = (preset: 'ball' | 'time' | 'length') => {
    if (preset === 'ball') {
      setQuantityName('d (Đường kính bi thép)');
      setUnit('mm');
      setInstrumentError(0.05);
      setTrials([18.4, 18.5, 18.4, 18.6, 18.5]);
    } else if (preset === 'time') {
      setQuantityName('t (Thời gian rơi tự do)');
      setUnit('s');
      setInstrumentError(0.001);
      setTrials([0.404, 0.402, 0.405, 0.403, 0.404]);
    } else {
      setQuantityName('L (Chiều dài thanh nhôm)');
      setUnit('cm');
      setInstrumentError(0.1);
      setTrials([45.2, 45.3, 45.1, 45.2, 45.4]);
    }
  };

  // Math derivations
  const calculation = useMemo(() => {
    const n = trials.length;
    if (n === 0) return null;

    // 1. Mean value
    const sum = trials.reduce((acc, v) => acc + v, 0);
    const mean = sum / n;

    // 2. Deviations
    const deviations = trials.map((v) => Math.abs(mean - v));
    const meanDeviation = deviations.reduce((acc, d) => acc + d, 0) / n;

    // 3. Absolute error
    const absoluteError = meanDeviation + instrumentError;

    // 4. Relative error
    const relativeError = (absoluteError / mean) * 100;

    return {
      mean,
      deviations,
      meanDeviation,
      absoluteError,
      relativeError,
    };
  }, [trials, instrumentError]);

  const handleTrialChange = (index: number, val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const next = [...trials];
      next[index] = num;
      setTrials(next);
    }
  };

  return (
    <div id="error-calculator-lab-container" className="space-y-6">
      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Chọn mẫu thí nghiệm:</span>
          <button
            onClick={() => applyPreset('ball')}
            className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Đo đường kính bi thép ($d$)
          </button>
          <button
            onClick={() => applyPreset('time')}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Đo thời gian rơi tự do ($t$)
          </button>
          <button
            onClick={() => applyPreset('length')}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Đo chiều dài thanh nhôm ($L$)
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Quy chuẩn: <span className="text-sky-400 font-bold">SGK Vật lí 10 (Trang 18)</span>
        </div>
      </div>

      {/* Interactive Vernier Caliper Demo */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" /> Thước kẹp cơ khí (Vernier Caliper - ĐCNN 0.05mm)
          </h4>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
            Số đo hiển thị: {caliperValue.toFixed(2)} mm
          </span>
        </div>

        {/* Visual Simulated Vernier Caliper Bar */}
        <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
          <div className="min-w-[600px] h-28 relative select-none">
            {/* Main Ruler Blade (Thân thước chính) */}
            <div className="absolute top-2 left-0 right-0 h-14 bg-gradient-to-b from-slate-400 to-slate-500 rounded-sm border border-slate-600">
              {/* Millimeter Ticks */}
              {Array.from({ length: 41 }, (_, i) => i).map((cmVal) => {
                const px = cmVal * 15;
                const isCm = cmVal % 10 === 0;
                const is5mm = cmVal % 5 === 0 && !isCm;
                return (
                  <div key={cmVal} className="absolute bottom-0" style={{ left: `${px}px` }}>
                    <div
                      className={`w-[1px] bg-slate-900 ${isCm ? 'h-7' : is5mm ? 'h-5' : 'h-3'}`}
                    />
                    {isCm && (
                      <span className="absolute -bottom-4 -translate-x-1/2 text-[9px] font-bold text-slate-900 font-mono">
                        {cmVal / 10}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sliding Vernier Jaw (Du xích trượt) */}
            <div
              className="absolute top-0 h-24 w-36 bg-gradient-to-b from-slate-300 to-slate-400 rounded border-2 border-slate-700 shadow-xl transition-all"
              style={{ left: `${caliperValue * 1.5}px` }}
            >
              {/* Vernier scale (0 to 10 with 0.05 steps) */}
              <div className="relative w-full h-12 border-b border-slate-500">
                <div className="absolute top-0 left-2 text-[9px] font-bold text-slate-800 font-mono">
                  Du xích (0.05)
                </div>
                {/* 0 marker line */}
                <div className="absolute top-4 left-4 w-[2px] h-6 bg-rose-600">
                  <span className="absolute -bottom-3 -translate-x-1/2 text-[8px] font-bold text-rose-700">0</span>
                </div>
                {/* 5 marker line */}
                <div className="absolute top-4 left-[64px] w-[1px] h-5 bg-slate-800">
                  <span className="absolute -bottom-3 -translate-x-1/2 text-[8px] font-bold text-slate-800">5</span>
                </div>
                {/* 10 marker line */}
                <div className="absolute top-4 left-[124px] w-[1px] h-6 bg-slate-800">
                  <span className="absolute -bottom-3 -translate-x-1/2 text-[8px] font-bold text-slate-800">10</span>
                </div>
              </div>
              <div className="p-1 text-center text-[10px] text-slate-800 font-semibold">
                Mỏ kẹp động
              </div>
            </div>
          </div>
        </div>

        {/* Caliper Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Kéo trượt mỏ kẹp thước:</span>
            <span className="font-mono text-cyan-400 font-bold">{caliperValue.toFixed(2)} mm</span>
          </div>
          <input
            type="range"
            min="5"
            max="35"
            step="0.05"
            value={caliperValue}
            onChange={(e) => setCaliperValue(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Scientific Error Processing Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Trials Table (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 p-4 rounded-2xl border border-slate-700/70 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              1. Nhập số liệu các lần đo
            </h4>
            <span className="text-xs text-sky-400 font-mono">{quantityName}</span>
          </div>

          <div className="space-y-2">
            {trials.map((val, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Lần đo {idx + 1} ($A_{idx + 1}$):</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => handleTrialChange(idx, e.target.value)}
                    className="w-24 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-right font-mono text-emerald-400 font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400 text-xs w-6">{unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <Latex content="Sai số dụng cụ ($\Delta A_{dc}$):" />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  value={instrumentError}
                  onChange={(e) => setInstrumentError(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-right font-mono text-amber-400 font-bold focus:outline-none focus:border-indigo-500"
                />
                <span className="text-slate-400 text-xs w-6">{unit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Step-by-Step Derivation (7 cols) */}
        {calculation && (
          <div className="lg:col-span-7 bg-slate-900/90 p-5 rounded-2xl border border-slate-700/70 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-indigo-400" /> 2. Các bước tính toán sai số chuẩn
              </h4>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              {/* Step 1: Mean */}
              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div className="font-semibold text-slate-400 mb-1">
                  <Latex content="Bước 1: Giá trị trung bình ($\bar{A}$):" />
                </div>
                <div className="font-mono text-emerald-400 text-sm">
                  <Latex content={`$\\bar{A} = \\frac{\\sum A_i}{5} = ${calculation.mean.toFixed(4)}\\text{ ${unit}}$`} />
                </div>
              </div>

              {/* Step 2: Deviations */}
              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div className="font-semibold text-slate-400 mb-1">
                  <Latex content="Bước 2: Sai số ngẫu nhiên trung bình ($\bar{\Delta A}$):" />
                </div>
                <div className="font-mono text-cyan-400">
                  <Latex content={`$\\bar{\\Delta A} = \\frac{\\sum |\\bar{A} - A_i|}{5} = ${calculation.meanDeviation.toFixed(4)}\\text{ ${unit}}$`} />
                </div>
              </div>

              {/* Step 3: Absolute Error */}
              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div className="font-semibold text-slate-400 mb-1">
                  <Latex content="Bước 3: Sai số tuyệt đối ($\Delta A = \bar{\Delta A} + \Delta A_{dc}$):" />
                </div>
                <div className="font-mono text-amber-400">
                  <Latex content={`$\\Delta A = ${calculation.meanDeviation.toFixed(4)} + ${instrumentError} = ${calculation.absoluteError.toFixed(4)}\\text{ ${unit}}$`} />
                </div>
              </div>

              {/* Step 4: Relative Error */}
              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div className="font-semibold text-slate-400 mb-1">
                  <Latex content="Bước 4: Sai số tỉ đối ($\delta A = \frac{\Delta A}{\bar{A}} \times 100\%$):" />
                </div>
                <div className="font-mono text-indigo-400 text-sm font-bold">
                  <Latex content={`$\\delta A = \\frac{${calculation.absoluteError.toFixed(4)}}{${calculation.mean.toFixed(4)}} \\times 100\\% = ${calculation.relativeError.toFixed(2)}\\%$`} />
                </div>
              </div>

              {/* Final Formal Notation Result */}
              <div className="p-3.5 bg-emerald-950/40 rounded-xl border-2 border-emerald-600/80 text-center">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  KẾT QUẢ GHI CHUẨN XÁC CỦA PHÉP ĐO:
                </div>
                <div className="text-xl font-mono font-black text-white">
                  <Latex content={`$A = (${calculation.mean.toFixed(2)} \\pm ${calculation.absoluteError.toFixed(2)})\\text{ ${unit}}$`} />
                </div>
                <div className="text-[10px] text-emerald-300/80 mt-1">
                  (Đã làm tròn theo quy tắc chữ số có nghĩa)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
