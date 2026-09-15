import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Info, Sliders, CheckCircle2, Activity, Gauge } from 'lucide-react';
import { Latex } from '../Latex';

type MC964Mode = 'A' | 'B' | 'A+B' | 'A<->B';

export const PhotogateTimerLab: React.FC = () => {
  // Parameters
  const [inclineAngle, setInclineAngle] = useState<number>(10); // degrees
  const [gateDist, setGateDist] = useState<number>(0.5); // 0.5m between A and B
  const [mode, setMode] = useState<MC964Mode>('A<->B');
  const ballDiameter = 0.02; // 20mm = 0.02m

  // Simulation state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ballProgress, setBallProgress] = useState<number>(0); // 0 to 1
  const [displayValue, setDisplayValue] = useState<string>('0.000');
  const [timeA, setTimeA] = useState<number | null>(null);
  const [timeB, setTimeB] = useState<number | null>(null);
  const [timeAB, setTimeAB] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const beamTriggeredARef = useRef<boolean>(false);
  const beamTriggeredBRef = useRef<boolean>(false);

  // Physics calculations:
  // a = g * sin(theta)
  const g = 9.8;
  const a = g * Math.sin((inclineAngle * Math.PI) / 180);

  // Track positions:
  // Magnet at x=0
  // Gate A at sA = 0.25m
  // Gate B at sB = sA + gateDist
  const sA = 0.25;
  const sB = sA + gateDist;

  // t to reach gate A: sA = 0.5 * a * tA^2 => tA = sqrt(2*sA / a)
  const tA = Math.sqrt((2 * sA) / a);
  // Velocity at A: vA = a * tA = sqrt(2 * a * sA)
  const vA = Math.sqrt(2 * a * sA);
  // Passage time through Gate A: dtA = d / vA
  const dtA = ballDiameter / vA;

  // t to reach gate B: sB = 0.5 * a * tB^2 => tB = sqrt(2*sB / a)
  const tB = Math.sqrt((2 * sB) / a);
  // Velocity at B: vB = sqrt(2 * a * sB)
  const vB = Math.sqrt(2 * a * sB);
  // Passage time through Gate B: dtB = d / vB
  const dtB = ballDiameter / vB;

  // Travel time from Gate A to Gate B
  const tBetweenAB = tB - tA;
  const vAverage = gateDist / tBetweenAB;

  // Release ball
  const handleRelease = () => {
    if (isRunning) return;
    setIsRunning(true);
    setBallProgress(0);
    setDisplayValue('0.000');
    setTimeA(null);
    setTimeB(null);
    setTimeAB(null);
    beamTriggeredARef.current = false;
    beamTriggeredBRef.current = false;
    startRef.current = performance.now();
  };

  const handleReset = () => {
    setIsRunning(false);
    setBallProgress(0);
    setDisplayValue('0.000');
    setTimeA(null);
    setTimeB(null);
    setTimeAB(null);
    beamTriggeredARef.current = false;
    beamTriggeredBRef.current = false;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  // Animation Loop
  useEffect(() => {
    if (!isRunning) return;

    const loop = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = (now - startRef.current) / 1000;
      // Total travel to end of track (sTrack = 1.0m)
      const tTotal = Math.sqrt((2 * 1.0) / a);
      const progress = Math.min(1, elapsed / tTotal);
      setBallProgress(progress);

      const simTime = elapsed;

      // Check gate passage
      if (simTime >= tA && !timeA) {
        setTimeA(dtA);
        beamTriggeredARef.current = true;
      }
      if (simTime >= tB && !timeB) {
        setTimeB(dtB);
        setTimeAB(tBetweenAB);
        beamTriggeredBRef.current = true;
      }

      // Update timer display based on mode
      if (mode === 'A') {
        if (simTime >= tA) {
          setDisplayValue(dtA.toFixed(3));
        } else {
          setDisplayValue('0.000');
        }
      } else if (mode === 'B') {
        if (simTime >= tB) {
          setDisplayValue(dtB.toFixed(3));
        } else {
          setDisplayValue('0.000');
        }
      } else if (mode === 'A+B') {
        if (simTime >= tB) {
          setDisplayValue((dtA + dtB).toFixed(3));
        } else if (simTime >= tA) {
          setDisplayValue(dtA.toFixed(3));
        } else {
          setDisplayValue('0.000');
        }
      } else if (mode === 'A<->B') {
        if (simTime >= tB) {
          setDisplayValue(tBetweenAB.toFixed(3));
        } else if (simTime >= tA) {
          setDisplayValue((simTime - tA).toFixed(3));
        } else {
          setDisplayValue('0.000');
        }
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(loop);
      } else {
        setIsRunning(false);
      }
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRunning, a, tA, dtA, tB, dtB, tBetweenAB, mode, timeA, timeB]);

  // Draw Track & Ball Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Workbench background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Subtle background grid
    ctx.strokeStyle = '#141c2e';
    ctx.lineWidth = 1;
    for (let x = 30; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    const angleRad = (inclineAngle * Math.PI) / 180;
    const startX = 60;
    const startY = 60;
    const trackPixelLength = w - 140;

    const endX = startX + Math.cos(angleRad) * trackPixelLength;
    const endY = startY + Math.sin(angleRad) * trackPixelLength;

    // Table baseline
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, endY + 28);
    ctx.lineTo(w - 30, endY + 28);
    ctx.stroke();

    // Base support wedge under incline
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(startX, startY + 12);
    ctx.lineTo(endX, endY + 12);
    ctx.lineTo(startX, endY + 12);
    ctx.closePath();
    ctx.fill();

    // Incline angle arc indicator
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(endX, endY + 12, 35, Math.PI, Math.PI + angleRad);
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`α = ${inclineAngle}°`, endX - 70, endY + 6);

    // Rail bar
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(angleRad);

    // Aluminum track body
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 0, trackPixelLength, 14);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 0, trackPixelLength, 4);

    // Millimeter ticks on track
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '8px monospace';
    for (let cm = 0; cm <= 100; cm += 10) {
      const px = (cm / 100) * trackPixelLength;
      ctx.fillRect(px, 14, 1, 6);
      ctx.fillText(`${cm}`, px - 6, 30);
    }

    // Electromagnet at 0m
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-18, -14, 18, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('NAM CHÂM', -18, -18);

    // Photogate A bracket
    const pxA = (sA / 1.0) * trackPixelLength;
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(pxA - 7, -22, 14, 22);

    // Photogate A infrared laser beam (glows red when clear, green flash when blocked)
    const isBlockingA = Math.abs(ballProgress * 1.0 - sA) < 0.03;
    ctx.strokeStyle = isBlockingA ? '#10b981' : '#ef4444';
    ctx.lineWidth = isBlockingA ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(pxA, -22);
    ctx.lineTo(pxA, 0);
    ctx.stroke();

    ctx.fillStyle = isBlockingA ? '#10b981' : '#38bdf8';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('CỔNG A', pxA - 18, -26);

    // Photogate B bracket
    const pxB = (sB / 1.0) * trackPixelLength;
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(pxB - 7, -22, 14, 22);

    // Photogate B beam
    const isBlockingB = Math.abs(ballProgress * 1.0 - sB) < 0.03;
    ctx.strokeStyle = isBlockingB ? '#10b981' : '#ef4444';
    ctx.lineWidth = isBlockingB ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(pxB, -22);
    ctx.lineTo(pxB, 0);
    ctx.stroke();

    ctx.fillStyle = isBlockingB ? '#10b981' : '#38bdf8';
    ctx.fillText('CỔNG B', pxB - 18, -26);

    // Distance bracket between A and B
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pxA, -42);
    ctx.lineTo(pxB, -42);
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`s = ${(gateDist * 100).toFixed(0)} cm`, (pxA + pxB) / 2, -48);

    // Steel Ball
    // s(t) = 0.5 * a * t^2
    const currentM = ballProgress * 1.0;
    const currentPx = currentM * trackPixelLength;

    // Ball with chrome reflection
    const ballGrad = ctx.createRadialGradient(currentPx - 3, -13, 2, currentPx, -10, 10);
    ballGrad.addColorStop(0, '#ffffff');
    ballGrad.addColorStop(0.5, '#cbd5e1');
    ballGrad.addColorStop(1, '#475569');
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(currentPx, -10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Rolling indicator cross inside ball
    const rotationAngle = currentPx * 0.15;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(currentPx + Math.cos(rotationAngle) * 8, -10 + Math.sin(rotationAngle) * 8);
    ctx.lineTo(currentPx - Math.cos(rotationAngle) * 8, -10 - Math.sin(rotationAngle) * 8);
    ctx.stroke();

    // Cushion stopper at end
    ctx.fillStyle = '#10b981';
    ctx.fillRect(trackPixelLength, -16, 12, 30);

    ctx.restore();
  }, [inclineAngle, gateDist, sA, sB, ballProgress]);

  return (
    <div id="photogate-lab-container" className="space-y-6">
      {/* Top Banner: Real Experiment Context */}
      <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-neutral-300">
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>
            Đường kính bi thép đo bằng thước kẹp: <strong className="text-amber-400 font-mono">d = 20.0 mm (0.02 m)</strong>
          </span>
        </div>
        <div className="text-neutral-400 font-mono bg-neutral-800/80 px-3 py-1.5 rounded-xl border border-neutral-700/50">
          Gia tốc trên máng: <span className="text-emerald-400 font-bold">{a.toFixed(2)} m/s²</span>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Track Canvas (7 cols) */}
        <div className="xl:col-span-7 rounded-2xl overflow-hidden border border-neutral-800 bg-[#090d16] p-3 sm:p-4 shadow-inner">
          <canvas ref={canvasRef} width={720} height={300} className="w-full h-auto block rounded-xl" />
        </div>

        {/* MC964 Device Control Box (5 cols) */}
        <div className="xl:col-span-5 bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
            <span className="text-xs font-bold text-neutral-200 tracking-wider font-mono">
              ĐỒNG HỒ HIỆN SỐ MC964
            </span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
              ĐỘ PHÂN GIẢI: 0.001s
            </span>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-neutral-400">CHỌN CHẾ ĐỘ (MODE):</span>
            <div className="grid grid-cols-4 gap-1.5">
              {(['A', 'B', 'A+B', 'A<->B'] as MC964Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    handleReset();
                  }}
                  className={`py-2 px-1 text-xs font-mono font-bold rounded-xl border transition-colors cursor-pointer ${
                    mode === m
                      ? 'bg-neutral-800 text-sky-400 border-sky-500/70 shadow-sm'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-neutral-400 italic pt-1">
              {mode === 'A' && 'MODE A: Đo thời gian chắn cổng A để tính tốc độ tức thời vA = d / ΔtA.'}
              {mode === 'B' && 'MODE B: Đo thời gian chắn cổng B để tính tốc độ tức thời vB = d / ΔtB.'}
              {mode === 'A+B' && 'MODE A+B: Tổng thời gian chắn cả 2 cổng quang điện.'}
              {mode === 'A<->B' && 'MODE A↔B: Đo thời gian bi đi từ cổng A đến cổng B để tính vtb = s / tAB.'}
            </div>
          </div>

          {/* LED Digital Display */}
          <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-3.5 text-center">
            <div className="text-[10px] text-emerald-500 font-mono">HIỂN THỊ ĐỒNG HỒ (GIÂY)</div>
            <div className="text-4xl font-mono font-black text-emerald-400 tracking-wider">
              {displayValue} <span className="text-base font-normal text-emerald-500/70">s</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRelease}
              disabled={isRunning}
              className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> NHẢ BI THÉP
            </button>
            <button
              onClick={handleReset}
              className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl border border-neutral-700/60 transition-colors cursor-pointer"
              title="Khôi phục trạng thái ban đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Adjusters & Formula Verification Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-5 rounded-2xl border border-neutral-800">
        {/* Sliders */}
        <div className="space-y-3.5">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-neutral-300">Độ dốc máng nghiêng <Latex content="$\\alpha$:" /></span>
              <span className="text-cyan-400 font-mono">{inclineAngle}°</span>
            </div>
            <input
              type="range"
              min="4"
              max="25"
              step="1"
              value={inclineAngle}
              onChange={(e) => {
                setInclineAngle(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full accent-cyan-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-neutral-300">Khoảng cách giữa cổng A và B (<Latex content="$s$" />):</span>
              <span className="text-amber-400 font-mono">{(gateDist * 100).toFixed(0)} cm ({gateDist.toFixed(2)} m)</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.65"
              step="0.05"
              value={gateDist}
              onChange={(e) => {
                setGateDist(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Results Table */}
        <div className="bg-neutral-800/40 p-4 rounded-xl border border-neutral-700/60 space-y-2 text-xs">
          <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Kết quả tính toán theo công thức SGK:
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 bg-neutral-800/80 rounded-lg">
              <div className="text-neutral-400">Tốc độ tức thời tại A:</div>
              <div className="text-sky-400 font-bold mt-0.5">{vA.toFixed(3)} m/s</div>
            </div>
            <div className="p-2 bg-neutral-800/80 rounded-lg">
              <div className="text-neutral-400">Tốc độ tức thời tại B:</div>
              <div className="text-sky-400 font-bold mt-0.5">{vB.toFixed(3)} m/s</div>
            </div>
            <div className="p-2 bg-neutral-800/80 rounded-lg col-span-2">
              <div className="text-neutral-400">Tốc độ trung bình trên đoạn AB:</div>
              <div className="text-emerald-400 font-bold mt-0.5">{vAverage.toFixed(3)} m/s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
