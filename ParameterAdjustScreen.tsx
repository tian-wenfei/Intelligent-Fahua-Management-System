import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Device, FermentationParameters } from './src/types';
import { mockDevices } from './src/data/mockData';

export default function ParameterAdjustScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { deviceId } = route.params || {};

  const device = mockDevices.find(d => d.id === deviceId) || mockDevices[0];

  const [parameters, setParameters] = useState<FermentationParameters>({
    targetTemperature: device.parameters.targetTemperature,
    targetHumidity: device.parameters.targetHumidity,
    ventilationRate: device.parameters.ventilationRate,
    turningInterval: device.parameters.turningInterval,
    fermentationDuration: device.parameters.fermentationDuration
  });

  const [tempInput, setTempInput] = useState(parameters.targetTemperature.toString());
  const [humidityInput, setHumidityInput] = useState(parameters.targetHumidity.toString());
  const [ventilationInput, setVentilationInput] = useState(parameters.ventilationRate.toString());
  const [turningInput, setTurningInput] = useState(parameters.turningInterval.toString());
  const [durationInput, setDurationInput] = useState(parameters.fermentationDuration.toString());

  const handleSave = () => {
    const newParams = {
      targetTemperature: parseFloat(tempInput) || parameters.targetTemperature,
      targetHumidity: parseFloat(humidityInput) || parameters.targetHumidity,
      ventilationRate: parseInt(ventilationInput) || parameters.ventilationRate,
      turningInterval: parseInt(turningInput) || parameters.turningInterval,
      fermentationDuration: parseInt(durationInput) || parameters.fermentationDuration
    };

    if (newParams.targetTemperature < 20 || newParams.targetTemperature > 40) {
      Alert.alert('错误', '温度设置范围应为20-40°C');
      return;
    }

    if (newParams.targetHumidity < 60 || newParams.targetHumidity > 95) {
      Alert.alert('错误', '湿度设置范围应为60-95%');
      return;
    }

    if (newParams.ventilationRate < 1 || newParams.ventilationRate > 10) {
      Alert.alert('错误', '通风速率设置范围应为1-10档');
      return;
    }

    setParameters(newParams);

    Alert.alert(
      '保存成功',
      '参数已成功保存，设备将按新参数运行',
      [
        {
          text: '确定',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      '重置参数',
      '确定要重置为默认参数吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            setTempInput('30');
            setHumidityInput('80');
            setVentilationInput('5');
            setTurningInput('4');
            setDurationInput('7');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceLocation}>{device.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>温度设置</Text>
        <View style={styles.paramCard}>
          <View style={styles.paramHeader}>
            <Text style={styles.paramIcon}>🌡️</Text>
            <Text style={styles.paramLabel}>目标温度</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.paramInput}
              value={tempInput}
              onChangeText={setTempInput}
              keyboardType="numeric"
              maxLength={5}
            />
            <Text style={styles.paramUnit}>°C</Text>
          </View>
          <View style={styles.rangeInfo}>
            <Text style={styles.rangeText}>建议范围：20-40°C</Text>
            <Text style={styles.currentText}>当前设备：{device.temperature}°C</Text>
          </View>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => setTempInput((parseFloat(tempInput) - 0.5).toString())}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${((parseFloat(tempInput) || 30) - 20) / 20 * 100}%` }]} />
            </View>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => setTempInput((parseFloat(tempInput) + 0.5).toString())}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>湿度设置</Text>
        <View style={styles.paramCard}>
          <View style={styles.paramHeader}>
            <Text style={styles.paramIcon}>💧</Text>
            <Text style={styles.paramLabel}>目标湿度</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.paramInput}
              value={humidityInput}
              onChangeText={setHumidityInput}
              keyboardType="numeric"
              maxLength={5}
            />
            <Text style={styles.paramUnit}>%</Text>
          </View>
          <View style={styles.rangeInfo}>
            <Text style={styles.rangeText}>建议范围：60-95%</Text>
            <Text style={styles.currentText}>当前设备：{device.humidity}%</Text>
          </View>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => setHumidityInput((parseFloat(humidityInput) - 1).toString())}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${((parseFloat(humidityInput) || 80) - 60) / 35 * 100}%` }]} />
            </View>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => setHumidityInput((parseFloat(humidityInput) + 1).toString())}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通风设置</Text>
        <View style={styles.paramCard}>
          <View style={styles.paramHeader}>
            <Text style={styles.paramIcon}>🌬️</Text>
            <Text style={styles.paramLabel}>通风速率</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.paramInput}
              value={ventilationInput}
              onChangeText={setVentilationInput}
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={styles.paramUnit}>档位</Text>
          </View>
          <View style={styles.rangeInfo}>
            <Text style={styles.rangeText}>建议范围：1-10档</Text>
          </View>
          <View style={styles.levelContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  parseInt(ventilationInput) >= level && styles.levelButtonActive
                ]}
                onPress={() => setVentilationInput(level.toString())}
              >
                <Text style={[
                  styles.levelText,
                  parseInt(ventilationInput) >= level && styles.levelTextActive
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>发酵时间设置</Text>
        <View style={styles.paramCard}>
          <View style={styles.paramRow}>
            <View style={styles.paramHalf}>
              <View style={styles.paramHeader}>
                <Text style={styles.paramIcon}>🔄</Text>
                <Text style={styles.paramLabel}>翻堆间隔</Text>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.paramInputSmall}
                  value={turningInput}
                  onChangeText={setTurningInput}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.paramUnit}>小时</Text>
              </View>
            </View>
            <View style={styles.paramDivider} />
            <View style={styles.paramHalf}>
              <View style={styles.paramHeader}>
                <Text style={styles.paramIcon}>📅</Text>
                <Text style={styles.paramLabel}>发酵时长</Text>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.paramInputSmall}
                  value={durationInput}
                  onChangeText={setDurationInput}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.paramUnit}>天</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>重置为默认</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>保存参数</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningText}>
          修改参数将影响发酵过程，请根据茶叶品种和季节适当调整。如有疑问，请咨询技术人员。
        </Text>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  deviceInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  deviceLocation: {
    fontSize: 14,
    color: '#999',
    marginTop: 4
  },
  section: {
    padding: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  paramCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15
  },
  paramHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  paramIcon: {
    fontSize: 20,
    marginRight: 8
  },
  paramLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  paramInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    textAlign: 'center'
  },
  paramInputSmall: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 70,
    textAlign: 'center'
  },
  paramUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10
  },
  rangeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  rangeText: {
    fontSize: 12,
    color: '#999'
  },
  currentText: {
    fontSize: 12,
    color: '#4CAF50'
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sliderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sliderButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold'
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden'
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  levelButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  levelButtonActive: {
    backgroundColor: '#4CAF50'
  },
  levelText: {
    fontSize: 12,
    color: '#999'
  },
  levelTextActive: {
    color: '#fff',
    fontWeight: 'bold'
  },
  paramRow: {
    flexDirection: 'row'
  },
  paramHalf: {
    flex: 1
  },
  paramDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 15
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500'
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  },
  warningBox: {
    backgroundColor: '#FFF8E1',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 10
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#F57C00',
    lineHeight: 20
  },
  bottomPadding: {
    height: 30
  }
});