import { Observable, Page } from '@nativescript/core';

interface AppUsageData {
    appId: string;
    appName: string;
    icon: string;
    usageTime: number; // 分钟
    lastUsed: Date;
    tokenCount?: number; // 豆包特有
    usageHistory: {
        date: Date;
        duration: number; // 分钟
    }[];
}

type PeriodType = 'today' | 'week' | 'month';

export class UsageDataViewModel extends Observable {
    private _usageData: AppUsageData[] = [];
    private _isLoading: boolean = false;
    private _selectedPeriod: PeriodType = 'today';

    constructor() {
        super();
        this.loadUsageData();
    }

    async loadUsageData() {
        try {
            this._isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            // 模拟从后端API获取使用数据
            const mockData: AppUsageData[] = this.getMockUsageData();

            this._usageData = mockData;
            this.notifyPropertyChange('usageData', mockData);
        } catch (error) {
            console.error('加载使用数据失败:', error);
        } finally {
            this._isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    private getMockUsageData(): AppUsageData[] {
        return [
            {
                appId: '1',
                appName: '豆包',
                icon: '~/assets/images/doubao.png',
                usageTime: 120,
                lastUsed: new Date(),
                tokenCount: 1000,
                usageHistory: [
                    { date: new Date(), duration: 30 },
                    { date: new Date(Date.now() - 86400000), duration: 45 },
                    { date: new Date(Date.now() - 172800000), duration: 45 }
                ]
            },
            {
                appId: '2',
                appName: 'QQ音乐',
                icon: '~/assets/images/qqmusic.png',
                usageTime: 60,
                lastUsed: new Date(Date.now() - 3600000),
                usageHistory: [
                    { date: new Date(), duration: 15 },
                    { date: new Date(Date.now() - 86400000), duration: 25 },
                    { date: new Date(Date.now() - 172800000), duration: 20 }
                ]
            }
        ];
    }

    formatUsageTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours > 0) {
            return `${hours}小时${remainingMinutes}分钟`;
        }
        return `${remainingMinutes}分钟`;
    }

    formatLastUsed(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}天前`;
        }
        if (hours > 0) {
            return `${hours}小时前`;
        }
        if (minutes > 0) {
            return `${minutes}分钟前`;
        }
        return '刚刚';
    }

    get usageData(): AppUsageData[] {
        return this._usageData;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    get selectedPeriod(): PeriodType {
        return this._selectedPeriod;
    }

    set selectedPeriod(value: PeriodType) {
        if (this._selectedPeriod !== value) {
            this._selectedPeriod = value;
            this.notifyPropertyChange('selectedPeriod', value);
            this.loadUsageData();
        }
    }
}

export function onNavigatingTo(args: any) {
    const page = args.object as Page;
    page.bindingContext = new UsageDataViewModel();
}

export function onPeriodChange(args: any) {
    const page = args.object.page as Page;
    const vm = page.bindingContext as UsageDataViewModel;
    vm.selectedPeriod = args.object.id;
}

export function onRefreshData(args: any) {
    const page = args.object.page as Page;
    const vm = page.bindingContext as UsageDataViewModel;
    vm.loadUsageData();
}
