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
    latestData: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState('');
  const [modalData, setModalData] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [devices, setDevices] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/data/realtime");
        const sensorData = res.data?.data;

        if (sensorData) setData({ ...sensorData, latestData: sensorData.latestData || [] });
      } catch (error) {
        console.error("Lỗi tải dữ liệu cảm biến:", error);
      }
    };

    const fetchDevices = async () => {
      try {
        const res = await api.get('/api/devices');
        const deviceData = res.data?.data || [];
        const formattedDevices = deviceData.map(device => ({
          value: device.name,
          label: `Thiết bị ${device.name.replace('device', '')}`,
          status: device.status ? 'Bật' : 'Tắt'
        }));
        setDevices(formattedDevices);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchData();
    fetchDevices();
    const interval = setInterval(() => {
      fetchData();
      fetchDevices();
    }, 10000);
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

  const toggleLED = () => {
    setConfirmMessage(`Bạn có muốn ${data.ledState ? 'tắt' : 'bật'} đèn LED?`);
    setOnConfirmAction(() => async () => {
      const newState = !data.ledState;
      setData(prev => ({ ...prev, ledState: newState }));
      try {
        await api.post('/api/control/led', { action: newState ? "on" : "off" });
      } catch (error) {
        console.error('Error toggling LED:', error);
        setData(prev => ({ ...prev, ledState: !newState }));
      }
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const togglePump = () => {
    setConfirmMessage(`Bạn có muốn ${data.pumpState ? 'tắt' : 'bật'} máy bơm?`);
    setOnConfirmAction(() => async () => {
      const newState = !data.pumpState;
      setData(prev => ({ ...prev, pumpState: newState }));
      try {
        await api.post('/api/control/pump', { action: newState ? "on" : "off" });
      } catch (error) {
        console.error('Error toggling Pump:', error);
        setData(prev => ({ ...prev, pumpState: !newState }));
      }
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
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
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}>

          {/* Device Status Widget */}
          {devices.length > 0 && (
            <div>
              <h3 style={{ textAlign: 'center', marginBottom: 10, color: '#333', fontSize: '18px' }}>Trạng thái Thiết bị</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                  justifyContent: "center",
                  alignItems: "stretch",
                }}
              >
                {devices.map(device => (
                  <SensorCard
                    key={device.value}
                    icon="💡"
                    title={device.label}
                    value={device.status}
                    unit=""
                    status={device.status}
                    bgColor={device.status === 'Bật' ? '#c8e6c9' : '#ffcdd2'}
                  />
                ))}
              </div>
            </div>
          )}

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
                      : () => {
                          setSelectedSensor(sensor.title);
                          setModalData(data.latestData);
                          setShowModal(true);
                        }
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

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(5px)',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '30px',
              borderRadius: '16px',
              maxWidth: '95%',
              maxHeight: '85%',
              overflow: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid #e0e0e0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
                📊 {selectedSensor} - Latest Data
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '5px',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>DateTime</th>
                    <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>Temperature (°C)</th>
                    <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>Humidity (%)</th>
                    <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>Soil Moisture (%)</th>
                    <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>Water Level (cm)</th>
                    <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>Rainfall (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {modalData.map((item, index) => {
                    const date = new Date(item.dateTime._seconds * 1000 + item.dateTime._nanoseconds / 1000000);
                    const formattedDate = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                    return (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.target.closest('tr').style.backgroundColor = '#e9ecef'} onMouseOut={(e) => e.target.closest('tr').style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa'}>
                        <td style={{ border: '1px solid #dee2e6', padding: '12px', color: '#495057' }}>{formattedDate}</td>
                        <td style={{ border: '1px solid #dee2e6', padding: '12px', color: '#495057' }}>{item.temperature.toFixed(2)}</td>
                        <td style={{ border: '1px solid #dee2e6', padding: '12px', color: '#495057' }}>{item.humidity.toFixed(2)}</td>
                        <td style={{ border: '1px solid #dee2e6', padding: '12px', color: '#495057' }}>{item.soilMoisture.toFixed(2)}</td>
                        <td style={{ border: '1px solid #dee2e6', padding: '12px', color: '#495057' }}>{item.waterLevel.toFixed(2)}</td>
                        <td style={{ border: '1px solid #dee2e6', padding: '12px', color: '#495057' }}>{item.rainfall.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(5px)',
          }}
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '30px',
              borderRadius: '16px',
              maxWidth: '400px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid #e0e0e0',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px' }}>
              Xác nhận
            </h2>
            <p style={{ margin: '0 0 30px 0', color: '#666' }}>
              {confirmMessage}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Hủy
              </button>
              <button
                onClick={onConfirmAction}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantManage;
