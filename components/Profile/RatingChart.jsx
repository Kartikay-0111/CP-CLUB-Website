import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

const RatingChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgb(121, 178, 250, 0.7)");
    gradient.addColorStop(1, "rgb(121, 178, 250, 0)");

    const data = {
      labels: ["01 Sep", "07 Sep", "14 Sep", "21 Sep", "28 Sep"],
      datasets: [
        {
          label: "Rating",
          data: [1420, 1440, 1460, 1480, 1504],
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
      maintainAspectRatio: false,
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
        y: {
          min: 1420,
          max: 1520,
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
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div style={{ height: 300 }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default RatingChart;
