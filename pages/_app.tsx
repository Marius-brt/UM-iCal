import type { AppProps } from "next/app";
import "../styles/style.scss";
import CustomApp from "../components/app";
import { useEffect, useState } from "react";
import { isValidHttpUrl } from "../utils/others";
import { useRouter } from "next/router";
import { CalendarItemInterface } from "../utils/interfaces";
import { isToday } from "../utils/dates";

const defaultSettings: any = {
  barStyle: "default",
};

function MyApp({ Component, pageProps }: AppProps) {
  const [loaded, setLoaded] = useState(false);
  const [calendar, setCalendar] = useState<CalendarItemInterface[]>([]);
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [bdeEvents, setBdeEvents] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [urlIsValid, setUrlValid] = useState(true);
  const router = useRouter();

  const deleteDatas = () => {
    localStorage.clear();
    router.push("/");
    setUrlValid(false);
  };

  const getSavedData = () => {
    const savedData = localStorage.getItem("ics-data");
    const bdeEvents = localStorage.getItem("ics-bde-events");
    const lastSave = localStorage.getItem("ics-last-save");
    const colors = localStorage.getItem("ics-colors");
    if (lastSave == null) return null;
    const date = new Date(
      lastSave != null || !isNaN(lastSave) ? parseInt(lastSave) : ""
    );
    if (
      bdeEvents == null ||
      colors == null ||
      savedData == null ||
      date.toString() == "Invalid Date"
    )
      return null;
    if (!isToday(date)) return null;
    const diff = Math.round(Math.abs(+new Date() - +date) / (1000 * 60 * 60));
    if (diff > 5) return null;
    try {
      const dt = {
        bdeEvents: JSON.parse(bdeEvents),
        events: JSON.parse(savedData),
        colors: JSON.parse(colors),
        lastUpdate: date,
      };
      return dt;
    } catch (e) {
      return null;
    }
  };

  const updateSettings = (newSettings: any) => {
    localStorage.setItem("ics-settings", JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const loadSettings = () => {
    let sett = localStorage.getItem("ics-settings");
    let cal = localStorage.getItem("ics-calendar");
    try {
      setLoaded(true);
      if (sett != null) {
        sett = JSON.parse(sett);
        setSettings(sett);
      }
      if (cal != null) {
        const cal2 = JSON.parse(cal);
        const d = new Date();
        d.setHours(23, 59, 59, 59);
        d.setDate(d.getDate() - 3);
        const calF = cal2.filter((el: any) => new Date(el.date) >= d);
        if (cal2.length != calF.length)
          localStorage.setItem("ics-calendar", JSON.stringify(calF));
        setCalendar(calF);
      } else {
        localStorage.setItem("ics-calendar", "[]");
      }
    } catch (e) {}
  };

  const refresh = async (forceRefresh: boolean = false): Promise<boolean> => {
    const url = localStorage.getItem("ics-url");
    if (url != null && isValidHttpUrl(url)) {
      const savedData = await getSavedData();
      if (savedData == null || forceRefresh) {
        console.log("fetch");
        const f = await fetch("/api/data?ics=" + encodeURIComponent(url), {
          method: "get",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        });
        if (f.status != 200) {
          console.log("Error");
          return false;
        }
        const res = await f.json();
        const t = res.events.sort((a: any, b: any) => {
          const d1 = +new Date(a.start);
          const d2 = +new Date(b.start);
          return d1 - d2;
        });
        localStorage.setItem("ics-data", JSON.stringify(t));
        localStorage.setItem("ics-last-save", Date.now().toString());
        localStorage.setItem("ics-colors", JSON.stringify(res.colors));
        localStorage.setItem("ics-bde-events", JSON.stringify(res.bdeEvents));
        setEvents(t);
        setBdeEvents(res.bdeEvents);
        setColors(res.colors);
        setLastUpdate(Date.now());
        setLoading(false);
        setUrlValid(true);
        return true;
      } else {
        console.log("load data");
        setEvents(savedData.events);
        setColors(savedData.colors);
        setBdeEvents(savedData.bdeEvents);
        setLastUpdate(savedData.lastUpdate.getTime());
        setLoading(false);
        setUrlValid(true);
        return true;
      }
    } else {
      setUrlValid(false);
      return false;
    }
  };

  useEffect(() => {
    loadSettings();
    refresh();
  }, []);

  const addToCalendar = (item: CalendarItemInterface) => {
    setCalendar((current: any[]) => [...current, item]);
  };

  const modifyTask = (item: CalendarItemInterface) => {
	try {
	const newCal = calendar.map(el => {
		if(el.id == item.id) return item
		return el
	})
	setCalendar(newCal)
	} catch (e) {}
  }

  const removeFromCalendar = (id: string) => {
    setCalendar(calendar.filter((el: CalendarItemInterface) => el.id != id));
  };

  useEffect(() => {
    if (loaded) localStorage.setItem("ics-calendar", JSON.stringify(calendar));
  }, [calendar]);

  return (
    <CustomApp urlIsValid={urlIsValid} refresh={refresh}>
      <Component
        {...pageProps}
        settings={settings}
        calendar={calendar}
        events={events}
        lastUpdate={lastUpdate}
        colors={colors}
        loading={loading}
        bdeEvents={bdeEvents}
        deleteDatas={deleteDatas}
        updateSettings={updateSettings}
        addToCalendar={addToCalendar}
        removeFromCalendar={removeFromCalendar}
        refresh={refresh}
		modifyCal={modifyTask}
      />
    </CustomApp>
  );
}

export default MyApp;
