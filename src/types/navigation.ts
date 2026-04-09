import { Device, Alert } from './index';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  DeviceDetail: { deviceId: string };
  ParameterAdjust: { deviceId: string };
};

export type MainTabParamList = {
  '首页': undefined;
  '设备': undefined;
  '报警': undefined;
  '我的': undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
