import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Device } from './src/types';
import { mockDevices } from './src/data/mockData';
import { getStatusConfig, STATUS_CONFIG } from './src/config/constants';
import { DeviceCard } from './src/components/DeviceCard';

export default function DeviceListScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [devices] = useState<Device[]>(mockDevices);

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchText.toLowerCase()) ||
                           device.location.toLowerCase().includes(searchText.toLowerCase());
      const matchesFilter = filterStatus === 'all' || device.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [devices, searchText, filterStatus]);

  const handleDevicePress = useCallback((deviceId: string) => {
    navigation.navigate('DeviceDetail', { deviceId });
  }, [navigation]);

  const clearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  const filterButtons = useMemo(() => [
    { key: 'all', label: '全部', icon: '�' },
    { key: 'online', label: '运行中', icon: '🟢' },
    { key: 'warning', label: '警告', icon: '🟡' },
    { key: 'error', label: '故障', icon: '🔴' }
  ], []);

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
              <TouchableOpacity onPress={clearSearch}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.filterContainer}>
          {filterButtons.map(filter => (
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
          <DeviceCard
            key={item.id}
            device={item}
            onPress={handleDevicePress}
          />
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