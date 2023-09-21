import config from "./config.js";

export async function search(query: string) {
  const response = await fetch(
    `https://api.tenor.com/v2/search?q=${query}&key=${config.tenorApiKey}&limit=1`
  );

  const json = await response.json();
  console.log(JSON.stringify(json, null, 2));
  return findFirstResult(json.results);
}

function findFirstResult(results: any[]): string | null {
  if (!results.length) {
    return null;
  }
  const firstResult = results[0];
  return firstResult.media_formats.gif.url;
}
