import { AcademicCalculationEngine } from '@/lib/engine/AcademicCalculationEngine';
import { AcademicRuleSet } from '@/lib/engine/AcademicRuleSet';
import type { AcademicGoal, Workspace } from './types';
import type { SubjectResult, Subject, Assessment, Grade, ScheduleEvent, Notification } from '@/lib/types';
import { daysUntil, minutes, timeFromMinutes, dateKey } from './dates';

export function getEngine(data: Workspace) { return new AcademicCalculationEngine(new AcademicRuleSet(data.rules)); }
export function getSubjectResults(data: Workspace, semesterId = data.activeSemesterId): SubjectResult[] {
  const engine = getEngine(data);
  return data.subjects.filter(s => semesterId === 'all' || s.semesterId === semesterId).map(subject => {
    const grades = data.grades.filter(g => g.subjectId === subject.id && !g.isSimulated);
    const result = engine.calculateSubjectAverage(grades, data.assessments.filter(a => a.subjectId === subject.id), subject);
    return grades.length ? result : { ...result, status: 'PENDING' as const };
  });
}
export function getSummary(data: Workspace, semesterId = data.activeSemesterId) {
  const results = getSubjectResults(data, semesterId);
  const graded = results.filter(r => r.grades.length > 0);
  const average = getEngine(data).weightedAverage(graded.map(r => ({ value: r.average, weight: r.coefficient })));
  const ids = new Set(results.map(r => r.subjectId));
  const credits = data.credits.filter(c => c.subjectId && ids.has(c.subjectId));
  return {
    results, average, hasGrades: graded.length > 0,
    validated: results.filter(r => r.status === 'VALIDATED').length,
    earnedCredits: credits.reduce((sum, c) => sum + c.creditsEarned, 0),
    totalCredits: credits.reduce((sum, c) => sum + c.creditsTotal, 0),
    pendingCredits: credits.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.creditsTotal - c.creditsEarned, 0),
  };
}
export function getEvolution(data: Workspace, subjectId?: string) {
  const assessments = data.assessments.filter(a => (!subjectId || a.subjectId === subjectId) && data.grades.some(g => g.assessmentId === a.id));
  const dates = [...new Set(assessments.map(a => a.date))].sort();
  return dates.map(date => {
    const ids = new Set(assessments.filter(a => a.date <= date).map(a => a.id));
    const snapshot = { ...data, grades: data.grades.filter(g => ids.has(g.assessmentId)) };
    const value = subjectId ? getSubjectResults(snapshot, 'all').find(r => r.subjectId === subjectId)?.average ?? 0 : getSummary(snapshot).average;
    return { label: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`)), value, date };
  });
}
export function getGoalProgress(goal: AcademicGoal, data: Workspace) {
  const summary = getSummary(data, goal.semesterId || 'all');
  const current = goal.type === 'CREDITS' ? summary.earnedCredits : goal.type === 'SUBJECT_GRADE' ? summary.results.find(r => r.subjectId === goal.subjectId)?.average ?? 0 : goal.type === 'UNIT_GRADE' ? getEngine(data).weightedAverage(summary.results.filter(r => data.subjects.find(s => s.id === r.subjectId)?.unitId === goal.unitId).map(r => ({ value: r.average, weight: r.coefficient }))) : summary.average;
  const percent = goal.targetValue > 0 ? Math.min(100, (current / goal.targetValue) * 100) : 0;
  const achieved = current >= goal.targetValue;
  return { current, percent, achieved, status: goal.status === 'ABANDONED' ? 'ABANDONED' : achieved ? 'ACHIEVED' : goal.deadline && daysUntil(goal.deadline) < 0 ? 'FAILED' : 'ACTIVE' };
}
/** Simulate a new assessment through the existing engine, never through real grades. */
export function simulateSubject(data: Workspace, subject: Subject, nextGrade: number, coefficient = 4, target = 10) {
  const engine = getEngine(data);
  const assessment: Assessment = { id: `virtual-${subject.id}`, subjectId: subject.id, name: 'Prochaine évaluation (simulation)', type: 'EXAMEN', coefficient, date: dateKey(), createdAt: '', updatedAt: '' };
  const currentGrades = data.grades.filter(g => g.subjectId === subject.id && !g.isSimulated);
  const assessments = [...data.assessments.filter(a => a.subjectId === subject.id), assessment];
  const virtualGrade: Grade = { id: `virtual-grade-${subject.id}`, assessmentId: assessment.id, subjectId: subject.id, studentId: 'simulation', value: 0, scale: data.rules.gradingScale, isSimulated: true, createdAt: '', updatedAt: '' };
  const result = engine.simulateWhatIf([...currentGrades, virtualGrade], assessments, [subject], { [assessment.id]: nextGrade });
  const required = engine.calculateRequiredGrade(currentGrades, assessments, subject, target, assessment.id);
  return { average: result.overallAverage, required, feasible: required !== null && required <= data.rules.gradingScale, assessment };
}
export function simulateSemester(data: Workspace, nextGrades: Record<string, number>, coefficient = 4) {
  const subjects = data.subjects.filter(s => data.activeSemesterId === 'all' || s.semesterId === data.activeSemesterId);
  const outcomes = subjects.map(s => ({ subject: s, ...simulateSubject(data, s, nextGrades[s.id] ?? 10, coefficient) }));
  return { outcomes, average: getEngine(data).weightedAverage(outcomes.map(o => ({ value: o.average, weight: o.subject.coefficient }))) };
}
export function getUpcomingAssignments(data: Workspace) {
  return data.assignments.filter(a => a.status !== 'COMPLETED').sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}
export function getRevisionPriorities(data: Workspace) {
  const results = getSubjectResults(data);
  return results.map(result => {
    const next = getUpcomingAssignments(data).find(a => a.subjectId === result.subjectId);
    const urgency = next ? Math.max(0, 14 - Math.max(0, daysUntil(next.dueDate))) : 0;
    // Study suggestions only. Does not affect academic validation or credit rules.
    const score = urgency + (next?.priority ?? 0) * 2 + result.coefficient + Math.max(0, data.rules.passingGrade - result.average);
    return { ...result, next, score };
  }).sort((a, b) => b.score - a.score);
}
export function getCalendarEvents(data: Workspace): ScheduleEvent[] {
  const exams: ScheduleEvent[] = data.assignments.filter(a => ['EXAMEN', 'PARTIEL', 'EXAMEN_FINAL', 'RATTRAPAGE'].includes(a.type) && a.status !== 'COMPLETED').map(a => {
    const startTime = a.dueDate.includes('T') ? a.dueDate.slice(11, 16) : '09:00';
    return { id: `assignment:${a.id}`, subjectId: a.subjectId, studentId: a.studentId, title: a.title, type: 'EXAM', date: a.dueDate.slice(0, 10), startTime, endTime: timeFromMinutes(Math.min(23 * 60 + 59, minutes(startTime) + (a.estimatedTime || 90))), room: 'À confirmer', description: 'Synchronisé depuis tes échéances.' };
  });
  const revisions: ScheduleEvent[] = data.sessions.map(s => ({ id: `session:${s.id}`, subjectId: s.subjectId, studentId: s.studentId, title: `Révision · ${data.subjects.find(subject => subject.id === s.subjectId)?.name ?? 'Session'}`, type: 'REVISION', date: s.date, startTime: s.startTime, endTime: s.endTime, description: s.notes }));
  return [...data.events, ...exams, ...revisions].sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
}
export function getNotifications(data: Workspace): Notification[] {
  const generated: Notification[] = [];
  if (data.preferences.examReminders) getUpcomingAssignments(data).filter(a => daysUntil(a.dueDate) >= 0 && daysUntil(a.dueDate) <= 7).forEach(a => generated.push({ id: `due:${a.id}`, userId: 'local', type: a.type === 'EXAMEN' ? 'EXAM_SOON' : 'ASSIGNMENT_SOON', title: a.type === 'EXAMEN' ? 'Un examen approche' : 'Une échéance à préparer', message: `${a.title} · ${daysUntil(a.dueDate) === 0 ? 'aujourd’hui' : `dans ${daysUntil(a.dueDate)} jours`}`, read: false, link: '/assignments', createdAt: a.createdAt }));
  if (data.preferences.goalUpdates) data.goals.filter(g => getGoalProgress(g, data).achieved).forEach(g => generated.push({ id: `goal:${g.id}`, userId: 'local', type: 'GOAL_ACHIEVED', title: 'Objectif atteint, bravo !', message: g.title, read: false, link: '/goals', createdAt: g.createdAt }));
  if (data.preferences.revisionReminders) data.sessions.filter(s => s.date === dateKey() && !s.completed).forEach(s => generated.push({ id: `revision:${s.id}`, userId: 'local', type: 'REVISION_REMINDER', title: 'Ton rendez-vous avec la progression', message: `${data.subjects.find(subject => subject.id === s.subjectId)?.name} · ${s.startTime}`, read: false, link: '/study-planner', createdAt: `${s.date}T00:00:00` }));
  const generatedIds = new Set(generated.map(n => n.id));
  return [...generated.map(n => ({ ...n, read: data.notifications.find(saved => saved.id === n.id)?.read ?? false })), ...data.notifications.filter(n => !n.id.includes(':') && !generatedIds.has(n.id))].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
