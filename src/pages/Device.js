import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SensorCard from '../components/SensorCard';
import api from '../services/api';

function Device() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await api.get('/api/devices');
        const deviceData = res.data?.data || [];
        const formattedDevices = deviceData.map(device => ({
          value: device.name,
          label: `Thiết bị ${device.name.replace('device', '')}`,
          status: device.status ? 'On' : 'Off'
        }));
        setDevices(formattedDevices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching devices:', error);
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const toggleDevice = (device) => {
    setConfirmMessage(`Bạn có muốn ${device.status === 'On' ? 'tắt' : 'bật'} thiết bị ${device.label}?`);
    setOnConfirmAction(() => async () => {
      try {
        const action = device.status === 'On' ? 'off' : 'on';
        await api.post(`/api/device/${device.value}/${action}`);
        // Update local state
        setDevices(prev => prev.map(d => d.value === device.value ? { ...d, status: d.status === 'On' ? 'Off' : 'On' } : d));
      } catch (error) {
        console.error('Error toggling device:', error);
        alert('Lỗi khi bật/tắt thiết bị');
      }
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

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
        {loading ? (
          <p style={{ paddingTop: 100, textAlign: 'center' }}>Đang tải dữ liệu thiết bị...</p>
        ) : (
          <>
            <h1 style={{ fontSize: 28, fontWeight: "700", marginBottom: 20, color: "#333", textAlign: "center" }}>
              ⚙️ Quản lý Thiết bị
            </h1>

            <div style={{ textAlign: 'left', marginBottom: 30, color: '#666', fontSize: '14px', maxWidth: '600px', margin: '0 auto 30px auto' }}>
              <p>Đây là trang quản lý trạng thái của các thiết bị. Nhấn vào thẻ thiết bị để thay đổi trạng thái.</p>
              <ul>
                <li>"Bật": Thiết bị đang hoạt động.</li>
                <li>"Tắt": Thiết bị không hoạt động do lỗi hoặc phát nhiệt bất thường trong dữ liệu gửi về. Tắt để đảm bảo hệ thống hoạt động đúng. </li>
              </ul>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
                justifyContent: "center",
                alignItems: "stretch",
                width: "100%",
              }}
            >
              {devices.map(device => (
                <SensorCard
                  key={device.value}
                  icon="💡"
                  title={device.label}
                  value={device.status === 'On' ? 'Bật' : 'Tắt'}
                  unit=""
                  status={device.status}
                  bgColor={device.status === 'On' ? '#c8e6c9' : '#ffcdd2'}
                  onClick={() => toggleDevice(device)}
                />
              ))}
            </div>
          </>
        )}
      </main>

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
}

export default Device;
