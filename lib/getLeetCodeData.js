import axios from "axios";
import {
  contestQuery,
  statQuery,
  submissionCalendarQuery,
  userQuery,
} from "./query";

export const getLCRating = async (username) => {
  const response = await axios.post("https://leetcode.com/graphql", {
    query: contestQuery,
    variables: {
      username: username,
    },
  });
  if (response.data.data.userContestRanking.rating) {
    return Math.round(response.data.data.userContestRanking.rating);
  } else {
    return 0;
  }
};

export const getLeetCodeData = async (username) => {
  let leetCodeData = {};

  let response = await axios.post("https://leetcode.com/graphql", {
    query: userQuery,
    variables: {
      username: username,
    },
  });

  if (response.data.data) {
    leetCodeData["acSubmissionNum"] =
      response.data.data.matchedUser.submitStatsGlobal.acSubmissionNum;
  }

  response = await axios.post("https://leetcode.com/graphql", {
    query: submissionCalendarQuery,
    variables: {
      username: username,
      year: 2024,
    },
  });
  if (response.data.data) {
    leetCodeData["submissionCalendar"] = JSON.parse(
      response.data.data.matchedUser.userCalendar.submissionCalendar
    );
  }

  response = await axios.post("https://leetcode.com/graphql", {
    query: contestQuery,
    variables: {
      username: username,
    },
  });

  // if (response.data.data) {
  //   leetCodeData["userContestDetails"] = response.data.data.userContestRanking;
  //   leetCodeData["userContestDetails"]["contestParticipation"] =
  //     response.data.data.userContestRankingHistory.filter((item) => {
  //       if (item.attended === true) return item;
  //     });
  // }
  if (response.data.data) {
    const userContestRanking = response.data.data.userContestRanking;
    const userContestRankingHistory =
      response.data.data.userContestRankingHistory;

    // Check if userContestRanking and userContestRankingHistory exist
    if (userContestRanking && userContestRankingHistory) {
      leetCodeData["userContestDetails"] = userContestRanking;
      leetCodeData["userContestDetails"]["contestParticipation"] =
        userContestRankingHistory.filter((item) => item.attended === true);
    } else {
      // Handle case where userContestRanking or userContestRankingHistory is missing
      leetCodeData["userContestDetails"] = {
        contestParticipation: [],
      };
    }
  }

  response = await axios.post("https://leetcode.com/graphql", {
    query: statQuery,
    variables: {
      username: username,
    },
  });
  if (response.data.data) {
    leetCodeData["topicWiseAnalysis"] =
      response.data.data["matchedUser"]["tagProblemCounts"];
  }

  return leetCodeData;
};
