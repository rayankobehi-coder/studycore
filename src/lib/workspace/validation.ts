import { z } from 'zod';
import type { Workspace } from './types';

const id = z.string().min(1).max(200);
const text = z.string().max(2000);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}/);
const timestamp = z.string().max(100);
const positive = z.number().finite().positive().max(1000);
const nonnegative = z.number().finite().min(0).max(10000);
const type = z.enum(['INTERROGATION', 'DEVOIR', 'DEVOIR_SURVEILLE', 'TP', 'PROJET', 'ORAL', 'EXPOSE', 'CONTROLE_CONTINU', 'EXAMEN', 'PARTIEL', 'EXAMEN_FINAL', 'RATTRAPAGE', 'BONUS']);
const formation = z.enum(['COLLEGE', 'LYCEE_GENERAL', 'LYCEE_TECHNO', 'LYCEE_PRO', 'BTS', 'LICENCE', 'MASTER', 'FORMATION_PRO', 'AUTRE']);
const recordDates = { createdAt: timestamp, updatedAt: timestamp };
const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);
const safeUrl = z.string().max(1000000).refine(value => !value || /^https?:\/\//i.test(value) || /^data:image\/(png|jpeg|webp);base64,/i.test(value), 'Lien non autorisé');
const list = <T extends z.ZodType>(schema: T) => z.array(schema).max(5000);

export const workspaceSchema = z.object({
  version: z.literal(1), isDemo: z.boolean(),
  profile: z.object({ firstName: z.string().max(80), lastName: z.string().max(80), formation: text, formationType: formation, institution: text, className: text, academicYear: z.string().max(30), avatarUrl: safeUrl.optional(), onboardingCompleted: z.boolean() }),
  semesters: list(z.object({ id, academicYearId: id, name: text, order: nonnegative, startDate: date, endDate: date })),
  activeSemesterId: id,
  subjects: list(z.object({ id, unitId: id.optional(), semesterId: id, name: z.string().min(1).max(200), code: z.string().max(30), coefficient: positive, credits: nonnegative, passingGrade: nonnegative, eliminatoryGrade: nonnegative.optional(), color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), teacherName: text.optional(), ...recordDates })),
  assessments: list(z.object({ id, subjectId: id, name: text, type, coefficient: positive, date, session: text.optional(), ...recordDates })),
  grades: list(z.object({ id, assessmentId: id, subjectId: id, studentId: id, value: nonnegative, scale: positive, isSimulated: z.boolean().optional(), simulationId: id.optional(), ...recordDates })),
  credits: list(z.object({ id, studentId: id, subjectId: id.optional(), unitId: id.optional(), creditsEarned: nonnegative, creditsTotal: nonnegative, status: z.enum(['ACQUIRED', 'PENDING', 'FAILED', 'IN_PROGRESS']), validatedAt: timestamp.optional() })),
  events: list(z.object({ id, studentId: id, subjectId: id.optional(), title: text, type: z.enum(['COURSE', 'EXAM', 'ASSIGNMENT', 'REVISION', 'PERSONAL']), date, startTime: time, endTime: time, room: text.optional(), teacherName: text.optional(), description: text.optional(), color: z.string().optional() })),
  assignments: list(z.object({ id, studentId: id, subjectId: id, title: text, type, dueDate: date, coefficient: positive, difficulty: z.number().min(1).max(5).optional(), estimatedTime: positive.optional(), priority: z.number().min(1).max(5), status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']), createdAt: timestamp })),
  sessions: list(z.object({ id, studentId: id, subjectId: id, date, startTime: time, endTime: time, duration: positive, completed: z.boolean(), notes: text.optional() })),
  goals: list(z.object({ id, studentId: id, title: text, type: z.enum(['SUBJECT_GRADE', 'UNIT_GRADE', 'SEMESTER_GRADE', 'YEAR_GRADE', 'CREDITS', 'OVERALL']), targetValue: positive, currentValue: nonnegative.optional(), subjectId: id.optional(), unitId: id.optional(), semesterId: id.optional(), deadline: date.optional(), status: z.enum(['ACTIVE', 'ACHIEVED', 'FAILED', 'ABANDONED']), ...recordDates })),
  resources: list(z.object({ id, title: text, authorId: id, subjectId: id, type: z.enum(['PDF', 'FICHE', 'EXERCICE', 'ANNALE', 'CORRIGE', 'VIDEO', 'LIEN']), fileUrl: safeUrl.optional(), externalUrl: safeUrl.optional(), description: text.optional(), level: z.enum(['COLLEGE', 'LYCEE', 'BTS', 'LICENCE', 'MASTER', 'FORMATION_PRO', 'AUTRE']).optional(), year: text.optional(), categoryId: id.optional(), downloads: nonnegative, votes: nonnegative, createdAt: timestamp, author: text, content: z.string().max(100000), readingMinutes: positive })),
  notifications: list(z.object({ id, userId: id, type: z.enum(['EXAM_SOON', 'ASSIGNMENT_SOON', 'GOAL_ACHIEVED', 'GRADE_DROP', 'CREDIT_VALIDATED', 'REVISION_REMINDER']), title: text, message: text, read: z.boolean(), link: z.string().startsWith('/').optional(), createdAt: timestamp })),
  bookmarks: list(id), upvotes: list(id),
  simulations: list(z.object({ id, name: text, createdAt: timestamp, subjectGrades: z.record(z.string(), z.number().min(0).max(1000)), examCoefficient: positive, average: nonnegative })),
  rules: z.object({ gradingScale: positive, passingGrade: nonnegative, eliminatoryGrade: nonnegative.nullable(), compensationEnabled: z.boolean(), compensationScope: z.enum(['SUBJECT', 'UNIT', 'SEMESTER', 'YEAR']), minimumCompensationGrade: nonnegative, creditsEnabled: z.boolean(), roundingMode: z.enum(['STANDARD', 'SUPERIOR', 'INFERIOR', 'BANKER']), retakeEnabled: z.boolean(), bonusEnabled: z.boolean(), ccWeight: positive.nullable(), examWeight: positive.nullable() }),
  preferences: z.object({ examReminders: z.boolean(), goalUpdates: z.boolean(), revisionReminders: z.boolean() }),
  previousAverage: nonnegative.nullable(),
}).superRefine((data, context) => {
  const subjectIds = new Set(data.subjects.map(s => s.id));
  const assessmentIds = new Set(data.assessments.map(a => a.id));
  const semesterIds = new Set(data.semesters.map(s => s.id));
  const issue = (message: string) => context.addIssue({ code: 'custom', message });
  if (data.activeSemesterId !== 'all' && !semesterIds.has(data.activeSemesterId)) issue('Semestre inconnu.');
  if (data.subjects.some(s => !semesterIds.has(s.semesterId))) issue('Une matière référence un semestre inconnu.');
  if (data.assessments.some(a => !subjectIds.has(a.subjectId))) issue('Une évaluation référence une matière inconnue.');
  if (data.grades.some(g => g.value > g.scale || !subjectIds.has(g.subjectId) || !assessmentIds.has(g.assessmentId) || data.assessments.find(a => a.id === g.assessmentId)?.subjectId !== g.subjectId)) issue('Une note ou sa référence est invalide.');
  if (data.credits.some(c => c.creditsEarned > c.creditsTotal || (c.subjectId && !subjectIds.has(c.subjectId)))) issue('Crédits incohérents.');
  if (data.assignments.some(a => !subjectIds.has(a.subjectId)) || data.sessions.some(s => !subjectIds.has(s.subjectId)) || data.resources.some(r => !subjectIds.has(r.subjectId))) issue('Une référence de matière est invalide.');
  if (data.events.some(e => e.endTime <= e.startTime) || data.sessions.some(s => s.endTime <= s.startTime)) issue('Une heure de fin précède le début.');
  if (data.rules.passingGrade > data.rules.gradingScale) issue('Le seuil de validation dépasse le barème.');
  for (const rows of [data.subjects, data.assessments, data.grades, data.semesters, data.credits, data.assignments, data.sessions, data.resources]) {
    if (new Set(rows.map(r => r.id)).size !== rows.length) issue('Identifiants dupliqués.');
  }
});

export function parseWorkspace(value: unknown): Workspace {
  const result = workspaceSchema.safeParse(value);
  if (!result.success) throw new Error(`Sauvegarde invalide : ${result.error.issues[0]?.message ?? 'format non reconnu'}`);
  return result.data as Workspace;
}
