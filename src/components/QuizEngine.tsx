import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, XCircle, RotateCcw, Award, ChevronRight, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '../types';
import { Latex } from './Latex';

interface QuizEngineProps {
  questions?: QuizQuestion[];
  lessonTitle?: string;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions = [],
  lessonTitle = 'Bài học',
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unanswered' | 'review'>('all');

  // Reset local state when switching lessons or receiving new questions
  useEffect(() => {
    setSelectedAnswers({});
    setSubmitted(false);
    setActiveTab('all');
  }, [lessonTitle, questions]);

  const safeQuestions = questions ?? [];
  const totalCount = safeQuestions.length;

  const handleSelect = (questionId: string, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setActiveTab('all');
  };

  const handleSubmit = () => {
    if (totalCount === 0) return;
    setSubmitted(true);
    const correct = safeQuestions.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;
    const scoreRatio = correct / totalCount;

    if (scoreRatio >= 0.7) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const correctCount = safeQuestions.filter(
    (q) => selectedAnswers[q.id] === q.correctAnswer
  ).length;
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const getDifficultyBadge = (diff?: QuizQuestion['difficulty']) => {
    switch (diff) {
      case 'easy':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/60">Nhận biết</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/60">Thông hiểu</span>;
      case 'hard':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-amber-400/90 border border-neutral-700/60">Vận dụng</span>;
      case 'expert':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-indigo-400/90 border border-neutral-700/60">Vận dụng cao</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/60">Thông hiểu</span>;
    }
  };

  if (totalCount === 0) {
    return (
      <div id="quiz-engine-container" className="p-8 bg-[#18181b] rounded-2xl border border-neutral-800 text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center border border-neutral-700/60">
          <Award className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-100">
          Hệ thống bài tập trắc nghiệm & Vận dụng
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
          {lessonTitle ? `${lessonTitle}: ` : ''}Nội dung câu hỏi trắc nghiệm và bài tập vận dụng đang được cập nhật theo chuẩn SGK.
        </p>
      </div>
    );
  }

  return (
    <div id="quiz-engine-container" className="space-y-6 max-w-4xl">
      {/* Quiz Header & Performance Banner */}
      <div className="p-4 bg-[#18181b] rounded-2xl border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-neutral-400" />
            Luyện tập trắc nghiệm &amp; Vận dụng
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {lessonTitle ?? 'Bài học'} • <strong className="text-neutral-200">{totalCount} câu hỏi</strong> chuẩn SGK
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-neutral-400">Điểm số:</div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {correctCount} / {totalCount} ({scorePercent}%)
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-colors cursor-pointer border border-neutral-700/60"
              title="Làm lại đề này"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            id="submit-quiz-btn"
            onClick={handleSubmit}
            className="px-4 py-2 bg-neutral-100 hover:bg-white text-neutral-900 font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            Nộp bài &amp; Xem giải chi tiết <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {safeQuestions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;
          const questionText = q?.question ?? 'Nội dung câu hỏi đang được cập nhật...';
          const options = q?.options ?? [];

          return (
            <div
              key={q.id || `q-${qIndex}`}
              id={`quiz-question-${q.id || qIndex}`}
              className={`p-5 rounded-2xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-[#18181b] border-emerald-800/60'
                    : 'bg-[#18181b] border-rose-800/60'
                  : 'bg-[#18181b] border-neutral-800'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-neutral-800 border border-neutral-700/60 flex items-center justify-center font-semibold text-xs text-neutral-300 font-mono">
                    {qIndex + 1}
                  </span>
                  {getDifficultyBadge(q?.difficulty)}
                </div>

                {submitted && (
                  <div>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle className="w-4 h-4" /> Đúng
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-rose-400">
                        <XCircle className="w-4 h-4" /> Chưa đúng
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Question Text */}
              <div className="text-sm font-medium text-neutral-200 leading-relaxed mb-4">
                <Latex content={questionText} />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {options.map((opt, optIdx) => {
                  const isThisSelected = userAnswer === optIdx;
                  const isThisCorrectAnswer = q.correctAnswer === optIdx;

                  let optClasses =
                    'p-3 rounded-xl border text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer ';

                  if (submitted) {
                    if (isThisCorrectAnswer) {
                      optClasses += 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 font-medium ';
                    } else if (isThisSelected && !isCorrect) {
                      optClasses += 'bg-rose-950/40 border-rose-500/80 text-rose-300 line-through ';
                    } else {
                      optClasses += 'bg-neutral-900/40 border-neutral-800/60 text-neutral-500 opacity-60 ';
                    }
                  } else {
                    if (isThisSelected) {
                      optClasses += 'bg-neutral-800 border-neutral-500 text-neutral-100 font-medium ';
                    } else {
                      optClasses += 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:bg-neutral-800/40 ';
                    }
                  }

                  const optLabels = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={submitted}
                      className={optClasses}
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-semibold text-[11px] flex-shrink-0 ${
                          isThisSelected
                            ? 'bg-neutral-200 text-neutral-900'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {optLabels[optIdx] ?? `${optIdx + 1}`}
                      </span>
                      <div className="flex-1 mt-0.5 leading-normal">
                        <Latex content={opt ?? ''} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step-by-Step LaTeX Explanation (Shown after submit) */}
              {submitted && (
                <div className="mt-4 pl-3.5 py-2.5 bg-neutral-900/50 rounded-r-xl border-l-2 border-neutral-600 text-xs text-neutral-300 space-y-1.5">
                  <div className="font-semibold text-neutral-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> Hướng dẫn giải chi tiết:
                  </div>
                  <div className="leading-relaxed text-neutral-400">
                    <Latex content={q?.detailedExplanation || q?.explanation || 'Đáp án chính xác theo quy chuẩn SGK Vật lí 10.'} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Bar for Quick Submission if not submitted */}
      {!submitted && (
        <div className="sticky bottom-6 z-20 p-3 bg-[#18181b]/95 backdrop-blur-md rounded-xl border border-neutral-800 shadow-xl flex items-center justify-between">
          <div className="text-xs text-neutral-400">
            Đã chọn: <strong className="text-neutral-100 font-mono">{Object.keys(selectedAnswers).length}</strong> / {totalCount} câu
          </div>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-neutral-100 hover:bg-white text-neutral-900 font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Nộp bài chấm điểm
          </button>
        </div>
      )}
    </div>
  );
};
