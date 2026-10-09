'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import {
  Calculator,
  Target,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

interface SubjectSim {
  id: string;
  name: string;
  currentAverage: number;
  coefficient: number;
  examGrade?: number;
  simulatedAverage?: number;
}

const initialSubjects: SubjectSim[] = [
  { id: '1', name: 'Algorithmique', currentAverage: 11.8, coefficient: 4 },
  { id: '2', name: 'Base de données', currentAverage: 8.5, coefficient: 3 },
  { id: '3', name: 'Réseaux', currentAverage: 13.9, coefficient: 3 },
  { id: '4', name: 'Anglais', currentAverage: 14.2, coefficient: 2 },
  { id: '5', name: 'Mathématiques', currentAverage: 7.8, coefficient: 3 },
];

export default function SimulatorPage() {
  const [subjects, setSubjects] = useState<SubjectSim[]>(initialSubjects);
  const [targetGrade, setTargetGrade] = useState<number>(10);
  const [showResults, setShowResults] = useState(false);

  const currentOverall =
    subjects.reduce((sum, s) => sum + s.currentAverage * s.coefficient, 0) /
    subjects.reduce((sum, s) => sum + s.coefficient, 0);

  const simulatedOverall = subjects.some((s) => s.simulatedAverage !== undefined)
    ? subjects.reduce((sum, s) => sum + (s.simulatedAverage ?? s.currentAverage) * s.coefficient, 0) /
      subjects.reduce((sum, s) => sum + s.coefficient, 0)
    : currentOverall;

  const handleGradeChange = (id: string, grade: number) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const simulatedAverage =
          s.currentAverage + (grade - (s.examGrade ?? 0)) * 0.4;
        return { ...s, examGrade: grade, simulatedAverage };
      })
    );
  };

  const resetSimulation = () => {
    setSubjects(initialSubjects.map((s) => ({ ...s, examGrade: undefined, simulatedAverage: undefined })));
    setShowResults(false);
  };

  const scenarios = [];
  for (let g = 0; g <= 20; g += 2) {
    const sim = subjects.map((s) => ({
      ...s,
      simulatedAverage: s.currentAverage + (g - (s.examGrade ?? 10)) * 0.4,
    }));
    const avg =
      sim.reduce((sum, s) => sum + (s.simulatedAverage ?? s.currentAverage) * s.coefficient, 0) /
      sim.reduce((sum, s) => sum + s.coefficient, 0);
    scenarios.push({ grade: g, average: avg });
  }

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulateur</h1>
          <p className="mt-1 text-gray-500">
            Teste différents scénarios sans modifier tes vraies notes
          </p>
        </div>
        <Button variant="outline" onClick={resetSimulation}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Simulation Controls */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-indigo-600" />
                Simulation &quot;What If&quot;
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {subjects.map((subject) => (
                <div key={subject.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-sm text-gray-500">
                        Actuel : {subject.currentAverage.toFixed(1)} · Coeff {subject.coefficient}
                      </p>
                    </div>
                    {subject.simulatedAverage !== undefined && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Simulé</p>
                        <p className="text-lg font-bold text-indigo-600">
                          {subject.simulatedAverage.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-500 min-w-20">
                      Note examen :
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={subject.examGrade ?? subject.currentAverage}
                      onChange={(e) => handleGradeChange(subject.id, parseFloat(e.target.value))}
                      className="flex-1 h-2 rounded-full bg-gray-200 accent-indigo-600"
                    />
                    <span className="text-sm font-semibold min-w-12 text-right">
                      {subject.examGrade ?? '—'}/20
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Scenarios Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Scénarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note examen</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moyenne finale</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {scenarios.map((scenario) => {
                      const diff = scenario.average - currentOverall;
                      const ImpactIcon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
                      const impactColor = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400';
                      return (
                        <tr key={scenario.grade}>
                          <td className="px-4 py-3 text-sm font-medium">{scenario.grade}/20</td>
                          <td className="px-4 py-3 text-sm font-semibold">{scenario.average.toFixed(2)}</td>
                          <td className={`px-4 py-3 text-sm ${impactColor}`}>
                            <ImpactIcon className="h-4 w-4 inline mr-1" />
                            {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current vs Simulated */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-indigo-600" />
                Résultats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Moyenne actuelle</p>
                <p className="text-2xl font-bold">{currentOverall.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Moyenne simulée</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {simulatedOverall.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg bg-indigo-50 p-4">
                <p className="text-sm text-indigo-700">
                  {simulatedOverall >= currentOverall
                    ? `Tu gagnerais ${(simulatedOverall - currentOverall).toFixed(2)} points !`
                    : `Tu perdrais ${(currentOverall - simulatedOverall).toFixed(2)} points.`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Goal Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-600" />
                Combien me faut-il ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Objectif</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(parseFloat(e.target.value))}
                    className="w-20 rounded-lg border px-3 py-2 text-center text-lg font-bold"
                  />
                  <span className="text-gray-500">/20</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => setShowResults(true)}>
                Calculer
              </Button>
              {showResults && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="text-sm text-green-700 font-medium">
                    🎯 Tu dois obtenir au minimum :
                  </p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {((targetGrade * 1.5 - currentOverall * 0.6) / 0.4).toFixed(2)}
                    <span className="text-sm">/20</span>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    à l&apos;examen pour atteindre {targetGrade}/20
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}