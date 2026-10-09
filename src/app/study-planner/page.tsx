'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Clock,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const prioritySubjects = [
  {
    id: '1',
    name: 'Réseaux',
    average: 7.8,
    coefficient: 3,
    examDate: '2026-10-14',
    priority: 5,
    reason: 'Moyenne faible · Examen dans 6 jours · Coeff 3',
  },
  {
    id: '2',
    name: 'Algorithmique',
    average: 9.4,
    coefficient: 4,
    examDate: '2026-10-11',
    priority: 4,
    reason: 'Moyenne à risque · Examen dans 3 jours · Coeff 4',
  },
  {
    id: '3',
    name: 'Base de données',
    average: 8.5,
    coefficient: 3,
    examDate: '2026-10-18',
    priority: 3,
    reason: 'Moyenne faible · Examen dans 10 jours · Coeff 3',
  },
  {
    id: '4',
    name: 'Anglais',
    average: 14.2,
    coefficient: 2,
    examDate: '2026-10-20',
    priority: 2,
    reason: 'Moyenne bonne · Examen dans 12 jours · Coeff 2',
  },
];

const studyPlan = [
  { time: '18h00 - 19h00', subject: 'Réseaux', focus: 'Révision des concepts clés' },
  { time: '19h15 - 20h15', subject: 'Algorithmique', focus: 'Exercices sur les graphes' },
  { time: '20h30 - 21h00', subject: 'Anglais', focus: 'Vocabulaire technique' },
];

export default function StudyPlannerPage() {
  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planificateur de révisions</h1>
          <p className="mt-1 text-gray-500">
            Priorise tes révisions selon l&apos;urgence et l&apos;importance
          </p>
        </div>
        <Button>
          <Sparkles className="h-4 w-4 mr-2" />
          Générer un plan
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Priority List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                Priorités de révision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {prioritySubjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className={`rounded-lg border p-4 ${
                    index === 0
                      ? 'border-red-200 bg-red-50'
                      : index === 1
                        ? 'border-orange-200 bg-orange-50'
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {index === 0 ? '🔥' : index === 1 ? '🔥' : '🟢'}
                      </span>
                      <span className="font-semibold">
                        Priorité {index + 1}
                      </span>
                    </div>
                    <Badge
                      variant={
                        index === 0
                          ? 'danger'
                          : index === 1
                            ? 'warning'
                            : 'success'
                      }
                    >
                      {subject.name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Moyenne : {subject.average}/20 · Coeff {subject.coefficient}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {subject.reason}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {subject.average.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">/20</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Plan du jour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyPlan.map((session, index) => (
                <div key={index} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-indigo-600">
                      {session.time}
                    </span>
                    <Badge variant="outline">{session.subject}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{session.focus}</p>
                </div>
              ))}
              <div className="rounded-lg bg-indigo-50 p-3">
                <p className="text-xs text-indigo-700">
                  🎯 Temps total : 3h de révision aujourd&apos;hui
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sessions cette semaine</span>
                  <span className="font-medium">5/7</span>
                </div>
                <Progress value={71} className="mt-1" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Objectif journalier</span>
                  <span className="font-medium">3h/4h</span>
                </div>
                <Progress value={75} className="mt-1" />
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-sm text-green-700">
                  ✅ 12 sessions complétées ce mois-ci
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}