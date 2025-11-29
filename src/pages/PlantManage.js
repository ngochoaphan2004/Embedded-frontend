import React, { useEffect, useState } from "react";
import Header from "../components/Header.js";
import Sidebar from "../components/Sidebar.js";
import SensorCard from "../components/SensorCard.js";
import {
  FaTemperatureHigh,
  FaWater,
  FaCloudRain,
  FaTint,
  FaLightbulb,
  FaPumpSoap,
  FaSeedling,
} from "react-icons/fa";
import api from "../services/api.js";

const PlantManage = () => {
  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    ledState: 0,
    pumpState: 0,
    rainfall: 0,
    soilMoisture: 0,
    waterLevel: 0,
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/data/realtime");
        const sensorData = res.data?.data;

        if (sensorData) setData(sensorData);
      } catch (error) {
        console.error("Lỗi tải dữ liệu cảm biến:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);


  const getStatus = (type, value) => {
    const colors = {
      low: "#b3e5fc",
      medium: "#fff59d",
      high: "#ef9a9a",
    };

    switch (type) {
      case "Temperature":
        if (value < 20) return { label: "Thấp", color: colors.low };
        if (value <= 30) return { label: "Trung bình", color: colors.medium };
        return { label: "Cao", color: colors.high };

      case "Humidity":
        if (value < 40) return { label: "Thấp", color: colors.low };
        if (value <= 70) return { label: "Trung bình", color: colors.medium };
        return { label: "Cao", color: colors.high };

      case "Soil Moisture":
        if (value < 30) return { label: "Thấp", color: colors.low };
        if (value <= 60) return { label: "Trung bình", color: colors.medium };
        return { label: "Cao", color: colors.high };

      case "Water Level":
        if (value < 10) return { label: "Thấp", color: colors.low };
        if (value <= 20) return { label: "Trung bình", color: colors.medium };
        return { label: "Cao", color: colors.high };

      case "Rainfall":
        if (value < 5) return { label: "Thấp", color: colors.low };
        if (value <= 15) return { label: "Trung bình", color: colors.medium };
        return { label: "Cao", color: colors.high };

      case "LED State":
      case "Pump State":
        return value === true
          ? { label: "Bật", color: "#c8e6c9" }
          : { label: "Tắt", color: "#ffcdd2" };

      default:
        return { label: "-", color: "#f5f5f5" };
    }
  };

  const toggleLED = async () => {
    const newState = !data.ledState;
    setData(prev => ({ ...prev, ledState: newState }));
    try {
      await api.post('/api/control/led', { action: newState ? "on" : "off" });
    } catch (error) {
      console.error('Error toggling LED:', error);
      setData(prev => ({ ...prev, ledState: !newState }));
    }
  };

  const togglePump = async () => {
    const newState = !data.pumpState;
    setData(prev => ({ ...prev, pumpState: newState }));
    try {
      await api.post('/api/control/pump', { action: newState ? "on" : "off" });
    } catch (error) {
      console.error('Error toggling Pump:', error);
      setData(prev => ({ ...prev, pumpState: !newState }));
    }
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
      <Header />
      <Sidebar />
      <main
        style={{
          marginLeft: 250,
          padding: 20,
          height: "calc(100vh - 140px)",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: "700",
            marginBottom: 30,
            color: "#333",
            textAlign: "center",
          }}
        >
          🌾 SmartFarm Realtime Dashboard
        </h1>
        <div style={{
          width: "100",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          justifyContent: "center",
          alignItems: "stretch",
        }}>

          {/* Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              { icon: <FaTemperatureHigh />, title: "Temperature", value: data.temperature, unit: "°C" },
              { icon: <FaTint />, title: "Humidity", value: data.humidity, unit: "%" },
              { icon: <FaSeedling />, title: "Soil Moisture", value: data.soilMoisture, unit: "%" },
              { icon: <FaCloudRain />, title: "Rainfall", value: data.rainfall, unit: "mm" },
              { icon: <FaWater />, title: "Water Level", value: data.waterLevel, unit: "cm" },
              { icon: <FaLightbulb />, title: "LED State", value: data.ledState, unit: "" },
              { icon: <FaPumpSoap />, title: "Pump State", value: data.pumpState, unit: "" },
            ].map((sensor) => {
              const status = getStatus(sensor.title, sensor.value);
              return (
                <SensorCard
                  key={sensor.title}
                  icon={sensor.icon}
                  title={sensor.title}
                  value={
                    sensor.title === "LED State" || sensor.title === "Pump State"
                      ? sensor.value === true
                        ? "ON"
                        : "OFF"
                      : sensor.value.toFixed(1)
                  }
                  unit={sensor.unit}
                  status={status.label}
                  bgColor={status.color}
                  onClick={
                    sensor.title === "LED State"
                      ? toggleLED
                      : sensor.title === "Pump State"
                      ? togglePump
                      : undefined
                  }
                />
              );
            })}
          </div>

        </div>
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "8px 12px",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            fontSize: 14,
            color: "#666",
            zIndex: 1000,
            whiteSpace: "nowrap",
          }}
        >
          💡 Click LED/Pump cards to toggle on/off.
        </div>
      </main>
    </div>
  );
};

export default PlantManage;
