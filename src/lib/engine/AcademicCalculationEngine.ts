// ============================================================
// STUDYCORE - Moteur de calcul académique
// ============================================================

import {
  Grade,
  Assessment,
  Subject,
  Unit,
  SubjectResult,
  SubjectStatus,
  UnitResult,
  SemesterResult,
  AcademicYearResult,
  SimulationResults,
} from '@/lib/types';
import { AcademicRuleSet } from './AcademicRuleSet';

export class AcademicCalculationEngine {
  private rules: AcademicRuleSet;

  constructor(rules: AcademicRuleSet) {
    this.rules = rules;
  }

  setRules(rules: AcademicRuleSet): void {
    this.rules = rules;
  }

  // ---- Normalisation d'une note sur un barème donné ----
  normalize(value: number, fromScale: number, toScale: number = 20): number {
    if (fromScale === 0) return 0;
    return (value / fromScale) * toScale;
  }

  // ---- Arrondi selon le mode configuré ----
  round(value: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    switch (this.rules.roundingMode) {
      case 'SUPERIOR':
        return Math.ceil(value * factor) / factor;
      case 'INFERIOR':
        return Math.floor(value * factor) / factor;
      case 'BANKER':
        return Math.round(value * factor) / factor;
      case 'STANDARD':
      default:
        return Math.round(value * factor) / factor;
    }
  }

  // ---- Moyenne pondérée simple ----
  weightedAverage(
    values: { value: number; weight: number }[],
    scale: number = 20
  ): number {
    const totalWeight = values.reduce((sum, v) => sum + v.weight, 0);
    if (totalWeight === 0) return 0;
    const weightedSum = values.reduce(
      (sum, v) => sum + this.normalize(v.value, scale, 20) * v.weight,
      0
    );
    return this.round(weightedSum / totalWeight);
  }

  // ---- Calcul de la moyenne d'une matière ----
  calculateSubjectAverage(
    grades: Grade[],
    assessments: Assessment[],
    subject: Subject
  ): SubjectResult {
    const scale = this.rules.gradingScale;

    // Associer chaque note à son évaluation pour obtenir le coefficient
    const gradeEntries = grades
      .map((g) => {
        const assessment = assessments.find((a) => a.id === g.assessmentId);
        return {
          value: this.normalize(g.value, g.scale, scale),
          weight: assessment?.coefficient ?? 1,
        };
      })
      .filter((g) => !isNaN(g.value));

    const average = this.weightedAverage(gradeEntries, scale);
    const status = this.determineSubjectStatus(average);

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      average,
      scale,
      coefficient: subject.coefficient,
      credits: subject.credits,
      status,
      grades,
      assessments,
    };
  }

  // ---- Détermination du statut d'une matière ----
  private determineSubjectStatus(average: number): SubjectStatus {
    if (this.rules.isEliminatory(average)) return 'FAILED';
    if (this.rules.isPassing(average)) return 'VALIDATED';
    if (this.rules.canCompensate(average) && this.rules.compensationEnabled)
      return 'WARNING';
    if (this.rules.retakeEnabled) return 'RETAKABLE';
    return 'FAILED';
  }

  // ---- Calcul de la moyenne d'une UE ----
  calculateUnitAverage(
    subjects: SubjectResult[],
    unit: Unit
  ): UnitResult {
    const entries = subjects.map((s) => ({
      value: s.average,
      weight: s.coefficient,
    }));

    const average = this.weightedAverage(entries);
    const totalCredits = unit.credits;
    const earnedCredits = this.calculateEarnedCredits(subjects, unit);

    const status = this.determineUnitStatus(average, subjects);

    return {
      unitId: unit.id,
      unitName: unit.name,
      average,
      coefficient: unit.coefficient,
      credits: totalCredits,
      creditsEarned: earnedCredits,
      status,
      subjects,
    };
  }

  private determineUnitStatus(
    average: number,
    subjects: SubjectResult[]
  ): SubjectStatus {
    // Vérifier si une matière est éliminatoire
    const hasEliminatory = subjects.some((s) => s.status === 'FAILED');
    if (hasEliminatory) return 'FAILED';

    if (this.rules.isPassing(average)) return 'VALIDATED';
    if (this.rules.compensationEnabled && this.rules.canCompensate(average))
      return 'WARNING';
    if (this.rules.retakeEnabled) return 'RETAKABLE';
    return 'FAILED';
  }

  // ---- Calcul des crédits obtenus ----
  private calculateEarnedCredits(
    subjects: SubjectResult[],
    unit: Unit
  ): number {
    if (!this.rules.creditsEnabled) return 0;

    const allValidated = subjects.every(
      (s) => s.status === 'VALIDATED' || s.status === 'WARNING'
    );
    const average = this.weightedAverage(
      subjects.map((s) => ({ value: s.average, weight: s.coefficient }))
    );

    if (allValidated && this.rules.isPassing(average)) {
      return unit.credits;
    }

    // Compensation partielle
    if (this.rules.compensationEnabled && this.rules.canCompensate(average)) {
      return unit.credits;
    }

    return 0;
  }

  // ---- Calcul de la moyenne d'un semestre ----
  calculateSemesterAverage(
    units: UnitResult[],
    subjects: SubjectResult[]
  ): SemesterResult {
    const allEntries = [
      ...units.map((u) => ({ value: u.average, weight: u.coefficient })),
      ...subjects.map((s) => ({ value: s.average, weight: s.coefficient })),
    ];

    const average = this.weightedAverage(allEntries);
    const totalCredits = units.reduce((sum, u) => sum + u.credits, 0);
    const earnedCredits = units.reduce((sum, u) => sum + u.creditsEarned, 0);

    const hasFailed = [...units, ...subjects].some(
      (s) => s.status === 'FAILED'
    );
    const status = hasFailed
      ? 'FAILED'
      : this.rules.isPassing(average)
        ? 'VALIDATED'
        : 'RETAKABLE';

    return {
      semesterId: '',
      semesterName: '',
      average,
      totalCredits,
      earnedCredits,
      status,
      units,
      subjects,
    };
  }

  // ---- Calcul de la moyenne annuelle ----
  calculateYearAverage(semesters: SemesterResult[]): AcademicYearResult {
    const entries = semesters.map((s) => ({
      value: s.average,
      weight: 1,
    }));

    const overallAverage = this.weightedAverage(entries);
    const totalCredits = semesters.reduce((sum, s) => sum + s.totalCredits, 0);
    const earnedCredits = semesters.reduce((sum, s) => sum + s.earnedCredits, 0);

    const hasFailed = semesters.some((s) => s.status === 'FAILED');
    const status = hasFailed
      ? 'FAILED'
      : this.rules.isPassing(overallAverage)
        ? 'VALIDATED'
        : 'RETAKABLE';

    return {
      yearId: '',
      yearName: '',
      overallAverage,
      totalCredits,
      earnedCredits,
      status,
      semesters,
    };
  }

  // ---- Simulation "What If" ----
  simulateWhatIf(
    currentGrades: Grade[],
    assessments: Assessment[],
    subjects: Subject[],
    modifiedGrades: Record<string, number>
  ): SimulationResults {
    const simulatedGrades = currentGrades.map((g) => {
      if (modifiedGrades[g.assessmentId] !== undefined) {
        return { ...g, value: modifiedGrades[g.assessmentId], isSimulated: true };
      }
      return g;
    });

    const subjectResults = subjects.map((subject) => {
      const subjectGrades = simulatedGrades.filter(
        (g) => g.subjectId === subject.id
      );
      const subjectAssessments = assessments.filter(
        (a) => a.subjectId === subject.id
      );
      return this.calculateSubjectAverage(
        subjectGrades,
        subjectAssessments,
        subject
      );
    });

    const overallAverage = this.weightedAverage(
      subjectResults.map((s) => ({ value: s.average, weight: s.coefficient }))
    );

    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    const earnedCredits = subjectResults.reduce((sum, s) => {
      if (s.status === 'VALIDATED' || s.status === 'WARNING') {
        return sum + s.credits;
      }
      return sum;
    }, 0);

    const hasFailed = subjectResults.some((s) => s.status === 'FAILED');
    const status = hasFailed
      ? 'FAILED'
      : this.rules.isPassing(overallAverage)
        ? 'VALIDATED'
        : 'RETAKABLE';

    return {
      subjectAverages: Object.fromEntries(
        subjectResults.map((s) => [s.subjectId, s.average])
      ),
      unitAverages: {},
      semesterAverage: overallAverage,
      overallAverage,
      creditsEarned: earnedCredits,
      status,
    };
  }

  // ---- Calcul de la note nécessaire pour atteindre un objectif ----
  calculateRequiredGrade(
    currentGrades: Grade[],
    assessments: Assessment[],
    subject: Subject,
    targetAverage: number,
    targetAssessmentId?: string
  ): number | null {
    const scale = this.rules.gradingScale;

    // Notes actuelles
    const currentEntries = currentGrades
      .filter((g) => g.subjectId === subject.id)
      .map((g) => {
        const assessment = assessments.find((a) => a.id === g.assessmentId);
        return {
          value: this.normalize(g.value, g.scale, scale),
          weight: assessment?.coefficient ?? 1,
          assessmentId: g.assessmentId,
        };
      });

    const totalWeight = currentEntries.reduce((sum, e) => sum + e.weight, 0);
    const weightedSum = currentEntries.reduce(
      (sum, e) => sum + e.value * e.weight,
      0
    );

    // Si on cible une évaluation spécifique
    if (targetAssessmentId) {
      const targetAssessment = assessments.find(
        (a) => a.id === targetAssessmentId
      );
      if (!targetAssessment) return null;

      const targetWeight = targetAssessment.coefficient;
      const newTotalWeight = totalWeight + targetWeight;

      // Note nécessaire = (objectif * nouveau poids total - somme pondérée actuelle) / poids de l'évaluation
      const required =
        (targetAverage * newTotalWeight - weightedSum) / targetWeight;
      return this.round(Math.max(0, required), 2);
    }

    // Si on veut calculer pour toutes les évaluations restantes
    const remainingAssessments = assessments.filter(
      (a) =>
        a.subjectId === subject.id &&
        !currentEntries.some((e) => e.assessmentId === a.id)
    );

    if (remainingAssessments.length === 0) return null;

    const remainingWeight = remainingAssessments.reduce(
      (sum, a) => sum + a.coefficient,
      0
    );
    const newTotalWeight = totalWeight + remainingWeight;

    const required =
      (targetAverage * newTotalWeight - weightedSum) / remainingWeight;
    return this.round(Math.max(0, required), 2);
  }

  // ---- Génération de scénarios pour le simulateur ----
  generateScenarios(
    currentGrades: Grade[],
    assessments: Assessment[],
    subjects: Subject[],
    targetAssessmentId: string
  ): { grade: number; finalAverage: number }[] {
    const scenarios = [];
    for (let grade = 0; grade <= 20; grade += 2) {
      const results = this.simulateWhatIf(
        currentGrades,
        assessments,
        subjects,
        { [targetAssessmentId]: grade }
      );
      scenarios.push({
        grade,
        finalAverage: results.overallAverage,
      });
    }
    return scenarios;
  }
}