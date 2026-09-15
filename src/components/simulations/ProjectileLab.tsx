import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Crosshair } from 'lucide-react';
import { Latex } from '../Latex';

export const ProjectileLab: React.FC = () => {
  // Parameters
  const [h0, setH0] = useState<number>(25); // initial height: meters
  const [v0, setV0] = useState<number>(18); // initial velocity: m/s
  const [angleDeg, setAngleDeg] = useState<number>(0); // 0 = ném ngang, >0 = ném xiên
  const [simultaneousDrop, setSimultaneousDrop] = useState<boolean>(true); // So sánh rơi tự do đồng thời
  const [showVectors, setShowVectors] = useState<boolean>(true);

  // Simulation states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [strobePoints, setStrobePoints] = useState<{ x: number; y: number; t: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const g = 9.8;
  const angleRad = (angleDeg * Math.PI) / 180;
  const v0x = v0 * Math.cos(angleRad);
  const v0y = v0 * Math.sin(angleRad); // upward positive in formula

  // Total flight time calculation
  // y(t) = h0 + v0y*t - 0.5*g*t^2 = 0 => 0.5*g*t^2 - v0y*t - h0 = 0
  const totalFlightTime = (v0y + Math.sqrt(v0y * v0y + 2 * g * h0)) / g;
  const maxRange = v0x * totalFlightTime;
  const maxHeight = h0 + (v0y > 0 ? (v0y * v0y) / (2 * g) : 0);

  // Current physical quantities
  const currentT = Math.min(time, totalFlightTime);
  const currentX = v0x * currentT;
  const currentY = Math.max(0, h0 + v0y * currentT - 0.5 * g * currentT * currentT);
  const currentVx = v0x;
  const currentVy = v0y - g * currentT; // negative means downward
  const currentV = Math.sqrt(currentVx * currentVx + currentVy * currentVy);

  // Drop-only ball (free fall simultaneous comparison)
  const dropBallY = Math.max(0, h0 - 0.5 * g * currentT * currentT);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setTime((prev) => {
        const next = prev + dt;
        if (next >= totalFlightTime) {
          setIsPlaying(false);
          return totalFlightTime;
        }
        return next;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, totalFlightTime]);

  // Update stroboscopic dots
  useEffect(() => {
    if (time === 0) {
      setStrobePoints([{ x: 0, y: h0, t: 0 }]);
    } else {
      setStrobePoints((prev) => {
        if (prev.length > 0 && time - prev[prev.length - 1].t < 0.15) {
          return prev;
        }
        return [...prev, { x: currentX, y: currentY, t: time }];
      });
    }
  }, [time, currentX, currentY, h0]);

  const handleLaunch = () => {
    setIsPlaying(false);
    setTime(0);
    setStrobePoints([{ x: 0, y: h0, t: 0 }]);
    setTimeout(() => setIsPlaying(true), 30);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setStrobePoints([{ x: 0, y: h0, t: 0 }]);
  };

  // Draw 2D Projectile Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark canvas background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Ground plane
    const groundY = h - 45;
    const originX = 75; // Left margin for cannon tower

    // Ground grass/dirt
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, groundY, w, 45);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Scale mapping (Meters to Canvas Pixels)
    const viewMaxX = Math.max(70, maxRange * 1.25);
    const viewMaxY = Math.max(50, maxHeight * 1.3);
    const scaleX = (w - originX - 40) / viewMaxX;
    const scaleY = (groundY - 50) / viewMaxY;

    // Helper functions
    const toCanvasX = (mX: number) => originX + mX * scaleX;
    const toCanvasY = (mY: number) => groundY - mY * scaleY;

    // Grid coordinates
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#71717a';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    // Horizontal grid ticks
    const stepX = viewMaxX > 80 ? 20 : 10;
    for (let xm = 0; xm <= viewMaxX; xm += stepX) {
      const cx = toCanvasX(xm);
      ctx.beginPath();
      ctx.moveTo(cx, 30);
      ctx.lineTo(cx, groundY);
      ctx.stroke();
      ctx.fillText(`${xm}m`, cx, groundY + 16);
    }

    // Vertical grid ticks (every 10m)
    ctx.textAlign = 'right';
    for (let ym = 0; ym <= viewMaxY; ym += 10) {
      const cy = toCanvasY(ym);
      ctx.beginPath();
      ctx.moveTo(originX, cy);
      ctx.lineTo(w - 20, cy);
      ctx.stroke();
      ctx.fillText(`${ym}m`, originX - 8, cy + 3);
    }

    // Launch Tower / Platform
    const towerTopY = toCanvasY(h0);
    ctx.fillStyle = '#27272a';
    ctx.fillRect(originX - 35, towerTopY, 35, groundY - towerTopY);
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 2;
    ctx.strokeRect(originX - 35, towerTopY, 35, groundY - towerTopY);

    // Height ruler indicator
    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(originX - 45, towerTopY);
    ctx.lineTo(originX - 45, groundY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(`h = ${h0}m`, originX - 52, (towerTopY + groundY) / 2);

    // Theoretical Parabolic Curve (Dashed line)
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const simStep = totalFlightTime / 60;
    for (let t = 0; t <= totalFlightTime; t += simStep) {
      const px = v0x * t;
      const py = h0 + v0y * t - 0.5 * g * t * t;
      const cx = toCanvasX(px);
      const cy = toCanvasY(Math.max(0, py));
      if (t === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Stroboscopic strobe dots along flight path
    strobePoints.forEach((pt) => {
      const cx = toCanvasX(pt.x);
      const cy = toCanvasY(pt.y);
      ctx.fillStyle = 'rgba(129, 140, 248, 0.4)';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Cannon / Launcher Angle Indicator
    ctx.save();
    ctx.translate(originX, towerTopY);
    ctx.rotate(-angleRad);
    ctx.fillStyle = '#475569';
    ctx.fillRect(-6, -6, 26, 12);
    ctx.restore();

    // Drop Ball (Red ball: Thả rơi tự do cùng thời điểm)
    if (simultaneousDrop) {
      const dropBallCanvasY = toCanvasY(dropBallY);
      ctx.save();
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(originX, dropBallCanvasY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Horizontal dashed guide line connecting both balls to prove simultaneous height!
      const ballCanvasX = toCanvasX(currentX);
      const ballCanvasY = toCanvasY(currentY);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(originX, dropBallCanvasY);
      ctx.lineTo(ballCanvasX, ballCanvasY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Main Projectile (Cyan ball)
    const ballCanvasX = toCanvasX(currentX);
    const ballCanvasY = toCanvasY(currentY);

    ctx.save();
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(ballCanvasX, ballCanvasY, 8, 0, Math.PI * 2);
    ctx.fill();

    // If landed, draw impact dust ring
    if (currentT >= totalFlightTime) {
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(ballCanvasX, groundY, 18, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Vector Decompositions: vx, vy, v
    if (showVectors && currentT < totalFlightTime) {
      const vScale = 2.2;

      // vx vector (Horizontal cyan)
      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballCanvasX, ballCanvasY);
      ctx.lineTo(ballCanvasX + currentVx * vScale, ballCanvasY);
      ctx.stroke();

      // vy vector (Vertical rose: negative canvasVy is downward)
      const canvasVy = -currentVy * vScale;
      ctx.strokeStyle = '#f43f5e';
      ctx.fillStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballCanvasX, ballCanvasY);
      ctx.lineTo(ballCanvasX, ballCanvasY + canvasVy);
      ctx.stroke();

      // Resultant V vector (Yellow)
      ctx.strokeStyle = '#facc15';
      ctx.fillStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ballCanvasX, ballCanvasY);
      ctx.lineTo(ballCanvasX + currentVx * vScale, ballCanvasY + canvasVy);
      ctx.stroke();
    }

    ctx.restore();
  }, [h0, v0x, v0y, angleRad, maxRange, maxHeight, totalFlightTime, currentX, currentY, dropBallY, currentVx, currentVy, simultaneousDrop, showVectors, strobePoints, currentT]);

  return (
    <div id="projectile-lab-container" className="space-y-6">
      {/* Top Controls & Mode Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-neutral-900 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            id="preset-horizontal-btn"
            onClick={() => {
              setAngleDeg(0);
              handleReset();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              angleDeg === 0
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            Chuyển động Ném ngang (<Latex content={"$\\theta = 0^\\circ$"} />)
          </button>
          <button
            id="preset-angled-btn"
            onClick={() => {
              setAngleDeg(45);
              handleReset();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              angleDeg > 0
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            Chuyển động Ném xiên (<Latex content={"$\\theta = 45^\\circ$"} />)
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={simultaneousDrop}
              onChange={(e) => setSimultaneousDrop(e.target.checked)}
              className="rounded text-rose-500 focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <span className="text-rose-300 font-medium">So sánh thả rơi tự do đồng thời</span>
          </label>

          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showVectors}
              onChange={(e) => setShowVectors(e.target.checked)}
              className="rounded text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <div className="flex items-center gap-1">
              <span>Hiển thị phân tích vectơ</span>
              <Latex content={"($\\vec{v}_x, \\vec{v}_y, \\vec{v}$)"} />
            </div>
          </label>
        </div>
      </div>

      {/* Main Canvas View */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#090d16] p-3 shadow-inner">
        <canvas ref={canvasRef} width={840} height={340} className="w-full h-auto block rounded-xl" />

        {/* Real-time Telemetry Overlay */}
        <div className="absolute top-5 right-5 bg-neutral-900/90 backdrop-blur-md p-3.5 rounded-xl border border-neutral-700/80 text-xs font-mono text-neutral-200 space-y-1.5 shadow-xl">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Thời gian <Latex content={"$t$:"} /></span>
            <span className="text-amber-400 font-bold">{currentT.toFixed(2)}s / {totalFlightTime.toFixed(2)}s</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Toạ độ <Latex content={"$x$ (ngang):"} /></span>
            <span className="text-cyan-400 font-bold">{currentX.toFixed(1)} m</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Độ cao <Latex content={"$y$ (đứng):"} /></span>
            <span className="text-indigo-400 font-bold">{currentY.toFixed(1)} m</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-neutral-800 pt-1">
            <span className="text-neutral-400">Vận tốc <Latex content={"$v$:"} /></span>
            <span className="text-yellow-400 font-bold">{currentV.toFixed(1)} m/s</span>
          </div>
        </div>
      </div>

      {/* Sliders and Fire Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-neutral-900 p-4 sm:p-5 rounded-2xl border border-neutral-800 items-center">
        {/* Launch Button */}
        <div className="flex items-center gap-2">
          <button
            id="fire-cannon-btn"
            onClick={handleLaunch}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            <Crosshair className="w-4 h-4" /> BẮN / NÉM VẬT
          </button>
          <button
            id="reset-projectile-btn"
            onClick={handleReset}
            className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-colors cursor-pointer border border-neutral-700/60"
            title="Đặt lại vị trí ban đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Height Slider */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold">
            <span className="text-neutral-300">Độ cao ném <Latex content={"$h$:"} /></span>
            <span className="text-amber-400 font-mono font-bold">{h0} m</span>
          </div>
          <input
            id="h0-slider"
            type="range"
            min="5"
            max="45"
            step="1"
            value={h0}
            onChange={(e) => {
              setH0(parseFloat(e.target.value));
              handleReset();
            }}
            className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Initial Velocity Slider */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold">
            <span className="text-neutral-300">Vận tốc đầu <Latex content={"$v_0$:"} /></span>
            <span className="text-cyan-400 font-mono font-bold">{v0} m/s</span>
          </div>
          <input
            id="v0-slider"
            type="range"
            min="5"
            max="30"
            step="1"
            value={v0}
            onChange={(e) => {
              setV0(parseFloat(e.target.value));
              handleReset();
            }}
            className="w-full accent-cyan-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Launch Angle Slider */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold">
            <span className="text-neutral-300">Góc ném <Latex content={"$\\theta$:"} /></span>
            <span className="text-indigo-400 font-mono font-bold">{angleDeg}°</span>
          </div>
          <input
            id="angle-slider"
            type="range"
            min="0"
            max="75"
            step="5"
            value={angleDeg}
            onChange={(e) => {
              setAngleDeg(parseFloat(e.target.value));
              handleReset();
            }}
            className="w-full accent-indigo-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Physics Analytical Summary Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-900 p-4 sm:p-5 rounded-2xl border border-neutral-800 text-xs">
        <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
          <div className="text-neutral-400 font-semibold mb-1">Thời gian rơi chạm đất (<Latex content={"$t$"} />):</div>
          <div className="text-sm font-mono font-bold text-emerald-400">
            <Latex content={`$t = \\sqrt{\\frac{2h}{g}} = ${totalFlightTime.toFixed(2)}\\text{ s}$`} />
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
            Không phụ thuộc vận tốc ném ngang <Latex content={"$v_0$"} />; vật ném ngang và vật thả rơi chạm đất cùng một thời điểm!
          </p>
        </div>

        <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
          <div className="text-neutral-400 font-semibold mb-1">Tầm xa bay cực đại (<Latex content={"$L$"} />):</div>
          <div className="text-sm font-mono font-bold text-cyan-400">
            <Latex content={`$L = v_0 \\sqrt{\\frac{2h}{g}} = ${maxRange.toFixed(1)}\\text{ m}$`} />
          </div>
          <div className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
            <Latex content={"Tỉ lệ thuận với vận tốc ban đầu $v_0$ và căn bậc hai của độ cao thả rơi $\\sqrt{h}$."} />
          </div>
        </div>

        <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
          <div className="text-neutral-400 font-semibold mb-1">Phương trình quỹ đạo Parabol:</div>
          <div className="text-sm font-mono font-bold text-amber-400">
            <Latex content={`$y = \\frac{g}{2v_0^2}x^2 = ${(g / (2 * v0 * v0)).toFixed(4)}x^2$`} />
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
            Quỹ đạo chuyển động ném ngang trong trọng trường luôn là một nhánh của đường Parabol.
          </p>
        </div>
      </div>
    </div>
  );
};
