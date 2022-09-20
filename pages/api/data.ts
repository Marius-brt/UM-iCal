import type { NextApiRequest, NextApiResponse } from "next";
import { parseICS } from "node-ical";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { isValidHttpUrl } from "../../utils/others";
import mongo from "../../utils/connectBD";
mongo();
import BdeEventsSchema from "../../schemas/bdeEvents";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  console.log("fetch");
  if (
    req.query.ics == undefined ||
    typeof req.query.ics !== "string" ||
    !isValidHttpUrl(req.query.ics)
  )
    return res.status(400).send("Bad request");
  const f = await fetch(req.query.ics, {
    method: "GET",
    redirect: "follow",
  });
  if (f.status != 200 || f.redirected) return res.status(404).send("error");
  const result = await f.text();
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 59);
  end.setDate(end.getDate() + 1);
  const data = Object.values(parseICS(result)).filter(
    (e) => e.type == "VEVENT" && e.start >= midnight && e.end <= end
  );
  let colors = JSON.parse(
    readFileSync(join(process.cwd(), "colors.json"), { encoding: "utf-8" })
  );
  let change = false;
  data.forEach((el: any) => {
    if (el["summary"] !== undefined) {
      const summary = el.summary
        .toLocaleLowerCase()
        .replace(/\s/g, "")
        .replace(/[^a-z\s!?]/g, "");
      if (colors.summaries[summary] == undefined) {
        colors.last++;
        if (colors.last > 11) colors.last = 0;
        colors.summaries[summary] = colors.last;
        change = true;
      }
    }
  });
  if (change)
    writeFileSync("colors.json", JSON.stringify(colors, null, 4), {
      encoding: "utf-8",
    });
  const bdeEvents = await BdeEventsSchema.find({}).populate("bde").exec();
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const passed = bdeEvents.filter((el) => new Date(el.date) < d);
  passed.forEach((el) => {
    BdeEventsSchema.deleteOne({ id: el.id });
  });
  res.status(200).json({
    events: data,
    colors,
    bdeEvents,
  });
}
