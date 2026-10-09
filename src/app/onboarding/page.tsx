'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  School,
  Target,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';

const steps = [
  { id: 'welcome', title: 'Bienvenue' },
  { id: 'profile', title: 'Profil' },
  { id: 'level', title: 'Niveau' },
  { id: 'institution', title: 'Établissement' },
  { id: 'goal', title: 'Objectif' },
  { id: 'done', title: 'Terminé' },
];

const formationTypes = [
  { id: 'COLLEGE', label: 'Collège', emoji: '🏫' },
  { id: 'LYCEE_GENERAL', label: 'Lycée général', emoji: '🎓' },
  { id: 'LYCEE_TECHNO', label: 'Lycée technologique', emoji: '🔧' },
  { id: 'LYCEE_PRO', label: 'Lycée professionnel', emoji: '🛠️' },
  { id: 'BTS', label: 'BTS', emoji: '📚' },
  { id: 'LICENCE', label: 'Licence', emoji: '🎓' },
  { id: 'MASTER', label: 'Master', emoji: '🎓' },
  { id: 'FORMATION_PRO', label: 'Formation professionnelle', emoji: '💼' },
  { id: 'AUTRE', label: 'Autre', emoji: '📖' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    formationType: '',
    institution: '',
    goal: '',
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <Sparkles className="h-8 w-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl">Bienvenue sur STUDYCORE</CardTitle>
          <p className="text-gray-500 mt-2">
            Configurons ton profil académique en quelques étapes
          </p>
          <div className="mt-6">
            <Progress value={progress} />
            <p className="text-sm text-gray-500 mt-2">
              Étape {currentStep + 1} sur {steps.length}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {/* Step indicators */}
          <div className="mb-8 flex justify-center gap-2">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`flex items-center justify-center rounded-full w-8 h-8 text-xs font-medium transition-all ${
                  i <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </div>
            ))}
          </div>

          {/* Step content */}
          {currentStep === 0 && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
                <GraduationCap className="h-12 w-12 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Prêt à gérer ton parcours académique ?
                </h2>
                <p className="text-gray-500 mt-2">
                  STUDYCORE t&apos;aide à suivre tes notes, calculer tes moyennes,
                  simuler tes résultats et organiser tes révisions.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-2xl mb-1">📊</p>
                  <p className="text-sm font-medium">Notes & Moyennes</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-2xl mb-1">🎯</p>
                  <p className="text-sm font-medium">Simulateur</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-2xl mb-1">🧠</p>
                  <p className="text-sm font-medium">Révisions</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Qui es-tu ?</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Ton prénom"
                  className="w-full rounded-lg border px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Ton nom"
                  className="w-full rounded-lg border px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Ton niveau d&apos;études</h2>
              <p className="text-sm text-gray-500">
                Choisis le type de formation que tu suis actuellement.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {formationTypes.map((ft) => (
                  <button
                    key={ft.id}
                    onClick={() =>
                      setFormData({ ...formData, formationType: ft.id })
                    }
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                      formData.formationType === ft.id
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{ft.emoji}</span>
                    <span className="font-medium">{ft.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Ton établissement</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;établissement
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) =>
                    setFormData({ ...formData, institution: e.target.value })
                  }
                  placeholder="Ex: Lycée Technique, Université..."
                  className="w-full rounded-lg border px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Ton objectif académique</h2>
              <p className="text-sm text-gray-500">
                Quel est ton objectif principal pour cette année ?
              </p>
              <div>
                <input
                  type="text"
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  placeholder="Ex: Obtenir 14/20, valider mon BTS..."
                  className="w-full rounded-lg border px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Configuration terminée !</h2>
                <p className="text-gray-500 mt-2">
                  Ton profil est prêt. Tu peux maintenant explorer STUDYCORE.
                </p>
              </div>
              <div className="rounded-lg bg-indigo-50 p-4">
                <p className="text-sm text-indigo-700">
                  🎯 Objectif : {formData.goal || 'Non défini'}
                </p>
                <p className="text-sm text-indigo-700">
                  🏫 {formData.institution || 'Établissement non défini'}
                </p>
                <p className="text-sm text-indigo-700">
                  📚{' '}
                  {formationTypes.find((f) => f.id === formData.formationType)
                    ?.label || 'Niveau non défini'}
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>
                  Terminer
                  <Check className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}