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

  data = await axios.get("https://codeforces.com/api/user.status?handle=" + username);
  let count = 0;
  if(data.data.result.length > 0) {
    data.data.result.map((item) => {
      if(item.verdict === 'OK' && item.author.participantType === 'CONTESTANT')  count++;
    })
  }

  codeForcesData["problemsSolvedCount"] = count;

  return codeForcesData;
};
