// データベースサービス（IndexedDBを使用）
class DatabaseService {
  private db: IDBDatabase | null = null
  private dbName = 'AinanceDB'
  private version = 1

  constructor() {
    this.initDB()
  }

  // データベース初期化
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error('データベースの初期化に失敗しました'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // レシートテーブル
        if (!db.objectStoreNames.contains('receipts')) {
          const receiptStore = db.createObjectStore('receipts', { keyPath: 'id', autoIncrement: true })
          receiptStore.createIndex('date', 'date', { unique: false })
          receiptStore.createIndex('amount', 'amount', { unique: false })
        }

        // 請求書テーブル
        if (!db.objectStoreNames.contains('invoices')) {
          const invoiceStore = db.createObjectStore('invoices', { keyPath: 'id', autoIncrement: true })
          invoiceStore.createIndex('date', 'date', { unique: false })
          invoiceStore.createIndex('amount', 'amount', { unique: false })
          invoiceStore.createIndex('status', 'status', { unique: false })
        }

        // 取引テーブル
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true })
          transactionStore.createIndex('date', 'date', { unique: false })
          transactionStore.createIndex('type', 'type', { unique: false })
          transactionStore.createIndex('category', 'category', { unique: false })
        }

        // ユーザープロファイルテーブル
        if (!db.objectStoreNames.contains('userProfiles')) {
          const profileStore = db.createObjectStore('userProfiles', { keyPath: 'id' })
        }

        // 設定テーブル
        if (!db.objectStoreNames.contains('settings')) {
          const settingsStore = db.createObjectStore('settings', { keyPath: 'key' })
        }
      }
    })
  }

  // データベース接続を取得
  private async getDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB()
    }
    return this.db as IDBDatabase
  }

  // レシートを保存
  async saveReceipt(receipt: any): Promise<number> {
    const db = await this.getDB()
    const transaction = db.transaction(['receipts'], 'readwrite')
    const store = transaction.objectStore('receipts')
    const request = store.add(receipt)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve((request.result as number))
      request.onerror = () => reject(request.error)
    })
  }

  // レシートを取得
  async getReceipt(id: number): Promise<any> {
    const db = await this.getDB()
    const transaction = db.transaction(['receipts'], 'readonly')
    const store = transaction.objectStore('receipts')
    const request = store.get(id)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // すべてのレシートを取得
  async getAllReceipts(): Promise<any[]> {
    const db = await this.getDB()
    const transaction = db.transaction(['receipts'], 'readonly')
    const store = transaction.objectStore('receipts')
    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // レシートを更新
  async updateReceipt(id: number, receipt: any): Promise<void> {
    const db = await this.getDB()
    const transaction = db.transaction(['receipts'], 'readwrite')
    const store = transaction.objectStore('receipts')
    receipt.id = id
    const request = store.put(receipt)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // レシートを削除
  async deleteReceipt(id: number): Promise<void> {
    const db = await this.getDB()
    const transaction = db.transaction(['receipts'], 'readwrite')
    const store = transaction.objectStore('receipts')
    const request = store.delete(id)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // 請求書を保存
  async saveInvoice(invoice: any): Promise<number> {
    const db = await this.getDB()
    const transaction = db.transaction(['invoices'], 'readwrite')
    const store = transaction.objectStore('invoices')
    const request = store.add(invoice)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve((request.result as number))
      request.onerror = () => reject(request.error)
    })
  }

  // 請求書を取得
  async getInvoice(id: number): Promise<any> {
    const db = await this.getDB()
    const transaction = db.transaction(['invoices'], 'readonly')
    const store = transaction.objectStore('invoices')
    const request = store.get(id)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // すべての請求書を取得
  async getAllInvoices(): Promise<any[]> {
    const db = await this.getDB()
    const transaction = db.transaction(['invoices'], 'readonly')
    const store = transaction.objectStore('invoices')
    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // 請求書を更新
  async updateInvoice(id: number, invoice: any): Promise<void> {
    const db = await this.getDB()
    const transaction = db.transaction(['invoices'], 'readwrite')
    const store = transaction.objectStore('invoices')
    invoice.id = id
    const request = store.put(invoice)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // 請求書を削除
  async deleteInvoice(id: number): Promise<void> {
    const db = await this.getDB()
    const transaction = db.transaction(['invoices'], 'readwrite')
    const store = transaction.objectStore('invoices')
    const request = store.delete(id)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // 取引を保存
  async saveTransaction(transaction: any): Promise<number> {
    const db = await this.getDB()
    const tx = db.transaction(['transactions'], 'readwrite')
    const store = tx.objectStore('transactions')
    const request = store.add(transaction)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve((request.result as number))
      request.onerror = () => reject(request.error)
    })
  }

  // 取引を取得
  async getTransaction(id: number): Promise<any> {
    const db = await this.getDB()
    const tx = db.transaction(['transactions'], 'readonly')
    const store = tx.objectStore('transactions')
    const request = store.get(id)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // すべての取引を取得
  async getAllTransactions(): Promise<any[]> {
    const db = await this.getDB()
    const tx = db.transaction(['transactions'], 'readonly')
    const store = tx.objectStore('transactions')
    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // 特定の条件で取引を検索
  async searchTransactions(filter: { startDate?: Date, endDate?: Date, type?: string, category?: string }): Promise<any[]> {
    const db = await this.getDB()
    const tx = db.transaction(['transactions'], 'readonly')
    const store = tx.objectStore('transactions')
    const index = store.index('date')
    
    // 簡略化された検索実装
    const allTransactions = await this.getAllTransactions()
    return allTransactions.filter(transaction => {
      let match = true
      
      if (filter.startDate && new Date(transaction.date) < filter.startDate) {
        match = false
      }
      
      if (filter.endDate && new Date(transaction.date) > filter.endDate) {
        match = false
      }
      
      if (filter.type && transaction.type !== filter.type) {
        match = false
      }
      
      if (filter.category && transaction.category !== filter.category) {
        match = false
      }
      
      return match
    })
  }

  // ユーザープロファイルを保存
  async saveUserProfile(profile: any): Promise<void> {
    const db = await this.getDB()
    const transaction = db.transaction(['userProfiles'], 'readwrite')
    const store = transaction.objectStore('userProfiles')
    profile.id = 'currentUser'
    const request = store.put(profile)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // ユーザープロファイルを取得
  async getUserProfile(): Promise<any> {
    const db = await this.getDB()
    const transaction = db.transaction(['userProfiles'], 'readonly')
    const store = transaction.objectStore('userProfiles')
    const request = store.get('currentUser')

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // 設定を保存
  async saveSetting(key: string, value: any): Promise<void> {
    const db = await this.getDB()
    const transaction = db.transaction(['settings'], 'readwrite')
    const store = transaction.objectStore('settings')
    const request = store.put({ key, value })

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // 設定を取得
  async getSetting(key: string): Promise<any> {
    const db = await this.getDB()
    const transaction = db.transaction(['settings'], 'readonly')
    const store = transaction.objectStore('settings')
    const request = store.get(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result?.value)
      request.onerror = () => reject(request.error)
    })
  }
}

// シングルトンインスタンスをエクスポート
export default new DatabaseService()