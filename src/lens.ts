export interface Lens<T, V> {
  get(x: T): V;
}

export type Key = string | number | symbol;
export type Scalar = number | string | boolean | undefined;
export type Record = { [K in Key]: Record | Scalar };

export function lens(
  key: Key,
): Lens<Record, Scalar | Record> {
  return {
    get: (x: Record) => {
      if (!x) return undefined;
      return x[key];
    },
  };
}

// deno-lint-ignore no-explicit-any
function isScalar(x: any): x is Scalar {
  return x && typeof x !== "object";
}

export function focus(
  lens: Lens<Record, Scalar | Record>,
): Lens<Record, Scalar> {
  return {
    get: (x) => {
      const v = lens.get(x);
      return isScalar(v) ? v : undefined;
    },
  };
}

export function unwrapOrDefault(
  def: Scalar,
): (lens: Lens<Record, Scalar>) => Lens<Record, Scalar> {
  return (lens) => ({
    get: (x) => {
      const v = lens.get(x);
      return v ?? def;
    },
  });
}

export function parseNumber(
  lens: Lens<Record, Scalar>,
): Lens<Record, Scalar> {
  return {
    get: (x) => {
      const v = lens.get(x);
      return isNaN(v as number) ? v : Number.parseFloat(v as string);
    },
  };
}

export function combine<T, Q>(
  self: Lens<T, Q>,
): <R>(other: Lens<Q, R>) => Lens<T, R> {
  return (other) => ({
    get: (x) => other.get(self.get(x)),
  });
}
