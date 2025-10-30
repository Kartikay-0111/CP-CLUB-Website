import axios from "axios";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

async function fetchContestRankingHistory(username) {
  const query = `
        query userContestRankingInfo($username: String!) {
            userContestRankingHistory(username: $username) {
                attended
                ranking
                contest {
                    title
                    startTime
                }
            }
        }
    `;

  const variables = { username };

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      { query, variables },
      { timeout: 5000 } // 5-second timeout for the API request
    );

    if (response.data?.data?.userContestRankingHistory) {
      return response.data.data.userContestRankingHistory.map((contest) => ({
        ranking: contest.ranking,
        contestTitle: contest.contest.title,
        contestStartTime: contest.contest.startTime,
      }));
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      `Error fetching contest data for ${username}:`,
      error.message
    );
    return null;
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  const contestName =
    url.searchParams.get("contestName") || "weekly-contest-422";

  // Load the user list from the JSON file
  const filePath = path.resolve(process.cwd(), "json/members.json");
  let users;

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    users = JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return NextResponse.json(
      { error: "Failed to read users file" },
      { status: 500 }
    );
  }

  const userHandles = Object.values(users).map((user) => user.lc_username);

  // Fetch contest data for all users in parallel
  const contestPromises = userHandles.map(async (handle) => {
    const user = Object.values(users).find((u) => u.lc_username === handle);
    const contestData = await fetchContestRankingHistory(handle);

    if (contestData && contestData.length > 0) {
      const filteredContestData = contestData.filter(
        (contest) =>
          contest.contestTitle
            .toLowerCase()
            .includes(contestName.toLowerCase()) && contest.ranking !== 0
      );

      if (filteredContestData.length > 0) {
        // Add the key of the user object as the `ref` attribute
        const ref = Object.keys(users).find((key) => users[key].lc_username === handle);
        return {
          name: user.name,
          handle,
          standing: filteredContestData[0].ranking ? filteredContestData[0].ranking : "-",
          ref,  // The key (e.g., "urabhay10") will be sent here
        };
      }
    }
    return null;
  });

  // Await all promises and filter out null values
  const results = (await Promise.all(contestPromises)).filter(
    (result) => result !== null
  );

  // Respond with the filtered results
  return NextResponse.json(results);
}
