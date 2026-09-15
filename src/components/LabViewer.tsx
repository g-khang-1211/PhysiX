import React from 'react';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Lesson } from '../types';
import { MotionLab } from './simulations/MotionLab';
import { FreeFallLab } from './simulations/FreeFallLab';
import { ProjectileLab } from './simulations/ProjectileLab';
import { PhotogateTimerLab } from './simulations/PhotogateTimerLab';
import { ErrorCalculatorLab } from './simulations/ErrorCalculatorLab';
import { SafetyRulesLab } from './simulations/SafetyRulesLab';
import { VectorBoatLab } from './simulations/VectorBoatLab';
import { GalileoPisaLab } from './simulations/GalileoPisaLab';
import { ElectricSafetyLab } from './simulations/ElectricSafetyLab';
import { PhotogateErrorLab } from './simulations/PhotogateErrorLab';

interface LabViewerProps {
  lesson: Lesson;
  onNavigateToQuiz: () => void;
  onNavigateToTheory: () => void;
}

export const LabViewer: React.FC<LabViewerProps> = ({
  lesson,
  onNavigateToQuiz,
  onNavigateToTheory,
}) => {
  const labTitle =
    lesson?.virtualLab?.title ??
    lesson?.labTitle ??
    (lesson?.title ? `Thí nghiệm: ${lesson.title}` : 'Thí nghiệm mô phỏng');
  const labDescription =
    lesson?.virtualLab?.description ??
    lesson?.labDescription ??
    'Tương tác trực tiếp với các thông số vật lí thời gian thực, quan sát chuyển động và kiểm chứng các quy luật định lượng từ SGK.';
  const labType = lesson?.virtualLab?.labType ?? lesson?.labType ?? 'motion';

  const renderSimulation = () => {
    switch (labType) {
      case 'galileo_pisa':
        return <GalileoPisaLab />;
      case 'electric_safety':
        return <ElectricSafetyLab />;
      case 'photogate_error':
        return <PhotogateErrorLab />;
      case 'motion':
      case 'motion_graph':
        return <MotionLab />;
      case 'freefall':
      case 'free_fall':
        return <FreeFallLab />;
      case 'projectile':
        return <ProjectileLab />;
      case 'photogate':
      case 'photogate_mc964':
        return <PhotogateTimerLab />;
      case 'error':
      case 'vernier_error':
        return <PhotogateErrorLab />;
      case 'safety':
      case 'safety_rules':
        return <ElectricSafetyLab />;
      case 'vector':
      case 'vector_velocity':
        return <VectorBoatLab />;
      default:
        return <MotionLab />;
    }
  };

  return (
    <div id="lab-viewer-container" className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-[#18181b] rounded-2xl border border-neutral-800 space-y-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-neutral-400 tracking-wider font-mono uppercase bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700/50">
              Virtual Lab
            </span>
            <span className="text-xs text-neutral-500 hidden sm:inline">
              Mô phỏng vật lý tương tác
            </span>
          </div>

          <button
            onClick={onNavigateToTheory}
            className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" /> Xem lý thuyết
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-neutral-100 tracking-tight">
          {labTitle}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
          {labDescription}
        </p>
      </div>

      {/* Render Active Simulation */}
      <div className="bg-[#18181b] p-5 sm:p-6 rounded-2xl border border-neutral-800">
        {renderSimulation()}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 bg-[#18181b] rounded-2xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-neutral-400">
          Đã hoàn thành khảo sát và thu thập số liệu?
        </span>
        <button
          onClick={onNavigateToQuiz}
          className="flex items-center gap-1.5 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-medium text-xs rounded-xl border border-neutral-700/60 transition-colors cursor-pointer"
        >
          Luyện tập trắc nghiệm <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
