import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEntry } from './test-entry';

describe('TestEntry', () => {
  let component: TestEntry;
  let fixture: ComponentFixture<TestEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
