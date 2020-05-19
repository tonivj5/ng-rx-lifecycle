import { Observable, ReplaySubject } from 'rxjs';

import { getDef } from './helpers';
import { This, tokens } from './tokens';

const decorated = Symbol('ngOnInit');

export function NgOnInit() {
  return (target: any, propertyKey: string) => {
    const that: This = target;

    Promise.resolve().then(() => {
      if (!that[decorated]) {
        const def = getDef(target.constructor);

        const { onInit, onDestroy } = def;

        def.onInit = function () {
          this[tokens.init].next();

          onInit?.call(this);
        };

        def.onDestroy = function () {
          that[tokens.init].complete();
          that[tokens.init] = null;

          onDestroy?.call(this);
        };

        that[decorated] = true;
      }

      Object.defineProperty(that, propertyKey, {
        get() {
          if (!that[tokens.init]) {
            that[tokens.init] = new ReplaySubject<void>(1);
          }

          return that[tokens.init];
        },
      });
    });
  };
}

NgOnInit.$ = null as Observable<void>;
