import React from 'react';
import {
  BookOpen,
  AlertCircle,
  ArrowRight,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  XCircle,
  FlaskConical,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Lesson } from '../types';
import { Latex } from './Latex';
import { MarkdownRenderer } from './MarkdownRenderer';

interface TheoryViewerProps {
  lesson: Lesson;
  onNavigateToLab: () => void;
  onNavigateToQuiz: () => void;
}

export const TheoryViewer: React.FC<TheoryViewerProps> = ({
  lesson,
  onNavigateToLab,
  onNavigateToQuiz,
}) => {
  const labSpec = lesson?.virtualLab ?? lesson?.virtualLabSpec;
  const sections =
    lesson?.theory?.sections ?? lesson?.sections ?? lesson?.theorySections ?? [];

  const lessonTitle = lesson?.theory?.title ?? lesson?.title ?? 'Bài học';
  const lessonDesc =
    lesson?.theory?.summary ??
    lesson?.description ??
    lesson?.shortDesc ??
    'Nội dung tóm tắt bài học đang được cập nhật...';

  return (
    <div id="theory-viewer-container" className="space-y-10 max-w-4xl">
      {/* Lesson Header Banner */}
      <div className="pb-6 border-b border-neutral-800/80 space-y-4">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="px-2 py-0.5 rounded font-mono text-[11px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/50">
            {lesson?.id?.toUpperCase() ?? 'VAT-LI-10'}
          </span>
          <span>•</span>
          <span>SGK Vật lí 10 (KNTT)</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight">
          {lessonTitle}
        </h1>

        <div className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-3xl">
          <MarkdownRenderer content={lessonDesc} />
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            onClick={onNavigateToLab}
            className="flex items-center gap-2 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-100 text-xs font-medium rounded-xl border border-neutral-700/60 transition-colors cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5 text-indigo-400" /> Mở Virtual Lab
          </button>
          <button
            onClick={onNavigateToQuiz}
            className="flex items-center gap-2 px-3.5 py-2 bg-transparent hover:bg-neutral-850 text-neutral-300 text-xs font-medium rounded-xl border border-neutral-800 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" /> Luyện tập Trắc nghiệm
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PHẦN 1: LÝ THUYẾT TRỌNG TÂM (THEORY NOTES)               */}
      {/* ========================================================= */}
      <div className="space-y-8" id="part-1-theory">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-neutral-200 uppercase tracking-wider">
            Phần 1: Lý thuyết trọng tâm
          </h2>
          <p className="text-xs text-neutral-500">
            Kiến thức chuẩn SGK Vật lí 10, công thức định dạng LaTeX chuẩn
          </p>
        </div>

        <div className="space-y-10">
          {sections.length > 0 ? (
            sections.map((section, idx) => {
              const secTitle = section?.title ?? `Mục ${idx + 1}`;
              const secContent = section?.content ?? 'Nội dung đang được cập nhật...';
              const formulas = section?.formulas ?? [];

              return (
                <div key={idx} className="space-y-4 pt-6 first:pt-0 border-t first:border-t-0 border-neutral-800/60">
                  <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2.5">
                    <span className="text-xs font-mono text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded border border-neutral-700/50">
                      {idx + 1}
                    </span>
                    {secTitle}
                  </h3>

                  {/* Main Section Content */}
                  <div className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                    <MarkdownRenderer content={secContent} />
                  </div>

                  {/* Formulas Callout */}
                  {formulas.length > 0 && (
                    <div className="my-5 p-4 bg-[#18181b] rounded-xl border border-neutral-800 space-y-3">
                      <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400/80" /> Công thức trọng tâm:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {formulas.map((form, fIdx) => {
                          const latexStr =
                            (typeof form === 'string' ? form : form?.latex) ?? '';
                          const formulaName =
                            typeof form === 'object' ? form?.name : undefined;
                          return (
                            <div
                              key={fIdx}
                              className="p-3 bg-neutral-900/90 rounded-lg border border-neutral-800/80 text-center font-mono text-sm text-neutral-100 space-y-1"
                            >
                              {formulaName && (
                                <div className="text-[11px] font-sans text-neutral-400 font-medium">
                                  {formulaName}
                                </div>
                              )}
                              <Latex content={latexStr} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Key Takeaway */}
                  {section?.keyTakeaway && (
                    <div className="my-4 pl-3.5 py-2.5 border-l-2 border-emerald-500/70 bg-emerald-500/5 rounded-r-lg text-xs text-neutral-300 leading-relaxed">
                      <strong className="text-emerald-400 font-medium mr-1.5">
                        Ghi nhớ:
                      </strong>
                      <Latex content={section.keyTakeaway} />
                    </div>
                  )}

                  {/* Note / Trap Callout */}
                  {section?.note && (
                    <div className="my-4 pl-3.5 py-2.5 border-l-2 border-amber-500/70 bg-amber-500/5 rounded-r-lg text-xs text-neutral-300 leading-relaxed">
                      <strong className="text-amber-400 font-medium mr-1.5">
                        Lưu ý quan trọng:
                      </strong>
                      <Latex content={section.note} />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-6 bg-[#18181b] rounded-2xl border border-neutral-800 text-center">
              <p className="text-sm text-neutral-400">
                {lesson?.theory?.content ?? 'Nội dung lý thuyết chi tiết đang được cập nhật...'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* PHẦN 2: PHÒNG THÍ NGHIỆM ẢO (VIRTUAL LAB)                 */}
      {/* ========================================================= */}
      <div className="space-y-6 pt-8 border-t border-neutral-800" id="part-2-lab">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-neutral-200 uppercase tracking-wider">
              Phần 2: Phòng thí nghiệm ảo (Virtual Lab)
            </h2>
            <p className="text-xs text-neutral-500">
              Thực hành mô phỏng tương tác, kiểm chứng định luật và phân tích kết quả thực nghiệm
            </p>
          </div>

          <button
            onClick={onNavigateToLab}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-white text-neutral-900 font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" /> Mở Virtual Lab
          </button>
        </div>

        {/* Structured Virtual Lab Specification Card */}
        {labSpec ? (
          <div className="p-6 bg-[#18181b] rounded-2xl border border-neutral-800 space-y-6">
            {/* 1. Tên thí nghiệm & Mục đích */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                1. Tên thí nghiệm &amp; Mục đích
              </div>
              <div className="space-y-1 pl-3 border-l border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-100">
                  <Latex content={labSpec?.experimentName ?? lesson?.labTitle ?? 'Thí nghiệm ảo'} />
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  <span className="text-neutral-300 font-medium mr-1">Mục đích:</span>
                  <Latex content={labSpec?.purpose ?? lesson?.labDescription ?? 'Kiểm chứng định luật thực nghiệm.'} />
                </p>
              </div>
            </div>

            {/* 2. Thiết bị & Thao tác thực hiện */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                2. Thiết bị &amp; Thao tác thực hiện
              </div>
              <ul className="space-y-2 text-xs text-neutral-300 pl-3 border-l border-neutral-800">
                {(labSpec?.equipmentAndSteps ?? [
                  '1. Quan sát trạng thái ban đầu của hệ thống.',
                  '2. Điều chỉnh các thông số vật lí trên bảng điều khiển.',
                  '3. Khởi động mô phỏng và ghi nhận số liệu thực nghiệm.',
                ]).map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <span className="text-neutral-500 font-mono text-[11px] flex-shrink-0">
                      {sIdx + 1}.
                    </span>
                    <div className="leading-relaxed">
                      <Latex content={step} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Hiện tượng & Bản chất vật lý */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                3. Hiện tượng &amp; Bản chất vật lý
              </div>
              <div className="pl-3 border-l border-neutral-800 text-xs text-neutral-300 leading-relaxed">
                <Latex content={labSpec?.physicsNatureAndLogic ?? 'Bản chất vật lí và quy luật định lượng từ SGK Vật lí 10.'} />
              </div>
            </div>

            {/* 4. Kết quả mong đợi */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                4. Kết quả mong đợi (Expected Results)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Positive Result */}
                <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Kết quả Thực nghiệm Đúng:</span>
                  </div>
                  <div className="text-neutral-400 leading-relaxed">
                    <Latex content={labSpec?.expectedResults?.positive ?? 'Đo đạc và kết quả nghiệm đúng với định luật lí thuyết.'} />
                  </div>
                </div>

                {/* Negative Result */}
                <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-medium">
                    <XCircle className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
                    <span>Lỗi sai thường gặp / Sai số:</span>
                  </div>
                  <div className="text-neutral-400 leading-relaxed">
                    <Latex content={labSpec?.expectedResults?.negative ?? 'Sai lệch kết quả do yếu tố ma sát, lực cản hoặc thao tác đo chưa chuẩn.'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-[#18181b] rounded-2xl border border-neutral-800 flex flex-col items-center text-center space-y-3">
            <FlaskConical className="w-8 h-8 text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-200">
              {lesson?.labTitle ?? 'Phòng thí nghiệm ảo liên kết'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-lg">
              {lesson?.labDescription ?? 'Khám phá môi trường mô phỏng vật lý trực quan tương tác.'}
            </p>
            <button
              onClick={onNavigateToLab}
              className="mt-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-medium rounded-xl border border-neutral-700 transition-colors cursor-pointer"
            >
              Vào Thí nghiệm Ảo
            </button>
          </div>
        )}
      </div>

      {/* Bottom Footer Navigation */}
      <div className="p-5 bg-[#18181b] rounded-2xl border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Củng cố kiến thức
          </h4>
          <p className="text-xs text-neutral-500 mt-0.5">
            Làm bài trắc nghiệm nhanh để kiểm tra mức độ thấu hiểu bài học này.
          </p>
        </div>

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

