/**
 * @prettier
 * @flow
 * */

import moment from "moment";

const AM = "AM";
const PM = "PM";
const YEAR = 365;
const TODAY = "Today";
const ONE_DAY_IN_SECONDS = 86400;
const ONE_SECOND = 1000;

// it takes in format '12 AM' and return 24 format
export function hourTo24Format(hour: string) {
  return parseInt(moment(hour, ["h A"]).format("H"), 10);
}

// it takes in format 23 and return [11,'PM'] format
export function hourTo12Format(hour: number) {
  const currDate = new Date();
  currDate.setHours(hour);
  return dateTo12Hour(currDate.toISOString());
}

export const dateTo12Hour = (dateString: string) => {
  const localDate = new Date(dateString);
  let hour = localDate.getHours();
  if (hour === 12) {
    return ["12", PM];
  }
  if (hour === 0) {
    return ["12", AM];
  }
  const afterMidday = hour % 12 === hour;
  hour = afterMidday ? hour : hour % 12;
  const amPm = afterMidday ? AM : PM;
  return [hour.toString(), amPm];
};

export function increaseDateByDays(date: Date, numOfDays: ?number) {
  const nextDate = new Date(date.valueOf());
  nextDate.setDate(nextDate.getDate() + numOfDays);
  return nextDate;
}

export function pickerDateArray(
  startDateInput: string | Date,
  daysCount: number = YEAR
) {
  const startDate = new Date(startDateInput);
  const arr = [];

  for (let i = 0; i < daysCount; i++) {
    const ithDateFromStartDate =
      Date.parse(startDate) / ONE_SECOND + i * ONE_DAY_IN_SECONDS;
    if (
      moment.unix(Date.parse(new Date()) / ONE_SECOND).format("MM/DD/YYYY") ===
      moment.unix(ithDateFromStartDate).format("MM/DD/YYYY")
    ) {
      arr.push(TODAY);
    } else {
      arr.push(formatDatePicker(ithDateFromStartDate));
    }
  }
  return arr;
}

function formatDatePicker(date: number) {
  return moment.unix(date).format("ddd MMM D");
}

export function computeDatePosition(
  date: Date,
  startDate: Date,
  daysCount: number
) {
  const startDateAtMidnight = new Date(startDate);
  startDateAtMidnight.setHours(0);
  startDateAtMidnight.setMinutes(0);
  startDateAtMidnight.setSeconds(0);

  // so that the date diff is the correct value
  const dateAtMidday = new Date(date);
  dateAtMidday.setHours(12);
  dateAtMidday.setMinutes(0);
  dateAtMidday.setSeconds(0);

  const dateDiff = moment(dateAtMidday).diff(startDateAtMidnight, "days");
  if (dateDiff < 0) return -1;
  if (dateDiff >= daysCount) return -1;
  return dateDiff;
}

export function getDateFromPosition(position: Number, startDate: Date): Date {
  return moment(startDate)
    .add(position, "days")
    .toDate();
}

export function getHoursArray(format24: boolean) {
  const hours = format24 ? { min: 0, max: 23 } : { min: 1, max: 12 };
  const arr = [];
  for (let i = hours.min; i <= hours.max; i++) {
    arr.push(`00${i}`.slice(-2));
  }
  return arr;
}

export function computeHourPosition(
  date: Date,
  hours: string[],
  format24?: boolean
) {
  let hour = date.getHours();
  if (!format24) {
    hour = hour % 12;
    if (hour == 0) hour = 12;
  }
  return Math.max(hours.findIndex(h => Number(h) === hour), 0);
}

export function computeAMPMPosition(date: Date) {
  const hour = date.getHours();
  return hour < 12 ? 0 : 1;
}

export function getFiveMinutesArray() {
  const arr = [];
  arr.push("00");
  arr.push("05");
  for (let i = 10; i < 60; i += 5) {
    arr.push(`${i}`);
  }
  return arr;
}

export function computeMinutePosition(date: Date, minutes: string[]) {
  const minute = date.getMinutes();
  const position = minutes.findIndex(m => Number(m) > minute) - 1;
  if (position < 0) return minutes.length - 1;
  return position;
}

export function getAmArray() {
  const arr = [];
  arr.push(AM);
  arr.push(PM);
  return arr;
}
