import React, { useState, memo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {ChevronDown, User, Settings, LogOut, Bell, Search, Menu, X, Home, Calculator, FileText, BarChart3, MessageSquare, Zap, Building} from 'lucide-react'
import BusinessTypeSwitcher from './BusinessTypeSwitcher'
import { useAuth } from '../hooks/useAuth'

const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentBusinessType, setCurrentBusinessType] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // 仮のユーザーID（実際の実装では認証システムから取得）
  const userId = user?.userId || "user_001"
  
  // 通知のダミーデータ
  const notifications = [
    { id: 1, title: '新しいレシートが処理されました', description: 'コンビニ領収書 - ¥1,200', time: '5分前', unread: true },
    { id: 2, title: '請求書が送信されました', description: '株式会社サンプル - ¥50,000', time: '1時間前', unread: true },
    { id: 3, title: '銀行連携が更新されました', description: '三菱UFJ銀行 - 8件の取引', time: '3時間前', unread: false }
  ]

  const navItems = [
    { name: 'ダッシュボード', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'レシート', path: '/receipt-processing', icon: <Calculator className="w-5 h-5" /> },
    { name: '請求書', path: '/invoice-creation', icon: <FileText className="w-5 h-5" /> },
    { name: '経営分析', path: '/business-analysis', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'CHAT-TO-BOOK', path: '/chat-to-book', icon: <MessageSquare className="w-5 h-5" /> },
    { name: '事業変換', path: '/business-conversion', icon: <Zap className="w-5 h-5" /> }
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleBusinessTypeChange = (businessType: any) => {
    setCurrentBusinessType(businessType)
    console.log('業態形態が変更されました:', businessType)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 検索処理を実装
    console.log('検索:', searchQuery)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴと検索 */}
          <div className="flex items-center">
            <Link to="/dashboard">
              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700">Ainance</h1>
            </Link>
            
            {/* デスクトップ検索 */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center ml-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="検索..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
          
          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* 業態形態切り替え */}
            <BusinessTypeSwitcher 
              userId={userId}
              onBusinessTypeChange={handleBusinessTypeChange}
            />
            
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center font-medium pb-1 ${
                  isActive(item.path) 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* ユーザーメニューと通知 */}
          <div className="flex items-center space-x-4">
            {/* 通知 */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1 text-gray-600 hover:text-gray-900 relative"
              >
                <Bell className="w-6 h-6" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-medium text-gray-900">通知</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 text-center">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        すべての通知を表示
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* ユーザードロップダウン */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.userName || 'ユーザー'}
                </span>
                <ChevronDown className="w-4 h-4 hidden md:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user?.userName}</div>
                      <div className="text-gray-500">{user?.email}</div>
                    </div>
                    <Link
                      to="/integration-settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      設定
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        handleSignOut()
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      ログアウト
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* モバイルメニュー */}
            <button 
              className="md:hidden text-gray-600"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* モバイルナビゲーション */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* モバイル検索 */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="検索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            
            <div className="mb-4">
              <BusinessTypeSwitcher 
                userId={userId}
                onBusinessTypeChange={handleBusinessTypeChange}
              />
            </div>
            
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default memo(Header)
