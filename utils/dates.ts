export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
}

export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (tomorrow.toDateString() === date.toDateString()) return true;
  return false;
}

export function twoDigits(num: number): string {
  return num.toString().padStart(2, "0");
}

export function formatDate(date: Date): string {
  return [
    twoDigits(date.getDate()),
    twoDigits(date.getMonth() + 1),
    date.getFullYear(),
  ].join(" / ");
}

export function formatTime(date: Date): string {
  return `${twoDigits(date.getHours())}h${twoDigits(date.getMinutes())}`;
}

export function formatDateLetters(date: Date): string {
  return `${date.toLocaleString("fr-FR", {
    weekday: "long",
  })} ${date.getDate()} ${date.toLocaleString("fr-FR", { month: "long" })}`;
}

export function formatCountdown(
  days: number,
  hours: number,
  minutes: number
): string {
  let txt = [];
  if (days > 0) txt.push(days + " jours");
  if (hours > 0 && minutes > 0) {
    txt.push(twoDigits(hours) + "h" + twoDigits(minutes));
  } else {
    if (hours > 0) txt.push(twoDigits(hours) + "h");
    if (minutes > 0) txt.push(twoDigits(minutes) + "mins");
  }
  if (txt.length == 0) return "quelques secondes";
  return txt.join(" ");
}
