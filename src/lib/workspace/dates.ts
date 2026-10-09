/** Local date helpers: ISO date-only strings are never interpreted as UTC. */
export function dateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function parseDate(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}
export function addDays(value: string | Date, days: number): Date {
  const result = typeof value === 'string' ? parseDate(value) : new Date(value);
  result.setDate(result.getDate() + days);
  return result;
}
export function daysUntil(value: string, today: Date = new Date()): number {
  const target = parseDate(value);
  const start = parseDate(dateKey(today));
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}
export function countdown(value: string): string {
  const days = daysUntil(value);
  if (days < 0) return `En retard de ${Math.abs(days)} j`;
  if (days === 0) return "Aujourd’hui";
  if (days === 1) return 'Demain';
  return `Dans ${days} jours`;
}
export function formatDate(value: string | Date, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }): string {
  return new Intl.DateTimeFormat('fr-FR', options).format(typeof value === 'string' ? parseDate(value) : value);
}
export function mondayOf(date: Date): Date {
  return addDays(date, -((date.getDay() + 6) % 7));
}
export function minutes(time: string): number {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
}
export function timeFromMinutes(value: number): string {
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}
export function number(value: number, decimals = 2): string {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}
export function uid(): string { return crypto.randomUUID(); }
