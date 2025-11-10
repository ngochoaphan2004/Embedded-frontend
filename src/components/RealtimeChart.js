import React, { useEffect, useRef, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const RealtimeChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const now = new Date().toLocaleTimeString();
    const { temperature, humidity, soilMoisture, rainfall, waterLevel } = data;

    chart.data.labels.push(now);
    if (chart.data.labels.length > 10) chart.data.labels.shift();

    chart.data.datasets[0].data.push(temperature);
    chart.data.datasets[1].data.push(humidity);
    chart.data.datasets[2].data.push(soilMoisture);
    chart.data.datasets[3].data.push(rainfall);
    chart.data.datasets[4].data.push(waterLevel);

    chart.data.datasets.forEach((ds) => {
      if (ds.data.length > 10) ds.data.shift();
    });

    chart.update();
  }, [data]);

  const chartData = {
    labels: [],
    datasets: [
      { label: "Temperature (°C)", data: [], borderColor: "#ff7043", tension: 0.3 },
      { label: "Humidity (%)", data: [], borderColor: "#42a5f5", tension: 0.3 },
      { label: "Soil Moisture (%)", data: [], borderColor: "#66bb6a", tension: 0.3 },
      { label: "Rainfall (mm)", data: [], borderColor: "#7e57c2", tension: 0.3 },
      { label: "Water Level (cm)", data: [], borderColor: "#26a69a", tension: 0.3 },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Giá trị cảm biến",
        },
      },
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
      },
    },
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        mode: "nearest",
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}`,
        },
      },
    },
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 16,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>📊 Realtime Sensor Chart</h2>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default RealtimeChart;
