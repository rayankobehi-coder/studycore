'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Target,
  BookOpen,
  Award,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bonjour Rayan 👋</h1>
        <p className="mt-1 text-gray-500">Voici ton état académique</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Moyenne générale</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">14.27</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+0.8</span>
                </div>
              </div>
              <div className="rounded-full bg-indigo-50 p-3">
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Crédits</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">42/60</p>
                <Progress value={70} className="mt-2" />
              </div>
              <div className="rounded-full bg-green-50 p-3">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Assiduité</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">86%</p>
                <Progress value={86} className="mt-2" />
              </div>
              <div className="rounded-full bg-blue-50 p-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Objectif</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">14/20</p>
                <Progress value={82} className="mt-2" />
              </div>
              <div className="rounded-full bg-yellow-50 p-3">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Évolution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Évolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {[12.5, 13.2, 12.8, 13.5, 14.0, 13.7, 14.27].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">{val.toFixed(1)}</span>
                  <div
                    className="w-full rounded-t-md bg-indigo-500 transition-all"
                    style={{ height: `${(val / 20) * 100}%` }}
                  />
                  <span className="text-xs text-gray-400">S{i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* À surveiller */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              À surveiller
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-800">Base de données</p>
                  <p className="text-sm text-red-600">Moyenne : 8.5/20 · Coeff 3</p>
                </div>
                <Badge variant="danger">Non validée</Badge>
              </div>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-yellow-800">Algorithmique</p>
                  <p className="text-sm text-yellow-600">Moyenne : 9.2/20 · Coeff 4</p>
                </div>
                <Badge variant="warning">À risque</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prochains examens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Prochains examens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-50 p-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">Algorithmique</p>
                  <p className="text-sm text-gray-500">Dans 3 jours</p>
                </div>
              </div>
              <Badge variant="danger">Exam</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-50 p-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">Réseaux</p>
                  <p className="text-sm text-gray-500">Dans 8 jours</p>
                </div>
              </div>
              <Badge variant="warning">Exam</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-50 p-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Anglais</p>
                  <p className="text-sm text-gray-500">Dans 14 jours</p>
                </div>
              </div>
              <Badge variant="success">Oral</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Objectif */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              Objectif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Tu vises 14/20</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progression</span>
                  <span className="font-medium">82%</span>
                </div>
                <Progress value={82} className="mt-1" />
              </div>
            </div>
            <div className="rounded-lg bg-indigo-50 p-4">
              <p className="text-sm text-indigo-700">
                Il te reste 4 évaluations cette session. Tu dois maintenir une moyenne
                d&apos;au moins 13.5 pour atteindre ton objectif.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}