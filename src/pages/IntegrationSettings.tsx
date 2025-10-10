import React, { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import {ArrowLeft, Plus, Check, X, RefreshCw, AlertCircle, Settings, Eye, EyeOff, Copy, Search, Filter, Download, Upload, Trash2, Edit} from 'lucide-react'
import Header from '../components/Header'

interface Integration {
  id: string
  name: string
  type: 'bank' | 'credit' | 'ecommerce' | 'pos' | 'accounting' | 'payment'
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  lastSync: string
  description: string
  logo: string
  features: string[]
  syncFrequency: string
  nextSync: string
}

interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  created: string
  lastUsed: string
  status: 'active' | 'inactive'
}

const IntegrationSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'integrations' | 'api' | 'sync'>('integrations')
  const [showApiKey, setShowApiKey] = useState<{[key: string]: boolean}>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showNewApiKeyForm, setShowNewApiKeyForm] = useState(false)
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    permissions: [] as string[]
  })

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: '三菱UFJ銀行',
      type: 'bank',
      status: 'connected',
      lastSync: '2024-01-15 09:30',
      description: '普通預金口座の取引履歴を自動取得',
      logo: '🏦',
      features: ['残高照会', '取引履歴', '自動仕訳'],
      syncFrequency: '1時間毎',
      nextSync: '2024-01-15 10:30'
    },
    {
      id: '2',
      name: '楽天カード',
      type: 'credit',
      status: 'connected',
      lastSync: '2024-01-15 08:45',
      description: 'クレジットカード利用明細を自動取得',
      logo: '💳',
      features: ['利用明細', '自動分類', 'レシート連携'],
      syncFrequency: '日次',
      nextSync: '2024-01-16 00:00'
    },
    {
      id: '3',
      name: 'Amazon',
      type: 'ecommerce',
      status: 'error',
      lastSync: '2024-01-14 15:20',
      description: 'Amazon販売データの自動取得',
      logo: '📦',
      features: ['売上データ', '手数料計算', '在庫管理'],
      syncFrequency: '日次',
      nextSync: '2024-01-16 00:00'
    },
    {
      id: '4',
      name: 'Square POS',
      type: 'pos',
      status: 'disconnected',
      lastSync: '未接続',
      description: 'POS売上データの自動取得',
      logo: '🛒',
      features: ['売上データ', '商品管理', 'レシート発行'],
      syncFrequency: '未設定',
      nextSync: '未設定'
    },
    {
      id: '5',
      name: 'PayPal',
      type: 'payment',
      status: 'connected',
      lastSync: '2024-01-15 10:15',
      description: 'PayPal決済データの自動取得',
      logo: '💰',
      features: ['決済履歴', '手数料計算', '返金処理'],
      syncFrequency: 'リアルタイム',
      nextSync: '随時'
    },
    {
      id: '6',
      name: 'freee',
      type: 'accounting',
      status: 'pending',
      lastSync: '設定中',
      description: '会計ソフトとのデータ連携',
      logo: '📊',
      features: ['仕訳同期', 'レポート', '税務申告'],
      syncFrequency: '日次',
      nextSync: '2024-01-16 00:00'
    }
  ])

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'メインAPI',
      key: 'ak_live_1234567890abcdef...',
      permissions: ['read', 'write', 'admin'],
      created: '2024-01-01',
      lastUsed: '2024-01-15 09:30',
      status: 'active'
    },
    {
      id: '2',
      name: 'モバイルアプリ',
      key: 'ak_test_abcdef1234567890...',
      permissions: ['read'],
      created: '2024-01-10',
      lastUsed: '2024-01-14 16:45',
      status: 'active'
    },
    {
      id: '3',
      name: '開発用',
      key: 'ak_dev_fedcba0987654321...',
      permissions: ['read', 'write'],
      created: '2024-01-05',
      lastUsed: '2024-01-12 11:20',
      status: 'inactive'
    }
  ])

  const availableIntegrations = [
    { name: 'みずほ銀行', type: 'bank', logo: '🏦' },
    { name: 'りそな銀行', type: 'bank', logo: '🏦' },
    { name: 'イオンカード', type: 'credit', logo: '💳' },
    { name: 'JCBカード', type: 'credit', logo: '💳' },
    { name: 'Shopify', type: 'ecommerce', logo: '🛍️' },
    { name: 'BASE', type: 'ecommerce', logo: '🛍️' },
    { name: 'Airレジ', type: 'pos', logo: '📱' },
    { name: 'Stripe', type: 'payment', logo: '💳' },
    { name: 'マネーフォワード', type: 'accounting', logo: '📈' }
  ]

  const syncHistory = [
    { time: '2024-01-15 10:15', source: 'PayPal', type: '決済データ', count: 15, status: 'success' },
    { time: '2024-01-15 09:30', source: '三菱UFJ銀行', type: '取引履歴', count: 8, status: 'success' },
    { time: '2024-01-15 08:45', source: '楽天カード', type: '利用明細', count: 23, status: 'success' },
    { time: '2024-01-14 15:20', source: 'Amazon', type: '売上データ', count: 0, status: 'error' },
    { time: '2024-01-14 14:30', source: '三菱UFJ銀行', type: '取引履歴', count: 12, status: 'success' },
    { time: '2024-01-14 10:15', source: 'PayPal', type: '決済データ', count: 7, status: 'success' },
    { time: '2024-01-13 09:30', source: '三菱UFJ銀行', type: '取引履歴', count: 5, status: 'success' },
    { time: '2024-01-13 08:45', source: '楽天カード', type: '利用明細', count: 18, status: 'success' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100'
      case 'disconnected': return 'text-gray-600 bg-gray-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return '接続済み'
      case 'disconnected': return '未接続'
      case 'error': return 'エラー'
      case 'pending': return '設定中'
      default: return '不明'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bank': return 'text-blue-600 bg-blue-100'
      case 'credit': return 'text-purple-600 bg-purple-100'
      case 'ecommerce': return 'text-green-600 bg-green-100'
      case 'pos': return 'text-yellow-600 bg-yellow-100'
      case 'accounting': return 'text-indigo-600 bg-indigo-100'
      case 'payment': return 'text-pink-600 bg-pink-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'bank': return '銀行'
      case 'credit': return 'クレジット'
      case 'ecommerce': return 'ECサイト'
      case 'pos': return 'POS'
      case 'accounting': return '会計ソフト'
      case 'payment': return '決済サービス'
      default: return 'その他'
    }
  }

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || integration.type === filterType
    return matchesSearch && matchesFilter
  })

  const toggleApiKeyVisibility = (keyId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key)
    // トースト通知などを実装
  }

  const handleConnect = (integrationId: string) => {
    // 連携処理を実装
    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId ? {...int, status: 'pending'} : int
      )
    )
    console.log('Connecting to:', integrationId)
  }

  const handleDisconnect = (integrationId: string) => {
    // 切断処理を実装
    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId ? {...int, status: 'disconnected'} : int
      )
    )
    console.log('Disconnecting from:', integrationId)
  }

  const handleSync = (integrationId: string) => {
    // 同期処理を実装
    console.log('Syncing:', integrationId)
  }

  const handleCreateApiKey = () => {
    if (!newApiKey.name) return;
    
    const newKey: APIKey = {
      id: (apiKeys.length + 1).toString(),
      name: newApiKey.name,
      key: `ak_${newApiKey.name.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substr(2, 10)}`,
      permissions: newApiKey.permissions,
      created: new Date().toISOString().split('T')[0],
      lastUsed: '未使用',
      status: 'active'
    }
    
    setApiKeys(prev => [...prev, newKey])
    setNewApiKey({ name: '', permissions: [] })
    setShowNewApiKeyForm(false)
  }

  const handleDeleteApiKey = (keyId: string) => {
    if (window.confirm('このAPIキーを削除してもよろしいですか？')) {
      setApiKeys(prev => prev.filter(key => key.id !== keyId))
    }
  }

  const togglePermission = (permission: string) => {
    setNewApiKey(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const exportSyncHistory = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "時刻,サービス,データ種別,件数,ステータス\n"
      + syncHistory.map(item => 
          `"${item.time}","${item.source}","${item.type}","${item.count}","${item.status}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sync_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ヘッダー */}
        <div className="flex items-center mb-6">
          <Link to="/dashboard" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">連携設定</h1>
            <p className="text-gray-600">外部サービスとの連携を管理します</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-1" />
              設定インポート
            </button>
            <button className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
              <Download className="w-4 h-4 mr-1" />
              設定エクスポート
            </button>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('integrations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'integrations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                サービス連携
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'api'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                API管理
              </button>
              <button
                onClick={() => setActiveTab('sync')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sync'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                同期履歴
              </button>
            </nav>
          </div>
        </div>

        {/* サービス連携タブ */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {/* 検索・フィルター */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="サービスを検索..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">すべての種類</option>
                    <option value="bank">銀行</option>
                    <option value="credit">クレジット</option>
                    <option value="ecommerce">ECサイト</option>
                    <option value="pos">POS</option>
                    <option value="accounting">会計ソフト</option>
                    <option value="payment">決済サービス</option>
                  </select>
                  <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    <Filter className="w-4 h-4 mr-1" />
                    フィルター
                  </button>
                </div>
              </div>
            </div>

            {/* 接続済みサービス */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">接続済みサービス</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations.map((integration) => (
                  <div key={integration.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{integration.logo}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{integration.name}</h3>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integration.status)}`}>
                        {getStatusText(integration.status)}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>最終同期: {integration.lastSync}</span>
                        <span className={`px-2 py-1 rounded ${getTypeColor(integration.type)}`}>
                          {getTypeText(integration.type)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        同期頻度: {integration.syncFrequency} | 次回: {integration.nextSync}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {integration.features.map((feature, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {integration.status === 'connected' ? (
                        <>
                          <button
                            onClick={() => handleSync(integration.id)}
                            className="flex-1 bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700"
                          >
                            <RefreshCw className="w-3 h-3 inline mr-1" />
                            同期
                          </button>
                          <button
                            onClick={() => handleDisconnect(integration.id)}
                            className="flex-1 bg-gray-600 text-white text-xs py-2 px-3 rounded hover:bg-gray-700"
                          >
                            切断
                          </button>
                        </>
                      ) : integration.status === 'error' ? (
                        <>
                          <button
                            onClick={() => handleConnect(integration.id)}
                            className="flex-1 bg-yellow-600 text-white text-xs py-2 px-3 rounded hover:bg-yellow-700"
                          >
                            再接続
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-800">
                            <Settings className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConnect(integration.id)}
                          className="w-full bg-green-600 text-white text-xs py-2 px-3 rounded hover:bg-green-700"
                        >
                          接続
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 利用可能なサービス */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">利用可能なサービス</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableIntegrations.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{service.logo}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{getTypeText(service.type)}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleConnect(`new-${index}`)}
                        className="bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700"
                      >
                        <Plus className="w-3 h-3 inline mr-1" />
                        追加
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* API管理タブ */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">APIキー管理</h2>
                <button 
                  onClick={() => setShowNewApiKeyForm(!showNewApiKeyForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  新しいAPIキー
                </button>
              </div>
              
              {/* 新しいAPIキー作成フォーム */}
              {showNewApiKeyForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-3">新しいAPIキーを作成</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                      <input
                        type="text"
                        value={newApiKey.name}
                        onChange={(e) => setNewApiKey(prev => ({...prev, name: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="APIキーの名前"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">権限</label>
                      <div className="flex flex-wrap gap-2">
                        {['read', 'write', 'admin'].map((permission) => (
                          <button
                            key={permission}
                            type="button"
                            onClick={() => togglePermission(permission)}
                            className={`px-3 py-1 text-sm rounded-full ${
                              newApiKey.permissions.includes(permission)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {permission}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCreateApiKey}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        作成
                      </button>
                      <button
                        onClick={() => setShowNewApiKeyForm(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APIキー</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">権限</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終使用</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {apiKeys.map((apiKey) => (
                      <tr key={apiKey.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {apiKey.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {showApiKey[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                            </code>
                            <button
                              onClick={() => toggleApiKeyVisibility(apiKey.id)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              {showApiKey[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyApiKey(apiKey.key)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex flex-wrap gap-1">
                            {apiKey.permissions.map((permission, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {permission}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {apiKey.lastUsed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {apiKey.status === 'active' ? 'アクティブ' : '無効'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteApiKey(apiKey.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* API使用状況 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">API使用状況</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">今月のリクエスト数</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">12,547</p>
                  <p className="text-sm text-blue-700">上限: 50,000</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">成功率</h3>
                  <p className="text-2xl font-bold text-green-600 mt-2">99.2%</p>
                  <p className="text-sm text-green-700">12,447 / 12,547</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-900">平均レスポンス時間</h3>
                  <p className="text-2xl font-bold text-yellow-600 mt-2">245ms</p>
                  <p className="text-sm text-yellow-700">過去24時間</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 同期履歴タブ */}
        {activeTab === 'sync' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">同期履歴</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={exportSyncHistory}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  CSV出力
                </button>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  全て同期
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時刻</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">サービス</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">データ種別</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">件数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {syncHistory.map((sync, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sync.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sync.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sync.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sync.count}件
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {sync.status === 'success' ? (
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                          )}
                          <span className={`text-sm ${
                            sync.status === 'success' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {sync.status === 'success' ? '成功' : 'エラー'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default memo(IntegrationSettings)
