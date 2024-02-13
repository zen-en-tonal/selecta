export interface Lens<T, V> {
  get(x: T): V;
}

export type Key = string | number | symbol;
export type Scalar = number | string | boolean | undefined;
export type Record = { [K in Key]: Record | Scalar };

export function lens<T extends Record>(key: Key): Lens<T, Record | Scalar> {
  return {
    get: (x: T) => {
      if (!x) return undefined;
      return x[key];
    },
  };
}

// deno-lint-ignore no-explicit-any
function isScalar(x: any): x is Scalar {
  return x && typeof x !== "object";
}

export function focus<T extends Record>(
  lens: Lens<T, Record | Scalar>
): Lens<T, Scalar> {
  return {
    get: (x) => {
      const v = lens.get(x);
      return isScalar(v) ? v : undefined;
    },
  };
}

export function combine<T, Q>(
  self: Lens<T, Q>
): <R>(other: Lens<Q, R>) => Lens<T, R> {
  return (other) => ({
    get: (x) => other.get(self.get(x)),
  });
}
