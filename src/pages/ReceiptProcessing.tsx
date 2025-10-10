import React, { useState, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import {ArrowLeft, Upload, Camera, FileImage, Check, X, Edit3, Save, AlertCircle, Loader} from 'lucide-react'
import Header from '../components/Header'

interface ReceiptData {
  id: string
  date: string
  merchant: string
  amount: number
  category: string
  description: string
  confidence: number
  status: 'pending' | 'approved' | 'rejected'
  tax?: number
  subtotal?: number
  currency?: string
  error?: string
  isProcessing?: boolean
}

const ReceiptProcessing: React.FC = () => {
  const [uploadedReceipts, setUploadedReceipts] = useState<ReceiptData[]>([
    {
      id: '1',
      date: '2024-01-15',
      merchant: 'セブンイレブン',
      amount: 1200,
      category: '消耗品費',
      description: '事務用品購入',
      confidence: 95,
      status: 'pending',
      tax: 120,
      subtotal: 1080,
      currency: 'JPY'
    },
    {
      id: '2',
      date: '2024-01-14',
      merchant: 'スターバックス',
      amount: 580,
      category: '接待交際費',
      description: 'クライアント打ち合わせ',
      confidence: 88,
      status: 'approved',
      tax: 53,
      subtotal: 527,
      currency: 'JPY'
    }
  ])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<ReceiptData>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement> | FileList) => {
    let files: FileList | null = null;
    
    if (event instanceof FileList) {
      files = event;
    } else {
      files = event.target.files;
    }
    
    if (files && files.length > 0) {
      // シミュレーション: 新しいレシートを追加
      const newReceipt: ReceiptData = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        merchant: 'AI解析中...',
        amount: 0,
        category: '未分類',
        description: '解析中...',
        confidence: 0,
        status: 'pending',
        isProcessing: true
      }
      setUploadedReceipts(prev => [newReceipt, ...prev])
      
      // 3秒後にAI解析結果をシミュレート
      setTimeout(() => {
        // 10%の確率で解析エラーをシミュレート
        const isError = Math.random() < 0.1;
        
        if (isError) {
          setUploadedReceipts(prev => prev.map(receipt => 
            receipt.id === newReceipt.id 
              ? {
                  ...receipt,
                  merchant: '解析エラー',
                  description: '画像が不明瞭です。再アップロードしてください。',
                  error: '画像の品質が低く、正確に解析できませんでした。',
                  confidence: 0,
                  isProcessing: false
                }
              : receipt
          ))
        } else {
          // 解析成功のシミュレーション
          const merchants = ['ファミリーマート', 'ローソン', 'サークルK', 'ダイエー', 'イトーヨーカドー'];
          const descriptions = ['文房具購入', 'コピー用紙・文具', '事務用品', '消耗品費', '備品購入'];
          const categories = ['消耗品費', '接待交際費', '旅費交通費', '通信費', '水道光熱費'];
          
          const merchant = merchants[Math.floor(Math.random() * merchants.length)];
          const description = descriptions[Math.floor(Math.random() * descriptions.length)];
          const category = categories[Math.floor(Math.random() * categories.length)];
          const amount = Math.floor(Math.random() * 5000) + 100;
          const tax = Math.floor(amount * 0.1);
          const subtotal = amount - tax;
          const confidence = Math.floor(Math.random() * 30) + 70; // 70-99%
          
          setUploadedReceipts(prev => prev.map(receipt => 
            receipt.id === newReceipt.id 
              ? {
                  ...receipt,
                  merchant,
                  amount,
                  category,
                  description,
                  confidence,
                  tax,
                  subtotal,
                  currency: 'JPY',
                  isProcessing: false
                }
              : receipt
          ))
        }
      }, 3000)
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (err) {
      console.error("カメラアクセスに失敗しました:", err)
      alert("カメラへのアクセスが許可されていません。")
    }
  }

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const imageData = canvas.toDataURL('image/png')
        setCapturedImage(imageData)
        
        // カメラを停止
        const stream = videoRef.current.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach(track => track.stop())
        setIsCameraActive(false)
        
        // シミュレーション: 新しいレシートを追加
        const newReceipt: ReceiptData = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          merchant: 'AI解析中...',
          amount: 0,
          category: '未分類',
          description: '解析中...',
          confidence: 0,
          status: 'pending',
          isProcessing: true
        }
        setUploadedReceipts(prev => [newReceipt, ...prev])
        
        // 3秒後にAI解析結果をシミュレート
        setTimeout(() => {
          // 10%の確率で解析エラーをシミュレート
          const isError = Math.random() < 0.1;
          
          if (isError) {
            setUploadedReceipts(prev => prev.map(receipt => 
              receipt.id === newReceipt.id 
                ? {
                    ...receipt,
                    merchant: '解析エラー',
                    description: '画像が不明瞭です。再撮影してください。',
                    error: '画像の品質が低く、正確に解析できませんでした。',
                    confidence: 0,
                    isProcessing: false
                  }
                : receipt
            ))
          } else {
            // 解析成功のシミュレーション
            const merchants = ['ファミリーマート', 'ローソン', 'サークルK', 'ダイエー', 'イトーヨーカドー'];
            const descriptions = ['文房具購入', 'コピー用紙・文具', '事務用品', '消耗品費', '備品購入'];
            const categories = ['消耗品費', '接待交際費', '旅費交通費', '通信費', '水道光熱費'];
            
            const merchant = merchants[Math.floor(Math.random() * merchants.length)];
            const description = descriptions[Math.floor(Math.random() * descriptions.length)];
            const category = categories[Math.floor(Math.random() * categories.length)];
            const amount = Math.floor(Math.random() * 5000) + 100;
            const tax = Math.floor(amount * 0.1);
            const subtotal = amount - tax;
            const confidence = Math.floor(Math.random() * 30) + 70; // 70-99%
            
            setUploadedReceipts(prev => prev.map(receipt => 
              receipt.id === newReceipt.id 
                ? {
                    ...receipt,
                    merchant,
                    amount,
                    category,
                    description,
                    confidence,
                    tax,
                    subtotal,
                    currency: 'JPY',
                    isProcessing: false
                  }
                : receipt
            ))
          }
        }, 3000)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleEdit = (receipt: ReceiptData) => {
    setEditingId(receipt.id)
    setEditData(receipt)
  }

  const handleSave = () => {
    if (editingId && editData) {
      setUploadedReceipts(prev => prev.map(receipt => 
        receipt.id === editingId ? { ...receipt, ...editData } : receipt
      ))
      setEditingId(null)
      setEditData({})
    }
  }

  const handleApprove = (id: string) => {
    setUploadedReceipts(prev => prev.map(receipt => 
      receipt.id === id ? { ...receipt, status: 'approved' as const } : receipt
    ))
  }

  const handleReject = (id: string) => {
    setUploadedReceipts(prev => prev.map(receipt => 
      receipt.id === id ? { ...receipt, status: 'rejected' as const } : receipt
    ))
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">レシート処理</h1>
            <p className="text-gray-600">画像から自動で仕訳を作成します</p>
          </div>
        </div>

        {/* カメラプレビュー */}
        {isCameraActive && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">カメラ撮影</h2>
              <button 
                onClick={() => {
                  if (videoRef.current && videoRef.current.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream
                    const tracks = stream.getTracks()
                    tracks.forEach(track => track.stop())
                  }
                  setIsCameraActive(false)
                }}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className="w-full h-64 object-cover rounded-lg bg-gray-200"
              />
              <button
                onClick={captureImage}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-red-500 rounded-full"></div>
              </button>
            </div>
          </div>
        )}

        {/* アップロードエリア */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">レシートをアップロード</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ファイルアップロード */}
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">ファイルを選択</p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF対応</p>
            </label>

            {/* カメラ撮影 */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
              onClick={handleCameraCapture}
            >
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">カメラで撮影</p>
              <p className="text-xs text-gray-500">その場で撮影</p>
            </div>

            {/* ドラッグ&ドロップ */}
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragOver 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">ドラッグ&ドロップ</p>
              <p className="text-xs text-gray-500">ここに画像をドロップ</p>
            </div>
          </div>
        </div>

        {/* 処理済みレシート一覧 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">処理済みレシート</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">店舗名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カテゴリ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">説明</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">信頼度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploadedReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === receipt.id ? (
                        <input
                          type="date"
                          value={editData.date || receipt.date}
                          onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        receipt.date
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === receipt.id ? (
                        <input
                          type="text"
                          value={editData.merchant || receipt.merchant}
                          onChange={(e) => setEditData(prev => ({ ...prev, merchant: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        <div>
                          {receipt.isProcessing ? (
                            <div className="flex items-center">
                              <Loader className="w-4 h-4 mr-2 text-blue-500" />
                              <span>解析中...</span>
                            </div>
                          ) : (
                            <>
                              {receipt.merchant}
                              {receipt.error && (
                                <div className="flex items-center mt-1 text-red-600 text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  {receipt.error}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === receipt.id ? (
                        <input
                          type="number"
                          value={editData.amount || receipt.amount}
                          onChange={(e) => setEditData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        <div>
                          {receipt.isProcessing ? (
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          ) : (
                            <>
                              <div>¥{receipt.amount?.toLocaleString()}</div>
                              {receipt.subtotal !== undefined && receipt.tax !== undefined && (
                                <div className="text-xs text-gray-500">
                                  税抜: ¥{receipt.subtotal.toLocaleString()} 税: ¥{receipt.tax.toLocaleString()}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === receipt.id ? (
                        <select
                          value={editData.category || receipt.category}
                          onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="消耗品費">消耗品費</option>
                          <option value="接待交際費">接待交際費</option>
                          <option value="旅費交通費">旅費交通費</option>
                          <option value="通信費">通信費</option>
                          <option value="水道光熱費">水道光熱費</option>
                        </select>
                      ) : (
                        receipt.isProcessing ? (
                          <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        ) : (
                          receipt.category
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {editingId === receipt.id ? (
                        <input
                          type="text"
                          value={editData.description || receipt.description}
                          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        receipt.isProcessing ? (
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        ) : (
                          receipt.description
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {receipt.isProcessing ? (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="h-2 rounded-full bg-blue-500" style={{ width: '50%' }}></div>
                          </div>
                          <span className="text-xs text-gray-600">解析中...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                receipt.confidence >= 90 ? 'bg-green-500' :
                                receipt.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${receipt.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{receipt.confidence}%</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {receipt.isProcessing ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          処理中
                        </span>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          receipt.status === 'approved' ? 'bg-green-100 text-green-800' :
                          receipt.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {receipt.status === 'approved' ? '承認済み' :
                           receipt.status === 'rejected' ? '却下' : '保留中'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {editingId === receipt.id ? (
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        ) : (
                          <>
                            {receipt.isProcessing ? (
                              <div className="w-4 h-4 bg-gray-200 rounded"></div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(receipt)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                {receipt.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(receipt.id)}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleReject(receipt.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default memo(ReceiptProcessing)
