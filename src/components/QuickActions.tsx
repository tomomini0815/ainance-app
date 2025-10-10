import React, { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Camera, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Upload, 
  CreditCard, 
  Building, 
  Settings,
  Plus,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  path: string
  color: string
  frequency: string
}

const QuickActions: React.FC = () => {
  const [showAll, setShowAll] = useState(false)

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'レシート撮影',
      description: 'カメラでレシートをスキャン',
      icon: <Camera className="w-6 h-6" />,
      path: '/receipt-processing',
      color: 'bg-blue-500',
      frequency: '今日 12回使用'
    },
    {
      id: '2',
      title: '請求書作成',
      description: '新しい請求書を作成',
      icon: <FileText className="w-6 h-6" />,
      path: '/invoice-creation',
      color: 'bg-green-500',
      frequency: '今日 3回使用'
    },
    {
      id: '3',
      title: '経営分析',
      description: 'ビジネスパフォーマンスを分析',
      icon: <BarChart3 className="w-6 h-6" />,
      path: '/business-analysis',
      color: 'bg-purple-500',
      frequency: '今日 5回使用'
    },
    {
      id: '4',
      title: 'CHAT-TO-BOOK',
      description: 'チャットで帳簿入力',
      icon: <MessageSquare className="w-6 h-6" />,
      path: '/chat-to-book',
      color: 'bg-orange-500',
      frequency: '今日 8回使用'
    },
    {
      id: '5',
      title: 'ファイルアップロード',
      description: 'PDF/画像をアップロード',
      icon: <Upload className="w-6 h-6" />,
      path: '/receipt-processing',
      color: 'bg-indigo-500',
      frequency: '今日 7回使用'
    },
    {
      id: '6',
      title: 'カード連携',
      description: 'クレジットカードと連携',
      icon: <CreditCard className="w-6 h-6" />,
      path: '/integration-settings',
      color: 'bg-red-500',
      frequency: '設定済み'
    },
    {
      id: '7',
      title: '事業変換',
      description: '個人事業から法人へ',
      icon: <Building className="w-6 h-6" />,
      path: '/business-conversion',
      color: 'bg-yellow-500',
      frequency: '未開始'
    },
    {
      id: '8',
      title: '設定',
      description: 'アプリケーションの設定',
      icon: <Settings className="w-6 h-6" />,
      path: '/integration-settings',
      color: 'bg-gray-500',
      frequency: '最終更新 2日前'
    }
  ]

  const displayedActions = showAll ? quickActions : quickActions.slice(0, 6)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">クイックアクション</h2>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showAll ? '一部を表示' : 'すべて表示'}
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {displayedActions.map((action) => (
          <Link 
            key={action.id}
            to={action.path}
            className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className={`${action.color} p-3 rounded-lg text-white mb-3 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <h3 className="font-medium text-gray-900 text-center mb-1">{action.title}</h3>
            <p className="text-xs text-gray-600 text-center mb-2">{action.description}</p>
            <p className="text-xs text-gray-500">{action.frequency}</p>
          </Link>
        ))}
        
        {/* 追加アクションボタン */}
        <button className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-300 transition-colors">
          <div className="bg-gray-100 p-3 rounded-lg text-gray-600 mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-medium text-gray-900 text-center mb-1">アクションを追加</h3>
          <p className="text-xs text-gray-600 text-center">カスタムアクション</p>
        </button>
      </div>
      
      {/* 統計情報 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">今日の利用状況</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">25</p>
              <p className="text-xs text-gray-600">合計アクション</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">8</p>
              <p className="text-xs text-gray-600">タスク完了</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Bell className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">3</p>
              <p className="text-xs text-gray-600">未読通知</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(QuickActions)