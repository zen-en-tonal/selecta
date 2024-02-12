import { assertEquals } from "$std/assert/mod.ts";
import { combine } from "./lens.ts";

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
