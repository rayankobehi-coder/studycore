-- ============================================================
-- STUDYCORE - Schéma de base de données PostgreSQL / Supabase
-- ============================================================

-- ---- Utilisateurs (géré par Supabase Auth) ----
-- La table auth.users est gérée automatiquement par Supabase

-- ---- Profils ----
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'TEACHER', 'CLASS_ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN')),
  level TEXT CHECK (level IN ('COLLEGE', 'LYCEE', 'BTS', 'LICENCE', 'MASTER', 'FORMATION_PRO', 'AUTRE')),
  formation_type TEXT CHECK (formation_type IN ('COLLEGE', 'LYCEE_GENERAL', 'LYCEE_TECHNO', 'LYCEE_PRO', 'BTS', 'LICENCE', 'MASTER', 'FORMATION_PRO', 'AUTRE')),
  institution_id UUID,
  class_id UUID,
  academic_year_id UUID,
  academic_goal TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Établissements ----
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'France',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Programmes académiques ----
CREATE TABLE academic_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  formation_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Années académiques ----
CREATE TABLE academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES academic_programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Niveaux ----
CREATE TABLE levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- ---- Classes ----
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT
);

-- ---- Semestres ----
CREATE TABLE semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE
);

-- ---- Unités d'enseignement (UE) ----
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  credits INTEGER DEFAULT 0,
  coefficient DECIMAL(5,2) DEFAULT 1,
  passing_grade DECIMAL(4,2) DEFAULT 10.00
);

-- ---- Matières ----
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  coefficient DECIMAL(5,2) DEFAULT 1,
  credits INTEGER DEFAULT 0,
  passing_grade DECIMAL(4,2) DEFAULT 10.00,
  eliminatory_grade DECIMAL(4,2),
  color TEXT DEFAULT '#4f46e5',
  teacher_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Évaluations ----
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'INTERROGATION', 'DEVOIR', 'DEVOIR_SURVEILLE', 'TP', 'PROJET',
    'ORAL', 'EXPOSE', 'CONTROLE_CONTINU', 'EXAMEN', 'PARTIEL',
    'EXAMEN_FINAL', 'RATTRAPAGE', 'BONUS'
  )),
  coefficient DECIMAL(5,2) DEFAULT 1,
  date DATE,
  session TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Notes ----
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  value DECIMAL(5,2) NOT NULL,
  scale DECIMAL(5,2) DEFAULT 20,
  is_simulated BOOLEAN DEFAULT FALSE,
  simulation_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Règles de notation ----
CREATE TABLE grading_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  program_id UUID REFERENCES academic_programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grading_scale DECIMAL(4,1) DEFAULT 20,
  passing_grade DECIMAL(4,2) DEFAULT 10.00,
  eliminatory_grade DECIMAL(4,2),
  rounding_mode TEXT DEFAULT 'STANDARD' CHECK (rounding_mode IN ('STANDARD', 'SUPERIOR', 'INFERIOR', 'BANKER')),
  cc_weight DECIMAL(5,2),
  exam_weight DECIMAL(5,2)
);

-- ---- Règles de validation ----
CREATE TABLE validation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  program_id UUID REFERENCES academic_programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  compensation_enabled BOOLEAN DEFAULT FALSE,
  compensation_scope TEXT DEFAULT 'SEMESTER' CHECK (compensation_scope IN ('SUBJECT', 'UNIT', 'SEMESTER', 'YEAR')),
  minimum_compensation_grade DECIMAL(4,2) DEFAULT 7.00,
  credits_enabled BOOLEAN DEFAULT FALSE,
  retake_enabled BOOLEAN DEFAULT FALSE,
  bonus_enabled BOOLEAN DEFAULT FALSE
);

-- ---- Inscriptions ----
CREATE TABLE student_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, academic_year_id)
);

-- ---- Crédits ----
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  credits_earned INTEGER DEFAULT 0,
  credits_total INTEGER DEFAULT 0,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('ACQUIRED', 'PENDING', 'FAILED', 'IN_PROGRESS')),
  validated_at TIMESTAMPTZ
);

-- ---- Transactions de crédits ----
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  credit_id UUID REFERENCES credits(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('EARNED', 'REVOKED', 'TRANSFERRED')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Emploi du temps ----
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('COURSE', 'EXAM', 'ASSIGNMENT', 'REVISION', 'PERSONAL')),
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  teacher_name TEXT,
  description TEXT,
  color TEXT DEFAULT '#4f46e5',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Devoirs ----
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  due_date DATE NOT NULL,
  coefficient DECIMAL(5,2) DEFAULT 1,
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  estimated_time INTEGER,
  priority INTEGER DEFAULT 1,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Examens ----
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  exam_date DATE NOT NULL,
  duration INTEGER,
  room TEXT,
  coefficient DECIMAL(5,2) DEFAULT 1,
  session TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Sessions d'étude ----
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  study_plan_id UUID,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Plans de révision ----
CREATE TABLE study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  priority_score DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE study_sessions ADD CONSTRAINT fk_study_plan
  FOREIGN KEY (study_plan_id) REFERENCES study_plans(id) ON DELETE CASCADE;

-- ---- Ressources ----
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('PDF', 'FICHE', 'EXERCICE', 'ANNALE', 'CORRIGE', 'VIDEO', 'LIEN')),
  file_url TEXT,
  external_url TEXT,
  description TEXT,
  level TEXT,
  academic_year TEXT,
  category_id UUID,
  downloads INTEGER DEFAULT 0,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Catégories de ressources ----
CREATE TABLE resource_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT
);

ALTER TABLE resources ADD CONSTRAINT fk_resource_category
  FOREIGN KEY (category_id) REFERENCES resource_categories(id) ON DELETE SET NULL;

-- ---- Votes de ressources ----
CREATE TABLE resource_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('UP', 'DOWN')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

-- ---- Commentaires de ressources ----
CREATE TABLE resource_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Objectifs ----
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('SUBJECT_GRADE', 'UNIT_GRADE', 'SEMESTER_GRADE', 'YEAR_GRADE', 'CREDITS', 'OVERALL')),
  target_value DECIMAL(5,2) NOT NULL,
  current_value DECIMAL(5,2),
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  semester_id UUID REFERENCES semesters(id) ON DELETE SET NULL,
  deadline DATE,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ACHIEVED', 'FAILED', 'ABANDONED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Simulations ----
CREATE TABLE simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Notifications ----
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('EXAM_SOON', 'ASSIGNMENT_SOON', 'GOAL_ACHIEVED', 'GRADE_DROP', 'CREDIT_VALIDATED', 'REVISION_REMINDER')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Groupes ----
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Membres de groupes ----
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'ADMIN')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- ---- Journal d'audit ----
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Index ----
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_institution ON profiles(institution_id);

CREATE INDEX idx_subjects_semester ON subjects(semester_id);
CREATE INDEX idx_subjects_unit ON subjects(unit_id);

CREATE INDEX idx_assessments_subject ON assessments(subject_id);

CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_subject ON grades(subject_id);
CREATE INDEX idx_grades_assessment ON grades(assessment_id);

CREATE INDEX idx_credits_student ON credits(student_id);
CREATE INDEX idx_credits_status ON credits(status);

CREATE INDEX idx_schedules_student ON schedules(student_id);
CREATE INDEX idx_schedules_date ON schedules(event_date);

CREATE INDEX idx_assignments_student ON assignments(student_id);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_assignments_due ON assignments(due_date);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

CREATE INDEX idx_resources_subject ON resources(subject_id);
CREATE INDEX idx_resources_type ON resources(type);

CREATE INDEX idx_goals_student ON goals(student_id);
CREATE INDEX idx_goals_status ON goals(status);

CREATE INDEX idx_simulations_student ON simulations(student_id);

-- ---- Row Level Security ----
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Politiques RLS : un étudiant ne voit que ses propres données
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can view own grades"
  ON grades FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own grades"
  ON grades FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own grades"
  ON grades FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Students can view own credits"
  ON credits FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can view own schedule"
  ON schedules FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can view own assignments"
  ON assignments FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can view own study sessions"
  ON study_sessions FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can view own goals"
  ON goals FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can view own simulations"
  ON simulations FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can view own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

-- ---- Fonction de mise à jour automatique de updated_at ----
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON grades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();