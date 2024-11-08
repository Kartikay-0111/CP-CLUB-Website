import React, { useState } from "react";

const TopicAnalysis = ({ data }) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleExpand = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="flex flex-col gap-4 justify-center w-full">
      {Object.entries(data).map(([category, items]) => {
        const isExpanded = expandedCategories[category];
        const displayedItems = isExpanded ? items : items.slice(0, 3);

        return (
          <div key={category} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">‣</span>
              <span className="font-semibold text-sm uppercase ">
                {category}
              </span>
            </div>
            <div className="flex gap-4 flex-wrap">
              {displayedItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="px-4 py-2 bg-gray-200 rounded-full">
                    {item.tagName}
                  </span>
                  <span>x {item.problemsSolved}</span>
                </div>
              ))}
            </div>
            {items.length > 3 && (
              <button
                onClick={() => toggleExpand(category)}
                className="hover:underline"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TopicAnalysis;
