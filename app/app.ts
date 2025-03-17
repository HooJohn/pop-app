import { Application, ApplicationSettings } from '@nativescript/core';
import './styles/views.css';

console.log('Application initialization starting...');

// 立即启动应用
try {
    console.log('Starting application...');
    Application.run({ moduleName: 'app.xml' });

    // 启动后再注册事件监听
    Application.on(Application.launchEvent, () => {
        console.log('Application launched');
        
        // 设置一些基本配置
        ApplicationSettings.setBoolean('initialized', true);
    });

    Application.on(Application.uncaughtErrorEvent, (args) => {
        console.error('Uncaught error:', args.error);
    });

    // 注册错误处理
    global.onunhandledrejection = (error: any) => {
        console.error('Unhandled Promise Rejection:', error);
    };

    Application.on(Application.exitEvent, () => {
        console.log('Application exit event triggered');
    });

    Application.on(Application.lowMemoryEvent, () => {
        console.warn('Low memory warning received');
    });

} catch (error) {
    console.error('Fatal error during application start:', error);
}
