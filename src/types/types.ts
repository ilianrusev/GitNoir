// ── Case & Step ──────────────────────────────────────────────

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type DifficultyKey = "beginner" | "intermediate" | "advanced";

export interface Step {
  instruction: string;
  narrative: string;
  expected_commands: string[];
  hint: string;
  points: number;
  terminal_output_by_command?: Record<string, string | string[]>;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  total_points: number;
  story_intro: string;
  created_at?: string;
  steps: Step[];
}

// ── User & Progress ──────────────────────────────────────────

export interface CaseProgressEntry {
  current_step: number;
  completed_steps: number[];
  earned_points: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  reputation: number;
  completed_cases: string[];
  case_progress: Record<string, CaseProgressEntry>;
  created_at: string;
  is_guest: boolean;
}

export interface UserProgress {
  user_id: string;
  reputation: number;
  completed_cases: string[];
  case_progress: Record<string, CaseProgressEntry>;
}

// ── Game ─────────────────────────────────────────────────────

export interface ValidateCommandResult {
  is_correct: boolean;
  feedback: string;
  points_earned: number;
  next_step: number | null;
  next_step_narrative: string | null;
  next_step_instruction: string | null;
  case_completed: boolean;
}

export type CaseStatus = "completed" | "in_progress" | "unlocked" | "locked";

// ── Leaderboard ──────────────────────────────────────────────

export interface LeaderboardEntry {
  user_id: string | null;
  username: string;
  reputation: number;
  cases_solved: number;
  rank?: number;
}

export interface LeaderboardPageResult {
  entries: LeaderboardEntry[];
  nextCursor: unknown;
  hasMore: boolean;
}

// ── Unlock Progression ───────────────────────────────────────

export type TierCounts = Record<DifficultyKey, number>;

export interface TierPosition {
  difficultyKey: DifficultyKey;
  position: number | null;
}

export interface UnlockRequirements {
  difficultyKey: DifficultyKey;
  position: number | null;
  remaining: number | null;
  requiredDifficulty: DifficultyKey | null;
  unlocked: boolean;
}

// ── Auth Context ─────────────────────────────────────────────

export interface GoogleLoginResult {
  user: User;
  isNewUser: boolean;
}

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<User>;
  loginWithGoogle: () => Promise<GoogleLoginResult | null>;
  logout: () => Promise<void>;
  refreshUser: () => User | null;
}
