import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import RealtimeChart from "../components/RealtimeChart"
function AnalyticsPage() {
  const [analysis, setAnalysis] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedDevice, setSelectedDevice] = useState('history_sensor_data');

  const sensors = [
    { key: "temperature", label: "Temperature (°C)", color: "#ff7043" },
    { key: "humidity", label: "Humidity (%)", color: "#42a5f5" },
    { key: "soilMoisture", label: "Soil Moisture (%)", color: "#66bb6a" },
    { key: "rainfall", label: "Rainfall (mm)", color: "#7e57c2" },
    { key: "waterLevel", label: "Water Level (cm)", color: "#26a69a" },
  ];

  const periods = [
    { value: '1day', label: '1 ngày' },
    { value: '7days', label: '7 ngày' },
    { value: '1month', label: '1 tháng' },
    { value: '3months', label: '3 tháng' },
  ];

  const devices = [
    { value: 'history_sensor_data', label: 'Thiết bị 0' },
    { value: 'device1', label: 'Thiết bị 1' },
    { value: 'device2', label: 'Thiết bị 2' },
    { value: 'device3', label: 'Thiết bị 3' },
    { value: 'device4', label: 'Thiết bị 4' },
  ];

  const getFromDate = (period) => {
    const now = new Date();
    switch (period) {
      case '1day':
        return new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      case '7days':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '1month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '3months':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  };

  useEffect(() => {
    setLoading(true);
    const from = getFromDate(selectedPeriod);
    const params = { from: from };
    if (selectedDevice !== 'history_sensor_data') {
      params.device = selectedDevice;
    }
    api.get("/api/data/history", { params }).then(res => {
      setAnalysis(res.data.data)
      setLoading(false);
    })
  }, [selectedPeriod, selectedDevice]);


  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 60, zIndex: 1000 }}>
        <Header />
      </div>

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 60,
        left: 0,
        width: 250,
        bottom: 0,
        overflowY: 'auto',
        backgroundColor: '#f0f0f0',
        zIndex: 900
      }}>
        <Sidebar />
      </div>

      {/* Nội dung chính */}
      <main
        style={{
          marginTop: 60,
          marginLeft: 250,
          padding: 24,
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 60px)',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {loading ? (<p style={{ paddingTop: 100, textAlign: 'center' }}>Đang tải dữ liệu phân tích...</p>) :
          <>
            <h1
              style={{
                fontSize: 28,
                fontWeight: "700",
                marginBottom: 20,
                color: "#333",
                textAlign: "center",
              }}
            >📊 Data Analytics</h1>

            <div style={{ textAlign: 'center', marginBottom: 30, display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <label htmlFor="device-select" style={{ marginRight: 10, fontWeight: 'bold' }}>Chọn thiết bị:</label>
                <select
                  id="device-select"
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    fontSize: 16,
                  }}
                >
                  {devices.map(device => (
                    <option key={device.value} value={device.value}>{device.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="period-select" style={{ marginRight: 10, fontWeight: 'bold' }}>Chọn khoảng thời gian:</label>
                <select
                  id="period-select"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    fontSize: 16,
                  }}
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>{period.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "20px",
                justifyContent: "center",
                alignItems: "stretch",
                width: "100%",
              }}
            >
              {sensors.map(sensor => {
                return <RealtimeChart key={sensor.key} sensor={sensor} data={analysis} />
              })}
            </div>
          </>
        }
      </main>
    </div>
  );
}


export default AnalyticsPage;
