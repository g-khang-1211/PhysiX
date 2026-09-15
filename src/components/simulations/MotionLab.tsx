import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Info, Gauge } from 'lucide-react';
import { Latex } from '../Latex';

export const MotionLab: React.FC = () => {
  // Parameters
  const [v0, setV0] = useState<number>(5); // m/s
  const [a, setA] = useState<number>(2); // m/s^2
  const [motionType, setMotionType] = useState<'uniform' | 'accel' | 'decel'>('accel');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [history, setHistory] = useState<{ t: number; d: number; v: number }[]>([]);

  const animRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Canvas refs
  const roadCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle motion type presets
  const applyPreset = (type: 'uniform' | 'accel' | 'decel') => {
    setIsPlaying(false);
    setTime(0);
    setHistory([]);
    setMotionType(type);
    if (type === 'uniform') {
      setV0(8);
      setA(0);
    } else if (type === 'accel') {
      setV0(2);
      setA(2.5);
    } else {
      setV0(14);
      setA(-2.5);
    }
  };

  // Current values
  const effectiveV = v0 + a * time;
  const isStopped = a < 0 && effectiveV <= 0;
  const currentV = isStopped ? 0 : effectiveV;
  const currentD = isStopped
    ? (0 - v0 * v0) / (2 * a)
    : v0 * time + 0.5 * a * time * time;

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const updateLoop = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSeconds = ((timestamp - lastTimestampRef.current) / 1000) * playbackSpeed;
      lastTimestampRef.current = timestamp;

      setTime((prevTime) => {
        const nextTime = prevTime + deltaSeconds;
        if (a < 0 && v0 + a * nextTime <= 0) {
          const stopTime = -v0 / a;
          setIsPlaying(false);
          return Math.max(0, stopTime);
        }
        if (nextTime >= 12) {
          setIsPlaying(false);
          return 12;
        }
        return nextTime;
      });

      animRef.current = requestAnimationFrame(updateLoop);
    };

    animRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, playbackSpeed, v0, a]);

  // Update history
  useEffect(() => {
    if (time === 0) {
      setHistory([{ t: 0, d: 0, v: v0 }]);
    } else {
      setHistory((prev) => {
        if (prev.length > 0 && time - prev[prev.length - 1].t < 0.08) {
          return prev;
        }
        return [...prev, { t: time, d: currentD, v: currentV }];
      });
    }
  }, [time, currentD, currentV, v0]);

  // Draw Road & Car
  useEffect(() => {
    const canvas = roadCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background gradient
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Track road
    const roadY = height - 58;
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, roadY, width, 58);

    // Track border
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, roadY);
    ctx.lineTo(width, roadY);
    ctx.stroke();

    // Distance ticks along track (0m to 100m)
    const maxTrackDistance = 100;
    const scale = (width - 120) / maxTrackDistance;
    const startX = 60;

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    for (let d = 0; d <= maxTrackDistance; d += 10) {
      const x = startX + d * scale;
      ctx.beginPath();
      ctx.moveTo(x, roadY);
      ctx.lineTo(x, roadY + 10);
      ctx.strokeStyle = '#71717a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillText(`${d}m`, x, roadY + 24);
    }

    // Secondary 2m tick marks
    for (let d = 0; d <= maxTrackDistance; d += 2) {
      if (d % 10 !== 0) {
        const x = startX + d * scale;
        ctx.beginPath();
        ctx.moveTo(x, roadY);
        ctx.lineTo(x, roadY + 5);
        ctx.strokeStyle = '#3f3f46';
        ctx.stroke();
      }
    }

    // Car position
    const carX = Math.min(width - 50, startX + currentD * scale);
    const carY = roadY - 26;

    // Draw track ghost dots (path trace)
    history.forEach((pt, idx) => {
      if (idx % 4 === 0) {
        const px = startX + pt.d * scale;
        ctx.beginPath();
        ctx.arc(px, roadY - 4, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.45)';
        ctx.fill();
      }
    });

    // Draw stylized car body
    ctx.save();
    ctx.translate(carX, carY);

    // Headlight beam casting light ahead
    if (currentV > 0) {
      const lightGrad = ctx.createRadialGradient(28, 6, 2, 80, 10, 70);
      lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      lightGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.moveTo(24, 6);
      ctx.lineTo(100, -8);
      ctx.lineTo(100, 24);
      ctx.closePath();
      ctx.fill();
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(0, 24, 28, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.roundRect(-24, 0, 48, 18, [5, 10, 4, 4]);
    ctx.fill();

    // Cabin
    ctx.fillStyle = '#818cf8';
    ctx.beginPath();
    ctx.roundRect(-14, -12, 28, 14, [6, 8, 0, 0]);
    ctx.fill();

    // Windows
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.roundRect(-10, -9, 10, 9, [3, 0, 0, 0]);
    ctx.roundRect(2, -9, 10, 9, [0, 4, 0, 0]);
    ctx.fill();

    // Wheels with rotation
    const wheelAngle = (currentD * scale * 0.25) % (Math.PI * 2);
    [-14, 14].forEach((wx) => {
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(wx, 18, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#d4d4d8';
      ctx.beginPath();
      ctx.arc(wx, 18, 3, 0, Math.PI * 2);
      ctx.fill();

      // Rim spokes
      ctx.strokeStyle = '#71717a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(wx + Math.cos(wheelAngle) * 6, 18 + Math.sin(wheelAngle) * 6);
      ctx.lineTo(wx - Math.cos(wheelAngle) * 6, 18 - Math.sin(wheelAngle) * 6);
      ctx.stroke();
    });

    // Headlights bulb
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(22, 6, 3, 0, Math.PI * 2);
    ctx.fill();

    // Vector arrows on the car:
    // Velocity vector (Cyan arrow)
    const vLength = currentV * 4;
    if (Math.abs(vLength) > 2) {
      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(vLength, -18);
      ctx.stroke();

      const arrowDir = vLength >= 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(vLength, -18);
      ctx.lineTo(vLength - 6 * arrowDir, -22);
      ctx.lineTo(vLength - 6 * arrowDir, -14);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 10px monospace';
      ctx.fillText(`v = ${currentV.toFixed(1)}m/s`, vLength / 2, -24);
    }

    // Acceleration vector (Emerald arrow)
    const aLength = a * 14;
    if (Math.abs(aLength) > 2) {
      ctx.strokeStyle = '#34d399';
      ctx.fillStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -36);
      ctx.lineTo(aLength, -36);
      ctx.stroke();

      const arrowDir = aLength >= 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(aLength, -36);
      ctx.lineTo(aLength - 5 * arrowDir, -40);
      ctx.lineTo(aLength - 5 * arrowDir, -32);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 10px monospace';
      ctx.fillText(`a = ${a.toFixed(1)}m/s²`, aLength / 2, -42);
    }

    ctx.restore();
  }, [currentD, currentV, history, a]);

  // Draw Dual Graphs: d-t and v-t
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const maxT = 12; // 12 seconds window
    const gTop = 32;
    const gh = h - 65;
    const gw = (w - 150) / 2;

    // --- Subgraph 1: d-t graph (Left) ---
    const g1Left = 55;
    const maxD = Math.max(80, currentD * 1.15);

    // Grid lines for d-t
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    for (let t = 0; t <= maxT; t += 3) {
      const gx = g1Left + (t / maxT) * gw;
      ctx.beginPath();
      ctx.moveTo(gx, gTop);
      ctx.lineTo(gx, gTop + gh);
      ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      const gy = gTop + gh - (i / 4) * gh;
      ctx.beginPath();
      ctx.moveTo(g1Left, gy);
      ctx.lineTo(g1Left + gw, gy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(g1Left, gTop);
    ctx.lineTo(g1Left, gTop + gh);
    ctx.lineTo(g1Left + gw, gTop + gh);
    ctx.stroke();

    // Labels d-t
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${maxD.toFixed(0)}`, g1Left - 6, gTop + 10);
    ctx.fillText('0', g1Left - 6, gTop + gh);
    ctx.textAlign = 'center';
    ctx.fillText(`${maxT}s`, g1Left + gw, gTop + gh + 16);
    ctx.fillText('t (s)', g1Left + gw / 2, gTop + gh + 20);

    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Đồ thị d - t (Độ dịch chuyển)', g1Left, gTop - 12);

    // Plot d-t curve
    if (history.length > 1) {
      ctx.beginPath();
      history.forEach((pt, i) => {
        const px = g1Left + (pt.t / maxT) * gw;
        const py = gTop + gh - (pt.d / maxD) * gh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const lastPt = history[history.length - 1];
      const curPx = g1Left + (lastPt.t / maxT) * gw;
      const curPy = gTop + gh - (lastPt.d / maxD) * gh;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(curPx, curPy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- Subgraph 2: v-t graph (Right) ---
    const g2Left = g1Left + gw + 40;
    const maxV = Math.max(20, (v0 + 4) * 1.1);

    // Grid lines for v-t
    ctx.strokeStyle = '#18181b';
    for (let t = 0; t <= maxT; t += 3) {
      const gx = g2Left + (t / maxT) * gw;
      ctx.beginPath();
      ctx.moveTo(gx, gTop);
      ctx.lineTo(gx, gTop + gh);
      ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      const gy = gTop + gh - (i / 4) * gh;
      ctx.beginPath();
      ctx.moveTo(g2Left, gy);
      ctx.lineTo(g2Left + gw, gy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(g2Left, gTop);
    ctx.lineTo(g2Left, gTop + gh);
    ctx.lineTo(g2Left + gw, gTop + gh);
    ctx.stroke();

    // Labels v-t
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${maxV.toFixed(0)}`, g2Left - 6, gTop + 10);
    ctx.fillText('0', g2Left - 6, gTop + gh);
    ctx.textAlign = 'center';
    ctx.fillText(`${maxT}s`, g2Left + gw, gTop + gh + 16);
    ctx.fillText('t (s)', g2Left + gw / 2, gTop + gh + 20);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Đồ thị v - t (Vận tốc)', g2Left, gTop - 12);

    // Highlight area under v-t graph
    if (history.length > 1) {
      ctx.beginPath();
      ctx.moveTo(g2Left, gTop + gh);
      history.forEach((pt) => {
        const px = g2Left + (pt.t / maxT) * gw;
        const py = gTop + gh - (pt.v / maxV) * gh;
        ctx.lineTo(px, py);
      });
      const lastX = g2Left + (history[history.length - 1].t / maxT) * gw;
      ctx.lineTo(lastX, gTop + gh);
      ctx.closePath();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fill();

      // Plot v-t curve
      ctx.beginPath();
      history.forEach((pt, i) => {
        const px = g2Left + (pt.t / maxT) * gw;
        const py = gTop + gh - (pt.v / maxV) * gh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.font = 'italic 11px sans-serif';
      ctx.textAlign = 'center';
      if (lastX > g2Left + 40) {
        ctx.fillText(`Diện tích S = d = ${currentD.toFixed(1)}m`, (g2Left + lastX) / 2, gTop + gh - 12);
      }
    }
  }, [history, currentD, currentV, v0, a]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setHistory([{ t: 0, d: 0, v: v0 }]);
  };

  const handleStep = () => {
    setIsPlaying(false);
    setTime((prev) => {
      const next = prev + 0.2;
      return next <= 12 ? next : 12;
    });
  };

  return (
    <div id="motion-lab-container" className="space-y-6">
      {/* Preset Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-neutral-900 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Dạng chuyển động:</span>
          <div className="inline-flex rounded-xl bg-neutral-800 p-1 border border-neutral-700/60">
            <button
              id="preset-uniform-btn"
              onClick={() => applyPreset('uniform')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                motionType === 'uniform' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Thẳng đều (<Latex content={"$a = 0$"} />)
            </button>
            <button
              id="preset-accel-btn"
              onClick={() => applyPreset('accel')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                motionType === 'accel' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Nhanh dần đều (<Latex content={"$a \\cdot v > 0$"} />)
            </button>
            <button
              id="preset-decel-btn"
              onClick={() => applyPreset('decel')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                motionType === 'decel' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Chậm dần đều (<Latex content={"$a \\cdot v < 0$"} />)
            </button>
          </div>
        </div>

        {/* Speed Multiplier */}
        <div className="flex items-center gap-2 text-xs text-neutral-300">
          <FastForward className="w-3.5 h-3.5 text-indigo-400" />
          <span>Tốc độ phát:</span>
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                playbackSpeed === spd ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Track Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#090d16] p-3 shadow-inner">
        <canvas
          ref={roadCanvasRef}
          width={840}
          height={180}
          className="w-full h-auto block rounded-xl"
        />

        {/* Status Overlay */}
        <div className="absolute top-5 left-5 bg-neutral-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-neutral-700/80 text-xs font-mono flex items-center gap-4 text-neutral-200 shadow-xl">
          <div>
            <span className="text-neutral-400">Thời gian <Latex content={"$t$:"} /> </span>
            <span className="text-amber-400 font-bold">{time.toFixed(2)}s</span>
          </div>
          <div>
            <span className="text-neutral-400">Vị trí <Latex content={"$d$:"} /> </span>
            <span className="text-indigo-400 font-bold">{currentD.toFixed(2)}m</span>
          </div>
          <div>
            <span className="text-neutral-400">Vận tốc <Latex content={"$v$:"} /> </span>
            <span className="text-cyan-400 font-bold">{currentV.toFixed(2)}m/s</span>
          </div>
          <div>
            <span className="text-neutral-400">Gia tốc <Latex content={"$a$:"} /> </span>
            <span className="text-emerald-400 font-bold">{a.toFixed(2)}m/s²</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-900 p-4 sm:p-5 rounded-2xl border border-neutral-800">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="play-pause-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs transition-colors shadow-lg cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Tạm dừng
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Bắt đầu chạy
              </>
            )}
          </button>
          <button
            id="step-btn"
            onClick={handleStep}
            disabled={isPlaying}
            className="px-3 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium disabled:opacity-40 transition-colors cursor-pointer border border-neutral-700/60"
            title="Nhích một bước thời gian (+0.2s)"
          >
            Bước (+0.2s)
          </button>
          <button
            id="reset-btn"
            onClick={handleReset}
            className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer border border-neutral-700/60"
            title="Đặt lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-medium">
            <span className="text-neutral-300">Vận tốc đầu <Latex content={"$v_0$:"} /></span>
            <span className="text-cyan-400 font-mono font-bold">{v0} m/s</span>
          </div>
          <input
            id="v0-slider"
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={v0}
            onChange={(e) => {
              setV0(parseFloat(e.target.value));
              handleReset();
            }}
            className="w-full accent-cyan-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-medium">
            <span className="text-neutral-300">Gia tốc <Latex content={"$a$:"} /></span>
            <span className="text-emerald-400 font-mono font-bold">{a} m/s²</span>
          </div>
          <input
            id="a-slider"
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={a}
            onChange={(e) => {
              setA(parseFloat(e.target.value));
              handleReset();
            }}
            className="w-full accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Real-time Dual Graph Canvas */}
      <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-[#090d16] p-4 shadow-inner">
        <canvas
          ref={graphCanvasRef}
          width={840}
          height={240}
          className="w-full h-auto block rounded-xl"
        />
        <div className="mt-3 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <Latex content={"Đồ thị bên trái: độ dốc biểu thị vận tốc $v = \\frac{\\Delta d}{\\Delta t}$. Đồ thị bên phải: diện tích tô bóng dưới đường $v - t$ chính là độ dịch chuyển $d$."} />
        </div>
      </div>
    </div>
  );
};
