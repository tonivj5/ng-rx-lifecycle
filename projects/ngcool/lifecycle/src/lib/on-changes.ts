import {
  SimpleChanges,
  ɵɵNgOnChangesFeature as NgOnChangesFeature,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { getDef } from './helpers';
import { This, tokens } from './tokens';

const decorated = Symbol('ngOnChanges');

export function NgOnChanges<T extends object = any>(prop?: keyof T) {
  return (target: any, propertyKey: string) => {
    const that: This = target;

    that[tokens.changes] = {
      props: {},
      subject: null,
    };

    Promise.resolve().then(() => {
      if (!that[decorated]) {
        const { ngOnChanges } = target;

        target.ngOnChanges = function (changes: SimpleChanges) {
          if (!that[tokens.changes].subject) {
            that[tokens.changes].subject = new Subject();
          }

          that[tokens.changes].subject.next(changes);

          ngOnChanges?.call(this, changes);
        };

        const def = getDef(target.constructor);

        NgOnChangesFeature(def);

        const { onChanges, onDestroy } = def;

        def.onChanges = function () {
          onChanges?.call(this);
        };

        def.onDestroy = function () {
          if (that[tokens.changes].subject) {
            that[tokens.changes].subject.complete();
            that[tokens.changes].subject = null;

            that[tokens.changes].props = {};
          }

          onDestroy?.call(this);
        };

        that[decorated] = true;
      }

      Object.defineProperty(that, propertyKey, {
        get() {
          if (!that[tokens.changes].subject) {
            that[tokens.changes].subject = new Subject();
          }

          if (!that[tokens.changes].props[prop as string]) {
            that[tokens.changes].props[prop as string] = that[
              tokens.changes
            ].subject.pipe(pluck(prop as any));
          }

          return prop
            ? that[tokens.changes].props[prop as string]
            : that[tokens.changes].subject;
        },
      });
    });
  };
}

NgOnChanges.$ = null as Observable<SimpleChanges>;
