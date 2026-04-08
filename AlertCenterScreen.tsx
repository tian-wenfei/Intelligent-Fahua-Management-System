import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Alert as AlertType } from './src/types';
import { mockAlerts } from './src/data/mockData';

const ALERT_CONFIG = {
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
};

const TYPE_CONFIG = {
  temperature: { label: '温度异常', icon: '🌡️' },
  humidity: { label: '湿度异常', icon: '💧' },
  system: { label: '系统报警', icon: '⚙️' },
  maintenance: { label: '维护提醒', icon: '🔧' }
};

export default function AlertCenterScreen() {
  const [alerts, setAlerts] = useState<AlertType[]>(mockAlerts);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    updateUnreadCount();
  }, [alerts]);

  const updateUnreadCount = () => {
    const count = alerts.filter(a => !a.isRead).length;
    setUnreadCount(count);
  };

  const filteredAlerts = alerts.filter(alert => {
    return filterLevel === 'all' || alert.level === filterLevel;
  });

  const getAlertConfig = (level: string) => ALERT_CONFIG[level as keyof typeof ALERT_CONFIG] || ALERT_CONFIG.info;

  const getTypeConfig = (type: string) => TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.system;

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

  const renderAlert = ({ item }: { item: AlertType }) => {
    const config = getAlertConfig(item.level);
    const typeConfig = getTypeConfig(item.type);

    return (
      <TouchableOpacity
        style={[
          styles.alertCard,
          !item.isRead && styles.alertCardUnread,
          { borderLeftColor: config.borderColor }
        ]}
        onPress={() => handleMarkAsRead(item.id)}
        onLongPress={() => handleDeleteAlert(item.id)}
        activeOpacity={0.8}
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
                <View style={[styles.typeBadge, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={styles.typeBadgeText}>
                    {typeConfig.icon} {typeConfig.label}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: config.color }]} />}
        </View>

        <Text style={styles.alertMessage}>{item.message}</Text>

        <View style={styles.alertFooter}>
          <Text style={styles.alertTime}>🕐 {item.timestamp}</Text>
          <TouchableOpacity
            style={styles.markReadBtn}
            onPress={() => handleMarkAsRead(item.id)}
          >
            <Text style={styles.markReadText}>
              {item.isRead ? '✓ 已读' : '标为已读'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
          </View>

          <TouchableOpacity
            style={styles.markAllBtn}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.markAllBtnText}>✓ 全部标为已读</Text>
          </TouchableOpacity>

          <View style={styles.filterContainer}>
            {[
              { key: 'all', label: '全部', icon: '📋' },
              { key: 'critical', label: '紧急', icon: '🔴' },
              { key: 'warning', label: '警告', icon: '🟡' },
              { key: 'info', label: '提示', icon: '🔵' }
            ].map(filter => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  filterLevel === filter.key && styles.filterButtonActive
                ]}
                onPress={() => setFilterLevel(filter.key)}
              >
                <Text style={styles.filterIcon}>{filter.icon}</Text>
                <Text style={[
                  styles.filterText,
                  filterLevel === filter.key && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.listContainer}>
          {filteredAlerts.map(item => (
            <View
              key={item.id}
              style={[
                styles.alertCard,
                !item.isRead && styles.alertCardUnread,
                { borderLeftColor: getAlertConfig(item.level).borderColor }
              ]}
            >
              <View style={styles.alertHeader}>
                <View style={styles.alertHeaderLeft}>
                  <View style={[styles.alertIconContainer, { backgroundColor: getAlertConfig(item.level).color }]}>
                    <Text style={styles.alertIcon}>{getAlertConfig(item.level).icon}</Text>
                  </View>
                  <View style={styles.alertTitleArea}>
                    <Text style={styles.alertDevice}>{item.deviceName}</Text>
                    <View style={styles.alertMeta}>
                      <View style={[styles.levelBadge, { backgroundColor: getAlertConfig(item.level).bgColor }]}>
                        <Text style={[styles.levelBadgeText, { color: getAlertConfig(item.level).color }]}>
                          {getAlertConfig(item.level).label}
                        </Text>
                      </View>
                      <View style={[styles.typeBadge, { backgroundColor: '#F3F4F6' }]}>
                        <Text style={styles.typeBadgeText}>
                          {getTypeConfig(item.type).icon} {getTypeConfig(item.type).label}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: getAlertConfig(item.level).color }]} />}
              </View>

              <Text style={styles.alertMessage}>{item.message}</Text>

              <View style={styles.alertFooter}>
                <Text style={styles.alertTime}>🕐 {item.timestamp}</Text>
                <TouchableOpacity
                  style={styles.markReadBtn}
                  onPress={() => handleMarkAsRead(item.id)}
                >
                  <Text style={styles.markReadText}>
                    {item.isRead ? '✓ 已读' : '标为已读'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {filteredAlerts.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🎉</Text>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  headerTop: {
    marginBottom: 14
  },
  headerTitleArea: {
    flexDirection: 'row',
    alignItems: 'center'
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    marginBottom: 16
  },
  markAllBtnText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500'
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
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
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
    flexWrap: 'wrap',
    gap: 6
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
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
    alignItems: 'center'
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
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  markReadBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6'
  },
  markReadText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500'
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80
  },
  emptyIcon: {
    fontSize: 70,
    marginBottom: 20
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
    padding: 18,
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