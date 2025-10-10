// リアルタイム通知サービス
class NotificationService {
  private subscribers: Array<(notification: any) => void> = []
  private notificationPermission: NotificationPermission = 'default'

  constructor() {
    this.requestNotificationPermission()
    this.setupWebSocket()
  }

  // 通知権限をリクエスト
  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission()
    }
  }

  // WebSocket接続を設定
  private setupWebSocket(): void {
    // 実際のアプリケーションでは、WebSocketサーバーに接続します
    // ここではモック実装を提供します
    
    // WebSocket接続のモック
    setInterval(() => {
      // ランダムに通知を生成
      if (Math.random() > 0.7) {
        const mockNotifications = [
          {
            id: Date.now(),
            title: '新しいレシートが処理されました',
            description: 'コンビニ領収書 - ¥1,200',
            time: new Date().toLocaleTimeString(),
            type: 'receipt',
            unread: true
          },
          {
            id: Date.now(),
            title: '請求書が送信されました',
            description: '株式会社サンプル - ¥50,000',
            time: new Date().toLocaleTimeString(),
            type: 'invoice',
            unread: true
          },
          {
            id: Date.now(),
            title: '銀行連携が更新されました',
            description: '三菱UFJ銀行 - 8件の取引',
            time: new Date().toLocaleTimeString(),
            type: 'bank',
            unread: true
          }
        ]
        
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
        this.notify(randomNotification)
      }
    }, 30000) // 30秒ごとにチェック
  }

  // 通知を送信
  private async sendNotification(notification: any): Promise<void> {
    // ブラウザ通知を表示
    if (this.notificationPermission === 'granted' && 'Notification' in window) {
      new Notification(notification.title, {
        body: notification.description,
        icon: '/icon.png' // アイコンのパス
      })
    }

    // サブスクライバーに通知を配信
    this.subscribers.forEach(callback => {
      callback(notification)
    })
  }

  // 通知を処理
  async notify(notification: any): Promise<void> {
    // ローカルストレージに通知を保存
    const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]')
    existingNotifications.unshift(notification)
    // 最新の10件のみ保持
    const limitedNotifications = existingNotifications.slice(0, 10)
    localStorage.setItem('notifications', JSON.stringify(limitedNotifications))

    // 通知を送信
    await this.sendNotification(notification)
  }

  // 通知を取得
  async getNotifications(): Promise<any[]> {
    return JSON.parse(localStorage.getItem('notifications') || '[]')
  }

  // 通知を既読にする
  async markAsRead(notificationId: number): Promise<void> {
    const notifications = await this.getNotifications()
    const updatedNotifications = notifications.map((notification: any) => 
      notification.id === notificationId ? { ...notification, unread: false } : notification
    )
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
  }

  // すべての通知を既読にする
  async markAllAsRead(): Promise<void> {
    const notifications = await this.getNotifications()
    const updatedNotifications = notifications.map((notification: any) => ({ ...notification, unread: false }))
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
  }

  // 通知をクリア
  async clearNotifications(): Promise<void> {
    localStorage.setItem('notifications', JSON.stringify([]))
  }

  // 未読通知数を取得
  async getUnreadCount(): Promise<number> {
    const notifications = await this.getNotifications()
    return notifications.filter((notification: any) => notification.unread).length
  }

  // 通知イベントを購読
  subscribe(callback: (notification: any) => void): void {
    this.subscribers.push(callback)
  }

  // 通知イベントの購読を解除
  unsubscribe(callback: (notification: any) => void): void {
    const index = this.subscribers.indexOf(callback)
    if (index > -1) {
      this.subscribers.splice(index, 1)
    }
  }
}

// シングルトンインスタンスをエクスポート
export default new NotificationService()