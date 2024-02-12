import { assertEquals } from "https://deno.land/std@0.215.0/assert/mod.ts";
import { combine, recordLens } from "./lens.ts";
import { prism, Scalar } from "./prism.ts";

Deno.test("prism", () => {
  const nested = {
    name: "name",
    address: {
      code: "code",
    },
  };

  const addressCodeLens = combine(
    recordLens("address"),
    recordLens<Scalar>("code")
  );
  const nameLens = recordLens<Scalar>("name");
  const p = prism({
    addressCode: addressCodeLens,
    userName: nameLens,
  })(nested);

  assertEquals({ userName: "name", addressCode: "code" }, p);
});
