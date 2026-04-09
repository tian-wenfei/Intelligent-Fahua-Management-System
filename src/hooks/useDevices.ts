import { useState, useMemo, useCallback } from 'react';
import { Device, DeviceStats } from '../types';
import { mockDevices } from '../data/mockData';

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const stats: DeviceStats = useMemo(() => ({
    totalDevices: devices.length,
    onlineDevices: devices.filter(d => d.status === 'online').length,
    warningDevices: devices.filter(d => d.status === 'warning').length,
    errorDevices: devices.filter(d => d.status === 'error').length
  }), [devices]);

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchText.toLowerCase()) ||
                           device.location.toLowerCase().includes(searchText.toLowerCase());
      const matchesFilter = filterStatus === 'all' || device.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [devices, searchText, filterStatus]);

  const getDeviceById = useCallback((id: string) => {
    return devices.find(d => d.id === id);
  }, [devices]);

  const updateDevice = useCallback((id: string, updates: Partial<Device>) => {
    setDevices(prev => prev.map(device => 
      device.id === id ? { ...device, ...updates } : device
    ));
  }, []);

  return {
    devices,
    filteredDevices,
    stats,
    searchText,
    setSearchText,
    filterStatus,
    setFilterStatus,
    getDeviceById,
    updateDevice
  };
}

export function useAlerts() {
  const [alerts, setAlerts] = useState(mockDevices.flatMap(d => d.alerts));

  const unreadCount = useMemo(() => 
    alerts.filter(a => !a.isRead).length, 
    [alerts]
  );

  const markAsRead = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  }, []);

  const deleteAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  const counts = useMemo(() => ({
    critical: alerts.filter(a => a.level === 'critical' && !a.isRead).length,
    warning: alerts.filter(a => a.level === 'warning' && !a.isRead).length,
    info: alerts.filter(a => a.level === 'info' && !a.isRead).length
  }), [alerts]);

  return {
    alerts,
    unreadCount,
    counts,
    markAsRead,
    markAllAsRead,
    deleteAlert
  };
}
