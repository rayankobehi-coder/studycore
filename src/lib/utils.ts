import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatTime(date: string): string {
  return new Date(`2000-01-01T${date}`).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDaysUntil(date: string): number {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'VALIDATED':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'WARNING':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'FAILED':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'RETAKABLE':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'PENDING':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'VALIDATED':
      return 'Validée';
    case 'WARNING':
      return 'À surveiller';
    case 'FAILED':
      return 'Non validée';
    case 'RETAKABLE':
      return 'Rattrapage possible';
    case 'PENDING':
      return 'En attente';
    default:
      return status;
  }
}

export function getAssessmentTypeLabel(type: string): string {
  switch (type) {
    case 'INTERROGATION':
      return 'Interrogation';
    case 'DEVOIR':
      return 'Devoir';
    case 'DEVOIR_SURVEILLE':
      return 'Devoir surveillé';
    case 'TP':
      return 'TP';
    case 'PROJET':
      return 'Projet';
    case 'ORAL':
      return 'Oral';
    case 'EXPOSE':
      return 'Exposé';
    case 'CONTROLE_CONTINU':
      return 'Contrôle continu';
    case 'EXAMEN':
      return 'Examen';
    case 'PARTIEL':
      return 'Partiel';
    case 'EXAMEN_FINAL':
      return 'Examen final';
    case 'RATTRAPAGE':
      return 'Rattrapage';
    case 'BONUS':
      return 'Bonus';
    default:
      return type;
  }
}

export function getPriorityColor(priority: number): string {
  if (priority >= 4) return 'text-red-600 bg-red-50';
  if (priority >= 3) return 'text-orange-600 bg-orange-50';
  if (priority >= 2) return 'text-yellow-600 bg-yellow-50';
  return 'text-green-600 bg-green-50';
}

export function getPriorityLabel(priority: number): string {
  if (priority >= 4) return '🔥 Priorité 1';
  if (priority >= 3) return '🔥 Priorité 2';
  if (priority >= 2) return '🟢 Priorité 3';
  return '🟢 Priorité 4';
}