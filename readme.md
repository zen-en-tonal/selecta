# subfocus

lens, focus and prism.

## example

```ts
import { fromScheme } from "../mod.ts";

const scheme = {
  artists_sort: "artists",
  title: "title",
  community: {
    rating: {
      average: "average_rating",
    },
  },
};
const prism = fromScheme(scheme);

const url = "https://api.discogs.com/releases/19111147";
const resp = await fetch(url);
const json = await resp.json();

console.table(prism(json));
┌────────────────┬────────────────────────┐
│ (idx)          │ Values                 │
├────────────────┼────────────────────────┤
│ artists        │ "Sub Focus"            │
│ title          │ "Siren / Solar System" │
│ average_rating │ 4.92                   │
└────────────────┴────────────────────────┘
```

## dev

### test

```console
deno task test
```
