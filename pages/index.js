import Head from "next/head";
import { Component } from "react";
import {SimpleGrid, Tabs, Badge, Card} from '@mantine/core'

const colors = {
	'ppp': {
		bg: "#1c7ed6",
		badge: "blue",
		color: "#fff"
	},
	"initiationaudéveloppement": {
		bg: "rgb(255, 80, 80)",
		badge: "red",
		color: "#fff"
	},
	"mathsdiscrètes": {
		bg: "rgb(255, 80, 80)",
		badge: "red",
		color: "#fff"
	},
	"introb.d.": {

	},
	"intro.systèmes": {

	}
}

function padTo2Digits(num) {
	return num.toString().padStart(2, '0');
  }
  
function formatDate(date) {
	return [
		padTo2Digits(date.getDate()),
		padTo2Digits(date.getMonth() + 1),
		date.getFullYear(),
	].join(' / ');
}

function formatTime(date) {
	return `${padTo2Digits(date.getHours())}h${padTo2Digits(date.getMinutes())}`
}

function parseEvent(el, passed = false) {
	const now = new Date()
	const end = new Date(el.end)
	const start = new Date(el.start)
	if(el.description == undefined || (end < now && !passed))
		return null
	const splt = el.description.split('\n').filter(element => element);
	const teacher = splt.find(el => /^[A-Z\s]*$/.test(el) == true)
	if(teacher == null)
		return null
	return {
		end, 
		start,
		location: el.location.split(',').join(" - "),
		summary: el.summary,
		teacher
	}
}

const isToday = (someDate) => {
	const today = new Date()
	return someDate.getDate() == today.getDate() &&
	  someDate.getMonth() == today.getMonth() &&
	  someDate.getFullYear() == today.getFullYear()
}

function isTomorrow(date) {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);  
	if (tomorrow.toDateString() === date.toDateString()) 
	  return true;	  
	return false;
}


function GenerateCard(el, colors) {
	const teacher = [] 
	el.teacher.split(" ").forEach(el => {
		teacher.push(el.charAt(0).toUpperCase() + el.slice(1).toLowerCase())
	})
	const summary = el.summary.toLocaleLowerCase().replace(/\s/g, "").replace(/[^a-z\s!?]/g,'');
	const color = colors.colors[colors.summaries[summary]]
	return <div className="card" style={{backgroundColor: color.bg}}>
		<p className="summary" style={{color: color.color}}>{el.summary}</p>
		<Badge color={color.badge}>{el.location}</Badge>
		<p className="teacher" style={{color: color.color}}>{teacher.join(" ")}</p>
		<p className="hours" style={{color: color.color}}>{formatTime(el.start)} {">"} {formatTime(el.end)}</p>
	</div>
}

function StyledTabs(props) {
	return (
	  <Tabs
		unstyled
		styles={(theme) => ({
		  tab: {
			...theme.fn.focusStyles(),
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
			color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
			border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[4]}`,
			padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
			cursor: 'pointer',
			fontSize: theme.fontSizes.sm,
			display: 'flex',
			alignItems: 'center',
  
			'&:disabled': {
			  opacity: 0.5,
			  cursor: 'not-allowed',
			},
  
			'&:not(:first-of-type)': {
			  borderLeft: 0,
			},
  
			'&:first-of-type': {
			  borderTopLeftRadius: theme.radius.md,
			  borderBottomLeftRadius: theme.radius.md,
			},
  
			'&:last-of-type': {
			  borderTopRightRadius: theme.radius.md,
			  borderBottomRightRadius: theme.radius.md,
			},
  
			'&[data-active]': {
			  backgroundColor: theme.colors.blue[7],
			  borderColor: theme.colors.blue[7],
			  color: theme.white,
			},
		  },
  
		  tabIcon: {
			marginRight: theme.spacing.xs,
			display: 'flex',
			alignItems: 'center',
		  },
  
		  tabsList: {
			display: 'flex',
		  },
		})}
		{...props}
	  />
	);
  }

export default class Home extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			events: [],
			cal: [],
			next: <></>,
			today: [],
			tomorrow: [],
			tomorrowDate: new Date(),
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0
		};
	  }

	componentDidMount() {
		const tm = new Date();
		tm.setDate(tm.getDate() + 1);  
		this.setState({tomorrowDate: tm})
		fetch("/api/calendar")
		.then(res => res.json())
		.then(dt => {
			const data = Object.values(dt.events).sort((a,b) => {
				return  new Date(a.end) - new Date(b.end);
			});			
			this.setState({
				events: data,
				cal: data.map(el => {
					const val = parseEvent(el)
					if(val == null)
						return <></>
					return GenerateCard(val, dt.colors)
				})
			})
			for (let i = 0; i < data.length; i++) {
				const next = parseEvent(data[i])
				if(next != null) {
					this.setState({
						next: GenerateCard(next, dt.colors)
					})
					this.getTimeUntil(next.start)
					setInterval(() => this.getTimeUntil(next.start), 1000);
					break;
				}
			}			
			const today = []
			const tomorrow = []
			for (let i = 0; i < data.length; i++) {
				const el = parseEvent(data[i], true)
				if(el != null && isToday(el.start)) 
					today.push(GenerateCard(el, dt.colors))	
				if(el != null && isTomorrow(el.start))
					tomorrow.push(GenerateCard(el, dt.colors))		
			}
			this.setState({today, tomorrow})
		})
	}

	getTimeUntil(deadline) {
		const time = Date.parse(deadline) - Date.parse(new Date());
		if (time < 0) {
		  this.setState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
		} else {
		  const seconds = Math.floor((time / 1000) % 60);
		  const minutes = Math.floor((time / 1000 / 60) % 60);
		  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
		  const days = Math.floor(time / (1000 * 60 * 60 * 24));
		  this.setState({ days, hours, minutes, seconds });
		}
	}

	render() {
		return (
		  <div>
			<Head>
			  <title>UM Ical</title>
			  <meta name="description" content="L'emploie du temps en mode ez" />
			  <link rel="icon" href="/favicon.ico" />
			</Head>
	  
			<main>
				<p>Prochain cours dans {this.state.days > 0 ? this.state.days : ""} {this.state.days > 0 ? "jours " : ""}{padTo2Digits(this.state.hours)}h {padTo2Digits(this.state.minutes)}mins {padTo2Digits(this.state.seconds)}sec :</p>
				{this.state.next}
				<p></p>
				<StyledTabs defaultValue="today">
					<Tabs.List>
						<Tabs.Tab value="today">Aujourd'hui</Tabs.Tab>
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
			</main>
	  
			<footer>
			  <p>Créer par marius.brt</p>
			</footer>
		  </div>
		);
	}
}
