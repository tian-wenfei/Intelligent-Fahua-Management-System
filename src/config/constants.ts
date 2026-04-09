export const STATUS_CONFIG = {
  online: { color: '#10B981', bgColor: '#ECFDF5', label: '运行中', icon: '🟢' },
  warning: { color: '#F59E0B', bgColor: '#FFFBEB', label: '警告', icon: '🟡' },
  error: { color: '#EF4444', bgColor: '#FEF2F2', label: '故障', icon: '🔴' },
  offline: { color: '#6B7280', bgColor: '#F3F4F6', label: '离线', icon: '⚫' }
} as const;

export const ALERT_CONFIG = {
  critical: {
    color: '#EF4444',
    bgColor: '#FEF2F2',
    borderColor: '#EF4444',
    label: '紧急',
    icon: '!'
  },
  warning: {
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    label: '警告',
    icon: '⚠'
  },
  info: {
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    borderColor: '#3B82F6',
    label: '提示',
    icon: 'ℹ'
  }
} as const;

export const TYPE_CONFIG = {
  temperature: { label: '温度异常', icon: '🌡️' },
  humidity: { label: '湿度异常', icon: '💧' },
  system: { label: '系统报警', icon: '⚙️' },
  maintenance: { label: '维护提醒', icon: '🔧' }
} as const;

export const getStatusConfig = (status: string) => 
  STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.offline;

export const getAlertConfig = (level: string) => 
  ALERT_CONFIG[level as keyof typeof ALERT_CONFIG] || ALERT_CONFIG.info;

export const getTypeConfig = (type: string) => 
  TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.system;

export const COLORS = {
  primary: '#10B981',
  secondary: '#4CAF50',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 26
} as const;
