import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import QuickActions from '../components/QuickActions'
import CustomizableDashboard from '../components/CustomizableDashboard'
import { TrendingUp, TrendingDown, Wallet, CreditCard, BarChart3, Calendar, Bell, Settings, Calculator, FileText } from 'lucide-react'
import api from '../services/api'
import notificationService from '../services/notificationService'
import { useAuth } from '../hooks/useAuth'

// ダミーデータ
const financialSummary = {
  revenue: 1250000,
  expenses: 380000,
  profit: 870000,
  revenueChange: 12.5,
  expenseChange: -3.2,
  profitChange: 18.7
}

const recentActivities = [
  { id: 1, action: 'レシート処理完了', description: 'コンビニ領収書 - ¥1,200', time: '5分前', type: 'receipt' },
  { id: 2, action: '請求書送信', description: '株式会社サンプル - ¥50,000', time: '1時間前', type: 'invoice' },
  { id: 3, action: 'AI仕訳完了', description: '交通費 - ¥3,500', time: '2時間前', type: 'ai' },
  { id: 4, action: '銀行連携更新', description: '三菱UFJ銀行 - 8件の取引', time: '3時間前', type: 'bank' }
]

const upcomingTasks = [
  { id: 1, title: '請求書作成', description: '株式会社ABCへの請求書', dueDate: '2024-01-20', priority: 'high' },
  { id: 2, title: '税金申告準備', description: '第1四半期消費税申告', dueDate: '2024-01-25', priority: 'medium' },
  { id: 3, title: '銀行明細確認', description: '1月分の取引明細確認', dueDate: '2024-01-31', priority: 'low' }
]

const performanceMetrics = [
  { name: '売上成長率', value: '+12.5%', change: 2.3, icon: <TrendingUp className="w-5 h-5 text-green-500" /> },
  { name: '経費削減率', value: '-3.2%', change: -1.1, icon: <TrendingDown className="w-5 h-5 text-red-500" /> },
  { name: '純利益率', value: '24.5%', change: 1.8, icon: <BarChart3 className="w-5 h-5 text-blue-500" /> },
  { name: 'AI処理精度', value: '98.7%', change: 0.5, icon: <BarChart3 className="w-5 h-5 text-purple-500" /> }
]

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month')
  const [notifications, setNotifications] = useState(3)

  // ダミーのデータ更新処理
  useEffect(() => {
    const interval = setInterval(() => {
      // 実際にはAPIからデータを取得する
      console.log('データ更新')
    }, 30000) // 30秒ごとに更新

    return () => clearInterval(interval)
  }, [])

  // 通知サービスの初期化
  useEffect(() => {
    const updateNotificationCount = async () => {
      const count = await notificationService.getUnreadCount()
      setNotifications(count)
    }

    // 通知を購読
    notificationService.subscribe(updateNotificationCount)
    
    // 初期通知数を取得
    updateNotificationCount()

    return () => {
      // コンポーネントのクリーンアップ時に購読を解除
      notificationService.unsubscribe(updateNotificationCount)
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ヘッダーと通知 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
            <p className="text-gray-600">ようこそ、Ainanceへ</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
            <Settings className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
          </div>
        </div>

        {/* 財務サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">売上</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialSummary.revenue)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{financialSummary.revenueChange}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">経費</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialSummary.expenses)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  {financialSummary.expenseChange}%
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">純利益</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialSummary.profit)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{financialSummary.profitChange}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI処理件数</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-gray-600 mt-1">今月</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* クイックアクションとパフォーマンス指標 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">パフォーマンス指標</h2>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {metric.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{metric.value}</p>
                    <p className="text-xs text-gray-500">{metric.change > 0 ? '+' : ''}{metric.change}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* カスタマイズ可能なダッシュボード */}
        <div className="mb-8">
          <CustomizableDashboard />
        </div>

        {/* 最近の活動とタスク */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 最近の活動 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">最近の活動</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">すべて表示</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    {activity.type === 'receipt' && <Calculator className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'invoice' && <FileText className="w-5 h-5 text-green-600" />}
                    {activity.type === 'ai' && <BarChart3 className="w-5 h-5 text-purple-600" />}
                    {activity.type === 'bank' && <CreditCard className="w-5 h-5 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 今後のタスク */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">今後のタスク</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">すべて表示</button>
            </div>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg">
                  <div className="mr-3 mt-1">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {task.dueDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
