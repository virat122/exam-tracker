import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { MockData } from '../../core/services/mock-data';
import { TestRecord } from '../../core/modals/test-record';
import { ThemeService } from '../../core/services/theme.service';
import { publishFacade } from '@angular/compiler';
import { ApiCallService } from '../../core/api-call/api-call';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  studentId = 0;
  studentName = '';

  allTests: TestRecord[] = [];
  filteredTests: TestRecord[] = [];

  selectedPeriod = '1_WEEK';
  selectedTier = 'ALL';
  selectedTestType = 'ALL';
  selectedSubject = 'ALL';

  totalTests = 0;
  totalQuestions = 0;
  totalAttempted = 0;
  totalCorrect = 0;
  accuracy = 0;

  subjectPerformance: {
    subject: string;
    attempted: number;
    correct: number;
    accuracy: number;
  }[] = [];

  weakChapters: {
    chapter: string;
    wrongCount: number;
  }[] = [];

  mistakeReasons: {
    reason: string;
    count: number;
    percentage: number;
  }[] = [];

  recentTests: TestRecord[] = [];

  constructor(
    private mockData: MockData,
    private router: Router,
    public theme: ThemeService,
    public apiCallService :ApiCallService
  ) {}

  ngOnInit(): void {
    this.studentId = Number(
      sessionStorage.getItem('loggedInStudentId')
    );

    this.studentName =
      sessionStorage.getItem('loggedInStudentName') || 'Student';

    this.loadData();
  }

  loadData(): void {

    this.apiCallService.fetchTest(this.studentId).subscribe({
      next: (response) => {
        
        this.allTests =response;
         this.applyFilters();
       
      },

      error: (error) => {
        console.error('failed to fetch test:', error);
      }
    });

  }

  applyFilters(): void {

    let tests = [...this.allTests];

    // Period filter
    const startDate = this.getStartDate();

    tests = tests.filter(test => {
      const testDate = new Date(test.testDate);

      return testDate >= startDate;
    });

    // Tier filter
    if (this.selectedTier !== 'ALL') {
      tests = tests.filter(
        test => test.tier === this.selectedTier
      );
    }

    // Test type filter
    if (this.selectedTestType !== 'ALL') {
      tests = tests.filter(
        test => test.testType === this.selectedTestType
      );
    }

    // Subject filter
    if (this.selectedSubject !== 'ALL') {
      tests = tests.filter(test =>
        test.subjects.some(
          subject =>
            subject.subject === this.selectedSubject
        )
      );
    }

    this.filteredTests = tests;

    this.calculateSummary();
    this.calculateSubjectPerformance();
    this.calculateWeakChapters();
    this.calculateMistakeReasons();

    this.recentTests = [...tests]
      .sort(
        (a, b) =>
          new Date(b.testDate).getTime() -
          new Date(a.testDate).getTime()
      )
      .slice(0, 5);
  }

  getStartDate(): Date {

    const today = new Date();
    const startDate = new Date(today);

    switch (this.selectedPeriod) {

      case '1_WEEK':
        startDate.setDate(today.getDate() - 7);
        break;

      case '2_WEEKS':
        startDate.setDate(today.getDate() - 14);
        break;

      case '3_WEEKS':
        startDate.setDate(today.getDate() - 21);
        break;

      case '4_WEEKS':
        startDate.setDate(today.getDate() - 28);
        break;

      case '3_MONTHS':
        startDate.setMonth(today.getMonth() - 3);
        break;
    }

    startDate.setHours(0, 0, 0, 0);

    return startDate;
  }

  calculateSummary(): void {

    this.totalTests = this.filteredTests.length;

    this.totalQuestions = 0;
    this.totalAttempted = 0;
    this.totalCorrect = 0;

    this.filteredTests.forEach(test => {

      this.totalQuestions += test.totalQuestions;
      this.totalAttempted += test.attempted;
      this.totalCorrect += test.correct;

    });

    this.accuracy =
      this.totalAttempted > 0
        ? Number(
            (
              (this.totalCorrect / this.totalAttempted) *
              100
            ).toFixed(2)
          )
        : 0;
  }

  calculateSubjectPerformance(): void {

    const subjectMap = new Map<
      string,
      { attempted: number; correct: number }
    >();

    this.filteredTests.forEach(test => {

      test.subjects.forEach(subject => {

        // If subject filter is selected
        if (
          this.selectedSubject !== 'ALL' &&
          subject.subject !== this.selectedSubject
        ) {
          return;
        }

        if (!subjectMap.has(subject.subject)) {

          subjectMap.set(subject.subject, {
            attempted: 0,
            correct: 0
          });

        }

        const data = subjectMap.get(subject.subject)!;

        data.attempted += subject.attempted;
        data.correct += subject.correct;

      });

    });

    this.subjectPerformance = Array.from(
      subjectMap.entries()
    ).map(([subject, data]) => {

      const accuracy =
        data.attempted > 0
          ? Number(
              (
                (data.correct / data.attempted) *
                100
              ).toFixed(2)
            )
          : 0;

      return {
        subject,
        attempted: data.attempted,
        correct: data.correct,
        accuracy
      };

    }).sort(
      (a, b) => a.accuracy - b.accuracy
    );
  }

  calculateWeakChapters(): void {

    const chapterMap = new Map<string, number>();

    this.filteredTests.forEach(test => {

      if (!test.wrongQuestions) {
        return;
      }

      test.wrongQuestions.forEach(question => {

        if (
          this.selectedSubject !== 'ALL' &&
          question.subject !== this.selectedSubject
        ) {
          return;
        }

        const chapter =
          question.chapter || 'Unknown Chapter';

        chapterMap.set(
          chapter,
          (chapterMap.get(chapter) || 0) + 1
        );

      });

    });

    this.weakChapters = Array.from(
      chapterMap.entries()
    )
      .map(([chapter, wrongCount]) => ({
        chapter,
        wrongCount
      }))
      .sort(
        (a, b) => b.wrongCount - a.wrongCount
      )
      .slice(0, 5);
  }

  calculateMistakeReasons(): void {

    const reasonMap = new Map<string, number>();

    let totalMistakes = 0;

    this.filteredTests.forEach(test => {

      if (!test.wrongQuestions) {
        return;
      }

      test.wrongQuestions.forEach(question => {

        if (
          this.selectedSubject !== 'ALL' &&
          question.subject !== this.selectedSubject
        ) {
          return;
        }

        const reason =
          question.reason || 'Other';

        reasonMap.set(
          reason,
          (reasonMap.get(reason) || 0) + 1
        );

        totalMistakes++;

      });

    });

    this.mistakeReasons = Array.from(
      reasonMap.entries()
    )
      .map(([reason, count]) => ({
        reason,
        count,
        percentage:
          totalMistakes > 0
            ? Number(
                ((count / totalMistakes) * 100).toFixed(1)
              )
            : 0
      }))
      .sort(
        (a, b) => b.count - a.count
      );
  }

  getPeriodName(): string {

    switch (this.selectedPeriod) {

      case '1_WEEK':
        return 'Last 1 Week';

      case '2_WEEKS':
        return 'Last 2 Weeks';

      case '3_WEEKS':
        return 'Last 3 Weeks';

      case '4_WEEKS':
        return 'Last 4 Weeks';

      case '3_MONTHS':
        return 'Last 3 Months';

      default:
        return 'Last 1 Week';
    }
  }

  getTestSubjects(test: TestRecord): string {

    if (test.testType === 'FULL_TEST') {
      return 'All Subjects';
    }

    return test.subjects
      .map(subject => subject.subject)
      .join(', ');
  }

  getTestAccuracy(test: TestRecord): number {

    if (test.attempted === 0) {
      return 0;
    }

    return Number(
      (
        (test.correct / test.attempted) *
        100
      ).toFixed(1)
    );
  }

  goToTestEntry(): void {
    this.router.navigate(['/test-entry']);
  }

  goToAnalytics(): void {
    this.router.navigate(['/analytics']);
  }

  logout(): void {

    sessionStorage.removeItem('loggedInStudentId');
    sessionStorage.removeItem('loggedInStudentName');

    this.router.navigate(['/login']);
  }
}
