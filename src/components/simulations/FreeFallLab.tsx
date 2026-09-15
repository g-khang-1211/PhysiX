import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Plus, Trash2, CheckCircle2, Gauge, Scale } from 'lucide-react';
import { Latex } from '../Latex';

interface TrialRecord {
  id: number;
  height: number; // in meters
  time: number; // in seconds
  calculatedG: number;
}

export const FreeFallLab: React.FC = () => {
  // Parameters
  const [height, setHeight] = useState<number>(0.8); // 0.8m
  const [isVacuum, setIsVacuum] = useState<boolean>(true); // vacuum vs air resistance
  const [compareFeather, setCompareFeather] = useState<boolean>(false);

  // Simulation state
  const [isFalling, setIsFalling] = useState<boolean>(false);
  const [fallProgress, setFallProgress] = useState<number>(0); // 0 to 1
  const [measuredTime, setMeasuredTime] = useState<number | null>(null);
  const [timerDisplay, setTimerDisplay] = useState<string>('0.000');
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [trials, setTrials] = useState<TrialRecord[]>([
    { id: 1, height: 0.8, time: 0.404, calculatedG: 9.8 },
    { id: 2, height: 0.8, time: 0.403, calculatedG: 9.85 },
    { id: 3, height: 0.8, time: 0.405, calculatedG: 9.75 },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const theoreticalG = 9.8;
  // Actual physical drop time
  const trueTime = Math.sqrt((2 * height) / theoreticalG);

  // Release electromagnet
  const handleRelease = () => {
    if (isFalling) return;
    setIsFalling(true);
    setFallProgress(0);
    setMeasuredTime(null);
    setTimerDisplay('0.000');
    setCurrentSpeed(0);
    startTimeRef.current = performance.now();
  };

  const handleReset = () => {
    setIsFalling(false);
    setFallProgress(0);
    setMeasuredTime(null);
    setTimerDisplay('0.000');
    setCurrentSpeed(0);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  // Animation Loop for Free Fall
  useEffect(() => {
    if (!isFalling) return;

    const loop = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = (time - startTimeRef.current) / 1000;

      const totalFallDuration = trueTime * 1.25; // scaled slightly for visual clarity
      const progress = Math.min(1, elapsed / totalFallDuration);
      setFallProgress(progress);

      // Digital timer ticks up
      const currentSimTime = Math.min(trueTime, (elapsed / totalFallDuration) * trueTime);
      setTimerDisplay(currentSimTime.toFixed(3));

      // Calculate instantaneous speed v = g * t
      const instantSpeed = theoreticalG * currentSimTime;
      setCurrentSpeed(instantSpeed);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(loop);
      } else {
        // Falling finished: simulate tiny realistic measurement instrument jitter
        const instrumentJitter = (Math.random() - 0.5) * 0.004;
        const finalTime = Math.max(0.01, trueTime + instrumentJitter);
        setMeasuredTime(finalTime);
        setTimerDisplay(finalTime.toFixed(3));
        setIsFalling(false);
      }
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isFalling, trueTime]);

  const handleSaveTrial = () => {
    if (measuredTime === null) return;
    const calcG = (2 * height) / (measuredTime * measuredTime);
    setTrials((prev) => [
      ...prev,
      {
        id: Date.now(),
        height,
        time: parseFloat(measuredTime.toFixed(3)),
        calculatedG: parseFloat(calcG.toFixed(2)),
      },
    ]);
  };

  const handleDeleteTrial = (id: number) => {
    setTrials((prev) => prev.filter((t) => t.id !== id));
  };

  // Draw Drop Tower Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background (Laboratory wall)
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Subtle background guidelines
    ctx.strokeStyle = '#141c2e';
    ctx.lineWidth = 1;
    for (let x = 30; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Vertical Stand Column
    const standX = 130;
    const topY = 44;
    const bottomY = h - 44;
    const totalPixelHeight = bottomY - topY;

    // Metal pole
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(standX - 8, topY, 16, totalPixelHeight);
    ctx.fillStyle = '#52525b';
    ctx.fillRect(standX - 4, topY, 8, totalPixelHeight);

    // Base plate
    ctx.fillStyle = '#27272a';
    ctx.fillRect(standX - 60, bottomY, 120, 16);

    // Metric millimeter ruler along column
    ctx.fillStyle = '#f4f4f5';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';

    const maxMeters = 1.2;
    for (let m = 0; m <= maxMeters; m += 0.2) {
      const py = topY + (m / maxMeters) * totalPixelHeight;
      ctx.strokeStyle = '#71717a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(standX + 8, py);
      ctx.lineTo(standX + 24, py);
      ctx.stroke();

      ctx.fillText(`${(m * 100).toFixed(0)}cm`, standX + 58, py + 3);
    }

    // Electromagnet at top (Hold position)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(standX - 24, topY - 16, 48, 16);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(standX - 14, topY, 28, 8);
    // Coil wrap
    ctx.fillStyle = '#d97706';
    for (let i = -10; i <= 6; i += 4) {
      ctx.fillRect(standX + i, topY + 1, 2, 6);
    }

    // Photogate position based on selected height
    const gateY = topY + (height / maxMeters) * totalPixelHeight;

    // Photogate bracket (Cổng quang điện)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(standX - 35, gateY - 8, 20, 16);
    ctx.fillRect(standX + 15, gateY - 8, 20, 16);

    // Infrared optical beam
    const isInterrupted = Math.abs(fallProgress - 1) < 0.05;
    ctx.strokeStyle = isInterrupted ? '#10b981' : 'rgba(239, 68, 68, 0.8)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = isInterrupted ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(standX - 15, gateY);
    ctx.lineTo(standX + 15, gateY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Photogate label
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('CỔNG QUANG', standX + 42, gateY + 4);

    // Ball position
    const ballStartY = topY + 12;
    const currentBallY = ballStartY + Math.pow(fallProgress, 2) * (gateY - ballStartY);

    // Draw Steel Ball
    ctx.save();
    const ballGrad = ctx.createRadialGradient(standX - 3, currentBallY - 3, 2, standX, currentBallY, 10);
    ballGrad.addColorStop(0, '#ffffff');
    ballGrad.addColorStop(0.4, '#a1a1aa');
    ballGrad.addColorStop(1, '#27272a');
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(standX, currentBallY, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4d4d8';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Downward Velocity Vector Arrow (appears during fall)
    if (fallProgress > 0 && currentSpeed > 0.2) {
      const arrowLength = Math.min(60, currentSpeed * 12);
      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(standX - 22, currentBallY);
      ctx.lineTo(standX - 22, currentBallY + arrowLength);
      ctx.stroke();

      // Arrow tip
      ctx.beginPath();
      ctx.moveTo(standX - 22, currentBallY + arrowLength);
      ctx.lineTo(standX - 26, currentBallY + arrowLength - 6);
      ctx.lineTo(standX - 18, currentBallY + arrowLength - 6);
      ctx.closePath();
      ctx.fill();

      // Vector label
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`${currentSpeed.toFixed(1)}m/s`, standX - 60, currentBallY + arrowLength / 2);
    }

    // If feather comparison is active in vacuum vs air
    if (compareFeather) {
      const featherX = standX + 110;
      const featherProgress = isVacuum ? fallProgress : Math.pow(fallProgress, 1.6) * 0.65;
      const featherY = ballStartY + featherProgress * (gateY - ballStartY);

      ctx.save();
      ctx.translate(featherX, featherY);
      ctx.rotate(isVacuum ? 0 : Math.sin(fallProgress * 15) * 0.3);
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.ellipse(0, 0, 4, 14, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#fde047';
      ctx.font = '10px sans-serif';
      ctx.fillText(isVacuum ? 'Lông chim (chân không)' : 'Lông chim (có cản)', featherX - 35, featherY - 18);
    }

    // Cushion receiver at bottom
    ctx.fillStyle = '#065f46';
    ctx.fillRect(standX - 30, bottomY - 14, 60, 14);
    ctx.fillStyle = '#10b981';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GIẢM CHẤN', standX, bottomY - 4);
  }, [height, fallProgress, isVacuum, compareFeather, currentSpeed]);

  // Draw s - t² Graph on the side
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const padL = 45;
    const padR = 25;
    const padT = 30;
    const padB = 40;
    const gw = w - padL - padR;
    const gh = h - padT - padB;

    const maxT2 = 0.3; // s^2
    const maxS = 1.2; // m

    // Grid
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const x = padL + (i / 5) * gw;
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + gh);
      ctx.stroke();

      const y = padT + (i / 5) * gh;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + gw, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + gh);
    ctx.lineTo(padL + gw, padT + gh);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('s (m)', padL - 8, padT + 10);
    ctx.fillText('0', padL - 8, padT + gh);
    ctx.fillText(`${maxS}`, padL - 8, padT + 20);

    ctx.textAlign = 'center';
    ctx.fillText('t² (s²)', padL + gw / 2, padT + gh + 28);
    ctx.fillText(`${maxT2}`, padL + gw, padT + gh + 16);

    // Theoretical line: s = 0.5 * g * t^2 => slope = 0.5 * 9.8 = 4.9
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, padT + gh);
    const endS = 4.9 * maxT2;
    const endY = padT + gh - (endS / maxS) * gh;
    ctx.lineTo(padL + gw, endY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot experimental trial points
    trials.forEach((tr) => {
      const t2 = tr.time * tr.time;
      const px = padL + (t2 / maxT2) * gw;
      const py = padT + gh - (tr.height / maxS) * gh;

      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }, [trials]);

  // Compute Mean g from trials
  const meanG =
    trials.length > 0
      ? (trials.reduce((acc, t) => acc + t.calculatedG, 0) / trials.length).toFixed(2)
      : '0.00';

  return (
    <div id="freefall-lab-container" className="space-y-6">
      {/* Top Banner Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-neutral-900 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-medium text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isVacuum}
              onChange={(e) => setIsVacuum(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              Ống chân không Newton (<Latex content={"$F_{\\text{cản}} = 0$"} />)
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={compareFeather}
              onChange={(e) => setCompareFeather(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <span>Thả cùng lông chim để so sánh</span>
          </label>
        </div>

        <div className="text-xs text-neutral-400 font-mono bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700/50">
          Gia tốc chuẩn tại VN: <span className="text-emerald-400 font-bold">g = 9.80 m/s²</span>
        </div>
      </div>

      {/* Main Lab Area: Tower Canvas + Digital Timer MC964 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Drop Tower Column (5 cols) */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#090d16] p-3 flex justify-center shadow-inner">
          <canvas ref={canvasRef} width={380} height={420} className="w-full max-w-[380px] h-auto block rounded-xl" />
        </div>

        {/* Controls & MC964 Timer Box (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Virtual Digital Timer MC964 Box */}
          <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <span className="text-xs font-bold text-neutral-200 tracking-wider font-mono">
                ĐỒNG HỒ ĐO THỜI GIAN HIỆN SỐ MC964
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-400 text-[10px] font-mono rounded border border-indigo-800/60">
                MODE A (THẢ RƠI)
              </span>
            </div>

            {/* Large 7-segment digital display */}
            <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-4 text-center">
              <div className="text-xs text-emerald-400/80 font-mono tracking-wider mb-1">THỜI GIAN RƠI (GIÂY)</div>
              <div className="text-4xl sm:text-5xl font-mono font-black text-emerald-400 tracking-widest drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                {timerDisplay} <span className="text-xl font-normal text-emerald-500/70">s</span>
              </div>
            </div>

            {/* Action buttons on the device */}
            <div className="flex items-center justify-center gap-3">
              <button
                id="release-magnet-btn"
                onClick={handleRelease}
                disabled={isFalling}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> NHẢ NAM CHÂM ĐIỆN
              </button>
              <button
                id="reset-timer-btn"
                onClick={handleReset}
                className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl border border-neutral-700/60 transition-colors cursor-pointer"
                title="Reset về 0.000s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Height Adjuster Slider */}
          <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-neutral-300">Vị trí Cổng quang điện (Quãng đường rơi <Latex content={"$s$"} />):</span>
              <span className="text-sky-400 font-mono text-sm font-bold">{(height * 100).toFixed(0)} cm ({height.toFixed(2)} m)</span>
            </div>
            <input
              id="height-slider"
              type="range"
              min="0.2"
              max="1.1"
              step="0.05"
              value={height}
              onChange={(e) => {
                setHeight(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full accent-sky-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>20 cm</span>
              <span>40 cm</span>
              <span>60 cm</span>
              <span>80 cm</span>
              <span>100 cm</span>
            </div>
          </div>

          {/* Save Trial Button */}
          {measuredTime !== null && (
            <button
              onClick={handleSaveTrial}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl shadow transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Lưu kết quả lần đo này vào Bảng số liệu
            </button>
          )}
        </div>
      </div>

      {/* Experimental Data Analysis & Graph Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-neutral-900 p-5 rounded-2xl border border-neutral-800">
        {/* Left: Table of Experimental Trials */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Bảng số liệu thực nghiệm</span>
              <Latex content={"($g = \\frac{2s}{t^2}$)"} />
            </h4>
            <span className="text-xs text-neutral-400 font-mono">{trials.length} lần đo</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-xs text-left text-neutral-300">
              <thead className="bg-neutral-800/80 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="py-2.5 px-3">Lần</th>
                  <th className="py-2.5 px-3">Quãng đường <Latex content={"$s$ (m)"} /></th>
                  <th className="py-2.5 px-3">Thời gian <Latex content={"$t$ (s)"} /></th>
                  <th className="py-2.5 px-3">
                    <Latex content={"$g_{\\text{tn}}$ (m/s²)"} />
                  </th>
                  <th className="py-2.5 px-2 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {trials.map((tr, index) => (
                  <tr key={tr.id} className="hover:bg-neutral-800/40">
                    <td className="py-2.5 px-3 font-mono">{index + 1}</td>
                    <td className="py-2.5 px-3 font-mono">{tr.height.toFixed(2)}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400">{tr.time.toFixed(3)}</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400 font-bold">{tr.calculatedG.toFixed(2)}</td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => handleDeleteTrial(tr.id)}
                        className="text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Xóa dòng này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-neutral-800/60 rounded-xl border border-neutral-700/60 flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">Gia tốc trung bình thực nghiệm:</span>
            <span className="font-mono text-base font-bold text-emerald-400">
              <Latex content={`$\\bar{g} = ${meanG}\\text{ m/s}^2$`} />
            </span>
          </div>
        </div>

        {/* Right: Graph s - t^2 Linearization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Gauge className="w-4 h-4 text-indigo-400" />
              Đồ thị tuyến tính hóa <Latex content={"$s - t^2$"} />
            </h4>
            <span className="text-xs text-neutral-400 font-mono">Hệ số góc: k = 0.5g</span>
          </div>

          <div className="rounded-xl overflow-hidden border border-neutral-800 bg-[#090d16] p-2 flex justify-center shadow-inner">
            <canvas ref={graphCanvasRef} width={380} height={220} className="w-full h-auto block rounded-lg" />
          </div>

          <p className="text-[11px] text-neutral-400 italic">
            Đường đứt nét là lý thuyết lý tưởng (<Latex content={"$g = 9.80\\text{ m/s}^2$"} />). Các điểm chấm xanh ngọc là kết quả đo thực tế của bạn.
          </p>
        </div>
      </div>
    </div>
  );
};
