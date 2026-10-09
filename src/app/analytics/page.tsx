'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const subjectPerformance = [
  { name: 'Anglais', average: 16.2, trend: 'up', color: 'text-green-600', bg: 'bg-green-50' },
  { name: 'Gestion', average: 14.8, trend: 'up', color: 'text-green-600', bg: 'bg-green-50' },
  { name: 'Réseaux', average: 13.9, trend: 'up', color: 'text-green-600', bg: 'bg-green-50' },
  { name: 'Algorithmique', average: 11.8, trend: 'down', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { name: 'Base de données', average: 8.5, trend: 'down', color: 'text-red-600', bg: 'bg-red-50' },
  { name: 'Mathématiques', average: 7.8, trend: 'down', color: 'text-red-600', bg: 'bg-red-50' },
];

const evolutionData = [
  { month: 'Sept', average: 11.2 },
  { month: 'Oct', average: 12.5 },
  { month: 'Nov', average: 11.8 },
  { month: 'Déc', average: 13.2 },
  { month: 'Jan', average: 14.0 },
  { month: 'Fév', average: 13.5 },
  { month: 'Mar', average: 14.27 },
];

export default function AnalyticsPage() {
  const maxAverage = Math.max(...evolutionData.map((d) => d.average));

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-gray-500">Analyse détaillée de tes performances</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Evolution Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Évolution de la moyenne générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {evolutionData.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    {point.average.toFixed(1)}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-400 transition-all hover:from-indigo-600"
                    style={{ height: `${(point.average / maxAverage) * 100}%` }}
                  />
                  <span className="text-xs text-gray-400">{point.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Forces
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subjectPerformance
              .filter((s) => s.average >= 12)
              .map((subject) => (
                <div
                  key={subject.name}
                  className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <span className="font-bold text-green-700">
                    {subject.average.toFixed(1)}
                  </span>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Faiblesses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Faiblesses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subjectPerformance
              .filter((s) => s.average < 12)
              .map((subject) => (
                <div
                  key={subject.name}
                  className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <span className="font-bold text-red-700">
                    {subject.average.toFixed(1)}
                  </span>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Performance par matière */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Performance par matière
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectPerformance.map((subject) => (
                <div key={subject.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{subject.name}</span>
                    <span className={`text-sm font-bold ${subject.color}`}>
                      {subject.average.toFixed(1)}/20
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        subject.average >= 12
                          ? 'bg-green-500'
                          : subject.average >= 10
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${(subject.average / 20) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}