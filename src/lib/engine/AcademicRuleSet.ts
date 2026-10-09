// ============================================================
// STUDYCORE - Moteur de règles académiques
// ============================================================

import { RoundingMode } from '@/lib/types';

export interface AcademicRuleSetConfig {
  gradingScale: number;
  passingGrade: number;
  eliminatoryGrade: number | null;
  compensationEnabled: boolean;
  compensationScope: 'SUBJECT' | 'UNIT' | 'SEMESTER' | 'YEAR';
  minimumCompensationGrade: number;
  creditsEnabled: boolean;
  roundingMode: RoundingMode;
  retakeEnabled: boolean;
  bonusEnabled: boolean;
  ccWeight: number | null;
  examWeight: number | null;
}

export const DEFAULT_RULES: AcademicRuleSetConfig = {
  gradingScale: 20,
  passingGrade: 10,
  eliminatoryGrade: 7,
  compensationEnabled: true,
  compensationScope: 'SEMESTER',
  minimumCompensationGrade: 7,
  creditsEnabled: true,
  roundingMode: 'STANDARD',
  retakeEnabled: true,
  bonusEnabled: false,
  ccWeight: null,
  examWeight: null,
};

export const COLLEGE_RULES: AcademicRuleSetConfig = {
  ...DEFAULT_RULES,
  compensationEnabled: false,
  creditsEnabled: false,
  retakeEnabled: false,
};

export const LYCEE_RULES: AcademicRuleSetConfig = {
  ...DEFAULT_RULES,
  compensationEnabled: false,
  creditsEnabled: false,
  passingGrade: 10,
};

export const BTS_RULES: AcademicRuleSetConfig = {
  ...DEFAULT_RULES,
  gradingScale: 20,
  passingGrade: 10,
  eliminatoryGrade: 7,
  compensationEnabled: true,
  compensationScope: 'SEMESTER',
  minimumCompensationGrade: 7,
  creditsEnabled: true,
  roundingMode: 'STANDARD',
  retakeEnabled: true,
};

export const UNIVERSITE_RULES: AcademicRuleSetConfig = {
  ...DEFAULT_RULES,
  gradingScale: 20,
  passingGrade: 10,
  eliminatoryGrade: null,
  compensationEnabled: true,
  compensationScope: 'UNIT',
  minimumCompensationGrade: 7,
  creditsEnabled: true,
  roundingMode: 'STANDARD',
  retakeEnabled: true,
};

export class AcademicRuleSet {
  private config: AcademicRuleSetConfig;

  constructor(config: Partial<AcademicRuleSetConfig> = {}) {
    this.config = { ...DEFAULT_RULES, ...config };
  }

  getConfig(): AcademicRuleSetConfig {
    return { ...this.config };
  }

  setConfig(config: Partial<AcademicRuleSetConfig>): void {
    this.config = { ...this.config, ...config };
  }

  get gradingScale(): number {
    return this.config.gradingScale;
  }

  get passingGrade(): number {
    return this.config.passingGrade;
  }

  get eliminatoryGrade(): number | null {
    return this.config.eliminatoryGrade;
  }

  get compensationEnabled(): boolean {
    return this.config.compensationEnabled;
  }

  get compensationScope(): string {
    return this.config.compensationScope;
  }

  get minimumCompensationGrade(): number {
    return this.config.minimumCompensationGrade;
  }

  get creditsEnabled(): boolean {
    return this.config.creditsEnabled;
  }

  get roundingMode(): RoundingMode {
    return this.config.roundingMode;
  }

  get retakeEnabled(): boolean {
    return this.config.retakeEnabled;
  }

  get bonusEnabled(): boolean {
    return this.config.bonusEnabled;
  }

  isPassing(grade: number): boolean {
    return grade >= this.config.passingGrade;
  }

  isEliminatory(grade: number): boolean {
    if (this.config.eliminatoryGrade === null) return false;
    return grade < this.config.eliminatoryGrade;
  }

  canCompensate(grade: number): boolean {
    return grade >= this.config.minimumCompensationGrade;
  }

  static fromFormationType(type: string): AcademicRuleSet {
    switch (type) {
      case 'COLLEGE':
        return new AcademicRuleSet(COLLEGE_RULES);
      case 'LYCEE_GENERAL':
      case 'LYCEE_TECHNO':
      case 'LYCEE_PRO':
        return new AcademicRuleSet(LYCEE_RULES);
      case 'BTS':
        return new AcademicRuleSet(BTS_RULES);
      case 'LICENCE':
      case 'MASTER':
        return new AcademicRuleSet(UNIVERSITE_RULES);
      default:
        return new AcademicRuleSet(DEFAULT_RULES);
    }
  }
}