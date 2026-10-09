import type {
  Subject, Assessment, Grade, Credit, ScheduleEvent, Assignment,
  StudySession, Goal, Resource, Notification, Semester, FormationType,
} from '@/lib/types';
import type { AcademicRuleSetConfig } from '@/lib/engine/AcademicRuleSet';

export interface StudentProfile {
  firstName: string;
  lastName: string;
  formation: string;
  formationType: FormationType;
  institution: string;
  className: string;
  academicYear: string;
  avatarUrl?: string;
  onboardingCompleted: boolean;
}

export interface LibraryResource extends Resource {
  author: string;
  content: string;
  readingMinutes: number;
}

export interface AcademicGoal extends Goal { title: string }
export interface SavedSimulation {
  id: string;
  name: string;
  createdAt: string;
  subjectGrades: Record<string, number>;
  examCoefficient: number;
  average: number;
}

export interface Workspace {
  version: 1;
  isDemo: boolean;
  profile: StudentProfile;
  semesters: Semester[];
  activeSemesterId: string;
  subjects: Subject[];
  assessments: Assessment[];
  grades: Grade[];
  credits: Credit[];
  events: ScheduleEvent[];
  assignments: Assignment[];
  sessions: StudySession[];
  goals: AcademicGoal[];
  resources: LibraryResource[];
  notifications: Notification[];
  bookmarks: string[];
  upvotes: string[];
  simulations: SavedSimulation[];
  rules: AcademicRuleSetConfig;
  preferences: {
    examReminders: boolean;
    goalUpdates: boolean;
    revisionReminders: boolean;
  };
  previousAverage: number | null;
}

export type SyncStatus = 'loading' | 'local' | 'syncing' | 'synced' | 'error';
export type Theme = 'light' | 'dark' | 'system';
