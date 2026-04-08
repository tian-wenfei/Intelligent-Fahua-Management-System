export interface Device {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  temperature: number;
  humidity: number;
  fermentationProgress: number;
  currentPhase: FermentationPhase;
  startTime: string;
  estimatedEndTime: string;
  parameters: FermentationParameters;
  alerts: Alert[];
}

export interface FermentationParameters {
  targetTemperature: number;
  targetHumidity: number;
  ventilationRate: number;
  turningInterval: number;
  fermentationDuration: number;
}

export interface FermentationPhase {
  id: string;
  name: string;
  duration: number;
  progress: number;
}

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'temperature' | 'humidity' | 'system' | 'maintenance';
  level: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface DeviceStats {
  totalDevices: number;
  onlineDevices: number;
  warningDevices: number;
  errorDevices: number;
}

export interface ControlCommand {
  deviceId: string;
  command: 'start' | 'stop' | 'pause' | 'resume' | 'reset';
  parameters?: Partial<FermentationParameters>;
}