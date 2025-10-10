import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'

// APIのベースURL（環境変数から取得）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// APIサービスクラス
class APIService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // リクエストインターセプター
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 認証トークンをヘッダーに追加
        const token = localStorage.getItem('authToken')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // レスポンスインターセプター
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // 認証エラーの場合、ログアウト処理
          localStorage.removeItem('authToken')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // レシート処理API
  async processReceipt(imageData: FormData) {
    try {
      const response = await this.client.post('/receipts/process', imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw new Error(`レシート処理に失敗しました: ${error}`)
    }
  }

  // 請求書作成API
  async createInvoice(invoiceData: any) {
    try {
      const response = await this.client.post('/invoices', invoiceData)
      return response.data
    } catch (error) {
      throw new Error(`請求書作成に失敗しました: ${error}`)
    }
  }

  // 経営分析データ取得API
  async getBusinessAnalysis(params?: any) {
    try {
      const response = await this.client.get('/analysis', { params })
      return response.data
    } catch (error) {
      throw new Error(`経営分析データの取得に失敗しました: ${error}`)
    }
  }

  // 銀行連携API
  async connectBank(bankData: any) {
    try {
      const response = await this.client.post('/banks/connect', bankData)
      return response.data
    } catch (error) {
      throw new Error(`銀行連携に失敗しました: ${error}`)
    }
  }

  // 銀行取引履歴取得API
  async getBankTransactions(bankId: string, params?: any) {
    try {
      const response = await this.client.get(`/banks/${bankId}/transactions`, { params })
      return response.data
    } catch (error) {
      throw new Error(`銀行取引履歴の取得に失敗しました: ${error}`)
    }
  }

  // クレジットカード連携API
  async connectCreditCard(cardData: any) {
    try {
      const response = await this.client.post('/credit-cards/connect', cardData)
      return response.data
    } catch (error) {
      throw new Error(`クレジットカード連携に失敗しました: ${error}`)
    }
  }

  // クレジットカード利用明細取得API
  async getCreditCardTransactions(cardId: string, params?: any) {
    try {
      const response = await this.client.get(`/credit-cards/${cardId}/transactions`, { params })
      return response.data
    } catch (error) {
      throw new Error(`クレジットカード利用明細の取得に失敗しました: ${error}`)
    }
  }

  // ECサイト連携API
  async connectEcommerce(shopData: any) {
    try {
      const response = await this.client.post('/ecommerce/connect', shopData)
      return response.data
    } catch (error) {
      throw new Error(`ECサイト連携に失敗しました: ${error}`)
    }
  }

  // ECサイト売上データ取得API
  async getEcommerceSales(shopId: string, params?: any) {
    try {
      const response = await this.client.get(`/ecommerce/${shopId}/sales`, { params })
      return response.data
    } catch (error) {
      throw new Error(`ECサイト売上データの取得に失敗しました: ${error}`)
    }
  }

  // 会計ソフト連携API
  async connectAccounting(softwareData: any) {
    try {
      const response = await this.client.post('/accounting/connect', softwareData)
      return response.data
    } catch (error) {
      throw new Error(`会計ソフト連携に失敗しました: ${error}`)
    }
  }

  // 会計データ同期API
  async syncAccountingData(softwareId: string) {
    try {
      const response = await this.client.post(`/accounting/${softwareId}/sync`)
      return response.data
    } catch (error) {
      throw new Error(`会計データの同期に失敗しました: ${error}`)
    }
  }

  // 決済サービス連携API
  async connectPaymentService(paymentData: any) {
    try {
      const response = await this.client.post('/payments/connect', paymentData)
      return response.data
    } catch (error) {
      throw new Error(`決済サービス連携に失敗しました: ${error}`)
    }
  }

  // 決済データ取得API
  async getPaymentTransactions(paymentId: string, params?: any) {
    try {
      const response = await this.client.get(`/payments/${paymentId}/transactions`, { params })
      return response.data
    } catch (error) {
      throw new Error(`決済データの取得に失敗しました: ${error}`)
    }
  }

  // ユーザープロファイル取得API
  async getUserProfile() {
    try {
      const response = await this.client.get('/user/profile')
      return response.data
    } catch (error) {
      throw new Error(`ユーザープロファイルの取得に失敗しました: ${error}`)
    }
  }

  // ユーザープロファイル更新API
  async updateUserProfile(profileData: any) {
    try {
      const response = await this.client.put('/user/profile', profileData)
      return response.data
    } catch (error) {
      throw new Error(`ユーザープロファイルの更新に失敗しました: ${error}`)
    }
  }

  // 通知一覧取得API
  async getNotifications() {
    try {
      const response = await this.client.get('/notifications')
      return response.data
    } catch (error) {
      throw new Error(`通知一覧の取得に失敗しました: ${error}`)
    }
  }

  // 通知既読処理API
  async markNotificationAsRead(notificationId: string) {
    try {
      const response = await this.client.put(`/notifications/${notificationId}/read`)
      return response.data
    } catch (error) {
      throw new Error(`通知既読処理に失敗しました: ${error}`)
    }
  }
}

// シングルトンインスタンスをエクスポート
export default new APIService()