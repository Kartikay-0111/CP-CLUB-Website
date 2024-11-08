import axios from "axios";

export const getLeetCodeData = async (username) => {
  let leetCodeData = {};
  let data = await axios.get(
    "https://alfa-leetcode-api.onrender.com/userProfile/" + username
  );
  leetCodeData["acSubmissionNum"] =
    data.data["matchedUserStats"]["acSubmissionNum"];
  leetCodeData["submissionCalendar"] = data.data["submissionCalendar"];

  data = await axios.get(
    "https://alfa-leetcode-api.onrender.com/" + username + "/contest"
  );

  // console.log(data.data);
  leetCodeData["userContestDetails"] = data.data;

  data = await axios.get(
    "https://alfa-leetcode-api.onrender.com/skillStats/" + username
  );
  leetCodeData["topicWiseAnalysis"] =
    data.data["data"]["matchedUser"]["tagProblemCounts"];
  // data = await axios.get(
  //   "https://leetcodeapi-v1.vercel.app/contest/" + username
  // );

  return leetCodeData;
};
