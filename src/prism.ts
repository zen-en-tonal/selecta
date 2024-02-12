import { Lens } from "./lens.ts";

export type Scalar = number | string | boolean | null | undefined;

type Named<T> = {
  [K in string]: T;
};

type Prism<T> = { [K in keyof Named<T>]: Scalar };

export function prism<T extends Lens<Q, Scalar>, Q>(
  lenses: Named<T>
): (lay: Q) => Prism<typeof lenses> {
  return (lay: Q) => {
    const obj: { [K in keyof typeof lenses]: Scalar } = {};
    for (const [k, v] of Object.entries(lenses)) {
      obj[k] = v.get(lay);
    }
    return obj;
  };
}
