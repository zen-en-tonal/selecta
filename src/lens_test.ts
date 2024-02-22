import { assertEquals } from "../deps.ts";
import { parseNumber } from "./lens.ts";
import { combine, focus, lens, unwrapOrDefault } from "./lens.ts";

Deno.test("combine lenses", () => {
  const nested = {
    name: "name",
    address: {
      code: "code",
    },
  };

  const userAddressLens = {
    get: (x: typeof nested): typeof nested.address => x.address,
  };
  const codeLens = { get: (x: typeof nested.address): string => x.code };
  const combined = combine(userAddressLens)(codeLens);

  assertEquals(combined.get(nested), "code");
});

Deno.test("lens", () => {
  const nested = {
    name: "name",
    address: {
      code: "code",
    },
  };

  const addressLens = lens("address");
  const addressCodeLens = lens("code");
  const combination = combine(addressLens)(addressCodeLens);

  assertEquals(combination.get(nested), "code");
});

Deno.test("lens failed to get value, the value should be undefined.", () => {
  const nested = {
    name: "name",
    address: {
      code: "code",
    },
  };

  const addressLens = lens("address");
  const addressZipLens = lens("zip"); // undefined key.
  const combination = combine(addressLens)(addressZipLens);

  assertEquals(combination.get(nested), undefined);
});

Deno.test(
  "parent lens failed to get value, the child value should be undefined.",
  () => {
    const nested = {
      name: "name",
      address: {
        code: "code",
      },
    };

    const postsLens = lens("posts"); // undefined key.
    const addressZipLens = lens("zip"); // undefined key.
    const combination = combine(postsLens)(addressZipLens);

    assertEquals(combination.get(nested), undefined);
  },
);

Deno.test("toNonNull", () => {
  const data = {
    x: undefined,
  };
  const l = unwrapOrDefault(0)(focus(lens("x")));

  assertEquals(l.get(data), 0);
});

Deno.test("parseNumber", () => {
  const data = {
    x: "100",
  };
  const l = parseNumber(focus(lens("x")));

  assertEquals(l.get(data), 100);
});

Deno.test("parseNumber null value", () => {
  const data = {
    x: undefined,
  };
  const l = parseNumber(focus(lens("x")));

  assertEquals(l.get(data), undefined);
});
