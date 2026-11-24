import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Modal, TextInput, Image } from 'react-native';
import { useAuth } from './src/context/AuthContext';
import { mockDevices } from './src/data/mockData';
import {
  UserCircleIcon,
  LockIcon,
  LogoutIcon,
  AlertIcon,
  SpeakerIcon,
  PhoneIcon,
  RefreshIcon,
  TrashIcon,
  HelpIcon,
  InfoIcon
} from './src/components/icons';

interface SettingItemProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

function SettingItem({ icon, iconBg, title, subtitle, onPress, rightElement }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || <Text style={styles.settingArrow}>›</Text>}
    </TouchableOpacity>
  );
}

interface SettingGroupProps {
  title: string;
  children: React.ReactNode;
}

function SettingGroup({ title, children }: SettingGroupProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupContent}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const { user, logout, updateUser, changePassword } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.username || '');
  const [editRole, setEditRole] = useState(user?.role || '');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const stats = useMemo(() => {
    const online = mockDevices.filter(d => d.status === 'online').length;
    const alerting = mockDevices.filter(d => d.status === 'warning' || d.status === 'error').length;
    return {
      total: mockDevices.length,
      online,
      alerting
    };
  }, []);

  const handleEdit = () => {
    setEditName(user?.username || '');
    setEditRole(user?.role || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      Alert.alert('提示', '请输入用户名');
      return;
    }
    await updateUser({ username: editName, role: editRole || '茶厂管理员' });
    setShowEditModal(false);
    Alert.alert('成功', '个人信息已更新');
  };

  const handleChangePassword = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(true);
  };

  const handleSavePassword = async () => {
    const result = await changePassword(oldPassword, newPassword, confirmPassword);
    if (result.success) {
      setShowPasswordModal(false);
      Alert.alert('成功', result.message);
    } else {
      Alert.alert('失败', result.message);
    }
  };

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: logout }
    ]);
  };

  const handleAbout = () => {
    Alert.alert('关于', '智能发花监控平台 v1.0.0\n\n一款专为茶叶发花工艺设计的智能管理平台。', [{ text: '确定' }]);
  };

  const handleHelp = () => {
    Alert.alert('帮助与反馈', '如有问题请拨打客服热线：15674711141', [{ text: '确定' }]);
  };

  const handleClearCache = () => {
    Alert.alert('清除缓存', '确定要清除本地缓存数据吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: () => Alert.alert('提示', '缓存已清除') }
    ]);
  };

  const switchProps = (value: boolean, setValue: (v: boolean) => void) => ({
    value,
    onValueChange: setValue,
    trackColor: { false: '#E5E7EB', true: '#10B981' },
    thumbColor: value ? '#fff' : '#f4f4f4'
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>我的</Text>
          <Text style={styles.headerSubtitle}>管理个人设置</Text>
        </View>

        <View style={styles.scrollContent}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Image
                  source={require('./assets/logo.png')}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.username || '管理员'}</Text>
              <Text style={styles.userRole}>{user?.role || '茶厂管理员'}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>编辑</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>设备总数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.online}</Text>
              <Text style={styles.statLabel}>运行中</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>{stats.alerting}</Text>
              <Text style={styles.statLabel}>报警中</Text>
            </View>
          </View>

          <SettingGroup title="账户管理">
            <SettingItem
              icon={<UserCircleIcon color="#10B981" size={21} />}
              iconBg="#ECFDF5"
              title="个人信息"
              subtitle="修改用户名和角色"
              onPress={handleEdit}
            />
            <SettingItem
              icon={<LockIcon color="#F59E0B" size={21} />}
              iconBg="#FEF3C7"
              title="修改密码"
              subtitle="修改账户登录密码"
              onPress={handleChangePassword}
            />
            <SettingItem
              icon={<LogoutIcon color="#EF4444" size={21} />}
              iconBg="#FEE2E2"
              title="退出登录"
              subtitle="退出当前账户"
              onPress={handleLogout}
            />
          </SettingGroup>

          <SettingGroup title="通知设置">
            <SettingItem
              icon={<AlertIcon color="#F59E0B" size={21} />}
              iconBg="#FEF3C7"
              title="接收报警通知"
              subtitle="设备异常时推送通知"
              rightElement={<Switch {...switchProps(notificationsEnabled, setNotificationsEnabled)} />}
            />
            <SettingItem
              icon={<SpeakerIcon color="#3B82F6" size={21} />}
              iconBg="#DBEAFE"
              title="提示音"
              subtitle="报警时播放声音"
              rightElement={<Switch {...switchProps(soundEnabled, setSoundEnabled)} />}
            />
            <SettingItem
              icon={<PhoneIcon color="#10B981" size={21} />}
              iconBg="#D1FAE5"
              title="震动提醒"
              subtitle="收到报警时震动提示"
              rightElement={<Switch {...switchProps(vibrationEnabled, setVibrationEnabled)} />}
            />
          </SettingGroup>

          <SettingGroup title="系统设置">
            <SettingItem
              icon={<RefreshIcon color="#6366F1" size={21} />}
              iconBg="#E0E7FF"
              title="自动刷新"
              subtitle="每30秒自动刷新设备数据"
              rightElement={<Switch {...switchProps(autoRefresh, setAutoRefresh)} />}
            />
            <SettingItem
              icon={<TrashIcon color="#EF4444" size={21} />}
              iconBg="#FEE2E2"
              title="清除缓存"
              subtitle="清除本地存储的临时数据"
              onPress={handleClearCache}
            />
          </SettingGroup>

          <SettingGroup title="其他">
            <SettingItem
              icon={<HelpIcon color="#EAB308" size={21} />}
              iconBg="#FEF9C3"
              title="帮助与反馈"
              subtitle="获取帮助或提交问题"
              onPress={handleHelp}
            />
            <SettingItem
              icon={<InfoIcon color="#6B7280" size={21} />}
              iconBg="#E5E7EB"
              title="关于"
              subtitle="版本 1.0.0"
              onPress={handleAbout}
            />
          </SettingGroup>

          <View style={styles.footer}>
            <Text style={styles.footerText}>🍃 智能发花监控平台</Text>
            <Text style={styles.footerVersion}>v1.0.0</Text>
            <Text style={styles.footerCopyright}>© 2026 茯忆长安版权所有.</Text>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>编辑个人信息</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>用户名</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="请输入用户名"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>角色</Text>
                <TextInput
                  style={styles.input}
                  value={editRole}
                  onChangeText={setEditRole}
                  placeholder="请输入角色"
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>修改密码</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>原密码</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInputField}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    placeholder="请输入原密码"
                    placeholderTextColor="#999"
                    secureTextEntry={!showOldPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowOldPassword(!showOldPassword)}
                  >
                    <Text style={styles.eyeText}>{showOldPassword ? '👁' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>新密码</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInputField}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="请输入新密码（至少6位）"
                    placeholderTextColor="#999"
                    secureTextEntry={!showNewPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Text style={styles.eyeText}>{showNewPassword ? '👁' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>确认新密码</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInputField}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="请再次输入新密码"
                    placeholderTextColor="#999"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text style={styles.eyeText}>{showConfirmPassword ? '👁' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSavePassword}>
                <Text style={styles.saveButtonText}>确认修改</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    paddingBottom: 25,
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
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4
  },
  scrollContent: {
    flex: 1,
    paddingTop: 20
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5
  },
  avatarContainer: {
    position: 'relative'
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#fff'
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16
  },
  userName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6'
  },
  editButtonText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500'
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#374151'
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB'
  },
  group: {
    marginBottom: 16
  },
  groupTitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 20,
    marginBottom: 8,
    fontWeight: '500'
  },
  groupContent: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingContent: {
    flex: 1,
    marginLeft: 14
  },
  settingTitle: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500'
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2
  },
  settingArrow: {
    fontSize: 22,
    color: '#D1D5DB'
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20
  },
  footerText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500'
  },
  footerVersion: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4
  },
  footerCopyright: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 8
  },
  bottomSpacing: {
    height: 30
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  modalClose: {
    fontSize: 20,
    color: '#9CA3AF'
  },
  modalForm: {
    padding: 20
  },
  inputGroup: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  passwordInputField: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937'
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  eyeText: {
    fontSize: 18
  }
});
