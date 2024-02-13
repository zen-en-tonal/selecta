import { lens, Record, Lens, Scalar, combine, focus } from "./lens.ts";

export type Spectrum = { [K in string]: Scalar };

export function prism<T>(lenses: { [K in string]: Lens<T, Scalar> }): (
  lay: T
) => Spectrum {
  return (lay: T) => {
    const obj: { [K in string]: Scalar } = {};
    for (const [k, v] of Object.entries(lenses)) {
      obj[k] = v.get(lay);
    }
    return obj;
  };
}

export type Scheme = { [K in string]: string | Scheme };

// deno-lint-ignore no-explicit-any
const isScheme = (x: any): x is Scheme => x && typeof x === "object";

type FlattenScheme = { keys: string[]; value: string };

function flatScheme(scheme: Scheme): FlattenScheme[] {
  const leaf = (parents: string[], s: string): FlattenScheme => {
    return { keys: parents, value: s };
  };
  const node = (parents: string[], s: Scheme): FlattenScheme[] => {
    return Object.entries(s).flatMap(([k, v]) =>
      isScheme(v) ? node([...parents, k], v) : leaf([...parents, k], v)
    );
  };
  return node([], scheme);
}

export function fromScheme<T extends Record>(
  scheme: Scheme
): (lay: T) => Spectrum {
  const flatten = flatScheme(scheme);
  const obj: { [K in string]: Lens<T, Scalar> } = {};
  for (const x of flatten) {
    const lenses = x.keys.map((k) => lens(k)).reduce((p, c) => combine(p)(c));
    obj[x.value] = focus(lenses);
  }
  return prism(obj);
}
