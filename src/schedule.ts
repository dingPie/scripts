import { scheduleJob, RecurrenceRule, Range } from "node-schedule";
import { beforeDate, messagingAtLunch } from "./utils/messaging";

const messagingRule = new RecurrenceRule();
messagingRule.tz = "Asia/Seoul";
messagingRule.dayOfWeek = [new Range(0, 6)];
messagingRule.hour = [new Range(10, 15)]; // 11시부터 4시까지
messagingRule.minute = 0;

export const testSchedule = scheduleJob(
  "testSchedule",
  messagingRule,
  (date) => {
    console.log("불러온 현재 시간: ", date.getHours());
    // P_TODO: function 적용
  }
);
