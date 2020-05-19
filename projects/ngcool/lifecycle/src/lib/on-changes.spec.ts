import { TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { NgOnChanges } from './on-changes';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'lib-test',
})
class TestComponent {
  @NgOnChanges()
  onChanges$: typeof NgOnChanges.$;

  @Input()
  change: number;

  changes = [];

  destroyed = false;

  constructor() {
    this.onChanges$.subscribe({
      next: ({ change }) => {
        this.changes.push(change.currentValue);
      },
      complete: () => {
        this.destroyed = true;
      },
    });
  }
}

@Component({
  template: ` <lib-test [change]="change"></lib-test> `,
})
class HostWithoutMethodComponent {
  change: number;
}

describe('NgOnChanges', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [TestComponent, HostWithoutMethodComponent],
    }).compileComponents()
  );

  it('should observe changes without method', () => {
    const host = TestBed.createComponent(HostWithoutMethodComponent);

    const fixture = host.debugElement.query(By.directive(TestComponent));

    host.componentInstance.change = 1;

    host.detectChanges();

    expect(fixture.componentInstance.changes).toEqual([1]);

    host.componentInstance.change = 2;

    host.detectChanges();

    expect(fixture.componentInstance.changes).toEqual([1, 2]);

    host.destroy();

    expect(fixture.componentInstance.destroyed).toBeTrue();
  });
});
