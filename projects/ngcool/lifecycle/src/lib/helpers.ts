import {
  ɵComponentDef as ComponentDef,
  ɵDirectiveDef as DirectiveDef,
} from '@angular/core';

export const NG_COMPONENT_DEF = 'ɵcmp';
export const NG_DIRECTIVE_DEF = 'ɵdir';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
interface CompOrDirDef<T> {
  [NG_COMPONENT_DEF]?: Writeable<ComponentDef<T>>;
  [NG_DIRECTIVE_DEF]?: Writeable<DirectiveDef<T>>;
}

export function getDef<T>({
  [NG_COMPONENT_DEF]: dirDef,
  [NG_DIRECTIVE_DEF]: compDef,
}: CompOrDirDef<T>) {
  return dirDef || compDef;
}

// export function decorateIfNeeded(target: any, decorated: symbol, event: string) {

// }
