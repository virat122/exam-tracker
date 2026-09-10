import { Injectable } from '@angular/core';
import data from './../../mockdata.json'

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

@Injectable({
  providedIn: 'root'
})
export class MockData {

  tests: TestRecord[] = data.tests as TestRecord[];
  // [


  //   // Full Test
  //   {
  //     id: 1,
  //     studentId: 1,
  //     testDate: '2026-09-08',

  //     tier: 'TIER_1',
  //     testType: 'FULL_TEST',

  //     subjects: [
  //       {
  //         subject: 'Quantitative Aptitude',
  //         totalQuestions: 25,
  //         attempted: 22,
  //         correct: 18,
  //         incorrect: 4,
  //         unattempted: 3,
  //         marksObtained: 36,
  //         totalMarks: 50
  //       },
  //       {
  //         subject: 'Reasoning',
  //         totalQuestions: 25,
  //         attempted: 23,
  //         correct: 20,
  //         incorrect: 3,
  //         unattempted: 2,
  //         marksObtained: 40,
  //         totalMarks: 50
  //       },
  //       {
  //         subject: 'English',
  //         totalQuestions: 25,
  //         attempted: 21,
  //         correct: 18,
  //         incorrect: 3,
  //         unattempted: 4,
  //         marksObtained: 36,
  //         totalMarks: 50
  //       },
  //       {
  //         subject: 'General Awareness',
  //         totalQuestions: 25,
  //         attempted: 18,
  //         correct: 12,
  //         incorrect: 6,
  //         unattempted: 7,
  //         marksObtained: 24,
  //         totalMarks: 50
  //       }
  //     ],

  //     totalQuestions: 100,
  //     attempted: 84,
  //     correct: 68,
  //     incorrect: 16,
  //     unattempted: 16,

  //     marksObtained: 136,
  //     totalMarks: 200,

  //     timeTakenMinutes: 58
  //   },

  //   // Sectional Test
  //   {
  //     id: 2,
  //     studentId: 1,
  //     testDate: '2026-09-07',

  //     tier: 'TIER_1',
  //     testType: 'SECTIONAL',

  //     subjects: [
  //       {
  //         subject: 'Quantitative Aptitude',
  //         chapter: 'Percentage',

  //         totalQuestions: 25,
  //         attempted: 22,
  //         correct: 18,
  //         incorrect: 4,
  //         unattempted: 3,

  //         marksObtained: 36,
  //         totalMarks: 50
  //       }
  //     ],

  //     totalQuestions: 25,
  //     attempted: 22,
  //     correct: 18,
  //     incorrect: 4,
  //     unattempted: 3,

  //     marksObtained: 36,
  //     totalMarks: 50,

  //     timeTakenMinutes: 18
  //   }

  // ];


  getTestById(id: number): TestRecord | undefined {
    return this.tests.find(test => test.id === id);
  }
  getTestsByStudent(studentId: number): TestRecord[] {
  return this.tests.filter(
    test => test.studentId === studentId
  );
}

addTest(test: TestRecord): void {
  this.tests.push(test);
}
}