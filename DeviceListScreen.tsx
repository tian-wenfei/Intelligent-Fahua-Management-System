import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Device } from './src/types';
import { mockDevices } from './src/data/mockData';
import { DeviceCard } from './src/components/DeviceCard';
import { SearchIcon, XCircleIcon } from './src/components/icons';

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
    { key: 'all', label: '全部', color: '#9CA3AF' },
    { key: 'online', label: '运行中', color: '#10B981' },
    { key: 'warning', label: '警告', color: '#F59E0B' },
    { key: 'error', label: '故障', color: '#EF4444' }
  ], []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>设备列表</Text>
        <Text style={styles.headerSubtitle}>共 {devices.length} 台设备</Text>

        <View style={styles.searchInputContainer}>
          <SearchIcon color="#9CA3AF" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索设备名称或位置"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} hitSlop={8}>
              <XCircleIcon color="#9CA3AF" size={18} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          {filterButtons.map(filter => {
            const active = filterStatus === filter.key;
            return (
              <TouchableOpacity
                key={filter.key}
                style={[styles.filterButton, active && styles.filterButtonActive]}
                onPress={() => setFilterStatus(filter.key)}
                activeOpacity={0.8}
              >
                <View style={[styles.filterDot, { backgroundColor: filter.color }]} />
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
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
            <View style={styles.emptyIconBg}>
              <SearchIcon color="#C4B5FD" size={40} strokeWidth={1.4} />
            </View>
            <Text style={styles.emptyText}>没有找到设备</Text>
            <Text style={styles.emptySubtext}>请尝试调整搜索或筛选条件</Text>
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
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    marginBottom: 16
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    marginHorizontal: 10
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  filterButtonActive: {
    backgroundColor: '#fff'
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
    paddingTop: 18
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60
  },
  emptyIconBg: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
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
