import { fromSchema } from "../mod.ts";

const schema = {
  artists_sort: "artists",
  title: "title",
  lowest_price: "price",
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
