export interface SubjectResult {
  subject: string;
  chapter?: string;

  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;

  marksObtained: number;
  totalMarks: number;
}

export interface WrongQuestion {
  subject: string;
  chapter: string;
  reason: string;
}

export interface TestRecord {
  id: number;
  studentId: number;
  testDate: string;
  tier: 'TIER_1' | 'TIER_2';
  testType: 'FULL_TEST' | 'SECTIONAL';

  subjects: SubjectResult[];

  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;

  marksObtained: number;
  totalMarks: number;
  timeTakenMinutes: number;

  wrongQuestions: WrongQuestion[];
}