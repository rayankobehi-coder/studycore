'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  Calendar,
  BookOpen,
} from 'lucide-react';

const assignments = [
  { id: '1', title: 'Examen Algorithmique', subject: 'Algorithmique', type: 'EXAMEN', dueDate: '2026-10-11', coefficient: 4, priority: 5, status: 'PENDING' as const },
  { id: '2', title: 'Projet Base de données', subject: 'Base de données', type: 'PROJET', dueDate: '2026-10-14', coefficient: 3, priority: 4, status: 'IN_PROGRESS' as const },
  { id: '3', title: 'Présentation Anglais', subject: 'Anglais', type: 'ORAL', dueDate: '2026-10-20', coefficient: 2, priority: 2, status: 'PENDING' as const },
  { id: '4', title: 'Devoir Réseaux', subject: 'Réseaux', type: 'DEVOIR', dueDate: '2026-10-08', coefficient: 2, priority: 3, status: 'OVERDUE' as const },
  { id: '5', title: 'TP Mathématiques', subject: 'Mathématiques', type: 'TP', dueDate: '2026-10-18', coefficient: 1, priority: 1, status: 'PENDING' as const },
];

const statusConfig: Record<string, { label: string; variant: 'outline' | 'info' | 'success' | 'danger' }> = {
  PENDING: { label: 'À venir', variant: 'outline' },
  IN_PROGRESS: { label: 'En cours', variant: 'info' },
  COMPLETED: { label: 'Terminé', variant: 'success' },
  OVERDUE: { label: 'En retard', variant: 'danger' },
};

function getDaysLeft(date: string): number {
  const referenceDate = new Date('2026-10-09T00:00:00Z');
  const target = new Date(date);
  return Math.ceil((target.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AssignmentsPage() {
  const thisWeek = assignments.filter((a) => {
    const d = getDaysLeft(a.dueDate);
    return d <= 7 && d >= 0;
  }).length;

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Devoirs & Examens</h1>
          <p className="mt-1 text-gray-500">Toutes tes échéances académiques</p>
        </div>
        <Button><ClipboardList className="h-4 w-4 mr-2" />Ajouter</Button>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-4">
        <Card><CardContent className="p-6"><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold mt-1">{assignments.length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-gray-500">En retard</p><p className="text-2xl font-bold text-red-600 mt-1">{assignments.filter((a) => a.status === 'OVERDUE').length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-gray-500">Cette semaine</p><p className="text-2xl font-bold text-orange-600 mt-1">{thisWeek}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-gray-500">Priorité haute</p><p className="text-2xl font-bold text-indigo-600 mt-1">{assignments.filter((a) => a.priority >= 4).length}</p></CardContent></Card>
      </div>

      <div className="space-y-4">
        {[...assignments].sort((a, b) => b.priority - a.priority).map((assignment) => {
          const daysLeft = getDaysLeft(assignment.dueDate);
          const config = statusConfig[assignment.status];
          const isUrgent = daysLeft <= 3 && daysLeft >= 0;
          const isOverdue = daysLeft < 0;

          return (
            <Card key={assignment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2 ${isOverdue ? 'bg-red-50' : isUrgent ? 'bg-orange-50' : 'bg-gray-50'}`}>
                      <BookOpen className={`h-5 w-5 ${isOverdue ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">{assignment.subject}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-sm text-gray-500">Coeff {assignment.coefficient}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-600'}`}>
                        {isOverdue ? `En retard de ${Math.abs(daysLeft)}j` : `Dans ${daysLeft} jours`}
                      </span>
                    </div>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}