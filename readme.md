# subfocus

lens, focus and prism.

## example

```ts
import { fromSchema } from "../mod.ts";

const schema = {
  artists_sort: "artists",
  title: "title",
  community: {
    rating: {
      average: "average_rating",
    },
  },
};
const prism = fromSchema(schema);

const url = "https://api.discogs.com/releases/19111147";
const resp = await fetch(url);
const json = await resp.json();

console.table(prism(json));
```
```console
┌────────────────┬────────────────────────┐
│ (idx)          │ Values                 │
├────────────────┼────────────────────────┤
│ artists        │ "Sub Focus"            │
│ title          │ "Siren / Solar System" │
│ average_rating │ 4.92                   │
└────────────────┴────────────────────────┘
```

## Rest API

```console
deno run -A cmd/serve.ts
```

```console
curl -X POST http://localhost:3000 -d '{"data":{"field":"value"},"schema":{"field":"value"}}'
{"field":"value"}
```

## dev

### test

```console
deno task test
```
