import { App, AppInfo } from '@capacitor/app';
import { Device } from '@capacitor/device';
import type { DeviceInfo, DeviceId } from '@capacitor/device';

export class AppInfoService {
  private static instance: AppInfoService;

  private appInfo: AppInfo | null = null;
  private deviceInfo: DeviceInfo | null = null;
  private deviceId: DeviceId | null = null;

  private generatedAppInstanceId: Record<string, any> | null = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): AppInfoService {
    if (!AppInfoService.instance) {
      AppInfoService.instance = new AppInfoService();
    }
    return AppInfoService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      const appInfo = App.getInfo();
      const deviceInfo = Device.getInfo();
      const deviceId = Device.getId();

      this.appInfo = await appInfo;
      this.deviceInfo = await deviceInfo;
      this.deviceId = await deviceId;

      this.generatedAppInstanceId = this.buildAppInstanceId();
      this.isInitialized = true;
    })();

    return this.initializationPromise;
  }

  public getAppInstanceId(): Record<string, any> {
    if (!this.isInitialized || !this.generatedAppInstanceId) {
      throw new Error('AppInfoService not initialized');
    }
    return this.generatedAppInstanceId;
  }

  private buildAppInstanceId(): Record<string, any> {
    return {
      deviceId: this.deviceId?.identifier ?? 'unknown-device',
      platform: this.deviceInfo?.platform ?? 'unknown-platform',
      version: this.appInfo?.version ?? 'unknown-version',
      build: this.appInfo?.build ?? 'unknown-build',
    };
  }
}
