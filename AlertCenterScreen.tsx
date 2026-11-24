import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Alert as AlertType } from './src/types';
import { mockAlerts } from './src/data/mockData';
import { getAlertConfig, getTypeConfig } from './src/config/constants';
import { ClockIcon, CheckCircleIcon } from './src/components/icons';

const FILTERS = [
  { key: 'all', label: '全部', color: '#9CA3AF' },
  { key: 'critical', label: '紧急', color: '#EF4444' },
  { key: 'warning', label: '警告', color: '#F59E0B' },
  { key: 'info', label: '提示', color: '#3B82F6' }
];

export default function AlertCenterScreen() {
  const [alerts, setAlerts] = useState<AlertType[]>(mockAlerts);
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const filteredAlerts = alerts.filter(alert => {
    return filterLevel === 'all' || alert.level === filterLevel;
  });

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const handleMarkAllAsRead = () => {
    Alert.alert(
      '标记已读',
      '确定要将所有报警标记为已读吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
          }
        }
      ]
    );
  };

  const handleDeleteAlert = (alertId: string) => {
    Alert.alert(
      '删除报警',
      '确定要删除这条报警记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            setAlerts(prev => prev.filter(alert => alert.id !== alertId));
          }
        }
      ]
    );
  };

  const criticalCount = alerts.filter(a => a.level === 'critical' && !a.isRead).length;
  const warningCount = alerts.filter(a => a.level === 'warning' && !a.isRead).length;
  const infoCount = alerts.filter(a => a.level === 'info' && !a.isRead).length;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitleArea}>
              <Text style={styles.headerTitle}>报警中心</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{unreadCount} 未读</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.markAllBtn}
              onPress={handleMarkAllAsRead}
              activeOpacity={0.8}
            >
              <CheckCircleIcon color="#fff" size={16} />
              <Text style={styles.markAllBtnText}>全部标为已读</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            {FILTERS.map(filter => {
              const active = filterLevel === filter.key;
              return (
                <TouchableOpacity
                  key={filter.key}
                  style={[styles.filterButton, active && styles.filterButtonActive]}
                  onPress={() => setFilterLevel(filter.key)}
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
          {filteredAlerts.map(item => {
            const config = getAlertConfig(item.level);
            const typeConfig = getTypeConfig(item.type);

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.alertCard,
                  !item.isRead && styles.alertCardUnread
                ]}
                onPress={() => handleMarkAsRead(item.id)}
                onLongPress={() => handleDeleteAlert(item.id)}
                activeOpacity={0.85}
              >
                <View style={styles.alertHeader}>
                  <View style={styles.alertHeaderLeft}>
                    <View style={[styles.alertIconContainer, { backgroundColor: config.color }]}>
                      <Text style={styles.alertIcon}>{config.icon}</Text>
                    </View>
                    <View style={styles.alertTitleArea}>
                      <Text style={styles.alertDevice}>{item.deviceName}</Text>
                      <View style={styles.alertMeta}>
                        <View style={[styles.levelBadge, { backgroundColor: config.bgColor }]}>
                          <Text style={[styles.levelBadgeText, { color: config.color }]}>
                            {config.label}
                          </Text>
                        </View>
                        <View style={styles.typeBadge}>
                          <Text style={styles.typeBadgeText}>{typeConfig.label}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: config.color }]} />}
                </View>

                <Text style={styles.alertMessage}>{item.message}</Text>

                <View style={styles.alertFooter}>
                  <View style={styles.alertTimeRow}>
                    <ClockIcon color="#9CA3AF" size={12} />
                    <Text style={styles.alertTime}>{item.timestamp}</Text>
                  </View>
                  <View style={styles.markReadBtn}>
                    <CheckCircleIcon
                      color={item.isRead ? '#C4C4C4' : '#10B981'}
                      size={14}
                    />
                    <Text style={[styles.markReadText, item.isRead && styles.markReadTextDone]}>
                      {item.isRead ? '已读' : '标为已读'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {filteredAlerts.length === 0 && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <CheckCircleIcon color="#10B981" size={40} strokeWidth={1.4} />
              </View>
              <Text style={styles.emptyText}>暂无报警信息</Text>
              <Text style={styles.emptySubtext}>所有设备运行正常</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.summaryText}>紧急 {criticalCount}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <View style={[styles.summaryDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.summaryText}>警告 {warningCount}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <View style={[styles.summaryDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.summaryText}>提示 {infoCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollView: {
    flex: 1
  },
  header: {
    backgroundColor: '#10B981',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28
  },
  headerTop: {
    marginBottom: 16
  },
  headerTitleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5
  },
  unreadBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 12
  },
  unreadText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600'
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignSelf: 'flex-start'
  },
  markAllBtnText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3
  },
  alertCardUnread: {
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  alertHeaderLeft: {
    flexDirection: 'row',
    flex: 1
  },
  alertIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  alertIcon: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold'
  },
  alertTitleArea: {
    flex: 1
  },
  alertDevice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '600'
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginBottom: 4
  },
  typeBadgeText: {
    fontSize: 11,
    color: '#6B7280'
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  alertMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  alertTimeRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 5
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6'
  },
  markReadText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginLeft: 4
  },
  markReadTextDone: {
    color: '#9CA3AF'
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80
  },
  emptyIconBg: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#ECFDF5',
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
  },
  summaryBar: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  summaryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  summaryText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500'
  },
  summaryDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB'
  }
});
