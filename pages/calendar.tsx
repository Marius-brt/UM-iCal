import { Carousel } from "@mantine/carousel";
import {
  Timeline,
  Badge,
  Button,
  TextInput,
  Center,
  Code,
} from "@mantine/core";
import { Component, ReactNode } from "react";
import InfoPanel from "../components/InfoPanel";
import BdeCard from "../components/BdeEvent";
import { formatDateLetters } from "../utils/dates";
import { objectsEqual, cardColors } from "../utils/others";
import CarouselComponent from "../components/Carousel";
import { DatePicker } from "@mantine/dates";
import { IconTrash, IconPlus, IconEdit } from "@tabler/icons";

class Calendar extends Component<any, any> {
  constructor(props: any) {
    super(props);
    const now = new Date();
    now.setHours(22, 0, 0, 0);
    this.state = {
      items: [],
      active: 0,
      bdeEvents: [],
      panelOpen: false,
      taskOpen: false,
      panelEvent: {},
      summary: "",
      description: "",
      taskDate: now,
      color: 8,
	  editID: null,
	  minDate: new Date()
    };
  }

  refresh() {
    const items: JSX.Element[] = [],
      bdeEvents: JSX.Element[] = [];
    const e: any = {};
    this.props.calendar.forEach((el: any) => {
      const date = new Date(el.date).getTime().toString();
      if (e[date]) e[date].push(el);
      else e[date] = [el];
    });
    const events = Object.keys(e)
      .sort()
      .reduce((el: any, key) => {
        el[key] = e[key];
        return el;
      }, {});
    let active = -1;
    const now = new Date();
    now.setHours(23, 59, 59, 59);
    Object.values(events).forEach((dt: any, i: number) => {
      let dashed = true;
      if (new Date(dt[0].date) <= now) {
        active++;
        const e: any = Object.values(events)[i + 1];
        if (e == undefined || new Date(e[0].date) <= now) dashed = false;
      }
      items.push(
        <Timeline.Item
          key={i}
          title={<Badge>{formatDateLetters(new Date(dt[0].date))}</Badge>}
          lineVariant={dashed ? "dashed" : "solid"}
        >
          {dt.map((el: any) => {
            return (
              <div className="taskEvent">
                {el.summary && (
                  <Badge
                    style={{ marginBottom: "10px" }}
                    color={cardColors[el.color].badge}
                  >
                    {el.summary}
                  </Badge>
                )}
                <div className="text">
                  <div
                    style={{ backgroundColor: cardColors[el.color].bg }}
                  ></div>
				  {el.summary ? <p>{el.text}</p> : <p className="padd">{el.text}</p>}
                </div>
				<IconEdit size={18}
                  onClick={() => {const d = new Date(el.date); this.setState({editID: el.id, summary: el.summary, description: el.text, taskDate: d, color: el.color, minDate: d })}}
				  className="edit"/>
                <IconTrash
                  size={18}
                  onClick={() => this.props.removeFromCalendar(el.id)}
                  color="#e03131"
				  className="delete"
                />
              </div>
            );
          })}
        </Timeline.Item>
      );
    });

    this.props.bdeEvents.forEach((el: any, i: number) => {
      bdeEvents.push(
        <Carousel.Slide key={i}>
          {
            <BdeCard
              start={el.date}
              smallDescription={el.description}
              title={el.title}
              onOpen={() => this.setState({ panelOpen: true, panelEvent: el })}
            />
          }
        </Carousel.Slide>
      );
    });
    this.setState({ items, active, bdeEvents });
  }

  componentDidMount(): void {
    this.refresh();
  }

  componentDidUpdate(prevProps: Readonly<any>): void {
    if (!objectsEqual(prevProps.calendar, this.props.calendar)) this.refresh();
  }

  setColor(id: number) {
    this.setState({ color: id });
  }

  render(): ReactNode {
    return (
      <>
        {this.state.panelOpen && (
          <InfoPanel
            id={this.state.panelEvent["_id"]}
            bde={this.state.panelEvent.bde.name}
            title={this.state.panelEvent.title}
            description={this.state.panelEvent.description}
            price={this.state.panelEvent.price}
            start={this.state.panelEvent.date}
            registration={this.state.panelEvent.registration}
            onClose={() => {
              this.setState({ panelOpen: false });
            }}
            addToCalendar={this.props.addToCalendar}
            removeFromCalendar={this.props.removeFromCalendar}
          />
        )}
        {(this.state.taskOpen || this.state.editID) && (
          <div className="task-panel">
            <TextInput
              label="Matière"
              value={this.state.summary}
              onChange={(e) => this.setState({ summary: e.target.value })}
            />
            <TextInput
              required
              label="Description"
              value={this.state.description}
              onChange={(e) => this.setState({ description: e.target.value })}
            />
			<DatePicker
				minDate={this.state.minDate}
				label="Date"
				required
				value={this.state.taskDate}
				onChange={(e) => this.setState({ taskDate: e })}
			/>            
            <label style={{ fontSize: "14px" }}>Couleur</label>
            <div className="colors">
              {cardColors.map((el, i) => {
                return (
                  <div
                    onClick={() => this.setColor(i)}
                    style={{
                      backgroundColor: el.bg,
                      border: this.state.color == i ? "solid 4px #fff" : "none",
                    }}
                  ></div>
                );
              })}
            </div>
            <div className="btns">
              <Button
                disabled={
                  this.state.description == "" || this.state.taskDate == null
                }
                onClick={() => {
					if(this.state.editID)  {
						this.props.modifyCal({
							id: this.state.editID,
							text: this.state.description,
							date: this.state.taskDate,
							summary:
								this.state.summary != "" ? this.state.summary : null,
							color: this.state.color,
						})
					} else {
						this.props.addToCalendar({
						  id: Date.now().toString(),
						  text: this.state.description,
						  date: this.state.taskDate,
						  summary:
							this.state.summary != "" ? this.state.summary : null,
						  color: this.state.color,
						});
					}
                  const now = new Date();
                  now.setHours(22, 0, 0, 0);
                  this.setState({
                    taskOpen: false,
                    summary: "",
                    description: "",
					editID: null,
                    taskDate: now,
					minDate: now,
                    color: 8,
                  });
                }}
              >
                {this.state.editID ? "📝 Modifier" : "Ajouter"}
              </Button>
              <Button
                color="gray"
                onClick={() => this.setState({ taskOpen: false, editID: null })}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
        {this.state.bdeEvents.length > 0 && (
          <CarouselComponent>{this.state.bdeEvents}</CarouselComponent>
        )}
        <h3>Tâches à venir</h3>
        {!this.state.items.length ? (
          <Center>
            <Code>Aucune tâches 👍</Code>
          </Center>
        ) : (
          <Timeline
            className="calendar"
            active={this.state.active}
            bulletSize={18}
          >
            {this.state.items}
          </Timeline>
        )}

        <div
          className="addBtn"
          onClick={() => this.setState({ taskOpen: true })}
        >
          <IconPlus size={30} color="#fff" />
        </div>
      </>
    );
  }
}

export default Calendar;
