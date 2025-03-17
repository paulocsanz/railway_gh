const express = require("express");
const pg = require("pg");
const region = process.env.RAILWAY_REPLICA_REGION;
const port = process.env.PORT || 4000;
const app = express();
const pool = new pg.Pool();
const ping = require("ping");

let counter = 0;

app.get("/data", async (req, res) => {
  try {
    res.json({ data: (await pool.query("SELECT NOW()")).rows });
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
});

let baseUrl = process.env["RAILWAY_REGION"] != null ? ['railway.internal'] : ['up.railway.app']
let hosts = ['europe', 'asia', 'us-west', 'us-east']
let urls = hosts.map(h => `${h}.${baseUrl}`)

console.log(`URLs are: ${urls}`);

app.get("/", async (req, res) => {
  console.log(`Hit #${counter}`);
  let results = await Promise.all(urls.map(url => ping.promise.probe(url)))
  let timings = await results.map(result => `${result.host}: ${result.time}ms`)
  counter++;
  res.send(
    `Hello ${process.env.RAILWAY_REGION}<br/>${timings.join("<br/>")}`,
  );
});

app.listen(port, () => {
  console.log(`[${region}] Example app listening at http://localhost:${port}`);
});
