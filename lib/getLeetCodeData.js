import axios from "axios";

export const getLeetCodeData = async (username) => {
  let leetCodeData = {};
  let data = await axios.get("https://leetcodeapi-v1.vercel.app/" + username);
  leetCodeData["acSubmissionNum"] =
    data.data[username]["submitStatsGlobal"]["acSubmissionNum"];

  data = await axios.get(
    "https://leetcodeapi-v1.vercel.app/contest/" + username
  );
  leetCodeData["userContestDetails"] = data.data["userContestDetails"];
  
  return leetCodeData;
};
