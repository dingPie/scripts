import { Octokit } from "@octokit/rest";
import dayjs from "dayjs";

export const getRepoList = async ({
  auth,
  filterFn,
  dateCount = 30,
}: {
  auth: string;
  filterFn?: (...args: any) => boolean;
  dateCount: number;
}) => {
  const octokit = new Octokit({ auth });

  try {
    const response = await octokit.request("GET /user/repos", {
      affiliation: "organization_member", // "owner", //
      sort: "updated", // 최근 수정순으로 정렬
      direction: "desc", // 내림차순
      per_page: 100, // 한 페이지당 표시할 레포지토리 수
      visibility: "all", // private/public 모두 표시
      since: dayjs().subtract(dateCount, "d").toISOString(),
    });

    const filtered = response.data.filter((v) =>
      filterFn ? filterFn(v) : true
    );
    return filtered.map(({ name }) => name);
    // const;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw error;
  }
};
