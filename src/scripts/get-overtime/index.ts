import dayjs from "dayjs";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getCommitList } from "./utils/get-commit-list";

import * as fs from "fs";

import { convertJsonToExcel } from "./utils/convert-json-to-excel";
import { getOvertime } from "./utils/get-overtime";
import { getRepoList } from "./utils/get-repo-list";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

// P_TODO: 자료구조를 username / date로 바꿔야할듯.
export interface OvertimeHoursByPersonType {
  [date: string]: {
    [username: string]: string;
  };
}

const main = async ({
  auth,
  owner,
  dateCount = 30,
  fileName = `./output/${Date.now()}_test`,
}: {
  auth: string;
  owner: string;
  dateCount?: number;
  fileName?: string;
}) => {
  try {
    const overtimeHoursByPerson: OvertimeHoursByPersonType = Array(dateCount)
      .fill(0)
      .reduce((acc, cur, i) => {
        const date = dayjs()
          .subtract(dateCount - i, "d")
          .format("YYYY-MM-DD");
        acc[date] = {};
        return acc;
      }, {});

    console.log("초기화 성공...");

    const repoList = await getRepoList({ dateCount, auth });

    console.log(
      `repository 목록 받아오기 성공: ${repoList.length}개의 레포지토리`
    );
    console.log(`총 커밋 목록 받아오기 시작`);

    const promiseCommit = repoList?.map(async (repo) => {
      const commits = await getCommitList({
        auth,
        owner,
        repo,
        dateCount,
      });

      return commits;
    });

    const commitList = (await Promise.all(promiseCommit)).flat(2);

    console.log(`총 커밋 목록 받아오기 완료`);

    commitList.map(async ({ commit, author }) => {
      const name = author?.login ?? "";
      const overTime = getOvertime(commit.author?.date);
      if (!!overTime) {
        const { key, value } = overTime;

        if (!overtimeHoursByPerson[key]) overtimeHoursByPerson[key] = {};
        if (!overtimeHoursByPerson[key][name]) {
          overtimeHoursByPerson[key][name] = value;
        } else {
          const prevValue = overtimeHoursByPerson[key][name];
          if (dayjs(value).isAfter(prevValue)) {
            overtimeHoursByPerson[key][name] = value;
          }
        }
      }
    });

    // JSON 파일로 쓰기 (임시주석)
    const sortedList = Object.entries(overtimeHoursByPerson).sort(
      ([a], [b]) => {
        return dayjs(a).diff(b);
      }
    );
    const result = sortedList.reduce((acc, cur) => {
      acc[cur[0]] = cur[1];
      return acc;
    }, {} as OvertimeHoursByPersonType);
    fs.writeFile(`${fileName}.json`, JSON.stringify(result), (err) => {
      if (err) {
        throw `실패 ${err}`;
      }
    });

    convertJsonToExcel({ jsonData: overtimeHoursByPerson, fileName });
    console.log(`엑셀파일 생성완료`);
  } catch (error) {
    console.log("오류가 발생하였습니다:", error);
  }
};

const OWNER = "TOKTOKHAN-DEV";
const DATE_COUNT = 90;

if (process.env.GIT_ACCESS_TOKEN) {
  main({
    auth: process.env.GIT_ACCESS_TOKEN,
    owner: OWNER,
    dateCount: DATE_COUNT,
    fileName: `./output/${dayjs().format("YYYY-MM-DD")}_야근일지`,
  });
}
