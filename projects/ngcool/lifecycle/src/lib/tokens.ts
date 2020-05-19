import { SimpleChanges, SimpleChange } from '@angular/core';
import { ReplaySubject, Subject, Observable } from 'rxjs';

interface Tokens {
  readonly init: unique symbol;
  readonly changes: unique symbol;
  readonly destroy: unique symbol;
}

export const tokens: Tokens = {
  init: Symbol('on init') as any,
  changes: Symbol('on changes') as any,
  destroy: Symbol('on destroy') as any,
};

export interface This {
  [tokens.init]: ReplaySubject<void>;
  [tokens.changes]: {
    subject: Subject<SimpleChanges>;
    props: Record<string, Observable<SimpleChange>>;
  };
  [tokens.destroy]: Subject<any>;
}
