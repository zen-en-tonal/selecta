import { assertEquals } from "$std/assert/mod.ts";
import { combine, recordLens } from "./lens.ts";

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

Deno.test("record lens", () => {
  const nested = {
    name: "name",
    address: {
      code: "code",
    },
  };

  const addressLens = recordLens("address");
  const addressCodeLens = recordLens("code");
  const combination = combine(addressLens, addressCodeLens);

  assertEquals("code", combination.get(nested));
});

Deno.test(
  "record lens failed to get value, the value should be undefined.",
  () => {
    const nested = {
      name: "name",
      address: {
        code: "code",
      },
    };

    const addressLens = recordLens("address");
    const addressZipLens = recordLens("zip"); // undefined key.
    const combination = combine(addressLens, addressZipLens);

    assertEquals(undefined, combination.get(nested));
  }
);

Deno.test(
  "parent lens failed to get value, the child value should be undefined.",
  () => {
    const nested = {
      name: "name",
      address: {
        code: "code",
      },
    };

    const postsLens = recordLens("posts"); // undefined key.
    const addressZipLens = recordLens("zip"); // undefined key.
    const combination = combine(postsLens, addressZipLens);

    assertEquals(undefined, combination.get(nested));
  }
);
