'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface AssessmentItem {
  id: string;
  name: string;
  type: string;
  grade: number;
  coefficient: number;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  coefficient: number;
  credits: number;
  average: number;
  status: 'VALIDATED' | 'WARNING' | 'FAILED' | 'RETAKABLE';
  assessments: AssessmentItem[];
}

const initialSubjects: SubjectItem[] = [
  {
    id: '1',
    name: 'Algorithmique',
    code: 'ALGO',
    coefficient: 4,
    credits: 6,
    average: 11.8,
    status: 'WARNING',
    assessments: [
      { id: 'a1', name: 'TP 1', type: 'TP', grade: 15, coefficient: 1 },
      { id: 'a2', name: 'TP 2', type: 'TP', grade: 13, coefficient: 1 },
      { id: 'a3', name: 'Devoir', type: 'DEVOIR', grade: 12, coefficient: 2 },
      { id: 'a4', name: 'Examen', type: 'EXAMEN', grade: 9.5, coefficient: 4 },
    ],
  },
  {
    id: '2',
    name: 'Base de données',
    code: 'BDD',
    coefficient: 3,
    credits: 6,
    average: 8.5,
    status: 'FAILED',
    assessments: [
      { id: 'b1', name: 'TP 1', type: 'TP', grade: 12, coefficient: 1 },
      { id: 'b2', name: 'Devoir surveillé', type: 'DEVOIR_SURVEILLE', grade: 8, coefficient: 2 },
      { id: 'b3', name: 'Examen', type: 'EXAMEN', grade: 6, coefficient: 4 },
    ],
  },
  {
    id: '3',
    name: 'Réseaux',
    code: 'RES',
    coefficient: 3,
    credits: 6,
    average: 13.9,
    status: 'VALIDATED',
    assessments: [
      { id: 'c1', name: 'TP 1', type: 'TP', grade: 14, coefficient: 1 },
      { id: 'c2', name: 'Devoir', type: 'DEVOIR', grade: 15, coefficient: 2 },
      { id: 'c3', name: 'Examen', type: 'EXAMEN', grade: 12, coefficient: 4 },
    ],
  },
  {
    id: '4',
    name: 'Anglais',
    code: 'ANG',
    coefficient: 2,
    credits: 3,
    average: 14.2,
    status: 'VALIDATED',
    assessments: [
      { id: 'd1', name: 'Interrogation', type: 'INTERROGATION', grade: 14, coefficient: 1 },
      { id: 'd2', name: 'Oral', type: 'ORAL', grade: 15, coefficient: 2 },
    ],
  },
  {
    id: '5',
    name: 'Mathématiques',
    code: 'MATH',
    coefficient: 3,
    credits: 6,
    average: 7.8,
    status: 'RETAKABLE',
    assessments: [
      { id: 'e1', name: 'Devoir', type: 'DEVOIR', grade: 7, coefficient: 2 },
      { id: 'e2', name: 'Composition', type: 'EXAMEN', grade: 8.5, coefficient: 3 },
    ],
  },
];

const statusConfig = {
  VALIDATED: { label: 'Validée', badge: 'success' as const, icon: CheckCircle2, color: 'text-green-600' },
  WARNING: { label: 'À surveiller', badge: 'warning' as const, icon: AlertTriangle, color: 'text-yellow-600' },
  FAILED: { label: 'Non validée', badge: 'danger' as const, icon: XCircle, color: 'text-red-600' },
  RETAKABLE: { label: 'Rattrapage possible', badge: 'info' as const, icon: AlertTriangle, color: 'text-blue-600' },
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>(initialSubjects);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const totalAverage =
    subjects.reduce((sum, s) => sum + s.average * s.coefficient, 0) /
    subjects.reduce((sum, s) => sum + s.coefficient, 0);

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notes & Matières</h1>
          <p className="mt-1 text-gray-500">Gérez tes matières et tes évaluations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une matière
        </Button>
      </div>

      {/* Summary */}
      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Moyenne générale</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {totalAverage.toFixed(2)}
              <span className="text-lg text-gray-400">/20</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Matières validées</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {subjects.filter((s) => s.status === 'VALIDATED').length}
              <span className="text-lg text-gray-400">/{subjects.length}</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Crédits obtenus</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">
              {subjects
                .filter((s) => s.status === 'VALIDATED' || s.status === 'WARNING')
                .reduce((sum, s) => sum + s.credits, 0)}
              <span className="text-lg text-gray-400">/27</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects */}
      <div className="space-y-6">
        {subjects.map((subject) => {
          const config = statusConfig[subject.status];
          const StatusIcon = config.icon;
          return (
            <Card key={subject.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-indigo-50 p-3">
                      <GraduationCap className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {subject.name}
                        <span className="text-sm font-normal text-gray-400">
                          {subject.code} · Coeff {subject.coefficient}
                        </span>
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${config.color}`}>
                        {subject.average.toFixed(2)}
                        <span className="text-sm text-gray-400">/20</span>
                      </p>
                    </div>
                    <Badge variant={config.badge}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                    <button
                      onClick={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
                      className="rounded-lg p-2 hover:bg-gray-100"
                    >
                      {selectedSubject === subject.id ? (
                        <span className="text-sm text-gray-500">Réduire</span>
                      ) : (
                        <span className="text-sm text-gray-500">Détails</span>
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>

              {selectedSubject === subject.id && (
                <CardContent>
                  <div className="overflow-hidden rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Évaluation</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coeff</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {subject.assessments.map((assessment) => (
                          <tr key={assessment.id}>
                            <td className="px-4 py-3 text-sm font-medium">{assessment.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{assessment.type}</td>
                            <td className="px-4 py-3 text-sm font-semibold">{assessment.grade}/20</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{assessment.coefficient}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une évaluation
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}