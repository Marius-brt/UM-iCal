export function isValidHttpUrl(s: any): boolean {
  let url;
  try {
    url = new URL(s);
  } catch (_) {
    return false;
  }
  if (
    !s.includes(
      "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data="
    )
  )
    return false;
  return url.protocol === "http:" || url.protocol === "https:";
}

export function truncate(s: string, length: number) {
  if (s.length > length) return s.substring(0, length - 3) + "...";
  return s;
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function objectsEqual(o1: any, o2: any): boolean {
  return (
    Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every((p) => o1[p] === o2[p])
  );
}

export const cardColors = [
  {
    bg: "rgb(52, 163, 206)",
    badge: "blue",
  },
  {
    bg: "rgb(253, 114, 114)",
    badge: "red",
  },
  {
    bg: "rgb(206, 110, 234)",
    badge: "grape",
  },
  {
    bg: "rgb(73, 186, 230)",
    badge: "cyan",
  },
  {
    bg: "rgb(255, 214, 51)",
    badge: "yellow",
  },
  {
    bg: "rgb(230, 58, 154)",
    badge: "pink",
  },
  {
    bg: "rgb(55, 24, 142)",
    badge: "purple",
  },
  {
    bg: "rgb(14, 34, 140)",
    badge: "indigo",
  },
  {
    bg: "rgb(45, 183, 151)",
    badge: "teal",
  },
  {
    bg: "rgb(51, 185, 60)",
    badge: "green",
  },
  {
    bg: "rgb(126, 210, 68)",
    badge: "lime",
  },
  {
    bg: "rgb(234, 134, 45)",
    badge: "orange",
  },
];
