import type { NextApiRequest, NextApiResponse } from "next";
import { parseICS } from "node-ical";
import { isValidHttpUrl } from "../../utils/others";

const colors: {[k:string]:number} = {}
let last = 0

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
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
  const now = new Date().toLocaleString('en-EN', {
    timeZone: 'Europe/Paris',
  })
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 59);
  end.setDate(end.getDate() + 1);
  const data = Object.values(parseICS(result)).filter(
    (e) => e.type == "VEVENT" && e.start >= midnight && e.start <= end
  );
  data.forEach((el: any) => {
    if (el["summary"] !== undefined) {
      const summary = el.summary
        .toLocaleLowerCase()
        .replace(/\s/g, "")
        .replace(/[^a-z\s!?]/g, "");
      if (colors[summary] == undefined) {
        last++;
        if (colors.last > 11) last = 0;
        colors[summary] = last;
      }
    }
  });
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  res.status(200).json({
    events: data,
    colors,
    bdeEvents: [],
  });
}
