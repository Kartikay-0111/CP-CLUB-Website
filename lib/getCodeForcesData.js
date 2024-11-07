import axios from "axios";

export const getCodeForcesData = async (username) => {
  let codeForcesData = {};
  let data = await axios.get(
    " https://codeforces.com/api/user.info?handles=" + username
  );
  codeForcesData = data.data["result"][0];

  data = await axios.get(
    "https://codeforces.com/api/user.rating?handle=" + username
  );
  codeForcesData["ratingData"] = data.data["result"];

  return codeForcesData;
};
