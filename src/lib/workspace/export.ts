import type { Workspace } from './types';
import { getSubjectResults } from './selectors';
import { dateKey } from './dates';

export function download(content: string, name: string, mime = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const link = document.createElement('a');
  link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function exportWorkspace(data: Workspace) { download(JSON.stringify(data, null, 2), `studycore-sauvegarde-${dateKey()}.json`, 'application/json'); }
export function exportGrades(data: Workspace) {
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const lines = [['Matière', 'Évaluation', 'Type', 'Date', 'Note', 'Barème', 'Coefficient'].map(escape).join(';')];
  for (const grade of data.grades) {
    const assessment = data.assessments.find(a => a.id === grade.assessmentId);
    lines.push([data.subjects.find(s => s.id === grade.subjectId)?.name ?? '', assessment?.name ?? '', assessment?.type ?? '', assessment?.date ?? '', grade.value, grade.scale, assessment?.coefficient ?? 1].map(escape).join(';'));
  }
  download(`\uFEFF${lines.join('\r\n')}`, `studycore-notes-${dateKey()}.csv`, 'text/csv;charset=utf-8');
}
export function exportReport(data: Workspace) {
  const results = getSubjectResults(data);
  download(`# STUDYCORE — Bilan personnel\n\nRésultats indicatifs, non officiels.\n\n${results.map(r => `- ${r.subjectName} : ${r.grades.length ? r.average.toFixed(2) : 'Sans note'} / ${r.scale} (coefficient ${r.coefficient})`).join('\n')}\n`, `studycore-bilan-${dateKey()}.md`, 'text/markdown;charset=utf-8');
}
