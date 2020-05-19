## POC Angular lifecycle observables (with decorators)

```ts
import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { NgOnInit, NgOnChanges, NgOnDestroy } from '@ngcool/lifecycle';

@Component({
  selector: 'app-test',
  template: `
    {{ onChanges$ | async | json }} <br />
    {{ test$ | async | json }}
  `,
})
export class TestComponent {
  @Input()
  test: any;

  @NgOnInit()
  onInit$: Observable<void>;

  @NgOnChanges<TestComponent>()
  onChanges$: Observable<SimpleChanges>;

  @NgOnChanges<TestComponent>('test')
  test$: Observable<SimpleChange>;

  @NgOnDestroy()
  onDestroy$: Observable<void>;

  constructor() {
    this.onInit$.subscribe({
      next: () => console.log('on init'),
      complete: () => console.log('complete on init'),
    });

    this.onDestroy$.subscribe({
      next: () => console.log('on destroy'),
      complete: () => console.log('complete destroy'),
    });
  }
}
```
