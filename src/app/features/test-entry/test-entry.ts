import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import { MockData, TestRecord } from '../../core/services/mock-data';

import { ThemeService } from '../../core/services/theme.service';


interface SubjectMark {
  subject: string;
  marksObtained: number;
  totalMarks: number;
}


interface WrongQuestion {
  subject: string;
  chapter: string;
  reason: string;
  notes?: string;
}


@Component({

  selector: 'app-test-entry',

  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],

  templateUrl: './test-entry.html',

  styleUrl: './test-entry.css',

})


export class TestEntry implements OnInit {

  studentName = 'Student';

  testDate = new Date().toISOString().slice(0, 10);

  tier: 'TIER_1' | 'TIER_2' = 'TIER_1';

  testType: 'FULL_TEST' | 'SECTIONAL' = 'FULL_TEST';

  subject = 'Quantitative Aptitude';

  totalQuestions = 100;

  attempted = 0;

  correct = 0;

  timeTakenMinutes = 60;

  error = '';


  // -------------------------
  // SUBJECTS
  // -------------------------

  subjects = [
    'Quantitative Aptitude',
    'Reasoning',
    'English',
    'General Awareness'
  ];


  // -------------------------
  // SUBJECT MARKS
  // -------------------------

  subjectMarks: SubjectMark[] = [];


  // -------------------------
  // WRONG QUESTIONS
  // -------------------------

  wrongQuestions: WrongQuestion[] = [];

  wrongSubject = '';

  wrongChapter = '';

  wrongReason = '';

  wrongNotes = '';


  // -------------------------
  // MISTAKE TYPES
  // -------------------------

  reasons = [
    'Concept not clear',
    'Calculation mistake',
    'Silly mistake',
    'Time pressure',
    'Guessing'
  ];


  // -------------------------
  // CHAPTERS
  // -------------------------

  chapters: { [key: string]: string[] } = {

    'Quantitative Aptitude': [
      'Percentage',
      'Profit and Loss',
      'Ratio and Proportion',
      'Average',
      'Time and Work',
      'Time Speed Distance',
      'Simple Interest',
      'Compound Interest',
      'Algebra',
      'Geometry',
      'Mensuration',
      'Number System',
      'Data Interpretation'
    ],

    'Reasoning': [
      'Coding Decoding',
      'Analogy',
      'Classification',
      'Series',
      'Blood Relation',
      'Direction Sense',
      'Syllogism',
      'Venn Diagram',
      'Statement and Conclusion',
      'Puzzle',
      'Seating Arrangement',
      'Non Verbal Reasoning'
    ],

    'English': [
      'Error Detection',
      'Fill in the Blanks',
      'Synonyms',
      'Antonyms',
      'Idioms and Phrases',
      'One Word Substitution',
      'Sentence Improvement',
      'Active Passive',
      'Direct Indirect Speech',
      'Reading Comprehension',
      'Cloze Test',
      'Vocabulary'
    ],

    'General Awareness': [
      'Indian Polity',
      'Indian History',
      'Geography',
      'Economics',
      'Physics',
      'Chemistry',
      'Biology',
      'Current Affairs',
      'Static GK',
      'Environment'
    ]

  };


  constructor(
    private data: MockData,
    private router: Router,
    public theme: ThemeService
  ) {}


  ngOnInit(): void {

    this.studentName =
      sessionStorage.getItem('loggedInStudentName')
      || 'Student';

    this.initializeSubjectMarks();

  }


  // -------------------------
  // SUBJECT MARK INITIALIZATION
  // -------------------------

  initializeSubjectMarks(): void {

    if (this.testType === 'FULL_TEST') {

      this.subjectMarks = this.subjects.map(subject => ({

        subject: subject,

        marksObtained: 0,

        totalMarks: 50

      }));

    } else {

      this.subjectMarks = [{

        subject: this.subject,

        marksObtained: 0,

        totalMarks: 50

      }];

    }

  }


  // -------------------------
  // TEST TYPE CHANGE
  // -------------------------

  onTestTypeChange(): void {

    this.wrongQuestions = [];

    this.wrongSubject = '';

    this.wrongChapter = '';

    this.wrongReason = '';

    this.wrongNotes = '';

    this.initializeSubjectMarks();

  }


  // -------------------------
  // SECTIONAL SUBJECT CHANGE
  // -------------------------

  onSubjectChange(): void {

    this.initializeSubjectMarks();

    this.wrongSubject = this.subject;

    this.wrongChapter = '';

  }


  // -------------------------
  // CHAPTERS FOR SELECTED SUBJECT
  // -------------------------

  getChaptersForSubject(): string[] {

    if (!this.wrongSubject) {
      return [];
    }

    return this.chapters[this.wrongSubject] || [];

  }


  // -------------------------
  // CALCULATED VALUES
  // -------------------------

  get incorrect(): number {

    return Math.max(
      this.attempted - this.correct,
      0
    );

  }


  get unattempted(): number {

    return Math.max(
      this.totalQuestions - this.attempted,
      0
    );

  }


  get accuracy(): number {

    return this.attempted
      ? Math.round(
          (this.correct / this.attempted) * 100
        )
      : 0;

  }


  // -------------------------
  // TOTAL MARKS
  // -------------------------

  get totalMarksObtained(): number {

    return this.subjectMarks.reduce(
      (total, item) =>
        total + Number(item.marksObtained || 0),
      0
    );

  }


  get totalPossibleMarks(): number {

    return this.subjectMarks.reduce(
      (total, item) =>
        total + Number(item.totalMarks || 0),
      0
    );

  }


  // -------------------------
  // ADD WRONG QUESTION
  // -------------------------

  addWrongQuestion(): void {

    this.error = '';


    if (!this.wrongSubject) {

      this.error =
        'Please select a subject for the wrong question.';

      return;

    }


    if (!this.wrongChapter) {

      this.error =
        'Please select a chapter.';

      return;

    }


    if (!this.wrongReason) {

      this.error =
        'Please select the mistake type.';

      return;

    }


    this.wrongQuestions.push({

      subject: this.wrongSubject,

      chapter: this.wrongChapter,

      reason: this.wrongReason,

      notes: this.wrongNotes.trim()
        ? this.wrongNotes.trim()
        : undefined

    });


    // Clear question-specific fields

    this.wrongChapter = '';

    this.wrongReason = '';

    this.wrongNotes = '';


    // For full test user selects subject
    // for every wrong question

    if (this.testType === 'FULL_TEST') {

      this.wrongSubject = '';

    }

  }


  // -------------------------
  // REMOVE WRONG QUESTION
  // -------------------------

  removeWrongQuestion(index: number): void {

    this.wrongQuestions.splice(index, 1);

  }


  // -------------------------
  // SAVE
  // -------------------------

  save(): void {

    this.error = '';


    // Basic validation

    if (!this.testDate) {

      this.error = 'Please select test date.';

      return;

    }


    if (this.totalQuestions < 1) {

      this.error =
        'Total questions must be greater than 0.';

      return;

    }


    if (this.attempted < 0) {

      this.error =
        'Attempted questions cannot be negative.';

      return;

    }


    if (this.attempted > this.totalQuestions) {

      this.error =
        'Attempted questions cannot exceed total questions.';

      return;

    }


    if (this.correct < 0) {

      this.error =
        'Correct questions cannot be negative.';

      return;

    }


    if (this.correct > this.attempted) {

      this.error =
        'Correct questions cannot exceed attempted questions.';

      return;

    }


    // Validate subject marks

    for (const item of this.subjectMarks) {

      if (
        item.marksObtained < 0 ||
        item.marksObtained > item.totalMarks
      ) {

        this.error =
          `Invalid marks for ${item.subject}.`;

        return;

      }

    }


    const studentId =
      Number(
        sessionStorage.getItem('loggedInStudentId')
      ) || 1;


    // -------------------------
    // SUBJECT RESULT
    // -------------------------

    const subjectResults = this.subjectMarks.map(
      item => ({

        subject: item.subject,

        /*
         * For now overall questions are stored here.
         * Later we can make questions dynamic per subject.
         */

        totalQuestions:
          this.testType === 'FULL_TEST'
            ? Math.floor(
                this.totalQuestions /
                this.subjectMarks.length
              )
            : this.totalQuestions,

        attempted:
          this.testType === 'FULL_TEST'
            ? Math.floor(
                this.attempted /
                this.subjectMarks.length
              )
            : this.attempted,

        correct:
          this.testType === 'FULL_TEST'
            ? Math.floor(
                this.correct /
                this.subjectMarks.length
              )
            : this.correct,

        incorrect:
          this.testType === 'FULL_TEST'
            ? Math.floor(
                this.incorrect /
                this.subjectMarks.length
              )
            : this.incorrect,

        unattempted:
          this.testType === 'FULL_TEST'
            ? Math.floor(
                this.unattempted /
                this.subjectMarks.length
              )
            : this.unattempted,

        marksObtained:
          Number(item.marksObtained),

        totalMarks:
          Number(item.totalMarks)

      })
    );


    // -------------------------
    // TEST RECORD
    // -------------------------

    const record: TestRecord = {

      id: Date.now(),

      studentId,

      testDate: this.testDate,

      tier: this.tier,

      testType: this.testType,

      subjects: subjectResults,

      totalQuestions:
        Number(this.totalQuestions),

      attempted:
        Number(this.attempted),

      correct:
        Number(this.correct),

      incorrect:
        this.incorrect,

      unattempted:
        this.unattempted,

      marksObtained:
        this.totalMarksObtained,

      totalMarks:
        this.totalPossibleMarks,

      timeTakenMinutes:
        Number(this.timeTakenMinutes),

      wrongQuestions:
        this.wrongQuestions

    };


    // Save in MockData

    this.data.addTest(record);


    // Go dashboard

    this.router.navigate(['/dashboard']);

  }


  // -------------------------
  // BACK
  // -------------------------

  back(): void {

    this.router.navigate(['/dashboard']);

  }

}

