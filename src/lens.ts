export interface Lens<T, V> {
  get(x: T): V;
}

export type Key = string | number | symbol;
export type Scalar = number | string | boolean | undefined;
export type Record = { [K in Key]: Record | Scalar };

export function lens(
  key: Key,
): Lens<Record | Record[], Scalar | Record | (Scalar | Record)[]> {
  return {
    get: (x: Record | Record[]) => {
      if (!x) return undefined;
      if (Array.isArray(x)) return x.map((e) => e[key]);
      return x[key];
    },
  };
}

// deno-lint-ignore no-explicit-any
function isScalar(x: any): x is Scalar | Scalar[] {
  if (isArray(x)) {
    if (x.length < 1) return true;
    if (isScalar(x[0])) return true;
  }
  return x && typeof x !== "object";
}

// deno-lint-ignore no-explicit-any
function isArray(x: any): x is Array<any> {
  return x && Array.isArray(x);
}

export function focus(
  lens: Lens<Record | Record[], Scalar | Record | (Scalar | Record)[]>,
): Lens<Record | Record[], Scalar | Scalar[]> {
  return {
    get: (x) => {
      const v = lens.get(x);
      return isScalar(v) ? v : undefined;
    },
  };
}

export function toNonNull(
  lens: Lens<Record | Record[], Scalar | Scalar[]>,
): Lens<Record | Record[], Scalar | Scalar[]> {
  return {
    get: (x) => {
      const v = lens.get(x);
      return v ?? "";
    },
  };
}

export function parseNumber(
  lens: Lens<Record | Record[], Scalar | Scalar[]>,
): Lens<Record | Record[], Scalar | Scalar[]> {
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
