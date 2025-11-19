import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const RealtimeChart = ({ data, sensor }) => {

  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    scales: {
      y: {
        beginAtZero: false,
        title: { display: true, text: "Giá trị" },
      },
      x: {
        title: { display: true, text: "Thời gian" },
        ticks: { autoSkip: true, maxTicksLimit: 8 },
      },
    },
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}`,
        },
      },
    },
  };

  const chartData = {
    labels: sortedData.map((d) => d.dateTime),
    datasets: [
      {
        label: sensor.label,
        data: sortedData.map((d) => d[sensor.key]),
        backgroundColor: sensor.color,
        borderColor: sensor.color,
        borderWidth: 1,
      },
    ],
  };

  return (
      <div
        key={sensor.key}
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 16,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: 10 }}>{sensor.label}</h3>
        <Bar data={chartData} options={options} height={250}  />
      </div>
  );
};

export default RealtimeChart;
