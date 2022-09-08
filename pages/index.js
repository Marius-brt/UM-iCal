import Head from "next/head";
import { Component } from "react";
import { SimpleGrid, Tabs, Badge, Code, TextInput, Button, Kbd } from "@mantine/core";
import { IconArrowNarrowRight } from "@tabler/icons";

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join(" / ");
}

function formatTime(date) {
  return `${padTo2Digits(date.getHours())}h${padTo2Digits(date.getMinutes())}`;
}

function truncate(s, length) {
	if(s.length > length)
		return s.substring(0, length - 3) + '...'
	return s
}

function parseEvent(el, passed = false) {
  const now = new Date();
  const end = new Date(el.end);
  const start = new Date(el.start);
  if (el.description == undefined || (end < now && !passed)) return null;
  const splt = el.description.split("\n").filter((element) => element);
  const teacher = splt.find((el) => /^[A-Z\s]*$/.test(el) == true);
  if (teacher == null) return null;
  return {
    end,
    start,
    location: el.location.toLowerCase().includes("cours en ligne") ? "Cours en ligne" : truncate(el.location.split(",").join(" - "), 36),
    summary: truncate(el.summary, 34),
    teacher,
  };
}

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

function isTomorrow(date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (tomorrow.toDateString() === date.toDateString()) return true;
  return false;
}

function GenerateCard(el, colors) {
  const teacher = [];
  el.teacher.split(" ").forEach((el) => {
    teacher.push(el.charAt(0).toUpperCase() + el.slice(1).toLowerCase());
  });
  const summary = el.summary
    .toLocaleLowerCase()
    .replace(/\s/g, "")
    .replace(/[^a-z\s!?]/g, "");
  const color = colors.colors[colors.summaries[summary]];
  return (
    <div className="card" style={{ backgroundColor: color.bg }}>
      <p className="summary" style={{ color: color.color }}>
        {el.summary}
      </p>
      <Badge color={color.badge}>{el.location}</Badge>
      <p className="teacher" style={{ color: color.color }}>
        {teacher.join(" ")}
      </p>
      <div className="hours" style={{ color: color.color }}>
        <p>{formatTime(el.start)}</p>
        <IconArrowNarrowRight size={18} />
        <p>{formatTime(el.end)}</p>
      </div>
    </div>
  );
}

function StyledTabs(props) {
  return (
    <Tabs
      unstyled
      styles={(theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[0]
              : theme.colors.gray[9],
          border: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4]
          }`,
          padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
          cursor: "pointer",
          fontSize: theme.fontSizes.sm,
          display: "flex",
          alignItems: "center",

          "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },

          "&:not(:first-of-type)": {
            borderLeft: 0,
          },

          "&:first-of-type": {
            borderTopLeftRadius: theme.radius.md,
            borderBottomLeftRadius: theme.radius.md,
          },

          "&:last-of-type": {
            borderTopRightRadius: theme.radius.md,
            borderBottomRightRadius: theme.radius.md,
          },

          "&[data-active]": {
            backgroundColor: theme.colors.blue[7],
            borderColor: theme.colors.blue[7],
            color: theme.white,
          },
        },

        tabIcon: {
          marginRight: theme.spacing.xs,
          display: "flex",
          alignItems: "center",
        },

        tabsList: {
          display: "flex",
        },
      })}
      {...props}
    />
  );
}

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

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
		loaded: false,
      next: null,
      today: [],
      tomorrow: [],
      tomorrowDate: new Date(),
      days: 0,
      hours: 0,
      minutes: 0
    };
  }

  getUrl() {
	if (typeof window !== "undefined" && localStorage.getItem("ics-url") != null && isValidHttpUrl(localStorage.getItem("ics-url"))) {
		return localStorage.getItem("ics-url")
	} else {
		return ""
	}
  }

  refresh() {
	const url = this.getUrl()
	if(url != "") {
		const tm = new Date();
		tm.setDate(tm.getDate() + 1);
		this.setState({ tomorrowDate: tm, loaded: true });
		fetch(
		  "/api/calendar?ics=" +
			encodeURIComponent(url)
		)
		  .then((res) => {
			if(res.status != 200) {
				return
			}
			return res.json()})
		  .then((dt) => {
			const data = Object.values(dt.events).sort((a, b) => {
			  return new Date(a.end) - new Date(b.end);
			});
			const now = new Date()
			for (let i = 0; i < data.length; i++) {
			  const next = parseEvent(data[i]);
			  if (next != null && next.start > now) {
				this.setState({
				  next: GenerateCard(next, dt.colors),
				});
				this.getTimeUntil(next.start);
				setInterval(() => this.getTimeUntil(next.start), 1000);
				break;
			  }
			}
			let today = [];
			const tomorrow = [];
			for (let i = 0; i < data.length; i++) {
			  const el = parseEvent(data[i], true);
			  if (el != null && isToday(el.start))
				today.push(GenerateCard(el, dt.colors));
			  if (el != null && isTomorrow(el.start))
				tomorrow.push(GenerateCard(el, dt.colors));
			}
			if (today.length == 0)
			  today.push(<Code>Bah on dirait que ya pas cours 🤷‍♂️</Code>);
			if (tomorrow.length == 0)
			  tomorrow.push(<Code>Bah on dirait que ya pas cours 🤷‍♂️</Code>);
			this.setState({ today, tomorrow });
		  }).catch(err => {
			  this.setState({
				  loaded: false
			  })
			//document.getElementById("error").innerText = "Impossible de lire l'url donné"
		  })
	}
  }

  componentDidMount() {
    if (!this._Mounted) {
      this._Mounted = true;
	  this.refresh()
    }
  }

  getTimeUntil(deadline) {
    const time = Date.parse(deadline) - Date.parse(new Date());
    if (time < 0) {
      this.setState({ days: 0, hours: 0, minutes: 0 });
    } else {
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      this.setState({ days, hours, minutes });
    }
  }

  getCountdown() {
    let txt = [];
    if (this.state.days > 0) txt.push(this.state.days + " jours");
    if (this.state.hours > 0 && this.state.minutes > 0) {
      txt.push(
        padTo2Digits(this.state.hours) + "h" + padTo2Digits(this.state.minutes)
      );
    } else {
      if (this.state.hours > 0) txt.push(padTo2Digits(this.state.hours) + "h");
      if (this.state.minutes > 0)
        txt.push(padTo2Digits(this.state.minutes) + "mins");
    }
    return txt.join(" ");
  }

  Save() {
	if (typeof window !== "undefined") {
		const url = document.getElementById("url-input").value
		if(url == "" || !isValidHttpUrl(url)) {
			document.getElementById("error").innerText = "Mauvais url"
		} else {
			document.getElementById("error").innerText = ""
			localStorage.setItem("ics-url", document.getElementById("url-input").value)
			location.reload()
		}
	}
  }

  render() {
	if(this.state.loaded) {
		return (
		  <>
			<Head>
			  <title>UM Ical</title>
			  <meta name="description" content="L'emploie du temps en mode ez" />
			  <link rel="icon" href="/favicon.ico" />
			</Head>
	
			<main>
			  {this.state.next != null && (
				<>
				  <div className="next-date">
					<Code>Prochain cours dans {this.getCountdown()}</Code>
				  </div>
				  <div style={{ marginTop: "20px" }}>{this.state.next}</div>
				</>
			  )}
			  <StyledTabs defaultValue="today">
				<Tabs.List>
				  <Tabs.Tab value="today">Aujourd{"'"}hui</Tabs.Tab>
				  <Tabs.Tab value="tomorrow">Demain</Tabs.Tab>
				</Tabs.List>
	
				<Tabs.Panel value="today" pt="xs">
				  <div className="tab-date">
					<Badge>{formatDate(new Date())}</Badge>
				  </div>
				  <SimpleGrid cols={1}>{this.state.today}</SimpleGrid>
				</Tabs.Panel>
	
				<Tabs.Panel value="tomorrow" pt="xs">
				  <div className="tab-date">
					<Badge>{formatDate(this.state.tomorrowDate)}</Badge>
				  </div>
				  <SimpleGrid cols={1}>{this.state.tomorrow}</SimpleGrid>
				</Tabs.Panel>
			  </StyledTabs>
			  <Code className="footer">
				Créer par{" "}
				<a
				  href="https://github.com/Marius-brt"
				  target="_blank"
				  rel="noreferrer"
				  style={{ color: "#C1C2C5" }}
				>
				  @marius.brt
				</a>{" "}
				•{" "}
				<a
				  href="https://github.com/Marius-brt/UM-iCal"
				  target="_blank"
				  rel="noreferrer"
				  style={{ color: "#C1C2C5" }}
				>
				  Github
				</a>{" "}
				du site
			  </Code>
			</main>
		  </>
		);
	} else {
		return (
			<>
				<Head>
					<title>UM Ical</title>
					<meta name="description" content="L'emploie du temps en mode ez" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<div className="form">
						<Code>Pour trouver votre lien :</Code>
						<p><Kbd>Ent</Kbd> {">"} <Kbd>Planning</Kbd> {">"} <Kbd>Onglet iCal</Kbd></p>
						<TextInput id="url-input" label="Lien calendrier iCal"/>
						<Button onClick={this.Save}>Ok</Button>
						<p id="error"></p>
					</div>
				</main>
			</>
		);
	}
  }
}
