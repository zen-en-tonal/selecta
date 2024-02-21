import {
  combine,
  focus,
  Lens,
  lens,
  parseNumber,
  Record,
  Scalar,
  toNonNull,
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
  options?: Partial<{ parseNumber: boolean; nonNull: boolean }>,
): (lay: Record) => Spectrum {
  const flatten = flatSchema(schema);
  const obj: { [K in string]: Lens<Record, Scalar> } = {};
  for (const x of flatten) {
    const lenses = x.keys.map((k) => lens(k)).reduce((p, c) => combine(p)(c));
    obj[x.value] = focus(lenses);
    if (options?.parseNumber) {
      obj[x.value] = parseNumber(obj[x.value]);
    }
    if (options?.nonNull) {
      obj[x.value] = toNonNull(obj[x.value]);
    }
  }
  return prism(obj);
}
