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

  data = await axios.get(
    "https://codeforces.com/api/user.status?handle=" + username
  );
  let count = 0;
  if (data.data.result.length > 0) {
    data.data.result.map((item) => {
      if (item.verdict === "OK" && item.author.participantType === "CONTESTANT")
        count++;
    });
  }

  const topicAnalysis = {
    advanced: [],
    intermediate: [],
    fundamental: [],
  };

  // Process each submission
  if (data.data.result.length > 0) {
    data.data.result.forEach((item) => {
      if (
        item.verdict === "OK" &&
        item.author.participantType === "CONTESTANT"
      ) {
        const { tags, rating } = item.problem;
        let category = "fundamental";
        if (rating >= 1800) category = "advanced";
        else if (rating >= 1200) category = "intermediate";

        tags.forEach((tag) => {
          // Find existing topic or create a new one
          let topic = topicAnalysis[category].find((t) => t.tagName === tag);
          if (!topic) {
            topic = {
              tagName: tag,
              tagSlug: tag.toLowerCase().replace(/\s+/g, "-"),
              problemsSolved: 0,
            };
            topicAnalysis[category].push(topic);
          }
          topic.problemsSolved++;
        });
      }
    });
  }

  codeForcesData["problemsSolvedCount"] = count;
  codeForcesData["topicAnalysis"] = topicAnalysis;

  return codeForcesData;
};
