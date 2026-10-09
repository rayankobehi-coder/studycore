'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  School,
  GraduationCap,
  Calendar,
  Target,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
        <p className="mt-1 text-gray-500">Gère ton profil et tes paramètres</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
              <span className="text-3xl font-bold text-indigo-600">R</span>
            </div>
            <h2 className="text-xl font-bold">Rayan</h2>
            <p className="text-sm text-gray-500">Étudiant BTS Informatique</p>
            <div className="mt-4 flex justify-center gap-2">
              <Badge variant="info">BTS</Badge>
              <Badge variant="success">Actif</Badge>
            </div>
            <Button className="mt-6 w-full">
              <Settings className="h-4 w-4 mr-2" />
              Modifier le profil
            </Button>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">rayan@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <School className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Établissement</p>
                <p className="font-medium">Lycée Technique</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <GraduationCap className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Formation</p>
                <p className="font-medium">BTS Informatique</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Année académique</p>
                <p className="font-medium">2026-2027</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Target className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Objectif académique</p>
                <p className="font-medium">14/20 - Obtenir 60 crédits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}