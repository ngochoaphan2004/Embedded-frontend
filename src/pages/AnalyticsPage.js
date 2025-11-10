import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import RealtimeChart from "../components/RealtimeChart"
function AnalyticsPage() {
  const [analysis, setAnalysis] = useState();
  const [loading, setLoading] = useState(true);

  const sensors = [
    { key: "temperature", label: "Temperature (°C)", color: "#ff7043" },
    { key: "humidity", label: "Humidity (%)", color: "#42a5f5" },
    { key: "soilMoisture", label: "Soil Moisture (%)", color: "#66bb6a" },
    { key: "rainfall", label: "Rainfall (mm)", color: "#7e57c2" },
    { key: "waterLevel", label: "Water Level (cm)", color: "#26a69a" },
  ];

  useEffect(() => {
    const now = new Date()
    const pre = new Date(now.getTime() - 24 * 60 * 60 * 1000) // last 24 hours
    api.get("/api/data/history", {
      params: {
        from: pre
      }
    }).then(res => {
      setAnalysis(res.data.data)
      setLoading(false);
    })
  }, []);


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
                marginBottom: 30,
                color: "#333",
                textAlign: "center",
              }}
            >📊 Data Analytics</h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(600px, 1fr))",
                gap: "30px",
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
