import { assertEquals } from "https://deno.land/std@0.215.0/assert/mod.ts";
import { combine, lens, focus } from "./lens.ts";
import { prism } from "./prism.ts";

Deno.test("prism", () => {
  const nested = {
    name: "name",
    address: {
      code: "code",
    },
  };

  const addressCodeLens = combine(lens("address"))(lens("code"));
  const nameLens = lens("name");
  const p = prism({
    addressCode: focus(addressCodeLens),
    userName: focus(nameLens),
  })(nested);

  assertEquals(p, { userName: "name", addressCode: "code" });
});
