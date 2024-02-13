import { lens, Record, Lens, Scalar, combine, focus } from "./lens.ts";

export type Spectrum = { [K in string]: Scalar | Scalar[] };

export function prism(lenses: {
  [K in string]: Lens<Record | Record[], Scalar | Scalar[]>;
}): (lay: Record | Record[]) => Spectrum {
  return (lay: Record | Record[]) => {
    const obj: { [K in string]: Scalar | Scalar[] } = {};
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

export function fromScheme(scheme: Scheme): (lay: Record) => Spectrum {
  const flatten = flatScheme(scheme);
  const obj: { [K in string]: Lens<Record, Scalar | Scalar[]> } = {};
  for (const x of flatten) {
    const lenses = x.keys.map((k) => lens(k)).reduce((p, c) => combine(p)(c));
    obj[x.value] = focus(lenses);
  }
  return prism(obj);
}
