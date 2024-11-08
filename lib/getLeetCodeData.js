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

  console.log(data.data);
  // data = await axios.get(
  //   "https://leetcodeapi-v1.vercel.app/contest/" + username
  // );
  leetCodeData["userContestDetails"] = data.data;
  
  return leetCodeData;
};
