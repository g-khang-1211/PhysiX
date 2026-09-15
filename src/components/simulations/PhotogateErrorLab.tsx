import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { Latex } from '../Latex';

export const PhotogateErrorLab: React.FC = () => {
  // Distance between Photogate E and Photogate F (meters)
  const [distanceS] = useState<number>(0.500); // 0.500 m = 50.0 cm
  const instrumentDeltaS = 0.001; // Thước chia milimet: ĐCNN = 1mm => sai số dụng cụ = 1mm = 0.001m

  // Mode: "standard" (Electromagnet stable release) vs "erratic" (Manual inconsistent release)
  const [operationMode, setOperationMode] = useState<'standard' | 'erratic'>('standard');

  // 5 Measured Times (seconds)
  const [trials, setTrials] = useState<number[]>([0.624, 0.622, 0.626, 0.623, 0.625]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [ballPosRatio, setBallPosRatio] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const plotCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Theoretical true time for 0.5m on inclined track
  const theoreticalTrueTime = Math.sqrt((2 * distanceS) / (9.8 * Math.sin((10 * Math.PI) / 180)));

  // Generate new trial data
  const handleRunAllTrials = () => {
    setIsRolling(true);
    setBallPosRatio(0);

    const baseTime = theoreticalTrueTime;
    const newTrials: number[] = [];

    for (let i = 0; i < 5; i++) {
      if (operationMode === 'standard') {
        // High repeatability: tiny random error +/- 0.002s
        const jitter = (Math.random() - 0.5) * 0.005;
        newTrials.push(Number((baseTime + jitter).toFixed(3)));
      } else {
        // High error: inconsistent initial position, table shake +/- 0.080s
        const jitter = (Math.random() - 0.5) * 0.16;
        newTrials.push(Number((baseTime + jitter).toFixed(3)));
      }
    }

    // Animate roll
    let startTimestamp: number | null = null;
    const duration = 1200; // ms

    const animateRoll = (ts: number) => {
      if (!startTimestamp) startTimestamp = ts;
      const elapsed = ts - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      setBallPosRatio(progress);

      if (progress < 1) {
        requestAnimationFrame(animateRoll);
      } else {
        setIsRolling(false);
        setTrials(newTrials);
      }
    };

    requestAnimationFrame(animateRoll);
  };

  // Reset to default
  const handleReset = () => {
    setIsRolling(false);
    setBallPosRatio(0);
    if (operationMode === 'standard') {
      setTrials([0.624, 0.622, 0.626, 0.623, 0.625]);
    } else {
      setTrials([0.540, 0.710, 0.590, 0.680, 0.610]);
    }
  };

  // Calculations for Error Analysis
  const n = trials.length;
  // 1. Mean time t_bar
  const tBar = trials.reduce((acc, v) => acc + v, 0) / n;

  // 2. Absolute deviations Delta t_i = |t_bar - t_i|
  const deltaTList = trials.map((val) => Math.abs(tBar - val));

  // 3. Mean absolute error delta_t_bar
  const deltaTBar = deltaTList.reduce((acc, v) => acc + v, 0) / n;

  // 4. Instrument error (MC964 accurate to 0.001s)
  const deltaTInst = 0.001; // s

  // 5. Total absolute error of time Delta t
  const deltaTTotal = deltaTBar + deltaTInst;

  // 6. Relative error of time delta_t (%)
  const relativeDeltaT = (deltaTTotal / tBar) * 100;

  // 7. Relative error of distance delta_s (%)
  const relativeDeltaS = (instrumentDeltaS / distanceS) * 100;

  // 8. Mean speed v_bar = s_bar / t_bar
  const vBar = distanceS / tBar;

  // 9. Relative error of speed delta_v = delta_s + delta_t
  const relativeDeltaV = relativeDeltaS + relativeDeltaT;

  // 10. Absolute error of speed Delta v = delta_v * v_bar
  const deltaV = (relativeDeltaV / 100) * vBar;

  // Track Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Track angle ~10 degrees
    const trackStartX = 40;
    const trackStartY = 60;
    const trackEndX = width - 40;
    const trackEndY = height - 60;

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Base support & Incline Track
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(trackStartX, trackStartY + 14);
    ctx.lineTo(trackEndX, trackEndY + 14);
    ctx.lineTo(trackEndX, trackEndY + 28);
    ctx.lineTo(trackStartX, trackEndY + 28);
    ctx.closePath();
    ctx.fill();

    // Metallic Rail
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(trackStartX, trackStartY);
    ctx.lineTo(trackEndX, trackEndY);
    ctx.stroke();

    // Electromagnet N at top
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(trackStartX - 15, trackStartY - 22, 24, 22);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('N', trackStartX - 8, trackStartY - 8);

    // Photogate E (Gate A)
    const gateAX = trackStartX + (trackEndX - trackStartX) * 0.25;
    const gateAY = trackStartY + (trackEndY - trackStartY) * 0.25;

    // Photogate F (Gate B)
    const gateBX = trackStartX + (trackEndX - trackStartX) * 0.85;
    const gateBY = trackStartY + (trackEndY - trackStartY) * 0.85;

    // Draw Photogate brackets
    const drawGate = (gx: number, gy: number, label: string) => {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(gx - 6, gy - 30, 12, 34);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(gx - 8, gy - 36, 16, 8);

      // Optical beam
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gx, gy - 20);
      ctx.lineTo(gx, gy + 2);
      ctx.stroke();

      ctx.fillStyle = '#f4f4f5';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(label, gx - 4, gy - 40);
    };

    drawGate(gateAX, gateAY, 'E (Cổng A)');
    drawGate(gateBX, gateBY, 'F (Cổng B)');

    // Distance label between E and F
    ctx.strokeStyle = '#71717a';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(gateAX, gateAY - 50);
    ctx.lineTo(gateBX, gateBY - 50);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`s = ${(distanceS * 100).toFixed(1)} cm (± 0.1 cm)`, (gateAX + gateBX) / 2, gateAY - 56);
    ctx.textAlign = 'left';

    // Rolling steel ball
    const currentBallX = trackStartX + (trackEndX - trackStartX) * ballPosRatio;
    const currentBallY = trackStartY + (trackEndY - trackStartY) * ballPosRatio - 8;

    ctx.save();
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#f4f4f5';
    ctx.beginPath();
    ctx.arc(currentBallX, currentBallY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // MC964 Timer unit box in bottom-left
    ctx.fillStyle = '#18181b';
    ctx.fillRect(30, height - 75, 140, 60);
    ctx.strokeStyle = '#3f3f46';
    ctx.strokeRect(30, height - 75, 140, 60);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '9px monospace';
    ctx.fillText('ĐỒNG HỒ HIỆN SỐ MC964', 38, height - 62);
    ctx.fillText('MODE A ↔ B', 38, height - 50);

    // Digital LED display
    ctx.fillStyle = '#090d16';
    ctx.fillRect(36, height - 44, 126, 24);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`${(trials[0] || 0.624).toFixed(3)} s`, 46, height - 28);
  }, [ballPosRatio, distanceS, trials]);

  // Error Rectangle Canvas Plot
  useEffect(() => {
    const canvas = plotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    for (let x = 30; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 20; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    const originX = 40;
    const originY = height - 30;
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX, 10);
    ctx.lineTo(originX, originY);
    ctx.lineTo(width - 10, originY);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '10px monospace';
    ctx.fillText('s (m)', originX - 30, 20);
    ctx.fillText('t (s)', width - 35, originY + 18);

    // Theoretical line s = v * t
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(width - 20, 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Data point center
    const ptX = originX + (width - originX - 40) * 0.65;
    const ptY = originY - (originY - 30) * 0.65;

    // Error rectangle 2Delta t x 2Delta s
    const halfWidthPx = Math.max(deltaTTotal * 300, 8);
    const halfHeightPx = Math.max(instrumentDeltaS * 8000, 10);

    ctx.fillStyle = relativeDeltaV < 5 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
    ctx.fillRect(ptX - halfWidthPx, ptY - halfHeightPx, halfWidthPx * 2, halfHeightPx * 2);

    ctx.strokeStyle = relativeDeltaV < 5 ? '#10b981' : '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(ptX - halfWidthPx, ptY - halfHeightPx, halfWidthPx * 2, halfHeightPx * 2);

    // Experimental central point
    ctx.fillStyle = '#f4f4f5';
    ctx.beginPath();
    ctx.arc(ptX, ptY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Label on rectangle
    ctx.fillStyle = relativeDeltaV < 5 ? '#34d399' : '#f87171';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('Ô bao sai số (2Δt × 2Δs)', ptX - 55, ptY - halfHeightPx - 6);
  }, [deltaTTotal, instrumentDeltaS, relativeDeltaV]);

  return (
    <div className="space-y-6" id="photogate-error-lab">
      {/* 1. Header & Experiment Name */}
      <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                THỰC HÀNH VẬT LÍ 10 CHUẨN
              </span>
              <span className="text-xs text-neutral-400 font-medium">Xử lí sai số thực nghiệm</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-100 mt-1">
              Đo tốc độ <Latex content={"$v$"} /> bằng Cổng quang điện &amp; Đồng hồ đo thời gian hiện số MC964
            </h3>
          </div>

          {/* Precision Quality Badge */}
          {relativeDeltaV <= 5 ? (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Phép đo đạt chuẩn độ tin cậy (δv &lt; 5%)
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400" />
              Sai số lớn do thao tác không ổn định (δv &gt; 10%)
            </div>
          )}
        </div>

        <div className="text-xs text-neutral-300 mt-2.5 leading-relaxed">
          <strong className="text-amber-400 mr-1">Mục đích:</strong>
          <Latex content={"Xác định sai số trực tiếp của quãng đường $s$, thời gian $t$ và tính sai số gián tiếp của tốc độ $v = \\frac{s}{t}$ theo đúng chuẩn SGK Vật lí 10."} />
        </div>
      </div>

      {/* 2. Inclined Track & Data Measurement Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Track Simulation */}
        <div className="lg:col-span-7 bg-[#090d16] rounded-2xl border border-neutral-800 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            width={540}
            height={280}
            className="w-full h-auto block rounded-xl"
          />

          {/* Action Bar */}
          <div className="mt-3 p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                disabled={isRolling}
                onClick={handleRunAllTrials}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold transition-colors shadow cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isRolling ? 'Đang đo đạc...' : 'Thực hiện 5 lần đo liên tiếp'}
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition-colors cursor-pointer"
                title="Đặt lại"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mode selection toggle */}
            <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-xl border border-neutral-700/60">
              <button
                onClick={() => { setOperationMode('standard'); handleReset(); }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  operationMode === 'standard'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Thao tác chuẩn (Nam châm N)
              </button>
              <button
                onClick={() => { setOperationMode('erratic'); handleReset(); }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  operationMode === 'erratic'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Thao tác sai (Lệch vị trí)
              </button>
            </div>
          </div>
        </div>

        {/* Live Graphical Error Rectangle */}
        <div className="lg:col-span-5 bg-[#090d16] rounded-2xl border border-neutral-800 p-4 flex flex-col justify-between shadow-inner">
          <div className="space-y-1">
            <div className="text-xs font-bold text-neutral-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                ĐỒ THỊ Ô BAO SAI SỐ:
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">2Δt × 2Δs</span>
            </div>
            <div className="text-[11px] text-neutral-400">
              <Latex content={"Vùng hình chữ nhật thể hiện khoảng bất định xung quanh điểm thực nghiệm $(\\bar{t}, \\bar{s})$."} />
            </div>
          </div>

          <div className="my-2 flex justify-center">
            <canvas
              ref={plotCanvasRef}
              width={340}
              height={180}
              className="w-full h-auto block rounded-xl border border-neutral-800"
            />
          </div>

          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-neutral-400">Sai số tỉ đối <Latex content={"$\\delta v$:"} /></span>{' '}
              <span className={`font-bold ${relativeDeltaV < 5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {relativeDeltaV.toFixed(2)}%
              </span>
            </div>
            <div>
              <span className="text-neutral-400">Tốc độ trung bình:</span>{' '}
              <span className="text-cyan-400 font-bold">{vBar.toFixed(3)} m/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Measurement Data Table & Full Step-by-Step Calculation */}
      <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-4 text-xs">
        <h4 className="font-bold text-neutral-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          BẢNG XỬ LÍ SỐ LIỆU THỰC NGHIỆM 5 LẦN ĐO:
        </h4>

        {/* 5 Trials Table */}
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 bg-neutral-800/80 text-[11px]">
                <th className="p-3">Lần đo</th>
                <th className="p-3">Quãng đường <Latex content={"$s$ (m)"} /></th>
                <th className="p-3">Thời gian <Latex content={"$t$ (s)"} /></th>
                <th className="p-3">Độ lệch sai số <Latex content={"$\\Delta t$ (s)"} /></th>
                <th className="p-3">Tốc độ <Latex content={"$v$ (m/s)"} /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {trials.map((timeVal, idx) => {
                const diff = deltaTList[idx];
                const speed = distanceS / timeVal;
                return (
                  <tr key={idx} className="hover:bg-neutral-800/40">
                    <td className="p-3 font-bold text-neutral-300">Lần {idx + 1}</td>
                    <td className="p-3 text-neutral-300">{distanceS.toFixed(3)}</td>
                    <td className="p-3 text-cyan-400 font-bold">{timeVal.toFixed(3)}</td>
                    <td className="p-3 text-neutral-400">{diff.toFixed(4)}</td>
                    <td className="p-3 text-emerald-400">{speed.toFixed(3)}</td>
                  </tr>
                );
              })}
              {/* Summary Average Row */}
              <tr className="bg-neutral-800 font-bold text-indigo-300 border-t-2 border-indigo-500/40">
                <td className="p-3">
                  <Latex content={"Giá trị trung bình ($\\bar{A}$)"} />
                </td>
                <td className="p-3 text-neutral-100">
                  <Latex content={`$\\bar{s} = ${distanceS.toFixed(3)}\\text{ m}$`} />
                </td>
                <td className="p-3 text-cyan-400">
                  <Latex content={`$\\bar{t} = ${tBar.toFixed(3)}\\text{ s}$`} />
                </td>
                <td className="p-3 text-neutral-300">
                  <Latex content={`$\\bar{\\Delta t} = ${deltaTBar.toFixed(4)}\\text{ s}$`} />
                </td>
                <td className="p-3 text-emerald-400">
                  <Latex content={`$\\bar{v} = ${vBar.toFixed(3)}\\text{ m/s}$`} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Step-by-Step Logic formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Step 1: delta t */}
          <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-1">
            <div className="font-semibold text-neutral-200">1. Sai số tuyệt đối của thời gian:</div>
            <div className="font-mono text-cyan-300 text-[11px]">
              <Latex content={`$\\Delta t = \\bar{\\Delta t} + \\Delta t_{dc} = ${deltaTBar.toFixed(4)} + ${deltaTInst} = ${deltaTTotal.toFixed(3)}\\text{ s}$`} />
            </div>
            <div className="text-[10px] text-neutral-400">
              <Latex content={`Sai số tỉ đối: $\\delta t = \\frac{\\Delta t}{\\bar{t}} = ${relativeDeltaT.toFixed(2)}\\%$`} />
            </div>
          </div>

          {/* Step 2: delta s */}
          <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-1">
            <div className="font-semibold text-neutral-200">2. Sai số tuyệt đối quãng đường:</div>
            <div className="font-mono text-cyan-300 text-[11px]">
              <Latex content={`$\\Delta s = \\Delta s_{dc} = ${instrumentDeltaS}\\text{ m}$`} />
            </div>
            <div className="text-[10px] text-neutral-400">
              <Latex content={`Sai số tỉ đối: $\\delta s = \\frac{\\Delta s}{\\bar{s}} = ${relativeDeltaS.toFixed(2)}\\%$`} />
            </div>
          </div>

          {/* Step 3: delta v */}
          <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-1">
            <div className="font-semibold text-neutral-200">3. Sai số tỉ đối gián tiếp:</div>
            <div className="font-mono text-amber-300 text-[11px]">
              <Latex content={`$\\delta v = \\delta s + \\delta t = ${relativeDeltaS.toFixed(2)}\\% + ${relativeDeltaT.toFixed(2)}\\% = ${relativeDeltaV.toFixed(2)}\\%$`} />
            </div>
            <div className="text-[10px] text-neutral-400">
              <Latex content={"Cộng sai số tỉ đối đối với phép tính thương $v = s / t$."} />
            </div>
          </div>

          {/* Step 4: Final written result */}
          <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-indigo-700/50 space-y-1">
            <div className="font-semibold text-indigo-300">4. Ghi kết quả đo chuẩn:</div>
            <div className="font-mono text-emerald-300 font-bold text-xs pt-1">
              <Latex content={`$v = ${vBar.toFixed(2)} \\pm ${deltaV.toFixed(2)}\\text{ (m/s)}$`} />
            </div>
            <div className="text-[10px] text-neutral-400">
              Đã làm tròn theo quy tắc chữ số có nghĩa.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Expected Results Comparison */}
      <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3">
        <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          KẾT QUẢ MONG ĐỢI: SO SÁNH GIỮA THAO TÁC CHUẨN VÀ SAI SỐ DO THAO TÁC
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          {/* Positive Result */}
          <div className="p-4 bg-emerald-950/25 rounded-xl border border-emerald-800/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Kết quả Tích cực (Thao tác chuẩn với nam châm điện cố định):</span>
            </div>
            <div className="text-neutral-300">
              <Latex content={"Bảng dữ liệu 5 lần đo có độ lệch rất nhỏ ($|t_i - \\bar{t}| \\le 0{,}003\\text{ s}$). Sai số tỉ đối $\\delta v < 3\\%$, ô bao sai số hình chữ nhật $2\\Delta t \\times 2\\Delta s$ thu hẹp sát điểm thực nghiệm."} />
            </div>
            <div className="p-2.5 bg-emerald-900/30 rounded-lg font-mono text-[11px] text-emerald-300 border border-emerald-800/40">
              <Latex content={"Phép đo có độ tin cậy và tính lặp lại cao, kết quả $v = \\bar{v} \\pm \\Delta v$ phản ánh chính xác quy luật chuyển động."} />
            </div>
          </div>

          {/* Negative Result */}
          <div className="p-4 bg-rose-950/25 rounded-xl border border-rose-800/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Kết quả Tiêu cực (Thao tác sai - Thả tay tự do / Rung máng):</span>
            </div>
            <div className="text-neutral-300">
              <Latex content={"Thả bi ở các vị trí ban đầu không đồng nhất hoặc buông tay tạo vận tốc đầu ngẫu nhiên làm tăng mạnh sai số ngẫu nhiên $\\bar{\\Delta t}$. Sai số tỉ đối $\\delta v > 10\\%$, ô bao sai số phình to bất thường."} />
            </div>
            <div className="p-2.5 bg-rose-900/30 rounded-lg font-mono text-[11px] text-rose-300 border border-rose-800/40">
              Cảnh báo: Dữ liệu phân tán lớn, phép đo không đáng tin cậy và bắt buộc phải hiệu chỉnh lại thao tác thí nghiệm!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
