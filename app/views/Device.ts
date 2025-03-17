import { Observable, Http, Dialogs, Page } from '@nativescript/core';
// import { BarcodeScanner } from 'nativescript-barcodescanner';
import { Bluetooth } from '@nativescript-community/ble';

declare class NSObject {
    static ObjCProtocols: any[];
}

// declare class QRCodeReaderDelegate extends NSObject {
//     static ObjCProtocols: any[];
// }

interface WiFiNetwork {
    ssid: string;
    strength: number;
    isSecured: boolean;
    isConnected: boolean;
}

interface DeviceStatus {
    id: string;
    name: string;
    model: string;
  firmwareVersion: string;
  isOnline: boolean;
}

export class DeviceViewModel extends Observable {
    // private barcodescanner: BarcodeScanner;
    private wifiSSID: string = "";
    private wifiPassword: string = "";
    private discoveredDevices: any[] = [];
    private doubaoStatus: string = "";
    private isConnected: boolean = false;
    private _isScanning: boolean = false;
    private _device: DeviceStatus | null = null;
    private _availableNetworks: WiFiNetwork[] = [];
    private _isLoading: boolean = false;
    private bluetooth: Bluetooth;

    constructor() {
        super();
        // this.barcodescanner = new BarcodeScanner();
        this.getDoubaoStatus();
        this.bluetooth = new Bluetooth();
        this.loadDeviceStatus();
        this.scanWiFiNetworks();
    }

    public scanQRCode() {
        
    }

    private registerDevice(deviceId: string) {
        Http.request({
            url: "http://localhost:8000/api/devices/",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                device_id: deviceId,
                name: "My Device",
                connection_type: "QR Code"
            })
        }).then((response) => {
            if (response.statusCode === 201) {
                const result = response.content.toJSON();
                console.log("Device registered:", result);
                alert({
                    title: "Device Registration",
                    message: "Device registered successfully!",
                    okButtonText: "OK"
                });
            } else {
                console.error("Error registering device:", response.statusCode, response.content);
                alert({
                    title: "Device Registration",
                    message: "Error registering device: " + response.statusCode,
                    okButtonText: "OK"
                });
            }
        }, (error) => {
            console.error("Error registering device:", error);
            alert({
                title: "Device Registration",
                message: "Error registering device: " + error,
                okButtonText: "OK"
            });
        });
    }

    public configureWiFi() {
        const deviceId = 1; // 暂时假设 deviceId 为 1

        Http.request({
            url: `http://localhost:8000/api/devices/${deviceId}/wifi/`,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                ssid: this.wifiSSID,
                password: this.wifiPassword
            })
        }).then((response) => {
            if (response.statusCode === 200) {
                console.log("Wi-Fi configured successfully");
                alert({
                    title: "Wi-Fi Configuration",
                    message: "Wi-Fi configured successfully!",
                    okButtonText: "OK"
                });
            } else {
                console.error("Error configuring Wi-Fi:", response.statusCode, response.content);
                alert({
                    title: "Wi-Fi Configuration",
                    message: "Error configuring Wi-Fi: " + response.statusCode,
                    okButtonText: "OK"
                });
            }
        }, (error) => {
            console.error("Error configuring Wi-Fi:", error);
            alert({
                title: "Wi-Fi Configuration",
                message: "Error configuring Wi-Fi: " + error,
                okButtonText: "OK"
            });
        });
    }

    public getDoubaoStatus() {
        // 暂时假设 deviceId 为 1
        const deviceId = 1;

        Http.request({
            url: `http://localhost:8000/api/devices/${deviceId}/doubao_status/`,
            method: "GET"
        }).then((response) => {
            if (response.statusCode === 200) {
                const result = response.content.toJSON();
                // 假设后端返回的豆包状态信息包含在 "status" 字段中
                this.doubaoStatus = result.status;
                this.notifyPropertyChange("doubaoStatus", this.doubaoStatus);
            } else {
                console.error("Error getting Doubao status:", response.statusCode, response.content);
            }
        }, (error) => {
            console.error("Error getting Doubao status:", error);
        });
    }

    public controlDoubao() {
        const deviceId = 1;
        const command = "example_command";

        Dialogs.confirm({
            title: "Control Doubao",
            message: "Are you sure you want to send this command to Doubao?",
            okButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result: boolean) => {
            if (result) {
                Http.request({
                    url: `http://localhost:8000/api/devices/${deviceId}/doubao_control/`,
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    content: JSON.stringify({
                        command: command,
                    })
                }).then((response) => {
                    if (response.statusCode === 200) {
                        console.log("Doubao control command sent successfully");
                        Dialogs.alert({
                            title: "Doubao Control",
                            message: "Doubao control command sent successfully!",
                            okButtonText: "OK"
                        });
                    } else {
                        console.error("Error sending Doubao control command:", response.statusCode, response.content);
                        Dialogs.alert({
                            title: "Doubao Control",
                            message: "Error sending Doubao control command: " + response.statusCode,
                            okButtonText: "OK"
                        });
                    }
                }, (error) => {
                    console.error("Error sending Doubao control command:", error);
                    Dialogs.alert({
                        title: "Doubao Control",
                        message: "Error sending Doubao control command: " + error,
                        okButtonText: "OK"
                    });
                });
            }
        });
    }

    public startBluetoothScan() {
    }

    public connectToDevice(device: any) {
    }

    public disconnectDevice(device: any) {
    }

    async loadDeviceStatus() {
        try {
            this._isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            // 模拟从设备获取状态信息
            const mockStatus: DeviceStatus = this.getMockDeviceStatus();

            this._device = mockStatus;
            this.notifyPropertyChange('device', mockStatus);
        } catch (error) {
            console.error('加载设备状态失败:', error);
        } finally {
            this._isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    private getMockDeviceStatus(): DeviceStatus {
        return {
            id: '1',
            name: 'POP 王座',
            model: 'POP-001',
            firmwareVersion: 'v1.2.0',
            isOnline: true,
        };
    }

    async scanWiFiNetworks() {
        try {
            this._isScanning = true;
            this.notifyPropertyChange('isScanning', true);

            // 模拟扫描Wi-Fi网络
            const mockNetworks: WiFiNetwork[] = this.getMockWiFiNetworks();

            this._availableNetworks = mockNetworks;
            this.notifyPropertyChange('availableNetworks', mockNetworks);
        } catch (error) {
            console.error('扫描Wi-Fi网络失败:', error);
        } finally {
            this._isScanning = false;
            this.notifyPropertyChange('isScanning', false);
        }
    }

    private getMockWiFiNetworks(): WiFiNetwork[] {
        return [
            {
                ssid: 'Home_WiFi',
                strength: 80,
                isSecured: true,
                isConnected: true
            },
            {
                ssid: 'Office_Network',
                strength: 65,
                isSecured: true,
                isConnected: false
            },
            {
                ssid: 'Guest_WiFi',
                strength: 45,
                isSecured: false,
                isConnected: false
            }
        ];
    }

    async connectToNetwork(ssid: string, password?: string) {
        try {
            this._isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            console.log(`正在连接到网络: ${ssid}`);
            // TODO: 实现实际的Wi-Fi连接逻辑
            await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟连接过程

            // 更新连接状态
            this._availableNetworks = this._availableNetworks.map(network => ({
                ...network,
                isConnected: network.ssid === ssid
            }));
            this.notifyPropertyChange('availableNetworks', this._availableNetworks);
        } catch (error) {
            console.error('连接Wi-Fi失败:', error);
        } finally {
            this._isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    async refreshDeviceStatus() {
        await this.loadDeviceStatus();
    }

    async refreshWiFiNetworks() {
        await this.scanWiFiNetworks();
    }

    get device(): DeviceStatus | null {
        return this._device;
    }

    get availableNetworks(): WiFiNetwork[] {
        return this._availableNetworks;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    get isScanning(): boolean {
        return this._isScanning;
    }
}

export function onNavigatingTo(args: any) {
    const page = args.object as Page;
    page.bindingContext = new DeviceViewModel();
}

export function onNetworkTap(args: any) {
    const page = args.object.page as Page;
    const vm = page.bindingContext as DeviceViewModel;
    const network = args.object.bindingContext as WiFiNetwork;
    
    if (!network.isConnected) {
        // 如果需要密码，这里应该弹出输入密码的对话框
        if (network.isSecured) {
            // TODO: 实现密码输入对话框
            console.log('需要实现密码输入对话框');
        } else {
            vm.connectToNetwork(network.ssid);
        }
    }
}

export function onRefreshStatus(args: any) {
    const page = args.object.page as Page;
    const vm = page.bindingContext as DeviceViewModel;
    vm.refreshDeviceStatus();
}

export function onRefreshNetworks(args: any) {
    const page = args.object.page as Page;
    const vm = page.bindingContext as DeviceViewModel;
    vm.refreshWiFiNetworks();
}
