import { Device, Alert } from '../types';

export const mockDevices: Device[] = [
  {
    id: '1',
    name: '发花机 #1号',
    location: '茶厂一车间 A区',
    status: 'online',
    temperature: 32.5,
    humidity: 82,
    fermentationProgress: 65,
    currentPhase: {
      id: 'p1',
      name: '恒温发花阶段',
      duration: 48,
      progress: 65
    },
    startTime: '2026-04-01 08:00',
    estimatedEndTime: '2026-04-08 08:00',
    parameters: {
      targetTemperature: 32,
      targetHumidity: 85,
      ventilationRate: 5,
      turningInterval: 4,
      fermentationDuration: 7
    },
    alerts: []
  },
  {
    id: '2',
    name: '发花机 #2号',
    location: '茶厂一车间 B区',
    status: 'warning',
    temperature: 35.2,
    humidity: 78,
    fermentationProgress: 42,
    currentPhase: {
      id: 'p1',
      name: '升温发花阶段',
      duration: 24,
      progress: 42
    },
    startTime: '2026-04-02 10:00',
    estimatedEndTime: '2026-04-09 10:00',
    parameters: {
      targetTemperature: 32,
      targetHumidity: 85,
      ventilationRate: 5,
      turningInterval: 4,
      fermentationDuration: 7
    },
    alerts: [
      {
        id: 'a1',
        deviceId: '2',
        deviceName: '发花机 #2号',
        type: 'temperature',
        level: 'warning',
        message: '温度偏高，已超过目标温度2°C，建议检查通风系统',
        timestamp: '2026-04-03 14:30',
        isRead: false
      }
    ]
  },
  {
    id: '3',
    name: '发花机 #3号',
    location: '茶厂二车间 C区',
    status: 'online',
    temperature: 31.0,
    humidity: 86,
    fermentationProgress: 88,
    currentPhase: {
      id: 'p2',
      name: '降湿定型阶段',
      duration: 36,
      progress: 88
    },
    startTime: '2026-03-31 06:00',
    estimatedEndTime: '2026-04-07 06:00',
    parameters: {
      targetTemperature: 30,
      targetHumidity: 80,
      ventilationRate: 4,
      turningInterval: 6,
      fermentationDuration: 7
    },
    alerts: []
  },
  {
    id: '4',
    name: '发花机 #4号',
    location: '茶厂二车间 D区',
    status: 'error',
    temperature: 0,
    humidity: 0,
    fermentationProgress: 0,
    currentPhase: {
      id: 'p0',
      name: '设备故障',
      duration: 0,
      progress: 0
    },
    startTime: '-',
    estimatedEndTime: '-',
    parameters: {
      targetTemperature: 32,
      targetHumidity: 85,
      ventilationRate: 5,
      turningInterval: 4,
      fermentationDuration: 7
    },
    alerts: [
      {
        id: 'a2',
        deviceId: '4',
        deviceName: '发花机 #4号',
        type: 'system',
        level: 'critical',
        message: '设备通信中断，请检查网络连接和设备电源',
        timestamp: '2026-04-03 15:45',
        isRead: false
      }
    ]
  },
  {
    id: '5',
    name: '发花机 #5号',
    location: '茶厂三车间 E区',
    status: 'offline',
    temperature: 28.5,
    humidity: 75,
    fermentationProgress: 100,
    currentPhase: {
      id: 'p3',
      name: '发酵完成',
      duration: 168,
      progress: 100
    },
    startTime: '2026-03-25 08:00',
    estimatedEndTime: '2026-04-01 08:00',
    parameters: {
      targetTemperature: 30,
      targetHumidity: 80,
      ventilationRate: 3,
      turningInterval: 8,
      fermentationDuration: 7
    },
    alerts: [
      {
        id: 'a3',
        deviceId: '5',
        deviceName: '发花机 #5号',
        type: 'maintenance',
        level: 'info',
        message: '发酵已完成，请及时处理成品茶叶',
        timestamp: '2026-04-01 08:00',
        isRead: true
      }
    ]
  },
  {
    id: '6',
    name: '发花机 #6号',
    location: '茶厂三车间 F区',
    status: 'online',
    temperature: 33.8,
    humidity: 84,
    fermentationProgress: 25,
    currentPhase: {
      id: 'p1',
      name: '恒温发花阶段',
      duration: 72,
      progress: 25
    },
    startTime: '2026-04-03 08:00',
    estimatedEndTime: '2026-04-10 08:00',
    parameters: {
      targetTemperature: 33,
      targetHumidity: 85,
      ventilationRate: 6,
      turningInterval: 4,
      fermentationDuration: 7
    },
    alerts: []
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    deviceId: '2',
    deviceName: '发花机 #2号',
    type: 'temperature',
    level: 'warning',
    message: '温度偏高，已超过目标温度2°C，建议检查通风系统',
    timestamp: '2026-04-03 14:30',
    isRead: false
  },
  {
    id: 'a2',
    deviceId: '4',
    deviceName: '发花机 #4号',
    type: 'system',
    level: 'critical',
    message: '设备通信中断，请检查网络连接和设备电源',
    timestamp: '2026-04-03 15:45',
    isRead: false
  },
  {
    id: 'a3',
    deviceId: '5',
    deviceName: '发花机 #5号',
    type: 'maintenance',
    level: 'info',
    message: '发酵已完成，请及时处理成品茶叶',
    timestamp: '2026-04-01 08:00',
    isRead: true
  },
  {
    id: 'a4',
    deviceId: '1',
    deviceName: '发花机 #1号',
    type: 'humidity',
    level: 'warning',
    message: '湿度偏低，当前湿度78%，低于目标湿度85%',
    timestamp: '2026-04-03 10:15',
    isRead: false
  },
  {
    id: 'a5',
    deviceId: '3',
    deviceName: '发花机 #3号',
    type: 'maintenance',
    level: 'info',
    message: '设备运行正常，发酵进度已达88%，即将完成',
    timestamp: '2026-04-03 08:00',
    isRead: true
  },
  {
    id: 'a6',
    deviceId: '6',
    deviceName: '发花机 #6号',
    type: 'temperature',
    level: 'info',
    message: '温度略有上升，在可控范围内，持续监控中',
    timestamp: '2026-04-03 12:00',
    isRead: false
  },
  {
    id: 'a7',
    deviceId: '2',
    deviceName: '发花机 #2号',
    type: 'maintenance',
    level: 'info',
    message: '下次维护时间：2026-04-06，请提前做好准备',
    timestamp: '2026-04-02 09:00',
    isRead: true
  }
];