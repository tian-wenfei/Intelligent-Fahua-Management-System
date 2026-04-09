import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getStatusConfig } from '../config/constants';
import { Device } from '../types';

interface DeviceCardProps {
  device: Device;
  onPress: (deviceId: string) => void;
  compact?: boolean;
}

export function DeviceCard({ device, onPress, compact = false }: DeviceCardProps) {
  const statusConfig = getStatusConfig(device.status);

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      onPress={() => onPress(device.id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.deviceInfoRow}>
          <View style={[styles.statusIndicator, { backgroundColor: statusConfig.color }]}>
            <Text style={styles.statusIcon}>{statusConfig.icon}</Text>
          </View>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceLocation}>📍 {device.location}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
          <Text style={[styles.statusBadgeText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <View style={[styles.metricIconBg, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.metricIcon}>🌡️</Text>
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{device.temperature}°C</Text>
            <Text style={styles.metricLabel}>温度</Text>
          </View>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <View style={[styles.metricIconBg, { backgroundColor: '#DBEAFE' }]}>
            <Text style={styles.metricIcon}>💧</Text>
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{device.humidity}%</Text>
            <Text style={styles.metricLabel}>湿度</Text>
          </View>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <View style={[styles.metricIconBg, { backgroundColor: '#D1FAE5' }]}>
            <Text style={styles.metricIcon}>📈</Text>
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{device.fermentationProgress}%</Text>
            <Text style={styles.metricLabel}>进度</Text>
          </View>
        </View>
      </View>

      <View style={styles.phaseSection}>
        <View style={styles.phaseInfo}>
          <Text style={styles.phaseLabel}>当前阶段</Text>
          <View style={[styles.phaseTag, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={[styles.phaseTagText, { color: statusConfig.color }]}>
              {device.currentPhase.name}
            </Text>
          </View>
        </View>
        <View style={styles.phaseProgress}>
          <Text style={styles.phaseProgressText}>{device.currentPhase.progress}%</Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${device.fermentationProgress}%`, backgroundColor: statusConfig.color }
            ]}
          />
        </View>
      </View>

      {!compact && (
        <View style={styles.cardFooter}>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>开始时间</Text>
            <Text style={styles.timeValue}>{device.startTime}</Text>
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>预计结束</Text>
            <Text style={styles.timeValue}>{device.estimatedEndTime}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5
  },
  cardCompact: {
    padding: 14,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  deviceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  statusIndicator: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  statusIcon: {
    fontSize: 22
  },
  deviceInfo: {
    flex: 1
  },
  deviceName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4
  },
  deviceLocation: {
    fontSize: 13,
    color: '#6B7280'
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600'
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  metricIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  metricIcon: {
    fontSize: 18
  },
  metricContent: {
    alignItems: 'flex-start'
  },
  metricValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151'
  },
  metricLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8
  },
  phaseSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  phaseInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  phaseLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 8
  },
  phaseTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  phaseTagText: {
    fontSize: 12,
    fontWeight: '600'
  },
  phaseProgress: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  phaseProgressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981'
  },
  progressBarContainer: {
    marginBottom: 14
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  timeInfo: {
    alignItems: 'flex-start'
  },
  timeLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2
  },
  timeValue: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500'
  }
});
