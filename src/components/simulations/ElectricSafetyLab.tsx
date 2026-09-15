import React, { useState, useEffect, useRef } from 'react';
import {
  Power,
  Zap,
  AlertTriangle,
  RotateCcw,
  Gauge,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Activity,
  Flame,
} from 'lucide-react';
import { Latex } from '../Latex';

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export const ElectricSafetyLab: React.FC = () => {
  // Circuit Parameters
  const [currentType, setCurrentType] = useState<'DC' | 'AC'>('DC');
  const [voltage, setVoltage] = useState<number>(6); // 3, 6, 12, 24 V
  const [resistance, setResistance] = useState<number>(4); // 4, 6, 10, 20 ohms
  const [ammeterRange, setAmmeterRange] = useState<0.6 | 3>(3); // 0.6A or 3A
  const [wiringMode, setWiringMode] = useState<'series' | 'parallel'>('series');
  const [carrierView, setCarrierView] = useState<'conventional' | 'electron'>('conventional');
  const [isPowerOn, setIsPowerOn] = useState<boolean>(false);

  // Failure & Safety state
  const [isBlown, setIsBlown] = useState<boolean>(false);
  const [isShortCircuit, setIsShortCircuit] = useState<boolean>(false);
  const [breakerTripped, setBreakerTripped] = useState<boolean>(false);

  // Interactive mouse state for canvas
  const [isHoveringSwitch, setIsHoveringSwitch] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Animation dynamic variables
  const chargeOffsetRef = useRef<number>(0);
  const needleAngleRef = useRef<number>(0);
  const sparksRef = useRef<SparkParticle[]>([]);
  const smokesRef = useRef<SmokeParticle[]>([]);

  // Physics calculation
  const theoreticalCurrent = voltage / resistance; // Amperes
  const actualCurrent = wiringMode === 'parallel' ? 99.9 : theoreticalCurrent;
  const powerWatts = voltage * theoreticalCurrent; // Watts

  // Evaluate safety state when power turns on
  useEffect(() => {
    if (!isPowerOn) return;

    if (wiringMode === 'parallel') {
      setIsShortCircuit(true);
      setBreakerTripped(true);
      setIsPowerOn(false);
      // Spawn burst of sparks at short circuit point
      for (let i = 0; i < 40; i++) {
        sparksRef.current.push({
          x: 620,
          y: 210,
          vx: (Math.random() - 0.5) * 220,
          vy: (Math.random() - 0.7) * 220,
          life: 0,
          maxLife: 0.5 + Math.random() * 0.4,
          color: Math.random() > 0.3 ? '#f59e0b' : '#ef4444',
          size: 2 + Math.random() * 3,
        });
      }
      return;
    }

    if (theoreticalCurrent > ammeterRange) {
      setIsBlown(true);
      setBreakerTripped(true);
      setIsPowerOn(false);
      // Spawn sparks at Ammeter
      for (let i = 0; i < 35; i++) {
        sparksRef.current.push({
          x: 410,
          y: 90,
          vx: (Math.random() - 0.5) * 180,
          vy: (Math.random() - 0.7) * 180,
          life: 0,
          maxLife: 0.5 + Math.random() * 0.4,
          color: '#fbbf24',
          size: 2 + Math.random() * 2.5,
        });
      }
    }
  }, [isPowerOn, wiringMode, theoreticalCurrent, ammeterRange]);

  const handleReset = () => {
    setIsPowerOn(false);
    setIsBlown(false);
    setIsShortCircuit(false);
    setBreakerTripped(false);
    sparksRef.current = [];
    smokesRef.current = [];
  };

  const handleTogglePower = () => {
    if (breakerTripped || isBlown || isShortCircuit) {
      handleReset();
    } else {
      setIsPowerOn((prev) => !prev);
    }
  };

  // Continuous animation loop for moving electrical current, needle damping, and sparks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const renderLoop = (timestamp: number) => {
      if (!isMounted) return;
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      const width = canvas.width;
      const height = canvas.height;

      // Circuit geometry
      const leftX = 110;
      const rightX = width - 110;
      const topY = 90;
      const bottomY = height - 90;
      const centerY = (topY + bottomY) / 2;
      const centerX = width / 2;

      // Switch geometry: on top wire between leftX and ammeter
      const switchX = leftX + 110;
      const switchY = topY;

      // Ammeter center
      const ammeterX = centerX + 20;
      const ammeterY = topY;
      const meterR = 48;

      // Load center
      const loadX = rightX;
      const loadY = centerY;

      // Circuit active status
      const isLive = isPowerOn && !breakerTripped && !isBlown && !isShortCircuit;

      // 1. Update Charge Motion
      const baseSpeed = isLive ? theoreticalCurrent * 90 : 0; // px/s
      if (isLive) {
        if (currentType === 'DC') {
          const dir = carrierView === 'conventional' ? 1 : -1;
          chargeOffsetRef.current = (chargeOffsetRef.current + dir * baseSpeed * dt) % 10000;
        } else {
          // AC oscillation
          chargeOffsetRef.current = Math.sin(timestamp * 0.008) * 45;
        }
      }

      // 2. Update Needle Damping
      const startAngle = Math.PI * 0.75;
      const endAngle = Math.PI * 2.25;
      let targetFrac = 0;
      if (isLive) {
        targetFrac = Math.min(theoreticalCurrent / ammeterRange, 1.25);
      } else if (isBlown) {
        targetFrac = 1.35; // slammed past limit
      }
      const targetAngle = startAngle + targetFrac * (endAngle - startAngle);
      // Spring dampening
      needleAngleRef.current += (targetAngle - needleAngleRef.current) * Math.min(1, dt * 14);
      // Subtle tremor when current is live
      const currentTremor = isLive ? Math.sin(timestamp * 0.04) * 0.006 : 0;
      const finalNeedleAngle = needleAngleRef.current + currentTremor;

      // 3. Update Sparks & Smoke
      if (isBlown || isShortCircuit) {
        // Continuously emit occasional smoke puff
        if (Math.random() < 0.15) {
          const originX = isShortCircuit ? rightX : ammeterX;
          const originY = isShortCircuit ? centerY : topY;
          smokesRef.current.push({
            x: originX + (Math.random() - 0.5) * 16,
            y: originY + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 20,
            vy: -30 - Math.random() * 30,
            radius: 8,
            alpha: 0.65,
          });
        }
      }

      // Progress sparks
      sparksRef.current = sparksRef.current.filter((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 320 * dt; // gravity
        p.life += dt;
        return p.life < p.maxLife;
      });

      // Progress smoke
      smokesRef.current = smokesRef.current.filter((s) => {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.radius += 18 * dt;
        s.alpha -= 0.65 * dt;
        return s.alpha > 0;
      });

      // ================= DRAWING =================
      ctx.clearRect(0, 0, width, height);

      // Dark workbench canvas background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Subtle engineering grid
      ctx.strokeStyle = '#141c2e';
      ctx.lineWidth = 1;
      for (let x = 30; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 30; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Outer lab bench border
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 12, width - 24, height - 24);

      // --- Circuit Wires (Base layer) ---
      ctx.strokeStyle = isLive
        ? carrierView === 'conventional' ? '#0ea5e9' : '#38bdf8'
        : isShortCircuit
        ? '#ef4444'
        : '#334155';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw Main Circuit Loop
      ctx.beginPath();
      // From Power (+) up to top-left corner
      ctx.moveTo(leftX, centerY - 35);
      ctx.lineTo(leftX, topY);
      // Top wire to knife switch left terminal
      ctx.lineTo(switchX - 25, topY);

      // Gap for knife switch
      // From switch right terminal to Ammeter left
      ctx.moveTo(switchX + 25, topY);
      ctx.lineTo(ammeterX - meterR, topY);

      // From Ammeter right to top-right corner
      ctx.moveTo(ammeterX + meterR, topY);
      ctx.lineTo(rightX, topY);

      // Right wire down to Load (Resistor/Lamp)
      ctx.lineTo(rightX, loadY - 40);
      ctx.moveTo(rightX, loadY + 40);
      ctx.lineTo(rightX, bottomY);

      // Bottom return wire to Power (-)
      ctx.lineTo(leftX, bottomY);
      ctx.lineTo(leftX, centerY + 35);
      ctx.stroke();

      // Parallel fault wire if enabled
      if (wiringMode === 'parallel') {
        ctx.strokeStyle = isShortCircuit ? '#ef4444' : '#f59e0b';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(rightX - 50, topY);
        ctx.lineTo(rightX + 65, topY);
        ctx.lineTo(rightX + 65, bottomY);
        ctx.lineTo(rightX - 50, bottomY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ ĐOẢN MẠCH SONG SONG', rightX + 65, topY - 14);
      }

      // --- ANIMATED CURRENT FLOW (Charge Carriers Streaming) ---
      // Loop segments definition for coordinate mapping
      // Path: (leftX, centerY-35) -> (leftX, topY) -> (rightX, topY) -> (rightX, bottomY) -> (leftX, bottomY) -> (leftX, centerY+35)
      const perimeter =
        (centerY - 35 - topY) +
        (rightX - leftX) +
        (bottomY - topY) +
        (rightX - leftX) +
        (bottomY - (centerY + 35));

      const getPointOnCircuit = (dist: number): { x: number; y: number } => {
        let d = ((dist % perimeter) + perimeter) % perimeter;

        // Seg 1: Up left from power to top corner
        const seg1 = centerY - 35 - topY;
        if (d < seg1) {
          return { x: leftX, y: centerY - 35 - d };
        }
        d -= seg1;

        // Seg 2: Top wire from left to right
        const seg2 = rightX - leftX;
        if (d < seg2) {
          return { x: leftX + d, y: topY };
        }
        d -= seg2;

        // Seg 3: Down right from top to bottom
        const seg3 = bottomY - topY;
        if (d < seg3) {
          return { x: rightX, y: topY + d };
        }
        d -= seg3;

        // Seg 4: Bottom wire from right to left
        const seg4 = rightX - leftX;
        if (d < seg4) {
          return { x: rightX - d, y: bottomY };
        }
        d -= seg4;

        // Seg 5: Up left from bottom to power
        return { x: leftX, y: bottomY - d };
      };

      // Draw moving charges along wire
      const particleCount = 42;
      for (let i = 0; i < particleCount; i++) {
        const nominalDist = (i / particleCount) * perimeter;
        const currentDist = nominalDist + chargeOffsetRef.current;
        const pt = getPointOnCircuit(currentDist);

        // Don't draw particle inside switch gap if switch is open
        if (!isPowerOn && pt.y === topY && pt.x >= switchX - 25 && pt.x <= switchX + 25) {
          continue;
        }

        ctx.save();
        if (isLive) {
          // Glowing particle with halo
          const glowColor = carrierView === 'conventional' ? '#f59e0b' : '#38bdf8';
          ctx.fillStyle = glowColor;
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Core bright center
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Stationary dormant charge carrier (calm gray/blue)
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // --- 1. POWER SUPPLY UNIT (Left side) ---
      const psuW = 90;
      const psuH = 90;
      ctx.fillStyle = '#131b2e';
      ctx.fillRect(leftX - psuW / 2, centerY - psuH / 2, psuW, psuH);
      ctx.strokeStyle = isLive ? '#38bdf8' : '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(leftX - psuW / 2, centerY - psuH / 2, psuW, psuH);

      // PSU screen banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(leftX - psuW / 2 + 6, centerY - psuH / 2 + 6, psuW - 12, 34);
      ctx.fillStyle = isLive ? '#38bdf8' : '#64748b';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${voltage}.0V ${currentType}`, leftX, centerY - psuH / 2 + 22);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('NGUỒN ĐIỆN', leftX, centerY - psuH / 2 + 34);

      // Red (+) Terminal (Top terminal)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(leftX, centerY - 25, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('+', leftX, centerY - 22);

      // Blue (-) Terminal (Bottom terminal)
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(leftX, centerY + 25, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText('−', leftX, centerY + 28);

      // --- 2. INTERACTIVE KNIFE SWITCH (Khóa K) ---
      // Brass contacts
      ctx.fillStyle = '#eab308';
      ctx.fillRect(switchX - 25 - 4, switchY - 6, 8, 12);
      ctx.fillRect(switchX + 25 - 4, switchY - 6, 8, 12);

      // Pivot hinge on left contact
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.arc(switchX - 25, switchY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Lever Blade (smooth animation: closed horizontal when power on, raised 35 deg when off)
      const leverAngle = isPowerOn ? 0 : -0.65;
      const leverLen = 48;
      const leverEndX = switchX - 25 + Math.cos(leverAngle) * leverLen;
      const leverEndY = switchY + Math.sin(leverAngle) * leverLen;

      ctx.strokeStyle = isPowerOn ? '#facc15' : '#e2e8f0';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(switchX - 25, switchY);
      ctx.lineTo(leverEndX, leverEndY);
      ctx.stroke();

      // Insulated handle at tip of blade
      ctx.fillStyle = isHoveringSwitch ? '#f97316' : '#ef4444';
      ctx.beginPath();
      ctx.arc(leverEndX, leverEndY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Switch label
      ctx.fillStyle = isHoveringSwitch ? '#f97316' : '#94a3b8';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        isPowerOn ? 'Khóa K: ĐÓNG (Click để ngắt)' : 'Khóa K: MỞ (Click để đóng)',
        switchX,
        switchY - 26
      );

      // --- 3. AMMETER GAUGE (Top Center) ---
      // Meter Dial Housing
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(ammeterX, ammeterY, meterR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isBlown ? '#ef4444' : '#475569';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Dial scale ticks
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      for (let i = 0; i <= 6; i++) {
        const angle = startAngle + (i / 6) * (endAngle - startAngle);
        const x1 = ammeterX + Math.cos(angle) * (meterR - 9);
        const y1 = ammeterY + Math.sin(angle) * (meterR - 9);
        const x2 = ammeterX + Math.cos(angle) * (meterR - 2);
        const y2 = ammeterY + Math.sin(angle) * (meterR - 2);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Tick number labels
        const val = (i / 6) * ammeterRange;
        const tx = ammeterX + Math.cos(angle) * (meterR - 17);
        const ty = ammeterY + Math.sin(angle) * (meterR - 17);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(val.toFixed(1), tx, ty + 3);
      }

      // Needle
      ctx.save();
      ctx.strokeStyle = isBlown ? '#ef4444' : '#f87171';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ammeterX, ammeterY);
      ctx.lineTo(
        ammeterX + Math.cos(finalNeedleAngle) * (meterR - 12),
        ammeterY + Math.sin(finalNeedleAngle) * (meterR - 12)
      );
      ctx.stroke();

      // Needle center pivot cap
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(ammeterX, ammeterY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Meter Name & Scale Label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`A (${ammeterRange}A)`, ammeterX, ammeterY + 28);

      // --- 4. RESISTOR & GLOWING LAMP (Right side load) ---
      // Load enclosure box
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(loadX - 32, loadY - 45, 64, 90);
      ctx.strokeStyle = isLive ? '#10b981' : '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(loadX - 32, loadY - 45, 64, 90);

      // Light bulb socket
      ctx.fillStyle = '#64748b';
      ctx.fillRect(loadX - 10, loadY + 2, 20, 8);

      // Glass bulb dome
      if (isLive) {
        // Radiant pulsating aura
        const glowRadius = Math.min(12 + powerWatts * 1.5, 38);
        const bulbGlow = ctx.createRadialGradient(loadX, loadY - 14, 2, loadX, loadY - 14, glowRadius);
        bulbGlow.addColorStop(0, '#fef08a');
        bulbGlow.addColorStop(0.4, 'rgba(251, 191, 36, 0.7)');
        bulbGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = bulbGlow;
        ctx.beginPath();
        ctx.arc(loadX, loadY - 14, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Bright bulb core
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.arc(loadX, loadY - 14, 12, 0, Math.PI * 2);
        ctx.fill();

        // Hot filament
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(loadX, loadY - 14, 5, Math.PI * 0.2, Math.PI * 0.8, false);
        ctx.stroke();
      } else {
        // Cold unlit bulb
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(loadX, loadY - 14, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Resistor specs label
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`R = ${resistance}Ω`, loadX, loadY + 28);

      // --- 5. RENDER SPARKS & SMOKE ---
      sparksRef.current.forEach((sp) => {
        ctx.save();
        ctx.fillStyle = sp.color;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      smokesRef.current.forEach((sm) => {
        ctx.save();
        ctx.fillStyle = `rgba(148, 163, 184, ${sm.alpha})`;
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // --- 6. OVERLAY NOTIFICATIONS ON CANVAS ---
      if (breakerTripped || isBlown || isShortCircuit) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          isShortCircuit
            ? '💥 ĐOẢN MẠCH CỰC ĐẠI - CẦU DAO TỰ ĐỘNG CÚP!'
            : '⚠️ QUÁ TẢI AMPE KẾ (I > I_max) - CHÁY CUỘN DÂY!',
          centerX,
          bottomY + 45
        );
      } else if (isLive) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          `DÒNG ĐIỆN THỜI GIAN THỰC: I = ${theoreticalCurrent.toFixed(2)} A | P = ${powerWatts.toFixed(1)} W`,
          centerX,
          bottomY + 45
        );
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    voltage,
    resistance,
    ammeterRange,
    currentType,
    wiringMode,
    isPowerOn,
    isBlown,
    isShortCircuit,
    breakerTripped,
    carrierView,
    theoreticalCurrent,
    powerWatts,
    isHoveringSwitch,
  ]);

  // Handle canvas mouse move & click
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Switch zone: x near 220, y near 90
    const switchX = 110 + 110;
    const switchY = 90;
    const dist = Math.sqrt((x - switchX) ** 2 + (y - switchY) ** 2);
    setIsHoveringSwitch(dist < 36);
  };

  const handleCanvasClick = () => {
    if (isHoveringSwitch) {
      handleTogglePower();
    }
  };

  return (
    <div className="space-y-6" id="electric-safety-lab">
      {/* 1. Experiment Header Banner */}
      <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700/60 font-mono">
                THỰC HÀNH AN TOÀN ĐIỆN
              </span>
              <span className="text-xs text-neutral-400">Khảo sát trực quan dòng điện và ampe kế</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-100 mt-1">
              Mô phỏng Dòng điện Chuyển động &amp; Bảo vệ Thang đo Ampe kế
            </h3>
          </div>

          {/* Circuit Status Badge */}
          {breakerTripped || isBlown || isShortCircuit ? (
            <div className="px-3.5 py-1.5 rounded-xl bg-rose-950/70 border border-rose-600/60 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Sự cố mạch: Cầu dao tự động nhảy!
            </div>
          ) : isPowerOn ? (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Dòng điện đang lưu thông an toàn (I ≤ I_max)
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700/60 text-neutral-400 text-xs font-semibold flex items-center gap-2">
              <Power className="w-3.5 h-3.5" />
              Khóa K đang mở (Mạch hở, an toàn)
            </div>
          )}
        </div>

        <div className="text-xs sm:text-sm text-neutral-400 mt-2.5 leading-relaxed">
          <strong className="text-neutral-200">Mục đích bài thực hành:</strong> Quan sát dòng điện chuyển động thực tế trong dây dẫn, tính toán cường độ{' '}
          <Latex content="$I = \frac{U}{R}$" />, thực hành chọn thang đo{' '}
          <Latex content="$I_{\max}$" /> chuẩn xác và trải nghiệm hiện tượng quá dòng, chập mạch khi sai quy tắc.
        </div>
      </div>

      {/* 2. Expansive Interactive Canvas & Master Deck */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left/Top: Large Interactive Circuit Workbench Canvas */}
        <div className="xl:col-span-8 bg-[#090d16] rounded-2xl border border-neutral-800 p-3 sm:p-4 flex flex-col justify-between overflow-hidden shadow-inner space-y-4">
          <div className="flex items-center justify-between px-2 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sơ đồ phòng thí nghiệm điện ảo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-500">Hiển thị:</span>
              <button
                onClick={() => setCarrierView(carrierView === 'conventional' ? 'electron' : 'conventional')}
                className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-mono border border-neutral-700/50 transition-colors cursor-pointer"
                title="Đổi giữa chiều dòng điện quy ước và dòng electron tự do"
              >
                {carrierView === 'conventional' ? 'Chiều quy ước (+)➔(-)' : 'Dòng electron (-)➔(+)'}
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={820}
            height={420}
            onMouseMove={handleCanvasMouseMove}
            onClick={handleCanvasClick}
            className={`w-full h-auto block rounded-xl border border-neutral-800/80 bg-[#090d16] ${
              isHoveringSwitch ? 'cursor-pointer' : 'cursor-default'
            }`}
          />

          {/* Master Circuit Command Bar */}
          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePower}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer shadow-sm ${
                  isPowerOn
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : breakerTripped || isBlown || isShortCircuit
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Power className="w-4 h-4" />
                {isPowerOn ? 'NGẮT NGUỒN (MỞ KHÓA K)' : breakerTripped ? 'BẬT LẠI CẦU DAO' : 'ĐÓNG KHÓA K (CẤP ĐIỆN)'}
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition-colors cursor-pointer"
                title="Khôi phục trạng thái chuẩn ban đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Live Readout Metrics */}
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-neutral-400">Dòng thực $I$:</span>
                <span
                  className={`font-bold text-sm ${
                    theoreticalCurrent > ammeterRange ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {isPowerOn ? theoreticalCurrent.toFixed(2) : '0.00'} A
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Giới hạn <Latex content="$I_{\\max}$:" /></span>
                <span className="text-neutral-200 font-bold">{ammeterRange} A</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Công suất $P$:</span>
                <span className="text-amber-400 font-bold">
                  {isPowerOn ? powerWatts.toFixed(1) : '0.0'} W
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Step-by-Step Configuration Deck */}
        <div className="xl:col-span-4 space-y-3.5 text-xs">
          {/* Step 1: Power Supply Setting */}
          <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2.5">
            <div className="font-semibold text-neutral-200 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center text-[10px] font-mono border border-neutral-700/60">
                1
              </span>
              Nguồn điện &amp; Hiệu điện thế ($U$):
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setCurrentType('DC');
                  handleReset();
                }}
                className={`py-1.5 rounded-lg font-medium border transition-colors cursor-pointer ${
                  currentType === 'DC'
                    ? 'bg-neutral-800 text-neutral-100 border-neutral-600'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                DC (Một chiều ⎓)
              </button>
              <button
                onClick={() => {
                  setCurrentType('AC');
                  handleReset();
                }}
                className={`py-1.5 rounded-lg font-medium border transition-colors cursor-pointer ${
                  currentType === 'AC'
                    ? 'bg-neutral-800 text-neutral-100 border-neutral-600'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                AC (Xoay chiều ∿)
              </button>
            </div>

            <div className="pt-1">
              <label className="text-[11px] text-neutral-400 block mb-1">
                Điện áp đầu ra ($U$):
              </label>
              <select
                value={voltage}
                onChange={(e) => {
                  setVoltage(Number(e.target.value));
                  handleReset();
                }}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-neutral-500 cursor-pointer"
              >
                <option value={3}>3 V (Hạ áp an toàn)</option>
                <option value={6}>6 V (Chuẩn thí nghiệm SGK)</option>
                <option value={12}>12 V (Ắc quy thí nghiệm)</option>
                <option value={24}>24 V (Điện áp cao tải mạnh)</option>
              </select>
            </div>
          </div>

          {/* Step 2: Resistor value */}
          <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2.5">
            <div className="font-semibold text-neutral-200 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center text-[10px] font-mono border border-neutral-700/60">
                2
              </span>
              Điện trở tải ($R$):
            </div>
            <div className="grid grid-cols-4 gap-1.5 font-mono">
              {[4, 6, 10, 20].map((rVal) => (
                <button
                  key={rVal}
                  onClick={() => {
                    setResistance(rVal);
                    handleReset();
                  }}
                  className={`py-1.5 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                    resistance === rVal
                      ? 'bg-neutral-800 text-neutral-100 border-neutral-600'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {rVal}Ω
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Ammeter Scale Selector */}
          <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2.5">
            <div className="font-semibold text-neutral-200 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center text-[10px] font-mono border border-neutral-700/60">
                3
              </span>
              <Latex content="Chọn thang đo Ampe kế ($I_{\\max}$):" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setAmmeterRange(0.6);
                  handleReset();
                }}
                className={`p-2.5 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                  ammeterRange === 0.6
                    ? 'bg-neutral-800 text-amber-300 border-amber-600/70'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="font-bold">Thang 0.6 A</div>
                <div className="text-[10px] opacity-75">Dòng nhỏ (&lt; 0.6A)</div>
              </button>
              <button
                onClick={() => {
                  setAmmeterRange(3);
                  handleReset();
                }}
                className={`p-2.5 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                  ammeterRange === 3
                    ? 'bg-neutral-800 text-neutral-100 border-neutral-600'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="font-bold">Thang 3 A</div>
                <div className="text-[10px] opacity-75">Dòng lớn (&le; 3A)</div>
              </button>
            </div>
          </div>

          {/* Step 4: Wiring Mode */}
          <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2.5">
            <div className="font-semibold text-neutral-200 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center text-[10px] font-mono border border-neutral-700/60">
                4
              </span>
              Cách mắc Ampe kế vào mạch:
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-2 bg-neutral-800/60 rounded-lg cursor-pointer border border-neutral-700/60 hover:bg-neutral-800 transition-colors">
                <input
                  type="radio"
                  name="wiringMode"
                  checked={wiringMode === 'series'}
                  onChange={() => {
                    setWiringMode('series');
                    handleReset();
                  }}
                  className="text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-neutral-200 font-medium">Mắc nối tiếp (ĐÚNG quy tắc)</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 bg-neutral-800/60 rounded-lg cursor-pointer border border-neutral-700/60 hover:bg-neutral-800 transition-colors">
                <input
                  type="radio"
                  name="wiringMode"
                  checked={wiringMode === 'parallel'}
                  onChange={() => {
                    setWiringMode('parallel');
                    handleReset();
                  }}
                  className="text-rose-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-rose-300 font-medium">Mắc song song (SAI - Đoản mạch!)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Physics Nature & Mathematical Deduction */}
      <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3">
        <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono flex items-center gap-2">
          <Info className="w-4 h-4 text-neutral-400" />
          Bản chất Vật lí &amp; Khai triển Định luật Ohm
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-1.5">
            <div className="font-semibold text-neutral-200">Định luật Ohm cho đoạn mạch:</div>
            <p className="text-neutral-400">
              Cường độ dòng điện $I$ tỉ lệ thuận với hiệu điện thế $U$ và tỉ lệ nghịch với điện trở $R$:
            </p>
            <div className="font-mono text-neutral-200 pt-1">
              <Latex
                content={`$I = \\frac{U}{R} = \\frac{${voltage}}{${resistance}} = ${theoreticalCurrent.toFixed(2)}\\text{ A}$`}
              />
            </div>
          </div>

          <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-1.5">
            <div className="font-semibold text-neutral-200">Quy tắc chọn thang đo an toàn:</div>
            <div className="text-neutral-400">
              <Latex content="Phải chọn thang $I_{\\max} > I$. Bắt đầu từ thang lớn nhất rồi hạ dần để bảo vệ cuộn dây đồng:" />
            </div>
            <div className="font-mono text-emerald-400 pt-1">
              <Latex
                content={`$I_{\\max} = ${ammeterRange}\\text{ A} \\ge I = ${theoreticalCurrent.toFixed(2)}\\text{ A}$`}
              />
            </div>
          </div>

          <div className="p-3.5 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-1.5">
            <div className="font-semibold text-neutral-200">Vì sao cấm mắc song song?</div>
            <div className="text-neutral-400">
              <Latex content="Điện trở của Ampe kế rất nhỏ ($R_A \\approx 0$). Mắc song song tạo ra nhánh ngắn mạch đoản dòng:" />
            </div>
            <div className="font-mono text-rose-400 pt-1">
              <Latex content={"$I = \\frac{U}{R_A} \\to \\infty \\text{ (Cháy nổ!)}$"} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Expected Results Comparison */}
      <div className="p-4 sm:p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3">
        <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neutral-400" />
          So sánh Kết quả Thực nghiệm: Đúng quy tắc vs Sai thao tác
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Thao tác đúng chuẩn an toàn:</span>
            </div>
            <div className="text-neutral-300">
              <Latex content={"Mắc nối tiếp, chọn thang đo $3\\text{ A}$ khi $I = 1.5\\text{ A}$ ($U = 6\\text{ V}, R = 4\\,\\Omega$). Kim dịch chuyển êm dịu, dòng electron lưu thông ổn định, đèn tải phát sáng tỏa nhiệt bình thường."} />
            </div>
          </div>

          <div className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700/60 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>Sự cố do sai thao tác:</span>
            </div>
            <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
              <li>
                <Latex content={"**Chọn thang $0.6\\text{ A}$ khi dòng $1.5\\text{ A}$**: Kim kịch kim, quá dòng bốc khói cuộn dây."} />
              </li>
              <li>
                <strong>Mắc Ampe kế song song</strong>: Tạo dòng đoản mạch cực lớn phóng tia lửa điện, sụt áp nguồn và nhảy cầu dao khẩn cấp.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
