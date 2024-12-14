import { Octokit } from "@octokit/rest";
import dayjs from "dayjs";
import dotenv from "dotenv";

dotenv.config();

interface GetCommitProps {
  auth: string;
  owner: string;
  repo: string;
  author?: string;
  dateCount?: number;
}

export const getCommitList = async ({
  auth,
  owner,
  repo,
  dateCount = 30,
  author,
}: GetCommitProps) => {
  try {
    const octokit = new Octokit({ auth });
    const since = dayjs().subtract(dateCount, "d").toISOString();

    const data = await octokit.paginate("GET /repos/{owner}/{repo}/commits", {
      owner,
      repo,
      author: author ? author : undefined,
      since,
    });
    const commitList = data.map((v) => v.commit);

    return data;
  } catch (error) {
    console.error("Error fetching commits:", error);
    throw error;
  }
};
