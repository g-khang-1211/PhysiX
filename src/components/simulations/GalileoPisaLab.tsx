import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Wind,
  CheckCircle2,
  XCircle,
  Clock,
  Gauge,
  Info,
  Scale,
  Sparkles,
} from 'lucide-react';
import { Latex } from '../Latex';

interface FallingBody {
  name: string;
  mass: number; // kg
  color: string;
  radius: number; // px for canvas
  dragCoeff: number; // relative drag factor
  type: 'sphere_heavy' | 'sphere_light' | 'paper' | 'feather';
}

export const GalileoPisaLab: React.FC = () => {
  // Parameters
  const [height, setHeight] = useState<number>(54); // Height of Tower of Pisa ~54-56m
  const [airResistance, setAirResistance] = useState<boolean>(false); // default vacuum for true nature
  
  // Object 1 and Object 2 choices
  const [obj1Type, setObj1Type] = useState<string>('sphere_10kg');
  const [obj2Type, setObj2Type] = useState<string>('sphere_1kg');

  // Simulation running state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);
  const [y1, setY1] = useState<number>(0); // vertical position from top (meters)
  const [y2, setY2] = useState<number>(0);
  const [v1, setV1] = useState<number>(0); // velocity (m/s)
  const [v2, setV2] = useState<number>(0);
  const [landed1, setLanded1] = useState<boolean>(false);
  const [landed2, setLanded2] = useState<boolean>(false);
  const [landTime1, setLandTime1] = useState<number | null>(null);
  const [landTime2, setLandTime2] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  const g = 9.80; // m/s^2

  // Object metadata
  const objectCatalog: Record<string, FallingBody> = {
    sphere_10kg: {
      name: 'Quả cầu gang m₁ = 10 kg',
      mass: 10,
      color: '#38bdf8', // light blue
      radius: 14,
      dragCoeff: 0.15,
      type: 'sphere_heavy',
    },
    sphere_1kg: {
      name: 'Quả cầu gang m₂ = 1 kg',
      mass: 1,
      color: '#fbbf24', // amber
      radius: 10,
      dragCoeff: 0.2,
      type: 'sphere_light',
    },
    paper_flat: {
      name: 'Tờ giấy phẳng m = 0.005 kg',
      mass: 0.005,
      color: '#f1f5f9', // white
      radius: 12,
      dragCoeff: 4.8, // huge drag
      type: 'paper',
    },
    feather: {
      name: 'Chiếc lông vũ m = 0.002 kg',
      mass: 0.002,
      color: '#e879f9', // purple/pink
      radius: 10,
      dragCoeff: 5.5,
      type: 'feather',
    },
  };

  const obj1 = objectCatalog[obj1Type] || objectCatalog.sphere_10kg;
  const obj2 = objectCatalog[obj2Type] || objectCatalog.sphere_1kg;

  // Theoretical vacuum time: t = sqrt(2h / g)
  const theoreticalVacuumTime = Math.sqrt((2 * height) / g);

  // Toggle run / pause
  const handleToggleRun = () => {
    if (landed1 && landed2) {
      handleReset();
      setTimeout(() => setIsRunning(true), 50);
      return;
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSimTime(0);
    setY1(0);
    setY2(0);
    setV1(0);
    setV2(0);
    setLanded1(false);
    setLanded2(false);
    setLandTime1(null);
    setLandTime2(null);
    lastTimestampRef.current = null;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  };

  // Physical Numerical Integration Loop (Runge-Kutta / Euler)
  useEffect(() => {
    if (!isRunning) {
      lastTimestampRef.current = null;
      return;
    }

    const updatePhysics = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const rawDt = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;
      const dt = Math.min(rawDt, 0.05);

      setSimTime((prevTime) => {
        const nextTime = prevTime + dt;

        // --- Object 1 Physics ---
        if (!landed1) {
          let a1 = g;
          if (airResistance) {
            const dragForce1 = 0.5 * 1.2 * obj1.dragCoeff * (v1 * v1);
            const aDrag1 = dragForce1 / obj1.mass;
            a1 = Math.max(0, g - aDrag1);
          }
          const nextV1 = v1 + a1 * dt;
          const nextY1 = y1 + nextV1 * dt;

          if (nextY1 >= height) {
            setY1(height);
            setV1(0);
            setLanded1(true);
            setLandTime1(nextTime);
          } else {
            setY1(nextY1);
            setV1(nextV1);
          }
        }

        // --- Object 2 Physics ---
        if (!landed2) {
          let a2 = g;
          if (airResistance) {
            const dragForce2 = 0.5 * 1.2 * obj2.dragCoeff * (v2 * v2);
            const aDrag2 = dragForce2 / obj2.mass;
            a2 = Math.max(0, g - aDrag2);
          }
          const nextV2 = v2 + a2 * dt;
          const nextY2 = y2 + nextV2 * dt;

          if (nextY2 >= height) {
            setY2(height);
            setV2(0);
            setLanded2(true);
            setLandTime2(nextTime);
          } else {
            setY2(nextY2);
            setV2(nextV2);
          }
        }

        if (landed1 && landed2) {
          setIsRunning(false);
          return nextTime;
        }

        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, landed1, landed2, v1, v2, y1, y2, height, airResistance, obj1, obj2]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const heightPx = canvas.height;

    // Clear background
    ctx.clearRect(0, 0, width, heightPx);

    // Sky gradient
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, heightPx);

    // Environment indicators: Vacuum vs Air
    if (airResistance) {
      // Draw subtle airflow stream lines moving upwards relative to falling objects
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      const offset = (Date.now() * 0.05) % 40;
      for (let i = 0; i < 7; i++) {
        const yy = (50 + i * 45 - offset + heightPx) % (heightPx - 40);
        ctx.beginPath();
        ctx.moveTo(40, yy);
        ctx.bezierCurveTo(width * 0.3, yy - 6, width * 0.7, yy + 6, width - 40, yy);
        ctx.stroke();
      }
    } else {
      // Vacuum chamber border glow
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(10, 10, width - 20, heightPx - 20);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.02)';
      ctx.fillRect(10, 10, width - 20, heightPx - 20);

      // Vacuum label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('⚡ MÔI TRƯỜNG CHÂN KHÔNG (LỰC CẢN = 0)', width - 260, 28);
    }

    // Ground platform
    const groundY = heightPx - 44;
    ctx.fillStyle = '#27272a';
    ctx.fillRect(0, groundY, width, 44);

    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Draw stylized Leaning Tower of Pisa on left
    const towerTopY = 70;
    const towerBottomY = groundY;
    const towerHeight = towerBottomY - towerTopY;

    ctx.save();
    // Leaning angle ~3.9 degrees
    ctx.translate(140, towerBottomY);
    ctx.rotate((3.9 * Math.PI) / 180);

    // Base & Column storeys
    const storeys = 6;
    const storeyHeight = towerHeight / storeys;
    const towerWidth = 58;

    // Draw tower main body
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 1.5;

    for (let s = 0; s < storeys; s++) {
      const sy = -towerHeight + s * storeyHeight;
      ctx.fillStyle = s % 2 === 0 ? '#d4d4d8' : '#a1a1aa';
      ctx.fillRect(-towerWidth / 2, sy, towerWidth, storeyHeight);
      ctx.strokeRect(-towerWidth / 2, sy, towerWidth, storeyHeight);

      // Storey arches
      ctx.fillStyle = '#27272a';
      for (let a = -1; a <= 1; a++) {
        ctx.beginPath();
        ctx.arc(a * 15, sy + storeyHeight * 0.6, 5, Math.PI, 0);
        ctx.fill();
      }
    }

    // Tower top balcony
    ctx.fillStyle = '#71717a';
    ctx.fillRect(-towerWidth / 2 - 8, -towerHeight - 12, towerWidth + 16, 12);
    ctx.strokeRect(-towerWidth / 2 - 8, -towerHeight - 12, towerWidth + 16, 12);

    // Galilei figure silhouette standing on balcony
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(towerWidth / 2 + 3, -towerHeight - 18, 4, 0, Math.PI * 2); // head
    ctx.fill();
    ctx.fillRect(towerWidth / 2, -towerHeight - 14, 6, 14); // body
    ctx.restore();

    // Drop trajectories & scales
    const startY = towerTopY;
    const availablePixelHeight = groundY - startY;

    // Drop line X coordinates
    const dropX1 = 340;
    const dropX2 = 480;

    // Drop guide vertical dashed lines
    ctx.strokeStyle = 'rgba(82, 82, 91, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(dropX1, startY);
    ctx.lineTo(dropX1, groundY);
    ctx.moveTo(dropX2, startY);
    ctx.lineTo(dropX2, groundY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Height scale labels
    ctx.fillStyle = '#71717a';
    ctx.font = '10px monospace';
    ctx.fillText(`${height}m (Đỉnh)`, dropX1 - 55, startY + 4);
    ctx.fillText('0m (Mặt đất)', dropX1 - 55, groundY - 6);
    ctx.fillText(`${(height / 2).toFixed(0)}m`, dropX1 - 45, startY + availablePixelHeight / 2);

    // Positions of objects in pixels
    const obj1YPx = startY + (y1 / height) * availablePixelHeight;
    const obj2YPx = startY + (y2 / height) * availablePixelHeight;

    // Draw Object 1
    ctx.save();
    ctx.shadowColor = obj1.color;
    ctx.shadowBlur = landed1 ? 14 : 6;
    ctx.fillStyle = obj1.color;
    ctx.beginPath();
    if (obj1.type === 'paper') {
      ctx.fillRect(dropX1 - 12, obj1YPx - 3, 24, 6);
    } else {
      ctx.arc(dropX1, obj1YPx, obj1.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Draw Object 2
    ctx.save();
    ctx.shadowColor = obj2.color;
    ctx.shadowBlur = landed2 ? 14 : 6;
    ctx.fillStyle = obj2.color;
    ctx.beginPath();
    if (obj2.type === 'paper') {
      ctx.fillRect(dropX2 - 12, obj2YPx - 3, 24, 6);
    } else if (obj2.type === 'feather') {
      ctx.ellipse(dropX2, obj2YPx, 5, 14, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.arc(dropX2, obj2YPx, obj2.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Impact ripple when landing
    if (landed1) {
      ctx.strokeStyle = obj1.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(dropX1, groundY, 20, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (landed2) {
      ctx.strokeStyle = obj2.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(dropX2, groundY, 20, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Top tags identifying objects
    ctx.fillStyle = obj1.color;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Vật 1: ${obj1.mass} kg`, dropX1, startY - 14);

    ctx.fillStyle = obj2.color;
    ctx.fillText(`Vật 2: ${obj2.mass} kg`, dropX2, startY - 14);
    ctx.textAlign = 'left';
  }, [height, y1, y2, v1, v2, landed1, landed2, airResistance, obj1, obj2]);

  return (
    <div className="space-y-6" id="galileo-pisa-lab">
      {/* 1. Header & Experiment Name */}
      <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                THÍ NGHIỆM LỊCH SỬ KINH ĐIỂN
              </span>
              <span className="text-xs text-neutral-400 font-medium">Phương pháp thực nghiệm của Galilei</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-100 mt-1">
              Mô phỏng Tháp nghiêng Pisa – Kiểm chứng sự rơi tự do
            </h3>
          </div>

          {!airResistance ? (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Chân không lý tưởng
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-amber-400" />
              Có lực cản không khí
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Simulation Stage & Controls */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Large Visual Canvas */}
        <div className="xl:col-span-8 rounded-2xl overflow-hidden border border-neutral-800 bg-[#090d16] p-3 sm:p-4 shadow-inner">
          <canvas
            ref={canvasRef}
            width={740}
            height={380}
            className="w-full h-auto block rounded-xl"
          />

          {/* Control Bar under canvas */}
          <div className="mt-3 p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleRun}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-lg cursor-pointer ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Tạm dừng
                  </>
                ) : landed1 && landed2 ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" /> Thả lại
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Thả rơi đồng thời
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition-colors cursor-pointer"
                title="Đặt lại trạng thái ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Timers */}
            <div className="flex items-center gap-4 font-mono">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-neutral-400">Thời gian <Latex content={"$t$:"} /></span>
                <span className="text-amber-400 font-bold text-sm">
                  {simTime.toFixed(3)} s
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Độ cao <Latex content={"$h$:"} /></span>
                <span className="text-neutral-200 font-bold">{height} m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry & Controls Panel */}
        <div className="xl:col-span-4 space-y-4">
          {/* Object 1 Data Card */}
          <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-sky-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                {obj1.name}
              </span>
              {landed1 && (
                <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 text-[10px] border border-sky-800 font-mono">
                  Đã chạm đất
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-neutral-800/60 rounded-xl">
                <div className="text-[10px] text-neutral-400">Quãng đường:</div>
                <div className="text-sky-300 font-bold mt-0.5">{y1.toFixed(2)} m</div>
              </div>
              <div className="p-2.5 bg-neutral-800/60 rounded-xl">
                <div className="text-[10px] text-neutral-400">Vận tốc rơi:</div>
                <div className="text-sky-300 font-bold mt-0.5">{v1.toFixed(2)} m/s</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800">
              <span className="text-neutral-400">Chạm đất <Latex content={"$t_1$:"} /></span>
              <span className="font-mono text-sky-400 font-bold">
                {landTime1 !== null ? `${landTime1.toFixed(3)} s` : '--'}
              </span>
            </div>
          </div>

          {/* Object 2 Data Card */}
          <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                {obj2.name}
              </span>
              {landed2 && (
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] border border-amber-800 font-mono">
                  Đã chạm đất
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-neutral-800/60 rounded-xl">
                <div className="text-[10px] text-neutral-400">Quãng đường:</div>
                <div className="text-amber-300 font-bold mt-0.5">{y2.toFixed(2)} m</div>
              </div>
              <div className="p-2.5 bg-neutral-800/60 rounded-xl">
                <div className="text-[10px] text-neutral-400">Vận tốc rơi:</div>
                <div className="text-amber-300 font-bold mt-0.5">{v2.toFixed(2)} m/s</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800">
              <span className="text-neutral-400">Chạm đất <Latex content={"$t_2$:"} /></span>
              <span className="font-mono text-amber-400 font-bold">
                {landTime2 !== null ? `${landTime2.toFixed(3)} s` : '--'}
              </span>
            </div>
          </div>

          {/* Interactive Parameters Setup */}
          <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3 text-xs">
            <div className="font-bold text-neutral-200 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              Thiết lập vật thể & Môi trường:
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1 font-medium">Vật thả rơi 1:</label>
              <select
                value={obj1Type}
                onChange={(e) => {
                  setObj1Type(e.target.value);
                  handleReset();
                }}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-neutral-200 text-xs focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="sphere_10kg">Quả cầu gang nặng (m₁ = 10 kg)</option>
                <option value="sphere_1kg">Quả cầu gang vừa (m₁ = 1 kg)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1 font-medium">Vật thả rơi 2:</label>
              <select
                value={obj2Type}
                onChange={(e) => {
                  setObj2Type(e.target.value);
                  handleReset();
                }}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-neutral-200 text-xs focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="sphere_1kg">Quả cầu gang nhẹ (m₂ = 1 kg)</option>
                <option value="paper_flat">Tờ giấy phẳng (m₂ = 0.005 kg)</option>
                <option value="feather">Chiếc lông vũ (m₂ = 0.002 kg)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-neutral-800 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  Lực cản không khí:
                </span>
                <input
                  type="checkbox"
                  checked={airResistance}
                  onChange={(e) => {
                    setAirResistance(e.target.checked);
                    handleReset();
                  }}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                />
              </label>

              {airResistance ? (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-300">
                  Đang bật mô phỏng bầu khí quyển Trái Đất.
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300">
                  Đã rút hết không khí (Chân không lý tưởng <Latex content={"$F_c = 0$"} />).
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-800 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-neutral-400">Độ cao thả rơi <Latex content={"$h$:"} /></span>
                <span className="font-mono text-neutral-200 font-bold">{height} m</span>
              </div>
              <input
                type="range"
                min={20}
                max={60}
                step={2}
                value={height}
                onChange={(e) => {
                  setHeight(Number(e.target.value));
                  handleReset();
                }}
                className="w-full accent-indigo-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Physics Nature & Mathematical Deduction */}
      <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3">
        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-400" />
          HIỆN TƯỢNG VẬT LÍ & KHAI TRIỂN LOGIC THỰC NGHIỆM:
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-1">
            <div className="font-semibold text-neutral-200">Gia tốc rơi tự do (<Latex content={"$g$"} />):</div>
            <p className="text-neutral-400 leading-relaxed">
              Mọi vật ở cùng một vĩ độ trên Trái Đất đều rơi tự do với cùng một gia tốc trọng trường:
            </p>
            <div className="font-mono text-emerald-400 pt-1">
              <Latex content={"$a_1 = a_2 = g \\approx 9{,}80\\text{ m/s}^2$"} />
            </div>
          </div>

          <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-1">
            <div className="font-semibold text-neutral-200">Công thức thời gian rơi (<Latex content={"$t$"} />):</div>
            <p className="text-neutral-400 leading-relaxed">
              Thời gian rơi từ độ cao <Latex content={"$h$"} /> không phụ thuộc khối lượng <Latex content={"$m$"} />:
            </p>
            <div className="font-mono text-cyan-400 pt-1">
              <Latex content={`$t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2 \\times ${height}}{9{,}8}} = ${theoreticalVacuumTime.toFixed(3)}\\text{ s}$`} />
            </div>
          </div>

          <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-1">
            <div className="font-semibold text-neutral-200">Vận tốc khi chạm đất (<Latex content={"$v$"} />):</div>
            <p className="text-neutral-400 leading-relaxed">
              Được xác định hoàn toàn bởi gia tốc <Latex content={"$g$"} /> và độ cao <Latex content={"$h$"} />:
            </p>
            <div className="font-mono text-amber-400 pt-1">
              <Latex content={`$v = \\sqrt{2gh} = \\sqrt{2 \\times 9{,}8 \\times ${height}} = ${(Math.sqrt(2 * g * height)).toFixed(2)}\\text{ m/s}$`} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Expected Results Comparison */}
      <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3">
        <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          KẾT QUẢ MONG ĐỢI: ĐỐI CHIẾU THỰC NGHIỆM
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 bg-emerald-950/25 rounded-xl border border-emerald-800/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Kết quả Tích cực (Bật chân không / Đúng bản chất Galilei):</span>
            </div>
            <div className="text-neutral-300">
              <Latex content={"Hai quả cầu (dù khối lượng lệch nhau 10 lần: $10\\text{ kg}$ vs $1\\text{ kg}$) rơi cùng vận tốc và **chạm đất chính xác cùng một lúc** ($t_1 = t_2$)."} />
            </div>
            <div className="p-2.5 bg-emerald-900/30 rounded-lg font-mono text-[11px] text-emerald-300 border border-emerald-800/40">
              Khẳng định phương pháp thực nghiệm của Galilei, bác bỏ quan niệm cảm tính của Aristotle!
            </div>
          </div>

          <div className="p-4 bg-rose-950/25 rounded-xl border border-rose-800/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Kết quả Tiêu cực (Bật lực cản không khí mạnh / Thả tờ giấy):</span>
            </div>
            <div className="text-neutral-300">
              <Latex content={"Lực cản không khí $F_c$ làm vật nhẹ (hoặc vật có diện tích lớn như tờ giấy) rơi chậm hơn nhiều so với quả cầu gang ($t_{\\text{giấy}} > t_{\\text{gang}}$)."} />
            </div>
            <div className="p-2.5 bg-rose-900/30 rounded-lg font-mono text-[11px] text-rose-300 border border-rose-800/40">
              Minh họa yếu tố nhiễu môi trường: Nếu không cô lập điều kiện thí nghiệm, người quan sát dễ rút ra kết luận sai lệch như Aristotle thời cổ đại.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
