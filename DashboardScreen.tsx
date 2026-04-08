import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Device, DeviceStats, Alert } from './src/types';
import { mockDevices, mockAlerts } from './src/data/mockData';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DeviceStats>({
    totalDevices: 0,
    onlineDevices: 0,
    warningDevices: 0,
    errorDevices: 0
  });
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const devices = mockDevices;
    setStats({
      totalDevices: devices.length,
      onlineDevices: devices.filter(d => d.status === 'online').length,
      warningDevices: devices.filter(d => d.status === 'warning').length,
      errorDevices: devices.filter(d => d.status === 'error').length
    });
    setRecentAlerts(mockAlerts.slice(0, 5));
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadData();
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return '#EF4444';
      case 'warning': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  const getAlertBgColor = (level: string) => {
    switch (level) {
      case 'critical': return '#FEF2F2';
      case 'warning': return '#FFFBEB';
      default: return '#EFF6FF';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>智能发花监控平台</Text>
            <Text style={styles.headerSubtitle}>实时动态监控</Text>
          </View>
          <View style={styles.headerIcon}>
            <Image 
              source={require('./assets/logo.png')} 
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalDevices}</Text>
            <Text style={styles.statLabel}>设备</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#90EE90' }]}>{stats.onlineDevices}</Text>
            <Text style={styles.statLabel}>运行中</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#FFD700' }]}>{stats.warningDevices}</Text>
            <Text style={styles.statLabel}>警告</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#FF6B6B' }]}>{stats.errorDevices}</Text>
            <Text style={styles.statLabel}>故障</Text>
          </View>
        </View>
      </View>

      <View style={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>实时监控</Text>
            <TouchableOpacity onPress={() => navigation.navigate('设备')}>
              <Text style={styles.viewAllText}>查看全部 ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.deviceGrid}>
            {mockDevices.slice(0, 4).map(device => (
              <TouchableOpacity
                key={device.id}
                style={styles.deviceCard}
                onPress={() => navigation.navigate('DeviceDetail', { deviceId: device.id })}
                activeOpacity={0.7}
              >
                <View style={styles.deviceCardHeader}>
                  <View style={[styles.deviceStatusDot, { backgroundColor: getStatusColor(device.status) }]} />
                  <Text style={styles.deviceStatusText}>
                    {device.status === 'online' ? '运行中' : device.status === 'warning' ? '警告' : device.status === 'error' ? '故障' : '离线'}
                  </Text>
                </View>

                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceLocation}>{device.location}</Text>

                <View style={styles.deviceMetricsRow}>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricBoxValue}>{device.temperature}°</Text>
                    <Text style={styles.metricBoxLabel}>温度</Text>
                  </View>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricBoxValue}>{device.humidity}%</Text>
                    <Text style={styles.metricBoxLabel}>湿度</Text>
                  </View>
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>发酵进度</Text>
                    <Text style={styles.progressValue}>{device.fermentationProgress}%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${device.fermentationProgress}%`, backgroundColor: getStatusColor(device.status) }
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.phaseTag}>
                  <Text style={styles.phaseTagText}>{device.currentPhase.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>最近报警</Text>
            <TouchableOpacity onPress={() => navigation.navigate('报警')}>
              <Text style={styles.viewAllText}>查看全部 ›</Text>
            </TouchableOpacity>
          </View>

          {recentAlerts.map((alert, index) => (
            <View
              key={alert.id}
              style={[styles.alertCard, { backgroundColor: getAlertBgColor(alert.level), borderLeftColor: getAlertColor(alert.level) }]}
            >
              <View style={[styles.alertIconContainer, { backgroundColor: getAlertColor(alert.level) }]}>
                <Text style={styles.alertIconText}>
                  {alert.level === 'critical' ? '!' : alert.level === 'warning' ? '⚠' : 'ℹ'}
                </Text>
              </View>
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertDevice}>{alert.deviceName}</Text>
                  <View style={[styles.alertLevelBadge, { backgroundColor: getAlertColor(alert.level) }]}>
                    <Text style={styles.alertLevelText}>
                      {alert.level === 'critical' ? '紧急' : alert.level === 'warning' ? '警告' : '信息'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{alert.timestamp}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  header: {
    backgroundColor: '#10B981',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  headerLeft: {
    flex: 1
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerEmoji: {
    fontSize: 24
  },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 12,
    justifyContent: 'space-around'
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)'
  },
  scrollContent: {
    paddingTop: 15
  },
  section: {
    padding: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  viewAllText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500'
  },
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  deviceCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4
  },
  deviceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  deviceStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  deviceStatusText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500'
  },
  deviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2
  },
  deviceLocation: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 10
  },
  deviceMetricsRow: {
    flexDirection: 'row',
    marginBottom: 10
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
    marginHorizontal: 2
  },
  metricBoxValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151'
  },
  metricBoxLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2
  },
  progressSection: {
    marginBottom: 8
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  progressLabel: {
    fontSize: 10,
    color: '#6B7280'
  },
  progressValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981'
  },
  progressBarBg: {
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3
  },
  phaseTag: {
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start'
  },
  phaseTagText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '500'
  },
  alertCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    borderLeftWidth: 4
  },
  alertIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  alertIconText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold'
  },
  alertContent: {
    flex: 1
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  alertDevice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937'
  },
  alertLevelBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8
  },
  alertLevelText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '600'
  },
  alertMessage: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    marginBottom: 5
  },
  alertTime: {
    fontSize: 10,
    color: '#9CA3AF'
  },
  bottomSpacing: {
    height: 30
  }
});