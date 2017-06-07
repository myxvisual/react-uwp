const dayShortList = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const dayList = ["Sunday ", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthShortList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function addDays(d: Date, days: number) {
  const newDate = cloneDate(d);
  newDate.setDate(d.getDate() + days);
  return newDate;
}

export function addMonths(d: Date, months: number) {
  const newDate = cloneDate(d);
  newDate.setMonth(d.getMonth() + months);
  return newDate;
}

export function addYears(d: Date, years: number) {
  const newDate = cloneDate(d);
  newDate.setFullYear(d.getFullYear() + years);
  return newDate;
}

export function cloneDate(d: Date) {
  return new Date(d.getTime());
}

export function cloneAsDate(d: Date) {
  const clonedDate = cloneDate(d);
  clonedDate.setHours(0, 0, 0, 0);
  return clonedDate;
}

export function getFirstDayOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function getLastDayOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function getLastDayOfPrevMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 0);
}

export {
  dayShortList,
  dayList,
  monthShortList,
  monthList
};
