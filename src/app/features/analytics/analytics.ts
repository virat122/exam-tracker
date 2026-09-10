import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { MockData } from '../../core/services/mock-data';
import { TestRecord } from '../../core/modals/test-record';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-analytics',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class Analytics implements OnInit {

  studentId = 0;
  studentName = '';

  allTests: TestRecord[] = [];
  filteredTests: TestRecord[] = [];

  selectedPeriod = '1_WEEK';
  selectedTier = 'ALL';
  selectedTestType = 'ALL';
  selectedSubject = 'ALL';

  // Overall
  totalTests = 0;
  totalQuestions = 0;
  totalAttempted = 0;
  totalCorrect = 0;
  totalIncorrect = 0;
  totalUnattempted = 0;
  accuracy = 0;

  // Subject
  subjectPerformance: {
    subject: string;
    attempted: number;
    correct: number;
    incorrect: number;
    accuracy: number;
  }[] = [];

  // Trend
  performanceTrend: {
    date: string;
    accuracy: number;
  }[] = [];

  // Chapters
  weakChapters: {
    subject: string;
    chapter: string;
    wrongCount: number;
  }[] = [];

  // Mistake reasons
  mistakeReasons: {
    reason: string;
    count: number;
    percentage: number;
  }[] = [];

  // Test type
  testTypePerformance: {
    type: string;
    tests: number;
    accuracy: number;
  }[] = [];

  // Tier
  tierPerformance: {
    tier: string;
    tests: number;
    accuracy: number;
  }[] = [];

  constructor(
    private mockData: MockData,
    private router: Router,
    public theme: ThemeService
  ) {}

  ngOnInit(): void {

    this.studentId = Number(
      sessionStorage.getItem('loggedInStudentId')
    );

    this.studentName =
      sessionStorage.getItem('loggedInStudentName') || 'Student';

    this.allTests =
      this.mockData.getTestsByStudent(this.studentId);

    this.applyFilters();
  }

  applyFilters(): void {

    let tests = [...this.allTests];

    // Period
    const startDate = this.getStartDate();

    tests = tests.filter(test => {

      const testDate = new Date(test.testDate);

      return testDate >= startDate;

    });

    // Tier
    if (this.selectedTier !== 'ALL') {

      tests = tests.filter(
        test => test.tier === this.selectedTier
      );

    }

    // Test Type
    if (this.selectedTestType !== 'ALL') {

      tests = tests.filter(
        test => test.testType === this.selectedTestType
      );

    }

    // Subject
    if (this.selectedSubject !== 'ALL') {

      tests = tests.filter(test =>
        test.subjects.some(
          subject =>
            subject.subject === this.selectedSubject
        )
      );

    }

    this.filteredTests = tests;

    this.calculateOverall();
    this.calculateSubjectPerformance();
    this.calculatePerformanceTrend();
    this.calculateWeakChapters();
    this.calculateMistakeReasons();
    this.calculateTestTypePerformance();
    this.calculateTierPerformance();
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

  calculateOverall(): void {

    this.totalTests = this.filteredTests.length;

    this.totalQuestions = 0;
    this.totalAttempted = 0;
    this.totalCorrect = 0;
    this.totalIncorrect = 0;
    this.totalUnattempted = 0;

    this.filteredTests.forEach(test => {

      this.totalQuestions += test.totalQuestions;
      this.totalAttempted += test.attempted;
      this.totalCorrect += test.correct;
      this.totalIncorrect += test.incorrect;
      this.totalUnattempted += test.unattempted;

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
      {
        attempted: number;
        correct: number;
        incorrect: number;
      }
    >();

    this.filteredTests.forEach(test => {

      test.subjects.forEach(subject => {

        if (
          this.selectedSubject !== 'ALL' &&
          subject.subject !== this.selectedSubject
        ) {
          return;
        }

        if (!subjectMap.has(subject.subject)) {

          subjectMap.set(subject.subject, {
            attempted: 0,
            correct: 0,
            incorrect: 0
          });

        }

        const data =
          subjectMap.get(subject.subject)!;

        data.attempted += subject.attempted;
        data.correct += subject.correct;
        data.incorrect += subject.incorrect;

      });

    });

    this.subjectPerformance = Array.from(
      subjectMap.entries()
    )
      .map(([subject, data]) => {

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
          incorrect: data.incorrect,
          accuracy
        };

      })
      .sort(
        (a, b) => b.accuracy - a.accuracy
      );
  }

  calculatePerformanceTrend(): void {

    this.performanceTrend = [...this.filteredTests]
      .sort(
        (a, b) =>
          new Date(a.testDate).getTime() -
          new Date(b.testDate).getTime()
      )
      .map(test => {

        const accuracy =
          test.attempted > 0
            ? Number(
                (
                  (test.correct / test.attempted) *
                  100
                ).toFixed(1)
              )
            : 0;

        return {
          date: test.testDate,
          accuracy
        };

      });
  }

  calculateWeakChapters(): void {

    const chapterMap = new Map<
      string,
      {
        subject: string;
        chapter: string;
        wrongCount: number;
      }
    >();

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

        const key =
          `${question.subject}_${question.chapter}`;

        if (!chapterMap.has(key)) {

          chapterMap.set(key, {
            subject: question.subject,
            chapter: question.chapter,
            wrongCount: 0
          });

        }

        const data = chapterMap.get(key)!;

        data.wrongCount++;

      });

    });

    this.weakChapters = Array.from(
      chapterMap.values()
    )
      .sort(
        (a, b) => b.wrongCount - a.wrongCount
      )
      .slice(0, 10);
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
      .map(([reason, count]) => {

        const percentage =
          totalMistakes > 0
            ? Number(
                (
                  (count / totalMistakes) *
                  100
                ).toFixed(1)
              )
            : 0;

        return {
          reason,
          count,
          percentage
        };

      })
      .sort(
        (a, b) => b.count - a.count
      );
  }

  calculateTestTypePerformance(): void {

    const types = [
      'FULL_TEST',
      'SECTIONAL'
    ];

    this.testTypePerformance = types
      .map(type => {

        const tests =
          this.filteredTests.filter(
            test => test.testType === type
          );

        let attempted = 0;
        let correct = 0;

        tests.forEach(test => {

          attempted += test.attempted;
          correct += test.correct;

        });

        const accuracy =
          attempted > 0
            ? Number(
                (
                  (correct / attempted) *
                  100
                ).toFixed(1)
              )
            : 0;

        return {
          type:
            type === 'FULL_TEST'
              ? 'Full Test'
              : 'Sectional',
          tests: tests.length,
          accuracy
        };

      });
  }

  calculateTierPerformance(): void {

    const tiers = [
      'TIER_1',
      'TIER_2'
    ];

    this.tierPerformance = tiers
      .map(tier => {

        const tests =
          this.filteredTests.filter(
            test => test.tier === tier
          );

        let attempted = 0;
        let correct = 0;

        tests.forEach(test => {

          attempted += test.attempted;
          correct += test.correct;

        });

        const accuracy =
          attempted > 0
            ? Number(
                (
                  (correct / attempted) *
                  100
                ).toFixed(1)
              )
            : 0;

        return {
          tier:
            tier === 'TIER_1'
              ? 'Tier 1'
              : 'Tier 2',
          tests: tests.length,
          accuracy
        };

      });
  }

  getTrendBarWidth(accuracy: number): number {
    return Math.min(accuracy, 100);
  }

  getReasonBarWidth(percentage: number): number {
    return Math.min(percentage, 100);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToTestEntry(): void {
    this.router.navigate(['/test-entry']);
  }

  logout(): void {

    sessionStorage.removeItem('loggedInStudentId');
    sessionStorage.removeItem('loggedInStudentName');

    this.router.navigate(['/login']);
  }
}
