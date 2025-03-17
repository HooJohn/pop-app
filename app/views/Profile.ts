import { Observable, Page } from '@nativescript/core';

interface WishlistItem {
    id: string;
    appName: string;
    description: string;
    timestamp: Date;
    status: 'pending' | 'approved' | 'rejected';
}

export class ProfileViewModel extends Observable {
    private _wishlist: WishlistItem[] = [];
    private _isLoading: boolean = false;
  private _newWishAppName: string = '';
  private _newWishDescription: string = '';
  private _userName: string = '';
  private _userEmail: string = '';

  constructor() {
    super();
    this.loadWishlist();
    this._userName = '用户昵称';
    this._userEmail = 'user@example.com';
    this.notifyPropertyChange('userName', this._userName);
    this.notifyPropertyChange('userEmail', this._userEmail);
  }

    async loadWishlist() {
        try {
            this._isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            // 模拟从后端API获取心愿列表
            const mockWishlist: WishlistItem[] = this.getMockWishlist();

            this._wishlist = mockWishlist;
            this.notifyPropertyChange('wishlist', mockWishlist);
        } catch (error) {
            console.error('加载心愿列表失败:', error);
        } finally {
            this._isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    private getMockWishlist(): WishlistItem[] {
        return [
            {
                id: '1',
                appName: '网易云音乐',
                description: '希望能够支持网易云音乐，可以播放我的歌单',
                timestamp: new Date(),
                status: 'pending'
            },
            {
                id: '2',
                appName: '喜马拉雅',
                description: '希望能够支持喜马拉雅，可以收听有声书',
                timestamp: new Date(),
                status: 'approved'
            }
        ];
    }

    async addWishlistItem() {
        if (!this._newWishAppName || !this._newWishDescription) {
            console.log('应用名称和描述不能为空');
            return;
        }

        try {
            this._isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            // 模拟向后端API提交新的心愿
            const newItem: WishlistItem = {
                id: Date.now().toString(),
                appName: this._newWishAppName,
                description: this._newWishDescription,
                timestamp: new Date(),
                status: 'pending'
            };

            this._wishlist.unshift(newItem);
            this.notifyPropertyChange('wishlist', this._wishlist);

            // 清空输入
            this._newWishAppName = '';
            this._newWishDescription = '';
            this.notifyPropertyChange('newWishAppName', '');
            this.notifyPropertyChange('newWishDescription', '');
        } catch (error) {
            console.error('添加心愿失败:', error);
        } finally {
            this._isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    get wishlist(): WishlistItem[] {
        return this._wishlist;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    get newWishAppName(): string {
        return this._newWishAppName;
    }

    set newWishAppName(value: string) {
        if (this._newWishAppName !== value) {
            this._newWishAppName = value;
            this.notifyPropertyChange('newWishAppName', value);
        }
    }

    get newWishDescription(): string {
        return this._newWishDescription;
    }

    set newWishDescription(value: string) {
        if (this._newWishDescription !== value) {
            this._newWishDescription = value;
            this.notifyPropertyChange('newWishDescription', value);
        }
  }

  get userName(): string {
    return this._userName;
  }

  get userEmail(): string {
    return this._userEmail;
  }
}

export function onNavigatingTo(args: any) {
    const page = args.object as Page;
    page.bindingContext = new ProfileViewModel();
}

export function onAddWishTap(args: any) {
    const page = args.object.page as Page;
    const vm = page.bindingContext as ProfileViewModel;
    vm.addWishlistItem();
}
