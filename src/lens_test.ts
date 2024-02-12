import { assertEquals } from "https://deno.land/std@0.215.0/assert/mod.ts";
import { combine, lens } from "./lens.ts";

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
  const combined = combine(userAddressLens, codeLens);

  assertEquals("code", combined.get(nested));
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
  const combination = combine(addressLens, addressCodeLens);

  assertEquals("code", combination.get(nested));
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
  const combination = combine(addressLens, addressZipLens);

  assertEquals(undefined, combination.get(nested));
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
    const combination = combine(postsLens, addressZipLens);

    assertEquals(undefined, combination.get(nested));
  }
);
