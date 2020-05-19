import { TestBed } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';

import { NgOnInit } from './on-init';

@Component({})
class TestComponent {
  @NgOnInit()
  onInit$: typeof NgOnInit.$;

  initialized = false;
  destroyed = false;

  constructor() {
    this.onInit$.subscribe({
      next: () => {
        this.initialized = true;
      },
      complete: () => {
        this.destroyed = true;
      },
    });
  }
}

@Component({})
class SubTestComponent extends TestComponent {
  otherOnInitialized = false;

  @NgOnInit()
  otherOnInit$: typeof NgOnInit.$;

  constructor() {
    super();

    this.onInit$.subscribe({
      next: () => {
        this.otherOnInitialized = true;
      },
    });
  }
}

@Component({})
class WithNgOnInitMethodComponent implements OnInit {
  initialized = false;
  initializedOnMethod = false;

  @NgOnInit()
  onInit$: typeof NgOnInit.$;

  constructor() {
    this.onInit$.subscribe({
      next: () => {
        this.initialized = true;
      },
    });
  }

  ngOnInit(): void {
    this.initializedOnMethod = true;
  }
}

describe('NgOnInit', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        SubTestComponent,
        WithNgOnInitMethodComponent,
      ],
    }).compileComponents()
  );

  it('should init observable without method', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.initialized).toBeTrue();

    fixture.destroy();

    expect(fixture.componentInstance.destroyed).toBeTrue();
  });

  it('should init observable from extended class', () => {
    const fixture = TestBed.createComponent(SubTestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.initialized).toBeTrue();
    expect(fixture.componentInstance.otherOnInitialized).toBeTrue();
  });

  it('should call ngOnInit mehtod', () => {
    const fixture = TestBed.createComponent(WithNgOnInitMethodComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.initialized).toBeTrue();
    expect(fixture.componentInstance.initializedOnMethod).toBeTrue();
  });
});
