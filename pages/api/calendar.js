const ical = require("node-ical");
const fs = require("fs")


const url =
"https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac603f59e59934f30faea6068e5857005c27ffa1b75111bc532de8e0734552f6e7eec,1";

export default function handler(req, res) {
	let data = JSON.parse(fs.readFileSync("colors.json", {encoding: 'utf-8'}))
    const events = ical.sync.parseFile("ADECal.ics");
	let change = false
	Object.values(events).forEach(el => {
		if(el.summary) {
			const summary = el.summary.toLocaleLowerCase().replace(/\s/g, "").replace(/[^a-z\s!?]/g,'');
			if(data.summaries[summary] == undefined) {
				data.last++;
				if(data.last > data.colors.length - 1)
					data.last = 0;
				data.summaries[summary] = data.last;
				change = true
			}
		}
	})
	if(change)
		fs.writeFileSync("colors.json", JSON.stringify(data, null, 4), {encoding: 'utf-8'})
    res.status(200).json({events, colors: data});
}