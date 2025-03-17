import { Observable, Page } from '@nativescript/core';

interface Application {
    id: string;
  name: string;
  description: string;
  icon: string;
  iconClass: string;
  status: string;
  statusClass: string;
  isInstalled: boolean;
}

export class ApplicationsViewModel extends Observable {
    private _applications: Application[] = [];
    private _searchQuery: string = '';
    private _isLoading: boolean = false;

    constructor() {
        super();
        this.loadApplications();
    }

    private async loadApplications() {
        try {
            this._isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            // 模拟加载应用列表
            const mockApps: Application[] = this.getMockApplications();

            this._applications = mockApps;
            this.notifyPropertyChange('applications', mockApps);
        } catch (error) {
            console.error('加载应用列表失败:', error);
        } finally {
            this._isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    private getMockApplications(): Application[] {
        return [
            {
                id: '1',
                name: 'QQ 音乐',
                description: '智能对话助手，让生活更简单',
                icon: '\uf1bc',
                iconClass: 'fab fa-qq text-blue-500',
                status: '已连接',
                statusClass: 'text-green-500',
                isInstalled: true
            },
            {
                id: '2',
                name: 'AI 音乐',
                description: '千万曲库，听你想听',
                icon: '\uf001',
                iconClass: 'fas fa-music text-red-500',
                status: '空闲',
                statusClass: 'text-yellow-500',
                isInstalled: true
            },
            {
                id: '3',
                name: '喜马拉雅',
                description: '发现音乐的力量',
                icon: '\uf1e6',
                iconClass: 'fas fa-podcast text-purple-500',
                status: '未连接',
                statusClass: 'text-gray-400',
                isInstalled: false
            },
            {
                id: '4',
                name: '听书',
                description: '发现音乐的力量',
                icon: '\uf02d',
                iconClass: 'fas fa-book-open text-orange-500',
                status: '已连接',
                statusClass: 'text-green-500',
                isInstalled: false
            }
        ];
    }

    public onSearch(args: any) {
        const searchBar = args.object;
        this._searchQuery = searchBar.text;
        // 实现搜索逻辑
    }

    public onInstallApp(args: any) {
        const app = args.object.bindingContext as Application;
        console.log('安装应用:', app.name);
        // 实现安装逻辑
    }

    public onOpenApp(args: any) {
        const app = args.object.bindingContext as Application;
        console.log('打开应用:', app.name);
        // 实现打开应用逻辑
    }

    get applications(): Application[] {
        return this._applications;
    }

    get searchQuery(): string {
        return this._searchQuery;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }
}

export function onNavigatingTo(args: any) {
    const page = args.object as Page;
    page.bindingContext = new ApplicationsViewModel();
}
