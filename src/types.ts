export type ViewMode = 'both' | 'theory' | 'lab' | 'quiz';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string; // Explanations formatted with LaTeX
  detailedExplanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface TheorySection {
  title: string;
  content: string; // Markdown text with inline and block LaTeX
  keyTakeaway?: string;
  note?: string;
  formulas?: (
    | string
    | {
        name: string;
        latex: string;
        description: string;
        units?: string;
      }
  )[];
}

export interface VirtualLabSpec {
  experimentName: string;
  purpose: string;
  equipmentAndSteps: string[];
  physicsNatureAndLogic: string;
  expectedResults: {
    positive: string;
    negative: string;
  };
}

export interface LessonTheory {
  title: string;
  summary?: string;
  content?: string;
  sections: TheorySection[];
  formulas?: (
    | string
    | {
        name: string;
        latex: string;
        description?: string;
        units?: string;
      }
  )[];
  keyTakeaways?: string[];
}

export interface LessonVirtualLab {
  id?: string;
  title: string;
  description: string;
  labType: LabType;
  experimentName: string;
  purpose: string;
  equipmentAndSteps: string[];
  physicsNatureAndLogic: string;
  expectedResults: {
    positive: string;
    negative: string;
  };
}

export interface LessonPractice {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export type LabType =
  | 'galileo_pisa'
  | 'electric_safety'
  | 'photogate_error'
  | 'motion'
  | 'motion_graph'
  | 'freefall'
  | 'free_fall'
  | 'projectile'
  | 'photogate'
  | 'photogate_mc964'
  | 'error'
  | 'vernier_error'
  | 'vector'
  | 'vector_velocity'
  | 'safety'
  | 'safety_rules';

export interface Lesson {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  shortDesc: string;
  description?: string;
  hasLab?: boolean;
  labType: LabType;
  labTitle: string;
  labDescription: string;
  virtualLabSpec?: VirtualLabSpec;
  sections: TheorySection[];
  theorySections?: TheorySection[];
  summaryFormulas?: {
    name: string;
    latex: string;
    unit?: string;
    notes?: string;
  }[];
  theory?: LessonTheory;
  virtualLab?: LessonVirtualLab;
  practice?: LessonPractice;
}

export interface Chapter {
  id: string;
  number: number;
  romanNumeral: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface UserProgress {
  completedLessons: string[]; // lesson ids
  quizScores: Record<string, { score: number; total: number; passed: boolean }>; // lesson id -> score
  lastActiveLessonId: string;
}
