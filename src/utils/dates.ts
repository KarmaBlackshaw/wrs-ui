import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIME_ZONE = "Asia/Manila";

function toManila(input: string | number | Date) {
  return dayjs(new Date(input)).tz(TIME_ZONE);
}

export function formatDate(input: string | number | Date) {
  return toManila(input).format("D MMM YYYY");
}

export function formatTime(input: string | number | Date) {
  return toManila(input).format("h:mm A");
}

export function formatDateTime(input: string | number | Date) {
  return toManila(input).format("D MMM YYYY, h:mm A");
}

export function todayIso() {
  return toManila(Date.now()).format("YYYY-MM-DD");
}

export function isSameManilaDay(a: string | number | Date, b: string | number | Date) {
  return toManila(a).format("YYYY-MM-DD") === toManila(b).format("YYYY-MM-DD");
}

export function formatPeriod(start: string, end: string) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}
