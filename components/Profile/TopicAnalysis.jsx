import React, { useState } from "react";

const TopicAnalysis = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Merge all levels (advanced, intermediate, fundamental) into a single array
  const mergedTopics = [
    ...(data.advanced || []),
    ...(data.intermediate || []),
    ...(data.fundamental || []),
  ];

  // Determine how many items to display based on the expanded state
  const displayedItems = isExpanded ? mergedTopics : mergedTopics.slice(0, 15);

  return (
    <div className="flex flex-col gap-4 justify-center w-full">
      <div className="flex gap-4 flex-wrap text-sm">
        {displayedItems.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <span className="px-4 py-2 bg-gray-200 rounded-full">
              {item.tagName}
            </span>
            <span>x {item.problemsSolved}</span>
          </div>
        ))}
      </div>
      {mergedTopics.length > 15 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:underline mt-2"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default TopicAnalysis;
