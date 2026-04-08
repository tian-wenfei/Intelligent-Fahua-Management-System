import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Device } from './src/types';
import { mockDevices } from './src/data/mockData';

const STATUS_CONFIG = {
  online: { color: '#10B981', bgColor: '#ECFDF5', label: '运行中', icon: '🟢' },
  warning: { color: '#F59E0B', bgColor: '#FFFBEB', label: '警告', icon: '🟡' },
  error: { color: '#EF4444', bgColor: '#FEF2F2', label: '故障', icon: '🔴' },
  offline: { color: '#6B7280', bgColor: '#F3F4F6', label: '离线', icon: '⚫' }
};

export default function DeviceListScreen() {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [devices, setDevices] = useState<Device[]>(mockDevices);

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filterStatus === 'all' || device.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (status: string) => STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.offline;

  const renderDevice = ({ item }: { item: Device }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <TouchableOpacity
        style={styles.deviceCard}
        onPress={() => navigation.navigate('DeviceDetail', { deviceId: item.id })}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.deviceInfoRow}>
            <View style={[styles.statusIndicator, { backgroundColor: statusConfig.color }]}>
              <Text style={styles.statusIcon}>{statusConfig.icon}</Text>
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceLocation}>📍 {item.location}</Text>
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
              <Text style={styles.metricValue}>{item.temperature}°C</Text>
              <Text style={styles.metricLabel}>温度</Text>
            </View>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <View style={[styles.metricIconBg, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.metricIcon}>💧</Text>
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricValue}>{item.humidity}%</Text>
              <Text style={styles.metricLabel}>湿度</Text>
            </View>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <View style={[styles.metricIconBg, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.metricIcon}>📈</Text>
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricValue}>{item.fermentationProgress}%</Text>
              <Text style={styles.metricLabel}>进度</Text>
            </View>
          </View>
        </View>

        <View style={styles.phaseSection}>
          <View style={styles.phaseInfo}>
            <Text style={styles.phaseLabel}>当前阶段</Text>
            <View style={[styles.phaseTag, { backgroundColor: statusConfig.bgColor }]}>
              <Text style={[styles.phaseTagText, { color: statusConfig.color }]}>
                {item.currentPhase.name}
              </Text>
            </View>
          </View>
          <View style={styles.phaseProgress}>
            <Text style={styles.phaseProgressText}>{item.currentPhase.progress}%</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${item.fermentationProgress}%`, backgroundColor: statusConfig.color }
              ]}
            />
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>开始时间</Text>
            <Text style={styles.timeValue}>{item.startTime}</Text>
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>预计结束</Text>
            <Text style={styles.timeValue}>{item.estimatedEndTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>设备列表</Text>
          <Text style={styles.headerSubtitle}>共 {filteredDevices.length} 台设备</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="搜索设备名称或位置..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.filterContainer}>
          {[
            { key: 'all', label: '全部', icon: '📋' },
            { key: 'online', label: '运行中', icon: '🟢' },
            { key: 'warning', label: '警告', icon: '🟡' },
            { key: 'error', label: '故障', icon: '🔴' }
          ].map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                filterStatus === filter.key && styles.filterButtonActive
              ]}
              onPress={() => setFilterStatus(filter.key)}
            >
              <Text style={styles.filterIcon}>{filter.icon}</Text>
              <Text style={[
                styles.filterText,
                filterStatus === filter.key && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.listContainer}>
        {filteredDevices.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.deviceCard}
            onPress={() => navigation.navigate('DeviceDetail', { deviceId: item.id })}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={styles.deviceInfoRow}>
                <View style={[styles.statusIndicator, { backgroundColor: getStatusConfig(item.status).color }]}>
                  <Text style={styles.statusIcon}>{getStatusConfig(item.status).icon}</Text>
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{item.name}</Text>
                  <Text style={styles.deviceLocation}>📍 {item.location}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusConfig(item.status).bgColor }]}>
                <Text style={[styles.statusBadgeText, { color: getStatusConfig(item.status).color }]}>
                  {getStatusConfig(item.status).label}
                </Text>
              </View>
            </View>

            <View style={styles.metricsContainer}>
              <View style={styles.metricItem}>
                <View style={[styles.metricIconBg, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={styles.metricIcon}>🌡️</Text>
                </View>
                <View style={styles.metricContent}>
                  <Text style={styles.metricValue}>{item.temperature}°C</Text>
                  <Text style={styles.metricLabel}>温度</Text>
                </View>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricItem}>
                <View style={[styles.metricIconBg, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={styles.metricIcon}>💧</Text>
                </View>
                <View style={styles.metricContent}>
                  <Text style={styles.metricValue}>{item.humidity}%</Text>
                  <Text style={styles.metricLabel}>湿度</Text>
                </View>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricItem}>
                <View style={[styles.metricIconBg, { backgroundColor: '#D1FAE5' }]}>
                  <Text style={styles.metricIcon}>📈</Text>
                </View>
                <View style={styles.metricContent}>
                  <Text style={styles.metricValue}>{item.fermentationProgress}%</Text>
                  <Text style={styles.metricLabel}>进度</Text>
                </View>
              </View>
            </View>

            <View style={styles.phaseSection}>
              <View style={styles.phaseInfo}>
                <Text style={styles.phaseLabel}>当前阶段</Text>
                <View style={[styles.phaseTag, { backgroundColor: getStatusConfig(item.status).bgColor }]}>
                  <Text style={[styles.phaseTagText, { color: getStatusConfig(item.status).color }]}>
                    {item.currentPhase.name}
                  </Text>
                </View>
              </View>
              <View style={styles.phaseProgress}>
                <Text style={styles.phaseProgressText}>{item.currentPhase.progress}%</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${item.fermentationProgress}%`, backgroundColor: getStatusConfig(item.status).color }
                  ]}
                />
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.timeInfo}>
                <Text style={styles.timeLabel}>开始时间</Text>
                <Text style={styles.timeValue}>{item.startTime}</Text>
              </View>
              <View style={styles.timeInfo}>
                <Text style={styles.timeLabel}>预计结束</Text>
                <Text style={styles.timeValue}>{item.estimatedEndTime}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredDevices.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>没有找到设备</Text>
            <Text style={styles.emptySubtext}>请尝试调整搜索条件</Text>
          </View>
        )}
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
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  headerTop: {
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4
  },
  searchContainer: {
    marginBottom: 16
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#374151'
  },
  clearIcon: {
    fontSize: 16,
    color: '#9CA3AF',
    padding: 4
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  filterButtonActive: {
    backgroundColor: '#fff'
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 6
  },
  filterText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500'
  },
  filterTextActive: {
    color: '#10B981'
  },
  listContainer: {
    padding: 16,
    paddingTop: 20
  },
  deviceCard: {
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
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF'
  }
});