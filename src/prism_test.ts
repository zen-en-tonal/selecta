import { assertEquals } from "../deps.ts";
import { combine, focus, lens } from "./lens.ts";
import { fromSchema, prism } from "./prism.ts";

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

Deno.test("fromSchema", () => {
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

  const p = fromSchema({
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

Deno.test("fromSchema parseNumber", () => {
  const nested = {
    value: "0.1",
    str: "hoge",
  };

  const p = fromSchema({
    value: "value",
    str: "str",
  }, { parseNumber: true })(nested);

  assertEquals(p, {
    value: 0.1,
    str: "hoge",
  });
});

Deno.test("fromSchema nonNull", () => {
  const nested = {
    str: undefined,
  };

  const p = fromSchema({
    str: "str",
  }, { nonNull: true })(nested);

  assertEquals(p, {
    str: "",
  });
});
