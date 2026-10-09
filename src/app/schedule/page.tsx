'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Plus,
} from 'lucide-react';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: 'COURSE' | 'EXAM' | 'REVISION';
  room?: string;
  teacher?: string;
  color: string;
}

interface DaySchedule {
  day: string;
  date: string;
  items: ScheduleItem[];
}

const weekSchedule: DaySchedule[] = [
  {
    day: 'Lundi',
    date: '6 octobre',
    items: [
      { id: '1', time: '08:00', title: 'Algorithmique', type: 'COURSE', room: 'B12', teacher: 'M. Dupont', color: 'border-l-indigo-500 bg-indigo-50' },
      { id: '2', time: '10:00', title: 'Base de données', type: 'COURSE', room: 'C04', teacher: 'Mme Martin', color: 'border-l-emerald-500 bg-emerald-50' },
      { id: '3', time: '14:00', title: 'Réseaux', type: 'COURSE', room: 'B08', teacher: 'M. Bernard', color: 'border-l-amber-500 bg-amber-50' },
    ],
  },
  {
    day: 'Mardi',
    date: '7 octobre',
    items: [
      { id: '4', time: '09:00', title: 'Anglais', type: 'COURSE', room: 'A11', teacher: 'Mme Petit', color: 'border-l-rose-500 bg-rose-50' },
      { id: '5', time: '11:00', title: 'Mathématiques', type: 'COURSE', room: 'B12', teacher: 'M. Dubois', color: 'border-l-purple-500 bg-purple-50' },
      { id: '6', time: '14:00', title: 'TP Algorithmique', type: 'COURSE', room: 'Labo 3', teacher: 'M. Dupont', color: 'border-l-indigo-500 bg-indigo-50' },
    ],
  },
  {
    day: 'Mercredi',
    date: '8 octobre',
    items: [
      { id: '7', time: '08:00', title: 'Réseaux', type: 'COURSE', room: 'B08', teacher: 'M. Bernard', color: 'border-l-amber-500 bg-amber-50' },
      { id: '8', time: '10:00', title: 'Révision Algorithmique', type: 'REVISION', room: 'Bibliothèque', color: 'border-l-gray-500 bg-gray-50' },
    ],
  },
  {
    day: 'Jeudi',
    date: '9 octobre',
    items: [
      { id: '9', time: '08:00', title: 'Base de données', type: 'COURSE', room: 'C04', teacher: 'Mme Martin', color: 'border-l-emerald-500 bg-emerald-50' },
      { id: '10', time: '10:00', title: 'TD Mathématiques', type: 'COURSE', room: 'B12', teacher: 'M. Dubois', color: 'border-l-purple-500 bg-purple-50' },
    ],
  },
  {
    day: 'Vendredi',
    date: '10 octobre',
    items: [
      { id: '11', time: '09:00', title: 'Algorithmique', type: 'COURSE', room: 'B12', teacher: 'M. Dupont', color: 'border-l-indigo-500 bg-indigo-50' },
      { id: '12', time: '11:00', title: 'Anglais - Oral', type: 'EXAM', room: 'A11', teacher: 'Mme Petit', color: 'border-l-red-500 bg-red-50' },
    ],
  },
];

const typeBadge = {
  COURSE: { label: 'Cours', variant: 'info' as const },
  EXAM: { label: 'Examen', variant: 'danger' as const },
  REVISION: { label: 'Révision', variant: 'outline' as const },
};

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(0);

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emploi du temps</h1>
          <p className="mt-1 text-gray-500">Semaine du {weekSchedule[0].date}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">S{Math.abs(currentWeek) + 1}</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {weekSchedule.map((day) => (
          <Card key={day.day}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {day.day}
                <span className="block text-sm font-normal text-gray-500">{day.date}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {day.items.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Aucun cours</p>
              ) : (
                day.items.map((item) => {
                  const badge = typeBadge[item.type];
                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg border-l-4 p-3 ${item.color}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                        <span className="text-xs text-gray-500">{item.time}</span>
                      </div>
                      <p className="font-medium text-sm">{item.title}</p>
                      {item.room && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {item.room}
                        </div>
                      )}
                      {item.teacher && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <User className="h-3 w-3" />
                          {item.teacher}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}