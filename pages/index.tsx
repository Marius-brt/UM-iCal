import { Component, ReactNode } from "react";
import StyledTabs from "../components/StyledTab";
import { EventInterface } from "../utils/interfaces";
import EventCard from "../components/summary";
import { isToday, isTomorrow, formatCountdown } from "../utils/dates";
import { truncate, cardColors } from "../utils/others";
import {
  Badge,
  Center,
  Code,
  Loader,
  SimpleGrid,
  Tabs,
  Transition,
} from "@mantine/core";

function GenerateCard(event: EventInterface, style: string): JSX.Element {
  const teacher: string[] = [];
  event.teacher.split(" ").forEach((el) => {
    teacher.push(el.charAt(0).toUpperCase() + el.slice(1).toLowerCase());
  });

  return (
    <EventCard
      end={event.end}
      start={event.start}
      summary={event.summary}
      teacher={teacher.join(" ")}
      color={event.color}
      location={event.location}
      style={style}
    />
  );
}

function parseEvent(el: any, colors: any): EventInterface | null {
  const end = new Date(el.end);
  const start = new Date(el.start);
  if (el.description == undefined) return null;
  const teacher = el.description
    .replace(/[^A-Za-z0-9]/g, " ")
    .replace(/(?![A-Z])./g, " ")
    .split(" ")
    .filter((el: string) => el.length > 3)
    .join(" ");
  if (teacher == null) return null;
  const sm = el.summary
    .toLocaleLowerCase()
    .replace(/\s/g, "")
    .replace(/[^a-z\s!?]/g, "");
  const color = cardColors[colors[sm]];
  if (el.location == "") el.location = "Inconnu 🤷‍♂️";
  return {
    end,
    start,
    location: el.location.toLowerCase().includes("cours en ligne")
      ? "Cours en ligne"
      : truncate(el.location.split(",").join(" - "), 36),
    summary: truncate(el.summary, 34),
    teacher,
    color,
  };
}

const t = new Date();

class Home extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      next: null,
      today: [],
      tomorrow: [],
      days: 0,
      hours: 0,
      minutes: 0,
      countdown: null,
      currentTab: "today",
    };
  }

  update() {
    if (this.state.countdown != null) clearTimeout(this.state.countdown);
    let next: EventInterface | null = null;
    const now = new Date();
    const today: JSX.Element[] = [],
      tomorrow: JSX.Element[] = [];

    this.props.events.forEach((el: any) => {
      const start = new Date(el.start);
      const event = parseEvent(el, this.props.colors);
      if (next == null && event != null && start >= now) {
        next = event;
        this.getTimeUntil(next != null ? next.start.toISOString() : "");
        if (this.state.countdown != null) clearInterval(this.state.countdown);
        this.setState({
          next: GenerateCard(next, this.props.settings.barStyle),
          countdown: setInterval(
            () =>
              this.getTimeUntil(next != null ? next.start.toISOString() : ""),
            1000
          ),
        });
      }
      if (event != null && isToday(start))
        today.push(GenerateCard(event, this.props.settings.barStyle));
      if (event != null && isTomorrow(start))
        tomorrow.push(GenerateCard(event, this.props.settings.barStyle));
    });
    if (today.length == 0)
      today.push(
        <Center>
          <Code>
            On dirait que y{"'"}a pas cours aujourd{"'"}hui 🤷‍♂️
          </Code>
        </Center>
      );
    if (tomorrow.length == 0)
      tomorrow.push(
        <Center>
          <Code>On dirait que y{"'"}a pas cours demain 🤷‍♂️</Code>
        </Center>
      );

    this.setState({
      today,
      tomorrow,
    });
  }

  getTimeUntil(deadline: string) {
    const time = Date.parse(deadline) - +new Date();
    if (time < 0) {
      this.setState({ days: 0, hours: 0, minutes: 0 });
    } else {
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      this.setState({ days, hours, minutes });
    }
  }

  componentDidMount(): void {
    this.update();
  }

  componentDidUpdate(prevProps: Readonly<any>): void {
    if (
      this.props.lastUpdate !== prevProps.lastUpdate ||
      this.props.settings.barStyle !== prevProps.settings.barStyle
    ) {
      this.update();
    }
  }

  render(): ReactNode {
    return (
      <>
        <div>
          {this.props.loading ? (
            <Center>
              {" "}
              <Loader color="#f35c65" />
            </Center>
          ) : (
            <>
              {this.state.next != null && (
                <Center style={{ marginBottom: "20px" }}>
                  <Badge style={{ textTransform: "none" }}>
                    🚨 Prochain cours dans{" "}
                    {formatCountdown(
                      this.state.days,
                      this.state.hours,
                      this.state.minutes
                    )}
                  </Badge>
                </Center>
              )}
              {this.state.next}
            </>
          )}

          <StyledTabs
            onChange={(i: string) => this.setState({ currentTab: i })}
            defaultValue="today"
          >
            <Tabs.List>
              <Tabs.Tab value="today">Aujourd{"'"}hui</Tabs.Tab>
              <Tabs.Tab value="tomorrow">Demain</Tabs.Tab>
            </Tabs.List>

            <Transition
              mounted={this.state.currentTab == "today"}
              transition="slide-right"
              timingFunction="ease"
            >
              {(styles) => (
                <SimpleGrid cols={1} style={styles} className="tab">
                  {this.props.loading ? (
                    <Center>
                      {" "}
                      <Loader color="#f35c65" />
                    </Center>
                  ) : (
                    this.state.today
                  )}
                </SimpleGrid>
              )}
            </Transition>

            <Transition
              mounted={this.state.currentTab == "tomorrow"}
              transition="slide-left"
              timingFunction="ease"
            >
              {(styles) => (
                <SimpleGrid cols={1} style={styles} className="tab">
                  {this.props.loading ? (
                    <Center>
                      {" "}
                      <Loader color="#f35c65" />
                    </Center>
                  ) : (
                    this.state.tomorrow
                  )}
                </SimpleGrid>
              )}
            </Transition>
          </StyledTabs>
        </div>
      </>
    );
  }
}

export default Home;
