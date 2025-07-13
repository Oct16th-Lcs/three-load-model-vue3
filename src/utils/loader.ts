// 定义事件回调类型
type LoadEventCallback = () => void;
type LoadingEventCallback = (progress: { nowProgress: number; allProgress: number }) => void;

export default class Loader {
  private items: string[] = [];
  private loadedCount = 0;

  // 事件回调
  private onStart: LoadEventCallback | null = null;
  private onLoading: LoadingEventCallback | null = null;
  private onComplete: LoadEventCallback | null = null;
  private onError: ((error: any) => void) | null = null;

  constructor() {}

  // 设置要加载的资源列表
  public setData(urls: string[]) {
    this.items = urls
  }

  // 开始加载
  public start(): void {
    if (this.items.length === 0) {
      this.onComplete?.();
      return;
    }

    this.loadedCount = 0;
    this.onStart?.();

    this.items.forEach(item => {
      const img = new Image();
      img.src = item;

      img.onload = () => {
        this.loadedCount++;
        this.onLoading?.({ nowProgress: this.loadedCount, allProgress: this.items.length });

        if (this.loadedCount === this.items.length) {
          this.onComplete?.();
        }
      };

      img.onerror = (e) => {
        console.log('🚀🚀🚀 ~图片加载失败', e)
        this.onError?.(e);
      };
    });
  }

  // 绑定事件
  public on(event: 'start', callback: LoadEventCallback): void;
  public on(event: 'loading', callback: LoadingEventCallback): void;
  public on(event: 'complete', callback: LoadEventCallback): void;
  public on(event: 'error', callback: (error: any) => void): void;
  public on(event: string, callback: any): void {
    switch (event) {
      case 'start':
        this.onStart = callback;
        break;
      case 'loading':
        this.onLoading = callback;
        break;
      case 'complete':
        this.onComplete = callback;
        break;
      case 'error':
        this.onError = callback;
        break;
    }
  }

  // 解绑事件
  public off(event: 'start' | 'loading' | 'complete' | 'error'): void {
    switch (event) {
      case 'start':
        this.onStart = null;
        break;
      case 'loading':
        this.onLoading = null;
        break;
      case 'complete':
        this.onComplete = null;
        break;
      case 'error':
        this.onError = null;
        break;
    }
  }
}
