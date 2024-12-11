import dayjs from "dayjs";

const getIsWeekend = (date?: string) => {
  const day = dayjs(date).day();
  return day === 0 || day === 6;
};

//   20시 ~ 07시
export const getOvertime = (date?: string) => {
  const isWeekend = getIsWeekend(date);
  const isTodayOvertime = dayjs(date).hour() >= 20;
  const isTomorrowOvertime = dayjs(date).hour() <= 6;

  if (isTomorrowOvertime) {
    const result = dayjs(date).subtract(1, "d");

    return {
      key: result.format("YYYY-MM-DD"),
      value: dayjs(date).format("YYYY-MM-DD HH:mm"),
    };
  } else if (isWeekend || isTodayOvertime) {
    return {
      key: dayjs(date).format("YYYY-MM-DD"),
      value: dayjs(date).format("YYYY-MM-DD HH:mm"),
    };
  } else {
    return null;
  }
};
