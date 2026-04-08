import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Device, ControlCommand } from './src/types';
import { mockDevices } from './src/data/mockData';

export default function DeviceDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { deviceId } = route.params;

  const device = mockDevices.find(d => d.id === deviceId) || mockDevices[0];
  const [currentDevice, setCurrentDevice] = useState<Device>(device);

  const handleControl = (command: ControlCommand['command']) => {
    const commandText: Record<string, string> = {
      start: '启动',
      stop: '停止',
      pause: '暂停',
      resume: '恢复',
      reset: '重置'
    };

    Alert.alert(
      '确认操作',
      `确定要${commandText[command]}该设备吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            Alert.alert('操作成功', `${commandText[command]}命令已发送`);
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#999';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusSection}>
        <View style={styles.statusHeader}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(currentDevice.status) }]} />
          <Text style={styles.statusLabel}>
            {currentDevice.status === 'online' ? '运行中' :
             currentDevice.status === 'warning' ? '警告' :
             currentDevice.status === 'error' ? '故障' : '离线'}
          </Text>
        </View>
        <Text style={styles.deviceName}>{currentDevice.name}</Text>
        <Text style={styles.deviceLocation}>{currentDevice.location}</Text>
      </View>

      <View style={styles.metricsSection}>
        <Text style={styles.sectionTitle}>实时数据</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>🌡️</Text>
            <Text style={styles.metricValue}>{currentDevice.temperature}°C</Text>
            <Text style={styles.metricLabel}>当前温度</Text>
            <Text style={styles.metricTarget}>目标: {currentDevice.parameters.targetTemperature}°C</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>💧</Text>
            <Text style={styles.metricValue}>{currentDevice.humidity}%</Text>
            <Text style={styles.metricLabel}>当前湿度</Text>
            <Text style={styles.metricTarget}>目标: {currentDevice.parameters.targetHumidity}%</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>📊</Text>
            <Text style={styles.metricValue}>{currentDevice.fermentationProgress}%</Text>
            <Text style={styles.metricLabel}>发酵进度</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${currentDevice.fermentationProgress}%` }]} />
            </View>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>🌬️</Text>
            <Text style={styles.metricValue}>{currentDevice.parameters.ventilationRate}</Text>
            <Text style={styles.metricLabel}>通风速率</Text>
            <Text style={styles.metricUnit}>档位</Text>
          </View>
        </View>
      </View>

      <View style={styles.phaseSection}>
        <Text style={styles.sectionTitle}>发酵阶段</Text>
        <View style={styles.phaseCard}>
          <View style={styles.phaseHeader}>
            <Text style={styles.phaseName}>{currentDevice.currentPhase.name}</Text>
            <Text style={styles.phaseDuration}>预计时长: {currentDevice.currentPhase.duration}小时</Text>
          </View>
          <View style={styles.phaseProgress}>
            <View style={styles.progressBarLarge}>
              <View style={[styles.progressFillLarge, { width: `${currentDevice.currentPhase.progress}%` }]} />
            </View>
            <Text style={styles.phaseProgressText}>{currentDevice.currentPhase.progress}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.parametersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>设备参数</Text>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => navigation.navigate('ParameterAdjust', { deviceId: currentDevice.id })}
          >
            <Text style={styles.adjustButtonText}>调节参数</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.parametersGrid}>
          <View style={styles.paramItem}>
            <Text style={styles.paramLabel}>目标温度</Text>
            <Text style={styles.paramValue}>{currentDevice.parameters.targetTemperature}°C</Text>
          </View>
          <View style={styles.paramItem}>
            <Text style={styles.paramLabel}>目标湿度</Text>
            <Text style={styles.paramValue}>{currentDevice.parameters.targetHumidity}%</Text>
          </View>
          <View style={styles.paramItem}>
            <Text style={styles.paramLabel}>翻堆间隔</Text>
            <Text style={styles.paramValue}>{currentDevice.parameters.turningInterval}小时</Text>
          </View>
          <View style={styles.paramItem}>
            <Text style={styles.paramLabel}>发酵时长</Text>
            <Text style={styles.paramValue}>{currentDevice.parameters.fermentationDuration}天</Text>
          </View>
        </View>
      </View>

      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>时间信息</Text>
        <View style={styles.timeCard}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>开始时间</Text>
            <Text style={styles.timeValue}>{currentDevice.startTime}</Text>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>预计结束</Text>
            <Text style={styles.timeValue}>{currentDevice.estimatedEndTime}</Text>
          </View>
        </View>
      </View>

      <View style={styles.controlSection}>
        <Text style={styles.sectionTitle}>设备控制</Text>
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => handleControl('start')}
          >
            <Text style={styles.controlButtonText}>启动</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: '#FF9800' }]}
            onPress={() => handleControl('pause')}
          >
            <Text style={styles.controlButtonText}>暂停</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: '#F44336' }]}
            onPress={() => handleControl('stop')}
          >
            <Text style={styles.controlButtonText}>停止</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: '#2196F3' }]}
            onPress={() => handleControl('reset')}
          >
            <Text style={styles.controlButtonText}>重置</Text>
          </TouchableOpacity>
        </View>
      </View>

      {currentDevice.alerts.length > 0 && (
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>设备报警</Text>
          {currentDevice.alerts.map(alert => (
            <View key={alert.id} style={styles.alertCard}>
              <View style={[styles.alertBadge, { backgroundColor: getStatusColor(alert.level) }]}>
                <Text style={styles.alertBadgeText}>{alert.level === 'critical' ? '!' : '⚠'}</Text>
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{alert.timestamp}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  statusSection: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center'
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  statusLabel: {
    fontSize: 14,
    color: '#666'
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  deviceLocation: {
    fontSize: 14,
    color: '#999'
  },
  metricsSection: {
    padding: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  metricIcon: {
    fontSize: 28,
    marginBottom: 8
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  metricLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4
  },
  metricTarget: {
    fontSize: 11,
    color: '#4CAF50',
    marginTop: 4
  },
  metricUnit: {
    fontSize: 11,
    color: '#666',
    marginTop: 4
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2
  },
  phaseSection: {
    padding: 15,
    paddingTop: 0
  },
  phaseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  phaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  phaseDuration: {
    fontSize: 13,
    color: '#999'
  },
  phaseProgress: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  progressBarLarge: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10
  },
  progressFillLarge: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4
  },
  phaseProgressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  parametersSection: {
    padding: 15,
    paddingTop: 0
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  adjustButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500'
  },
  parametersGrid: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15
  },
  paramItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  paramLabel: {
    fontSize: 14,
    color: '#666'
  },
  paramValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  timeSection: {
    padding: 15,
    paddingTop: 0
  },
  timeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  timeLabel: {
    fontSize: 14,
    color: '#666'
  },
  timeValue: {
    fontSize: 14,
    color: '#333'
  },
  controlSection: {
    padding: 15,
    paddingTop: 0
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  alertsSection: {
    padding: 15,
    paddingTop: 0
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  alertBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  alertBadgeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  },
  alertContent: {
    flex: 1
  },
  alertMessage: {
    fontSize: 14,
    color: '#333'
  },
  alertTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4
  },
  bottomPadding: {
    height: 30
  }
});