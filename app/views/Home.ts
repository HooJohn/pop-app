import { Observable, Page, Application } from '@nativescript/core';
import { Bluetooth } from '@nativescript-community/ble';

interface Device {
  id: string;
  name: string;
  connectionStatus: string;
}

interface RecentApp {
  name: string;
  icon: string;
  lastUsed: string;
}

export class HomeViewModel extends Observable {
  private _devices: Device[] = [];
  private _isLoading: boolean = false;
  private bluetooth: Bluetooth;
  private _recentApps: RecentApp[] = [];
  private _installedSoftwareCount: number = 3;
  private _connectedDevicesCount: number = 2;
  private _doubaoUsageTime: string = '3 小时 15 分钟';
  private _doubaoTokenUsage: number = 125;

  constructor() {
    super();
    this.bluetooth = new Bluetooth();

    // 在iOS上，我们需要等待应用完全启动后再初始化蓝牙
    if (Application.ios) {
      Application.on(Application.launchEvent, () => {
        console.log('应用启动完成，开始初始化蓝牙...');
        this.initializeBluetooth();
      });
    } else {
      this.initializeBluetooth();
    }
    this.loadRecentApps();
  }

  private async initializeBluetooth() {
    try {
      this._isLoading = true;
      this.notifyPropertyChange('isLoading', true);

      // 检查蓝牙是否可用
      const available = await this.bluetooth.isBluetoothEnabled();
      console.log('蓝牙是否可用:', available);
      
      if (!available) {
        console.log('尝试启用蓝牙...');
        const enabled = await this.bluetooth.enable();
        console.log('蓝牙启用结果:', enabled);
      }

      // 检查位置权限
      const hasPermission = await this.bluetooth.hasLocationPermission();
      console.log('是否有位置权限:', hasPermission);
      
      if (!hasPermission) {
        console.log('请求位置权限...');
        const granted = await this.bluetooth.requestLocationPermission();
        console.log('位置权限请求结果:', granted);
      }

      // 开始扫描设备
      await this.startScanning();
    } catch (error) {
      console.error('蓝牙初始化错误:', error);
      // Handle the error gracefully, e.g., show an alert to the user
    } finally {
      this._isLoading = false;
      this.notifyPropertyChange('isLoading', false);
    }
  }

  private async startScanning() {
    try {
      this._isLoading = true;
      this.notifyPropertyChange('isLoading', true);

      console.log('开始扫描设备...');
      await this.bluetooth.startScanning({
        seconds: 4,
        skipPermissionCheck: false,
        onDiscovered: (peripheral) => {
          console.log('发现设备:', peripheral);
          const newDevice: Device = {
            id: peripheral.UUID,
            name: peripheral.name || '未知设备',
            connectionStatus: '已发现'
          };

          // 检查设备是否已存在
          const existingDeviceIndex = this._devices.findIndex(d => d.id === newDevice.id);
          if (existingDeviceIndex === -1) {
            this._devices.push(newDevice);
            this.notifyPropertyChange('devices', this._devices);
          }
        }
      });
    } catch (err) {
      console.error('扫描错误:', err);
      // Handle the error gracefully, e.g., show an alert to the user
    } finally {
      this._isLoading = false;
      this.notifyPropertyChange('isLoading', false);
    }
  }

  public async refreshDevices() {
    console.log('刷新设备列表...');
    this._devices = [];
    this.notifyPropertyChange('devices', this._devices);
    await this.initializeBluetooth(); // 重新初始化并扫描
  }

  get devices(): Device[] {
    return this._devices;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  private async loadRecentApps() {
    // 模拟加载最近使用的应用
    // TODO: Load recent apps from a real source
    const mockApps: RecentApp[] = [
      {
        name: '豆包',
        icon: '~/assets/images/doubao.png',
        lastUsed: '刚刚'
      },
      {
        name: 'QQ音乐',
        icon: '~/assets/images/qqmusic.png',
        lastUsed: '10分钟前'
      }
    ];

    this._recentApps = mockApps;
    this.notifyPropertyChange('recentApps', this._recentApps);
  }

  get recentApps(): RecentApp[] {
    return this._recentApps;
  }

  get installedSoftwareCount(): number {
    return this._installedSoftwareCount;
  }

  get connectedDevicesCount(): number {
    return this._connectedDevicesCount;
  }

  get doubaoUsageTime(): string {
    return this._doubaoUsageTime;
  }

  get doubaoTokenUsage(): number {
    return this._doubaoTokenUsage;
  }

  public onDeviceStatusTap() {
    console.log('跳转到设备状态页面');
    // 跳转到设备状态页面
  }

  public onUsageStatsTap() {
    console.log('跳转到使用统计页面');
    // 跳转到使用统计页面
  }

  public onScanQRCode() {
    console.log('启动二维码扫描');
    // 启动二维码扫描
  }

  public onConnectWiFi() {
    console.log('跳转到WiFi连接页面');
    // 跳转到WiFi连接页面
  }

  public onBluetoothConnect() {
    console.log('跳转到蓝牙连接页面');
    // 跳转到蓝牙连接页面
  }

  public onSettings() {
    console.log('跳转到设置页面');
    // 跳转到设置页面
  }
}

export function onNavigatingTo(args: any) {
  try {
    const page = args.object as Page;
    page.bindingContext = new HomeViewModel();
  } catch (error) {
    console.error('Error in onNavigatingTo:', error);
  }
}
