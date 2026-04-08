# 茶叶发花机远程智能管理APP

基于 React Native + Expo 构建的跨平台移动应用

## 功能特性

### 1. 设备监控
- 实时显示设备温度、湿度、发酵进度
- 设备状态在线/离线/警告/故障监控
- 支持设备搜索和状态筛选

### 2. 设备详情
- 完整的设备参数显示
- 发酵阶段实时跟踪
- 设备控制功能（启动/暂停/停止/重置）
- 历史报警记录查看

### 3. 参数调节
- 温度、湿度目标值调节
- 通风速率档位设置
- 翻堆间隔和发酵时长配置
- 参数保存和重置功能

### 4. 报警中心
- 紧急/警告/提示分级显示
- 未读报警数量提醒
- 支持标记已读和批量操作
- 按等级筛选报警信息

## 技术栈

- **框架**: React Native + Expo SDK 50
- **导航**: React Navigation 6 (Native Stack + Bottom Tabs)
- **类型**: TypeScript
- **样式**: StyleSheet

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# Android 构建
npm run android

# iOS 构建
npm run ios
```

## 项目结构

```
tea-fermentation-manager/
├── App.tsx                    # 应用入口
├── src/
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts
│   ├── data/                # Mock 数据
│   │   └── mockData.ts
│   └── screens/             # 页面组件
│       ├── DashboardScreen.tsx
│       ├── DeviceListScreen.tsx
│       ├── DeviceDetailScreen.tsx
│       ├── ParameterAdjustScreen.tsx
│       └── AlertCenterScreen.tsx
├── app.json                 # Expo 配置
├── package.json
├── tsconfig.json
└── babel.config.js
```

## 注意事项

1. 本项目使用 Mock 数据进行演示，实际使用时需对接后端API
2. 报警通知功能需要在真机上测试
3. 需要在设备上配置网络权限和通知权限