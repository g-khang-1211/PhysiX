import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Compass, Waves, ArrowRight, Gauge } from 'lucide-react';
import { Latex } from '../Latex';

interface WakeParticle {
  x: number;
  y: number;
  alpha: number;
  radius: number;
}

export const VectorBoatLab: React.FC = () => {
  // River & Boat Parameters
  const [riverWidth, setRiverWidth] = useState<number>(100); // meters
  const [riverSpeed, setRiverSpeed] = useState<number>(3); // v23: m/s (dòng nước)
  const [boatSpeed, setBoatSpeed] = useState<number>(4); // v12: m/s (thuyền so với nước)
  const [boatAngleDeg, setBoatAngleDeg] = useState<number>(90); // 90° = thẳng góc qua sông, >90° chếch thượng lưu

  // Simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);
  const [boatTrail, setBoatTrail] = useState<{ x: number; y: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const wakeParticlesRef = useRef<WakeParticle[]>([]);
  const riverFlowOffsetRef = useRef<number>(0);

  // Velocity components:
  // Let X be along river bank (downstream is +X)
  // Let Y be across river (from Bank A to Bank B is +Y)
  const angleRad = (boatAngleDeg * Math.PI) / 180;
  // Boat relative to water (v12):
  const v12x = -boatSpeed * Math.cos(angleRad); // negative if pointing upstream
  const v12y = boatSpeed * Math.sin(angleRad); // across river

  // River relative to bank (v23):
  const v23x = riverSpeed;
  const v23y = 0;

  // Boat relative to bank (v13 = v12 + v23):
  const v13x = v12x + v23x;
  const v13y = v12y + v23y;
  const v13Magnitude = Math.sqrt(v13x * v13x + v13y * v13y);

  // Time to cross river:
  const transitTime = v13y > 0 ? riverWidth / v13y : 999;
  const driftDistance = v13x * transitTime; // downstream drift
  const totalDisplacement = Math.sqrt(driftDistance * driftDistance + riverWidth * riverWidth);

  // Current boat position
  const currentT = Math.min(simTime, transitTime);
  const currentX = v13x * currentT;
  const currentY = v13y * currentT;

  // Real-time Physics & Animation Frame Loop
  useEffect(() => {
    let isMounted = true;

    const renderLoop = (timestamp: number) => {
      if (!isMounted) return;
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      // Update river continuous wave drift
      riverFlowOffsetRef.current = (riverFlowOffsetRef.current + riverSpeed * 40 * dt) % 120;

      // Progress boat simulation if playing
      if (isPlaying) {
        setSimTime((prev) => {
          const next = prev + dt;
          if (next >= transitTime) {
            setIsPlaying(false);
            return transitTime;
          }
          return next;
        });

        // Spawn boat wake particles
        if (Math.random() < 0.6) {
          wakeParticlesRef.current.push({
            x: currentX,
            y: currentY,
            alpha: 0.7,
            radius: 2 + Math.random() * 2,
          });
        }
      }

      // Update wake particles
      wakeParticlesRef.current = wakeParticlesRef.current.filter((p) => {
        p.alpha -= 0.6 * dt;
        p.radius += 5 * dt;
        p.x += (riverSpeed * 0.4) * dt; // drift with water
        return p.alpha > 0;
      });

      // --- CANVAS DRAWING ---
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          const riverTopY = 48;
          const riverBottomY = h - 48;
          const pixelRiverWidth = riverBottomY - riverTopY;
          const scale = pixelRiverWidth / riverWidth; // pixels per meter

          // 1. River Banks (Earth/Stone borders)
          ctx.fillStyle = '#18181b';
          ctx.fillRect(0, 0, w, riverTopY);
          ctx.fillRect(0, riverBottomY, w, 48);

          // Bank grassline borders
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, riverTopY);
          ctx.lineTo(w, riverTopY);
          ctx.moveTo(0, riverBottomY);
          ctx.lineTo(w, riverBottomY);
          ctx.stroke();

          // 2. Animated River Water Body
          const waterGrad = ctx.createLinearGradient(0, riverTopY, 0, riverBottomY);
          waterGrad.addColorStop(0, '#0c4a6e');
          waterGrad.addColorStop(0.5, '#0369a1');
          waterGrad.addColorStop(1, '#075985');
          ctx.fillStyle = waterGrad;
          ctx.fillRect(0, riverTopY, w, pixelRiverWidth);

          // Flowing Animated Water Currents (Moving Wavelets)
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';

          for (let row = 1; row <= 5; row++) {
            const cy = riverTopY + (row / 6) * pixelRiverWidth;
            const stagger = (row % 2) * 50;
            for (let x = -80 + (riverFlowOffsetRef.current + stagger) % 120; x < w + 80; x += 120) {
              ctx.beginPath();
              ctx.moveTo(x, cy);
              ctx.bezierCurveTo(x + 15, cy - 3, x + 30, cy + 3, x + 45, cy);
              ctx.stroke();

              // Arrow tip on some waves
              if (row % 2 === 1) {
                ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
                ctx.beginPath();
                ctx.moveTo(x + 45, cy);
                ctx.lineTo(x + 38, cy - 3);
                ctx.lineTo(x + 38, cy + 3);
                ctx.closePath();
                ctx.fill();
              }
            }
          }

          // Bank labels
          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('BỜ ĐỐI DIỆN (BỜ B) - ĐÍCH ĐẾN', 16, riverTopY - 14);
          ctx.fillText('BỜ XUẤT PHÁT (BỜ A)', 16, riverBottomY + 24);

          // River velocity indicator
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'italic 11px monospace';
          ctx.fillText(`Dòng chảy sông v₂₃ = ${riverSpeed.toFixed(1)} m/s ➔`, w / 2 - 80, riverTopY + 22);

          // Start point A
          const startCanvasX = 140;
          const startCanvasY = riverBottomY;
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(startCanvasX, startCanvasY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('A (Xuất phát)', startCanvasX - 25, startCanvasY + 20);

          // Ideal direct crossing point B (directly opposite)
          ctx.strokeStyle = '#94a3b8';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(startCanvasX, startCanvasY);
          ctx.lineTo(startCanvasX, riverTopY);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#94a3b8';
          ctx.fillText("B (Đối diện)", startCanvasX - 20, riverTopY - 14);

          // Target landing point B' (with drift)
          const endCanvasX = startCanvasX + driftDistance * scale;
          const endCanvasY = riverTopY;
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(endCanvasX, endCanvasY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText("B' (Cập bến thực tế)", endCanvasX - 35, riverTopY - 14);

          // Drift bracket along opposite bank
          if (Math.abs(driftDistance) > 1) {
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(startCanvasX, riverTopY - 4);
            ctx.lineTo(endCanvasX, riverTopY - 4);
            ctx.stroke();
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(
              `Độ dạt bờ: ${Math.abs(driftDistance).toFixed(1)} m`,
              (startCanvasX + endCanvasX) / 2,
              riverTopY - 8
            );
          }

          // Render wake particles behind boat
          wakeParticlesRef.current.forEach((p) => {
            const wx = startCanvasX + p.x * scale;
            const wy = startCanvasY - p.y * scale;
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(wx, wy, p.radius, 0, Math.PI * 2);
            ctx.fill();
          });

          // Trajectory Trail
          if (boatTrail.length > 1) {
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.75)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            boatTrail.forEach((pt, idx) => {
              const bx = startCanvasX + pt.x * scale;
              const by = startCanvasY - pt.y * scale;
              if (idx === 0) ctx.moveTo(bx, by);
              else ctx.lineTo(bx, by);
            });
            ctx.stroke();
          }

          // Boat Position & Parallelogram of Velocities
          const boatCanvasX = startCanvasX + currentX * scale;
          const boatCanvasY = startCanvasY - currentY * scale;

          ctx.save();
          ctx.translate(boatCanvasX, boatCanvasY);

          // Draw Boat Hull
          const boatOrient = -angleRad + Math.PI / 2;
          ctx.rotate(boatOrient);
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.moveTo(0, -14);
          ctx.lineTo(9, 10);
          ctx.lineTo(-9, 10);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();

          // Draw Velocity Vector Parallelogram from Boat Center
          ctx.save();
          ctx.translate(boatCanvasX, boatCanvasY);
          const vScale = 14; // pixels per m/s

          // 1. v12: Boat relative to water (Cyan)
          const p12x = v12x * vScale;
          const p12y = -v12y * vScale;
          ctx.strokeStyle = '#38bdf8';
          ctx.fillStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(p12x, p12y);
          ctx.stroke();
          ctx.font = 'bold 11px monospace';
          ctx.fillText('v₁₂', p12x + 4, p12y);

          // 2. v23: River flow relative to bank (Emerald)
          const p23x = v23x * vScale;
          const p23y = -v23y * vScale;
          ctx.strokeStyle = '#34d399';
          ctx.fillStyle = '#34d399';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(p23x, p23y);
          ctx.stroke();
          ctx.fillText('v₂₃', p23x + 4, p23y - 2);

          // 3. Parallelogram helper dashed lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(p12x, p12y);
          ctx.lineTo(p12x + p23x, p12y + p23y);
          ctx.moveTo(p23x, p23y);
          ctx.lineTo(p12x + p23x, p12y + p23y);
          ctx.stroke();
          ctx.setLineDash([]);

          // 4. v13: Resultant absolute velocity (Gold)
          const p13x = v13x * vScale;
          const p13y = -v13y * vScale;
          ctx.strokeStyle = '#facc15';
          ctx.fillStyle = '#facc15';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(p13x, p13y);
          ctx.stroke();
          ctx.fillText('v₁₃', p13x + 6, p13y - 2);

          ctx.restore();
        }
      }

      animRef.current = requestAnimationFrame(renderLoop);
    };

    animRef.current = requestAnimationFrame(renderLoop);
    return () => {
      isMounted = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [
    riverWidth,
    riverSpeed,
    boatSpeed,
    boatAngleDeg,
    isPlaying,
    transitTime,
    currentX,
    currentY,
    driftDistance,
    v12x,
    v12y,
    v23x,
    v23y,
    v13x,
    v13y,
    angleRad,
  ]);

  // Record trail while sailing
  useEffect(() => {
    if (simTime === 0) {
      setBoatTrail([{ x: 0, y: 0 }]);
    } else {
      setBoatTrail((prev) => [...prev, { x: currentX, y: currentY }]);
    }
  }, [simTime, currentX, currentY]);

  const handleStart = () => {
    setIsPlaying(false);
    setSimTime(0);
    setBoatTrail([{ x: 0, y: 0 }]);
    wakeParticlesRef.current = [];
    setTimeout(() => setIsPlaying(true), 50);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSimTime(0);
    setBoatTrail([{ x: 0, y: 0 }]);
    wakeParticlesRef.current = [];
  };

  return (
    <div id="vector-boat-lab-container" className="space-y-6">
      {/* Top Banner: Formula & Physics Frames */}
      <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-sky-400">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-neutral-400 font-mono uppercase bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700/50">
                TỔNG HỢP VẬN TỐC
              </span>
              <span className="text-xs text-neutral-400">Định lý cộng vectơ vận tốc</span>
            </div>
            <div className="text-sm font-mono text-amber-400 font-bold mt-0.5">
              <Latex content="$\vec{v}_{1,3} = \vec{v}_{1,2} + \vec{v}_{2,3}$" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-neutral-400 bg-neutral-800/60 px-3.5 py-2 rounded-xl border border-neutral-700/50">
          <span><strong className="text-cyan-400">(1)</strong> Thuyền</span>
          <span>•</span>
          <span><strong className="text-emerald-400">(2)</strong> Dòng nước</span>
          <span>•</span>
          <span><strong className="text-amber-400">(3)</strong> Bờ đất</span>
        </div>
      </div>

      {/* Main Expansive River Simulation Canvas */}
      <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-[#090d16] p-3 sm:p-4 relative shadow-inner">
        <canvas ref={canvasRef} width={880} height={360} className="w-full h-auto block rounded-xl" />

        {/* Live Telemetry Overlay Card */}
        <div className="absolute top-6 right-6 bg-neutral-900/90 backdrop-blur-md p-3.5 rounded-xl border border-neutral-700/80 text-xs font-mono text-neutral-300 space-y-1.5 shadow-xl max-w-xs">
          <div className="text-[11px] text-neutral-400 font-semibold uppercase border-b border-neutral-800 pb-1 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            Số liệu thời gian thực
          </div>
          <div>
            Thời gian trôi: <span className="text-amber-400 font-bold">{currentT.toFixed(1)} s / {transitTime.toFixed(1)} s</span>
          </div>
          <div>
            Vận tốc so với bờ <Latex content="$v_{1,3}$:" />{' '}
            <span className="text-yellow-400 font-bold">{v13Magnitude.toFixed(2)} m/s</span>
          </div>
          <div>
            Độ dạt bờ: <span className="text-emerald-400 font-bold">{Math.abs(driftDistance).toFixed(1)} m</span>
          </div>
          <div className="border-t border-neutral-800 pt-1 text-[11px] text-neutral-400">
            Tổng độ dời <Latex content="$d$:" />{' '}
            <span className="text-sky-400 font-bold">{totalDisplacement.toFixed(1)} m</span>
          </div>
        </div>
      </div>

      {/* Interactive Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-neutral-900 p-4 sm:p-5 rounded-2xl border border-neutral-800 items-center">
        {/* Run / Reset Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStart}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> XUẤT PHÁT
          </button>
          <button
            onClick={handleReset}
            className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl border border-neutral-700/60 transition-colors cursor-pointer"
            title="Khôi phục trạng thái ban đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* River Speed Slider (v23) */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold">
            <Latex content="Vận tốc dòng nước $v_{2,3}$:" />
            <span className="text-emerald-400 font-mono">{riverSpeed} m/s</span>
          </div>
          <input
            type="range"
            min="0"
            max="6"
            step="0.5"
            value={riverSpeed}
            onChange={(e) => {
              setRiverSpeed(parseFloat(e.target.value));
              handleReset();
            }}
            className="w-full accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Boat Speed Slider (v12) */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold">
            <Latex content="Vận tốc thuyền đối với nước $v_{1,2}$:" />
            <span className="text-cyan-400 font-mono">{boatSpeed} m/s</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            step="0.5"
            value={boatSpeed}
            onChange={(e) => {
              setBoatSpeed(parseFloat(e.target.value));
              handleReset();
            }}
            className="w-full accent-cyan-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Boat Heading Angle Slider */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold">
            <Latex content="Góc hướng mũi thuyền $\theta$:" />
            <span className="text-indigo-400 font-mono">{boatAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="45"
            max="135"
            step="5"
            value={boatAngleDeg}
            onChange={(e) => {
              setBoatAngleDeg(parseFloat(e.target.value));
              handleReset();
            }}
            className="w-full accent-indigo-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
