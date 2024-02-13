import { assertEquals } from "https://deno.land/std@0.215.0/assert/mod.ts";
import { combine, lens, focus } from "./lens.ts";
import { prism, fromScheme } from "./prism.ts";

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

Deno.test("fromScheme", () => {
  const nested = {
    name: "name",
    address: {
      code: "code",
      contary: {
        street: "toms diner",
      },
    },
    another: {
      field: "hi",
    },
  };

  const p = fromScheme({
    name: "userName",
    address: {
      code: "addressCode",
      contary: {
        street: "street",
      },
    },
    invaild: "invaild",
    another: "another",
  })(nested);

  assertEquals(p, {
    userName: "name",
    addressCode: "code",
    street: "toms diner",
    invaild: undefined,
    another: undefined,
  });
});
