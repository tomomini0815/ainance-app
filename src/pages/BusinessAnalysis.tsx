import React, { useState, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import {ArrowLeft, TrendingUp, TrendingDown, AlertCircle, CheckCircle, BarChart3, PieChart, Calendar, Download, X, RefreshCw} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Header from '../components/Header'

const BusinessAnalysis: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('3months')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCustomReport, setShowCustomReport] = useState(false)
  const [reportTitle, setReportTitle] = useState('')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isUpdating, setIsUpdating] = useState(false)

  const periods = [
    { value: '1month', label: '1ヶ月' },
    { value: '3months', label: '3ヶ月' },
    { value: '6months', label: '6ヶ月' },
    { value: '1year', label: '1年' }
  ]

  const categories = [
    { value: 'all', label: '全体分析' },
    { value: 'revenue', label: '売上分析' },
    { value: 'expense', label: '支出分析' },
    { value: 'cashflow', label: 'キャッシュフロー' },
    { value: 'profitability', label: '収益性' }
  ]

  // 売上データ
  const revenueData = [
    { month: '1月', revenue: 2400000, target: 2200000 },
    { month: '2月', revenue: 1398000, target: 2000000 },
    { month: '3月', revenue: 1800000, target: 1800000 },
    { month: '4月', revenue: 2780000, target: 2500000 },
    { month: '5月', revenue: 1890000, target: 2000000 },
    { month: '6月', revenue: 2390000, target: 2200000 }
  ]

  // 支出データ
  const expenseData = [
    { category: '人件費', amount: 1200000 },
    { category: '広告費', amount: 300000 },
    { category: '消耗品費', amount: 150000 },
    { category: '水道光熱費', amount: 80000 },
    { category: '通信費', amount: 50000 },
    { category: 'その他', amount: 120000 }
  ]

  // キャッシュフローデータ
  const cashFlowData = [
    { month: '1月', income: 2400000, expense: 1800000 },
    { month: '2月', income: 1398000, expense: 1600000 },
    { month: '3月', income: 1800000, expense: 1500000 },
    { month: '4月', income: 2780000, expense: 1900000 },
    { month: '5月', income: 1890000, expense: 1700000 },
    { month: '6月', income: 2390000, expense: 1850000 }
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  const kpis = [
    {
      title: '売上成長率',
      value: '+12.5%',
      change: '+2.1%',
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: '営業利益率',
      value: '18.2%',
      change: '+0.8%',
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'キャッシュフロー',
      value: '¥2,450,000',
      change: '-5.2%',
      trend: 'down',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: '顧客獲得コスト',
      value: '¥15,200',
      change: '-8.1%',
      trend: 'up',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  const aiInsights = [
    {
      type: 'warning',
      title: '支出増加の警告',
      description: '先月と比較して広告費が35%増加しています。ROIの確認をお勧めします。',
      impact: 'high',
      action: '広告効果を分析する'
    },
    {
      type: 'success',
      title: '売上好調',
      description: '新規顧客からの売上が前年同期比で28%増加しています。',
      impact: 'positive',
      action: 'マーケティング戦略を継続'
    },
    {
      type: 'info',
      title: '季節性の傾向',
      description: '過去3年のデータから、来月は売上が15%程度減少する傾向があります。',
      impact: 'medium',
      action: 'キャッシュフロー計画を調整'
    },
    {
      type: 'opportunity',
      title: '節税機会',
      description: '設備投資による節税効果が期待できます。年内実施で約¥180,000の節税が可能です。',
      impact: 'positive',
      action: '税理士に相談'
    }
  ]

  const forecasts = [
    {
      period: '来月',
      revenue: 2800000,
      expense: 2100000,
      profit: 700000,
      confidence: 92
    },
    {
      period: '3ヶ月後',
      revenue: 8500000,
      expense: 6300000,
      profit: 2200000,
      confidence: 85
    },
    {
      period: '6ヶ月後',
      revenue: 17200000,
      expense: 12800000,
      profit: 4400000,
      confidence: 78
    }
  ]

  const recommendations = [
    {
      category: 'コスト削減',
      items: [
        '通信費の見直しで月額¥8,000削減可能',
        '在庫管理の最適化で¥150,000削減可能',
        'サブスクリプションサービスの整理で月額¥12,000削減可能'
      ]
    },
    {
      category: '売上向上',
      items: [
        '既存顧客のアップセルで月額¥200,000増収可能',
        '新サービスの導入で月額¥350,000増収見込み',
        'マーケティング強化で月額¥180,000増収可能'
      ]
    },
    {
      category: '税務最適化',
      items: [
        '設備投資による節税効果¥180,000',
        '経費計上の見直しで¥45,000節税可能',
        '法人成りによる節税効果¥320,000/年'
      ]
    }
  ]

  // カスタムレポートのメトリクスオプション
  const metricOptions = [
    { id: 'revenue', label: '売上' },
    { id: 'expenses', label: '支出' },
    { id: 'profit', label: '利益' },
    { id: 'cashflow', label: 'キャッシュフロー' },
    { id: 'customers', label: '顧客数' },
    { id: 'roi', label: 'ROI' }
  ]

  // カスタムレポートの生成
  const generateCustomReport = () => {
    if (!reportTitle || selectedMetrics.length === 0) {
      alert('レポートタイトルと少なくとも1つの指標を選択してください')
      return
    }
    
    // 実際のレポート生成処理をここに実装
    console.log('Generating custom report:', { reportTitle, selectedMetrics })
    setShowCustomReport(false)
    setReportTitle('')
    setSelectedMetrics([])
    alert(`${reportTitle} を生成しました`)
  }

  // メトリクスの選択/非選択
  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId))
    } else {
      setSelectedMetrics([...selectedMetrics, metricId])
    }
  }

  // リアルタイムデータ更新
  const updateData = () => {
    setIsUpdating(true)
    
    // シミュレーション: 2秒後にデータを更新
    setTimeout(() => {
      // 実際のデータ更新処理をここに実装
      setLastUpdated(new Date())
      setIsUpdating(false)
      
      // データを再計算
      // ここでは例として、売上データを更新します
      console.log('Data updated')
    }, 2000)
  }

  // 5分ごとに自動更新（シミュレーション）
  useEffect(() => {
    const interval = setInterval(() => {
      updateData()
    }, 300000) // 5分 = 300000ミリ秒
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">経営分析</h1>
              <p className="text-gray-600">AIが事業データを分析してレポートを作成します</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowCustomReport(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              カスタムレポート
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              レポート出力
            </button>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分析期間</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {periods.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分析カテゴリ</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-sm text-gray-600 mr-3">
                最終更新: {lastUpdated.toLocaleTimeString()}
              </div>
              <button
                onClick={updateData}
                disabled={isUpdating}
                className={`flex items-center px-3 py-2 rounded-md ${
                  isUpdating 
                    ? 'bg-gray-300 text-gray-500' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full mr-2"></div>
                    更新中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    更新
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* KPI指標 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                <div className={`w-8 h-8 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className={`w-4 h-4 ${kpi.color}`} />
                  ) : (
                    <TrendingDown className={`w-4 h-4 ${kpi.color}`} />
                  )}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
                <span className={`text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* グラフセクション */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 売上推移グラフ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">売上推移</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`¥${Number(value).toLocaleString()}`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="実績" />
                  <Line type="monotone" dataKey="target" stroke="#82ca9d" name="目標" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 支出内訳円グラフ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">支出内訳</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="category"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`¥${Number(value).toLocaleString()}`, '']} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI分析結果 */}
          <div className="lg:col-span-2 space-y-6">
            {/* AIインサイト */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                AIインサイト
              </h2>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                        {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {insight.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-500" />}
                        {insight.type === 'opportunity' && <TrendingUp className="w-5 h-5 text-purple-500" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{insight.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          {insight.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 予測グラフ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                将来予測
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-700">期間</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">予想売上</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">予想支出</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">予想利益</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">信頼度</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecasts.map((forecast, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium text-gray-900">{forecast.period}</td>
                        <td className="py-3 text-sm text-gray-900">¥{forecast.revenue.toLocaleString()}</td>
                        <td className="py-3 text-sm text-gray-900">¥{forecast.expense.toLocaleString()}</td>
                        <td className="py-3 text-sm font-medium text-green-600">¥{forecast.profit.toLocaleString()}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${forecast.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{forecast.confidence}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 改善提案 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-purple-600" />
              改善提案
            </h2>
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-900 mb-3">{rec.category}</h3>
                  <div className="space-y-2">
                    {rec.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-sm text-gray-600">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* アクションボタン */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                詳細レポートを確認
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* カスタムレポートモーダル */}
      {showCustomReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">カスタムレポート作成</h3>
              <button
                onClick={() => setShowCustomReport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">レポートタイトル</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 2024年上半期業績分析"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">指標選択</label>
              <div className="space-y-2">
                {metricOptions.map((metric) => (
                  <label key={metric.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedMetrics.includes(metric.id)}
                      onChange={() => toggleMetric(metric.id)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{metric.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCustomReport(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={generateCustomReport}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                レポート生成
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default memo(BusinessAnalysis)