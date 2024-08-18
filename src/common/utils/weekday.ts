import * as moment from "moment-timezone";

export const getWeekday = () =>
  moment().day() - 1 === -1 ? 6 : moment().day() - 1;
