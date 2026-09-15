/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Atom,
  FlaskConical,
  GraduationCap,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { chaptersData } from './data/chapters';
import { quizzesData } from './data/quizzes';
import { Lesson, ViewMode } from './types';
import { TheoryViewer } from './components/TheoryViewer';
import { LabViewer } from './components/LabViewer';
import { QuizEngine } from './components/QuizEngine';

export default function App() {
  // Navigation State
  const [selectedLessonId, setSelectedLessonId] = useState<string>('bai-7'); // Default to Gia tốc - Chuyển động thẳng biến đổi đều
  const [activeView, setActiveView] = useState<ViewMode>('theory');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'chuong-1': true,
    'chuong-2': true,
    'chuong-3': true,
    'chuong-4': true,
    'chuong-5': true,
    'chuong-6': true,
    'chuong-7': true,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Find currently selected lesson safely
  const currentLesson = useMemo<Lesson>(() => {
    for (const chapter of chaptersData) {
      const found = chapter.lessons.find((l) => l.id === selectedLessonId);
      if (found) return found;
    }
    return chaptersData[1]?.lessons[2] ?? chaptersData[0]?.lessons[0];
  }, [selectedLessonId]);

  // Find chapter of current lesson safely
  const currentChapter = useMemo(() => {
    return chaptersData.find((c) =>
      c.lessons.some((l) => l.id === selectedLessonId)
    );
  }, [selectedLessonId]);

  // Quiz questions for current lesson safely
  const currentQuizzes = useMemo(() => {
    return currentLesson?.practice?.questions ?? quizzesData[selectedLessonId] ?? [];
  }, [currentLesson, selectedLessonId]);

  // Filter lessons based on search query
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chaptersData;
    const query = searchQuery.toLowerCase();
    return chaptersData
      .map((ch) => ({
        ...ch,
        lessons: ch.lessons.filter(
          (l) =>
            (l.title ?? '').toLowerCase().includes(query) ||
            (l.description || l.shortDesc || '').toLowerCase().includes(query)
        ),
      }))
      .filter((ch) => ch.lessons.length > 0);
  }, [searchQuery]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setMobileMenuOpen(false);
    const parentCh = chaptersData.find((c) => c.lessons.some((l) => l.id === lessonId));
    if (parentCh) {
      setExpandedChapters((prev) => ({
        ...prev,
        [parentCh.id]: true,
      }));
    }
  };

  return (
    <div id="physics-app-root" className="min-h-screen bg-[#121212] text-neutral-200 flex flex-col antialiased selection:bg-neutral-800 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile/Desktop Toggle & App Title */}
          <div className="flex items-center gap-3">
            {/* Mobile Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-100 lg:hidden cursor-pointer transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Desktop Sidebar Toggle (Hide / Show to expand screen space) */}
            <button
              id="desktop-sidebar-toggle-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs transition-colors cursor-pointer"
              title={sidebarCollapsed ? "Mở danh sách bài học" : "Ẩn mục lục (Mở rộng không gian hiển thị)"}
            >
              {sidebarCollapsed ? (
                <>
                  <PanelLeftOpen className="w-4 h-4 text-indigo-400" />
                  <span className="font-medium text-neutral-300 hidden sm:inline">Hiện mục lục</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4" />
                  <span className="hidden sm:inline">Ẩn mục lục</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-200">
                <Atom className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight text-neutral-100 flex items-center gap-2">
                  Vật lí 10
                  <span className="text-[10px] font-medium px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded border border-neutral-700/50">
                    KNTT
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 hidden sm:block">
                  Kết nối tri thức với cuộc sống
                </div>
              </div>
            </div>
          </div>

          {/* Center/Right: View Mode Navigation Tabs */}
          <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
            <button
              id="tab-theory"
              onClick={() => setActiveView('theory')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                activeView === 'theory'
                  ? 'bg-neutral-800 text-neutral-100 font-medium shadow-xs border border-neutral-700/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 font-normal'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lý thuyết &amp; Công thức</span>
              <span className="sm:hidden">Lý thuyết</span>
            </button>

            <button
              id="tab-lab"
              onClick={() => setActiveView('lab')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                activeView === 'lab'
                  ? 'bg-neutral-800 text-neutral-100 font-medium shadow-xs border border-neutral-700/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 font-normal'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Virtual Lab</span>
            </button>

            <button
              id="tab-quiz"
              onClick={() => setActiveView('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                activeView === 'quiz'
                  ? 'bg-neutral-800 text-neutral-100 font-medium shadow-xs border border-neutral-700/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 font-normal'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Luyện tập</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700/40 font-mono">
                {currentQuizzes.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Container - Expansive layout utilizing left and right screen space */}
      <div className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 flex gap-6 lg:gap-8 items-start relative">
        {/* Floating reopen button if sidebar is collapsed on desktop */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="hidden lg:flex items-center gap-2 px-3 py-2 bg-[#18181b]/95 hover:bg-neutral-800 text-neutral-200 text-xs font-medium rounded-xl border border-neutral-700/80 shadow-xl fixed left-4 top-20 z-30 transition-all cursor-pointer hover:border-neutral-500 backdrop-blur-md"
            title="Mở mục lục bài học"
          >
            <PanelLeftOpen className="w-4 h-4 text-indigo-400" />
            <span>Mục lục</span>
          </button>
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:sticky top-20 z-30 inset-y-0 left-0 w-80 max-w-[85vw] bg-[#161616] border-r lg:border border-neutral-800/90 lg:rounded-2xl p-4 flex flex-col gap-3 shadow-2xl lg:shadow-none transition-all duration-200 overflow-hidden ${
            sidebarCollapsed ? 'lg:hidden' : 'lg:flex'
          } ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ maxHeight: 'calc(100vh - 6.5rem)' }}
        >
          {/* Header with Title & Collapse Icon */}
          <div className="flex items-center justify-between pb-1 border-b border-neutral-800/70">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
              Chương trình Vật lí 10
            </span>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="hidden lg:flex p-1 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Ẩn mục lục (Mở rộng toàn màn hình)"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="sidebar-search-input"
              type="text"
              placeholder="Tìm kiếm bài học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#1f1f1f] border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>

          {/* Chapters & Lessons Scrollable Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {filteredChapters.map((chapter) => {
              const isExpanded = expandedChapters[chapter.id] !== false;
              return (
                <div key={chapter.id} className="space-y-1">
                  {/* Lightweight Collapsible Chapter Accordion */}
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                  >
                    <span className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase group-hover:text-neutral-200 transition-colors">
                      {chapter.title}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
                    )}
                  </button>

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="space-y-0.5 pl-2 border-l border-neutral-800/80 my-1">
                      {chapter.lessons.map((lesson) => {
                        const isSelected = lesson.id === selectedLessonId;
                        const getLabSubtext = () => {
                          if (lesson?.virtualLab?.title) return lesson.virtualLab.title;
                          switch (lesson.labType) {
                            case 'motion': return 'Đồ thị d-t & v-t';
                            case 'freefall': return 'Tháp rơi & Đồng hồ MC964';
                            case 'projectile': return 'Chuyển động ném';
                            case 'photogate': return 'Máng nghiêng Cổng quang';
                            case 'error': return 'Thước kẹp & Sai số';
                            case 'safety': return 'An toàn thực hành';
                            case 'vector': return 'Cộng vận tốc & Thuyền';
                            default: return 'Thí nghiệm ảo';
                          }
                        };
                        const labSubtext = getLabSubtext();

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson.id)}
                            className={`w-full text-left py-2 px-2.5 rounded-lg text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-neutral-800 text-neutral-100 font-medium border-l-2 border-indigo-400'
                                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="truncate text-xs leading-normal">
                                {lesson?.title ?? 'Bài học'}
                              </div>
                              <div className="text-[10px] truncate text-neutral-500 mt-0.5">
                                {labSubtext}
                              </div>
                            </div>

                            {(lesson.hasLab ?? true) && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 font-medium ${
                                  isSelected
                                    ? 'bg-neutral-700/80 text-neutral-200'
                                    : 'text-neutral-500 bg-neutral-900/60'
                                }`}
                                title="Có Virtual Lab"
                              >
                                Lab
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Minimal Curriculum Scope Indicator */}
          <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>SGK KNTT 10</span>
            <span className="text-neutral-400 font-mono">Chương 1 - 7</span>
          </div>
        </aside>

        {/* Backdrop for Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Main Content Viewer */}
        <main className="flex-1 min-w-0">
          {activeView === 'theory' && (
            <TheoryViewer
              key={currentLesson?.id ?? 'theory'}
              lesson={currentLesson}
              onNavigateToLab={() => setActiveView('lab')}
              onNavigateToQuiz={() => setActiveView('quiz')}
            />
          )}

          {activeView === 'lab' && (
            <LabViewer
              key={currentLesson?.id ?? 'lab'}
              lesson={currentLesson}
              onNavigateToTheory={() => setActiveView('theory')}
              onNavigateToQuiz={() => setActiveView('quiz')}
            />
          )}

          {activeView === 'quiz' && (
            <QuizEngine
              key={currentLesson?.id ?? 'quiz'}
              questions={currentQuizzes}
              lessonTitle={currentLesson?.title ?? 'Bài tập trắc nghiệm'}
            />
          )}
        </main>
      </div>
    </div>
  );
}

