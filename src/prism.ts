import {
  combine,
  focus,
  Lens,
  lens,
  parseNumber,
  Record,
  Scalar,
  unwrapOrDefault,
} from "./lens.ts";

export type Spectrum = { [K in string]: Scalar };

export function prism(
  lenses: {
    [K in string]: Lens<Record, Scalar>;
  },
): (lay: Record) => Spectrum {
  return (lay: Record) => {
    const obj: { [K in string]: Scalar } = {};
    for (const [k, v] of Object.entries(lenses)) {
      obj[k] = v.get(lay);
    }
    return obj;
  };
}

export type Schema = { [K in string]: string | Schema };

// deno-lint-ignore no-explicit-any
const isSchema = (x: any): x is Schema => x && typeof x === "object";

type FlattenSchema = { keys: string[]; value: string };

function flatSchema(schema: Schema): FlattenSchema[] {
  const leaf = (parents: string[], s: string): FlattenSchema => {
    return { keys: parents, value: s };
  };
  const node = (parents: string[], s: Schema): FlattenSchema[] => {
    return Object.entries(s).flatMap(([k, v]) =>
      isSchema(v) ? node([...parents, k], v) : leaf([...parents, k], v)
    );
  };
  return node([], schema);
}

export function fromSchema(
  schema: Schema,
  options?: Partial<{ parseNumber: boolean }>,
): (lay: Record) => Spectrum {
  const flatten = flatSchema(schema);
  const obj: { [K in string]: Lens<Record, Scalar> } = {};
  for (const x of flatten) {
    const lenses = x.keys.map((k) => lens(k)).reduce((p, c) => combine(p)(c));
    const { key, d } = parseDefault(x.value);
    obj[key] = d(focus(lenses));
    if (options?.parseNumber) {
      obj[key] = parseNumber(obj[key]);
    }
  }
  return prism(obj);
}

const parseDefault = (value: string) => {
  const [key, def] = value.split(":");
  return { key, d: unwrapOrDefault(def) };
};
