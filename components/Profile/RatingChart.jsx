"use client";
import React, { useRef, useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

const RatingChart = ({ data }) => {
  const [contests, setContests] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [dates, setDates] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    if (data && data.mergedContests) {
      setContests(data.mergedContests);
    }
  }, [data]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  useEffect(() => {
    if (contests.length > 0) {
      const sortedContests = contests.sort((a, b) => a.startTime - b.startTime);
      setRatings(sortedContests.map((item) => item.newRating));
      setDates(
        sortedContests.map((item) =>
          formatDate(item.startTime).substring(0, 10)
        )
      );
    }
  }, [contests]);

  useEffect(() => {
    if (ratings.length > 0 && dates.length > 0) {
      const ctx = chartRef.current.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgb(121, 178, 250, 0.7)");
      gradient.addColorStop(1, "rgb(121, 178, 250, 0)");

      const data = {
        labels: dates,
        datasets: [
          {
            label: "Rating",
            data: ratings,
            fill: true,
            backgroundColor: gradient,
            borderColor: "rgb(121,178,250,1)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `Rating: ${tooltipItem.raw}`,
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            min: Math.min(...ratings),
            max: Math.max(...ratings),
            ticks: {
              stepSize: 20,
            },
          },
        },
      };

      const myChart = new Chart(ctx, {
        type: "line",
        data: data,
        options: options,
      });

      return () => myChart.destroy();
    }
  }, [ratings, dates]);  

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ height: 300, width: "100%" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default RatingChart;
