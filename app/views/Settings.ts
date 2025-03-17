import { Observable } from '@nativescript/core';
import { Page } from '@nativescript/core';

export class SettingsViewModel extends Observable {
  public distanceUnits: string[];
  public weightUnits: string[];
  public settings: { title: string }[];

  constructor() {
    super();

    this.distanceUnits = ['公里', '英里'];
    this.weightUnits = ['公斤', '磅'];
    this.settings = [{ title: '隐私' }, { title: '关于' }];
  }
}

export function onNavigatingTo(args) {
  const page = args.object as Page;
  page.bindingContext = new SettingsViewModel();
}
