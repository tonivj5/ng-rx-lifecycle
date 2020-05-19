import { Subject, Observable } from 'rxjs';

import { getDef } from './helpers';
import { This, tokens } from './tokens';

const decorated = Symbol('ngOnDestroy');

export function NgOnDestroy() {
  return (target: any, propertyKey: string) => {
    const that: This = target;

    Promise.resolve().then(() => {
      if (!that[decorated]) {
        const def = getDef(target.constructor);

        const { onDestroy } = def;

        def.onDestroy = function () {
          if (!that[tokens.destroy]) {
            that[tokens.destroy].next();
            that[tokens.destroy].complete();
            that[tokens.destroy] = null;
          }

          onDestroy?.call(this);
        };

        that[decorated] = true;
      }

      Object.defineProperty(that, propertyKey, {
        get() {
          if (!that[tokens.destroy]) {
            that[tokens.destroy] = new Subject<void>();
          }

          return that[tokens.destroy];
        },
      });
    });
  };
}

NgOnDestroy.$ = null as Observable<void>;
