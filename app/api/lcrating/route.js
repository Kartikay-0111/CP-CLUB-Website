import axios from "axios";
import { NextResponse } from "next/server";

// Function to fetch the LeetCode rating for a given username
async function fetchLCRating(username) {
  const query = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        rating
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

    if (response.data?.data?.userContestRanking?.rating) {
      return Math.round(response.data.data.userContestRanking.rating);
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching rating for ${username}:`, error.message);
    return null;
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  const username = url.searchParams.get("username");

  // If no username is provided, return an error
  if (!username) {
    return NextResponse.json(
      { error: "Username parameter is required" },
      { status: 400 }
    );
  }

  // Fetch the LeetCode rating for the specified username
  const rating = await fetchLCRating(username);

  // Return the rating if available, else return null
  if (rating !== null) {
    return NextResponse.json({ rating });
  } else {
    return NextResponse.json({ rating: null });
  }
}
