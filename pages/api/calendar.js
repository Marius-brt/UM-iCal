const ical = require("node-ical");
const fs = require("fs")
const path = require('path')

function isValidHttpUrl(string) {
	let url;	
	try {
	  url = new URL(string);
	} catch (_) {
	  return false;  
	}
	if(url.hostname != "proseconsult.umontpellier.fr")
		return false;
	return url.protocol === "http:" || url.protocol === "https:";
}

export default function handler(req, res) {
	if(req.query.ics == undefined || !isValidHttpUrl(req.query.ics))
	  return res.status(400).send("Bad request")

	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	  
	fetch(req.query.ics, requestOptions)
	.then(response => {
		if(response.status != 200)
			return
		return response.text()
	})
	.then(result => {
		let data = JSON.parse(fs.readFileSync(path.join(process.cwd(), "colors.json"), {encoding: 'utf-8'}))
		const events = ical.sync.parseICS(result);
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
	})
	.catch(err => {
		 res.status(404).send("Can't find ics file " + err)
		});
}