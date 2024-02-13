import { fromScheme } from "../mod.ts";

const scheme = {
  artist: "artist",
  title: "title",
  year: "year",
};
const prism = fromScheme(scheme);

const url = "https://api.discogs.com/artists/142440/releases";
const resp = await fetch(url);
const json = await resp.json();

console.log(prism(json.releases));
