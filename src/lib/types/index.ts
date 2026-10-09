// ============================================================
// STUDYCORE - Types fondamentaux
// ============================================================

// ---- Utilisateurs & Rôles ----
export type UserRole = 'STUDENT' | 'TEACHER' | 'CLASS_ADMIN' | 'SCHOOL_ADMIN' | 'SUPER_ADMIN';

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole;
  level?: AcademicLevel;
  formationType?: FormationType;
  institutionId?: string;
  classId?: string;
  academicYearId?: string;
  academicGoal?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Niveaux académiques ----
export type AcademicLevel = 'COLLEGE' | 'LYCEE' | 'BTS' | 'LICENCE' | 'MASTER' | 'FORMATION_PRO' | 'AUTRE';
export type FormationType = 'COLLEGE' | 'LYCEE_GENERAL' | 'LYCEE_TECHNO' | 'LYCEE_PRO' | 'BTS' | 'LICENCE' | 'MASTER' | 'FORMATION_PRO' | 'AUTRE';

// ---- Établissements ----
export interface Institution {
  id: string;
  name: string;
  type: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt: string;
}

// ---- Programmes académiques ----
export interface AcademicProgram {
  id: string;
  institutionId: string;
  name: string;
  formationType: FormationType;
  description?: string;
  createdAt: string;
}

// ---- Années académiques ----
export interface AcademicYear {
  id: string;
  programId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

// ---- Niveaux ----
export interface Level {
  id: string;
  academicYearId: string;
  name: string;
  order: number;
}

// ---- Classes ----
export interface Class {
  id: string;
  levelId: string;
  name: string;
  code?: string;
}

// ---- Semestres ----
export interface Semester {
  id: string;
  academicYearId: string;
  name: string;
  order: number;
  startDate: string;
  endDate: string;
}

// ---- Unités d'enseignement (UE) ----
export interface Unit {
  id: string;
  semesterId: string;
  name: string;
  code: string;
  credits: number;
  coefficient: number;
  passingGrade: number;
}

// ---- Matières ----
export interface Subject {
  id: string;
  unitId?: string;
  semesterId: string;
  name: string;
  code: string;
  coefficient: number;
  credits: number;
  passingGrade: number;
  eliminatoryGrade?: number;
  color?: string;
  teacherName?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Types d'évaluation ----
export type AssessmentType =
  | 'INTERROGATION'
  | 'DEVOIR'
  | 'DEVOIR_SURVEILLE'
  | 'TP'
  | 'PROJET'
  | 'ORAL'
  | 'EXPOSE'
  | 'CONTROLE_CONTINU'
  | 'EXAMEN'
  | 'PARTIEL'
  | 'EXAMEN_FINAL'
  | 'RATTRAPAGE'
  | 'BONUS';

// ---- Évaluations ----
export interface Assessment {
  id: string;
  subjectId: string;
  name: string;
  type: AssessmentType;
  coefficient: number;
  date: string;
  session?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Notes ----
export interface Grade {
  id: string;
  assessmentId: string;
  subjectId: string;
  studentId: string;
  value: number;
  scale: number; // barème (20, 10, 40, etc.)
  isSimulated?: boolean;
  simulationId?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Règles de notation ----
export interface GradingRule {
  id: string;
  institutionId?: string;
  programId?: string;
  name: string;
  gradingScale: number;
  passingGrade: number;
  eliminatoryGrade?: number;
  roundingMode: RoundingMode;
  ccWeight?: number;
  examWeight?: number;
}

export type RoundingMode = 'STANDARD' | 'SUPERIOR' | 'INFERIOR' | 'BANKER';

// ---- Règles de validation ----
export interface ValidationRule {
  id: string;
  institutionId?: string;
  programId?: string;
  name: string;
  compensationEnabled: boolean;
  compensationScope: 'SUBJECT' | 'UNIT' | 'SEMESTER' | 'YEAR';
  minimumCompensationGrade: number;
  creditsEnabled: boolean;
  retakeEnabled: boolean;
  bonusEnabled: boolean;
}

// ---- Inscriptions ----
export interface StudentEnrollment {
  id: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  enrolledAt: string;
}

// ---- Crédits ----
export interface Credit {
  id: string;
  studentId: string;
  subjectId?: string;
  unitId?: string;
  creditsEarned: number;
  creditsTotal: number;
  status: CreditStatus;
  validatedAt?: string;
}

export type CreditStatus = 'ACQUIRED' | 'PENDING' | 'FAILED' | 'IN_PROGRESS';

// ---- Transactions de crédits ----
export interface CreditTransaction {
  id: string;
  studentId: string;
  creditId: string;
  amount: number;
  type: 'EARNED' | 'REVOKED' | 'TRANSFERRED';
  reason: string;
  createdAt: string;
}

// ---- Emploi du temps ----
export interface ScheduleEvent {
  id: string;
  studentId: string;
  subjectId?: string;
  title: string;
  type: ScheduleEventType;
  date: string;
  startTime: string;
  endTime: string;
  room?: string;
  teacherName?: string;
  description?: string;
  color?: string;
}

export type ScheduleEventType = 'COURSE' | 'EXAM' | 'ASSIGNMENT' | 'REVISION' | 'PERSONAL';

// ---- Devoirs ----
export interface Assignment {
  id: string;
  studentId: string;
  subjectId: string;
  title: string;
  type: AssessmentType;
  dueDate: string;
  coefficient: number;
  difficulty?: number;
  estimatedTime?: number;
  priority: number;
  status: AssignmentStatus;
  createdAt: string;
}

export type AssignmentStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';

// ---- Examens ----
export interface Exam {
  id: string;
  subjectId: string;
  name: string;
  date: string;
  duration?: number;
  room?: string;
  coefficient: number;
  session?: string;
}

// ---- Sessions d'étude ----
export interface StudySession {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  completed: boolean;
  notes?: string;
}

// ---- Plans de révision ----
export interface StudyPlan {
  id: string;
  studentId: string;
  name: string;
  startDate: string;
  endDate: string;
  sessions: StudySession[];
  priorityScore: number;
  createdAt: string;
}

// ---- Ressources ----
export interface Resource {
  id: string;
  title: string;
  authorId: string;
  subjectId: string;
  type: ResourceType;
  fileUrl?: string;
  externalUrl?: string;
  description?: string;
  level?: AcademicLevel;
  year?: string;
  categoryId?: string;
  downloads: number;
  votes: number;
  createdAt: string;
}

export type ResourceType = 'PDF' | 'FICHE' | 'EXERCICE' | 'ANNALE' | 'CORRIGE' | 'VIDEO' | 'LIEN';

// ---- Catégories de ressources ----
export interface ResourceCategory {
  id: string;
  name: string;
  description?: string;
}

// ---- Objectifs ----
export interface Goal {
  id: string;
  studentId: string;
  type: GoalType;
  targetValue: number;
  currentValue?: number;
  subjectId?: string;
  unitId?: string;
  semesterId?: string;
  deadline?: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export type GoalType = 'SUBJECT_GRADE' | 'UNIT_GRADE' | 'SEMESTER_GRADE' | 'YEAR_GRADE' | 'CREDITS' | 'OVERALL';
export type GoalStatus = 'ACTIVE' | 'ACHIEVED' | 'FAILED' | 'ABANDONED';

// ---- Simulations ----
export interface Simulation {
  id: string;
  studentId: string;
  name: string;
  data: SimulationData;
  createdAt: string;
}

export interface SimulationData {
  modifiedGrades: Record<string, number>; // assessmentId -> new value
  targetGrade?: number;
  targetType?: GoalType;
  results?: SimulationResults;
}

export interface SimulationResults {
  subjectAverages: Record<string, number>;
  unitAverages: Record<string, number>;
  semesterAverage: number;
  overallAverage: number;
  creditsEarned: number;
  status: string;
}

// ---- Notifications ----
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export type NotificationType = 'EXAM_SOON' | 'ASSIGNMENT_SOON' | 'GOAL_ACHIEVED' | 'GRADE_DROP' | 'CREDIT_VALIDATED' | 'REVISION_REMINDER';

// ---- Groupes ----
export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: 'MEMBER' | 'ADMIN';
  joinedAt: string;
}

// ---- Résultats de calcul ----
export interface SubjectResult {
  subjectId: string;
  subjectName: string;
  average: number;
  scale: number;
  coefficient: number;
  credits: number;
  status: SubjectStatus;
  grades: Grade[];
  assessments: Assessment[];
}

export type SubjectStatus = 'VALIDATED' | 'WARNING' | 'FAILED' | 'RETAKABLE' | 'PENDING';

export interface UnitResult {
  unitId: string;
  unitName: string;
  average: number;
  coefficient: number;
  credits: number;
  creditsEarned: number;
  status: SubjectStatus;
  subjects: SubjectResult[];
}

export interface SemesterResult {
  semesterId: string;
  semesterName: string;
  average: number;
  totalCredits: number;
  earnedCredits: number;
  status: SubjectStatus;
  units: UnitResult[];
  subjects: SubjectResult[];
}

export interface AcademicYearResult {
  yearId: string;
  yearName: string;
  overallAverage: number;
  totalCredits: number;
  earnedCredits: number;
  status: SubjectStatus;
  semesters: SemesterResult[];
}