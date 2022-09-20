export interface ColorInterface {
  bg: string;
  badge: string;
}

export interface EventInterface {
  location: string;
  summary: string;
  teacher: string;
  start: Date;
  end: Date;
  color: ColorInterface;
}

export interface BdeInterface {
  title: string;
  start: Date;
  smallDescription: string;
  onOpen: () => void;
}

export interface BdeInfoPanelInterface {
  id: string;
  bde: string;
  title: string;
  start: Date;
  description: string;
  price: string;
  registration: string;
  onClose: () => void;
  addToCalendar: (item: CalendarItemInterface) => void;
  removeFromCalendar: (id: string) => void;
}

export interface CalendarItemInterface {
  summary: string | null;
  color: number;
  date: Date;
  text: string;
  id: string;
}
