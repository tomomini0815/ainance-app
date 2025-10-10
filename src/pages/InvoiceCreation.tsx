import React, { useState, useRef, useCallback, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import {ArrowLeft, Plus, Save, Send, Eye, Download, Search, Calendar, Calculator, User, Building, FileText, Mail, Phone, X, Check, Copy, Trash2} from 'lucide-react'
import Header from '../components/Header'

interface Customer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  taxNumber: string
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  amount: number
}

interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  customer: Customer | null
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  notes: string
}

interface Template {
  id: string
  name: string
  description: string
  items: InvoiceItem[]
  notes: string
}

const InvoiceCreation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'templates' | 'history'>('create')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  
  // 自動保存機能の状態
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // 送信オプションの状態
  const [sendOptions, setSendOptions] = useState({
    sendPdf: true,
    sendMail: false,
    confirmationEmail: true,
    reminderEmail: false
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: 'ウェブサイト制作',
      quantity: 1,
      unitPrice: 300000,
      taxRate: 10,
      amount: 300000
    }
  ])

  // 追加の状態変数
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [language, setLanguage] = useState<'ja' | 'en' | 'zh'>('ja');

  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: '田中太郎',
      company: '株式会社サンプル',
      email: 'tanaka@sample.co.jp',
      phone: '03-1234-5678',
      address: '東京都渋谷区1-1-1',
      taxNumber: 'T1234567890123'
    },
    {
      id: '2',
      name: '佐藤花子',
      company: '合同会社テスト',
      email: 'sato@test.co.jp',
      phone: '03-9876-5432',
      address: '東京都新宿区2-2-2',
      taxNumber: 'T9876543210987'
    },
    {
      id: '3',
      name: '鈴木一郎',
      company: 'フリーランス',
      email: 'suzuki@freelance.jp',
      phone: '090-1234-5678',
      address: '大阪府大阪市北区3-3-3',
      taxNumber: 'T5555666677778'
    }
  ])

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'ウェブ制作標準',
      description: 'ウェブサイト制作の標準的な請求項目',
      items: [
        { id: '1', description: 'ウェブサイト制作', quantity: 1, unitPrice: 300000, taxRate: 10, amount: 300000 },
        { id: '2', description: 'ドメイン設定', quantity: 1, unitPrice: 5000, taxRate: 10, amount: 5000 }
      ],
      notes: '納期: 契約から30日以内'
    },
    {
      id: '2',
      name: 'コンサルティング',
      description: 'コンサルティング業務の標準請求',
      items: [
        { id: '1', description: 'コンサルティング業務', quantity: 10, unitPrice: 15000, taxRate: 10, amount: 150000 }
      ],
      notes: '月次コンサルティング料金'
    }
  ])

  // 署名機能のための参照と状態
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-2024-001',
      date: '2024-01-15',
      dueDate: '2024-02-14',
      customer: customers[0],
      items: [],
      subtotal: 300000,
      taxAmount: 30000,
      total: 330000,
      status: 'sent',
      notes: ''
    },
    {
      id: '2',
      number: 'INV-2024-002',
      date: '2024-01-10',
      dueDate: '2024-02-09',
      customer: customers[1],
      items: [],
      subtotal: 150000,
      taxAmount: 15000,
      total: 165000,
      status: 'paid',
      notes: ''
    },
    {
      id: '3',
      number: 'INV-2024-003',
      date: '2024-01-05',
      dueDate: '2024-02-04',
      customer: customers[2],
      items: [],
      subtotal: 80000,
      taxAmount: 8000,
      total: 88000,
      status: 'overdue',
      notes: ''
    }
  ])

  const [invoiceForm, setInvoiceForm] = useState({
    number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  })

  // 多言語対応
  const translations = {
    ja: {
      invoice: '請求書',
      invoiceNumber: '請求書番号',
      issueDate: '発行日',
      dueDate: '支払期限',
      billTo: '請求先',
      item: '項目',
      quantity: '数量',
      unitPrice: '単価',
      taxRate: '税率',
      amount: '金額',
      subtotal: '小計',
      tax: '消費税',
      total: '合計',
      notes: '備考',
      companyInfo: '会社情報',
      phone: '電話',
      email: 'メール',
      save: '保存',
      send: '送信',
      preview: 'プレビュー'
    },
    en: {
      invoice: 'Invoice',
      invoiceNumber: 'Invoice Number',
      issueDate: 'Issue Date',
      dueDate: 'Due Date',
      billTo: 'Bill To',
      item: 'Item',
      quantity: 'Quantity',
      unitPrice: 'Unit Price',
      taxRate: 'Tax Rate',
      amount: 'Amount',
      subtotal: 'Subtotal',
      tax: 'Tax',
      total: 'Total',
      notes: 'Notes',
      companyInfo: 'Company Info',
      phone: 'Phone',
      email: 'Email',
      save: 'Save',
      send: 'Send',
      preview: 'Preview'
    },
    zh: {
      invoice: '发票',
      invoiceNumber: '发票号码',
      issueDate: '开票日期',
      dueDate: '付款期限',
      billTo: '付款方',
      item: '项目',
      quantity: '数量',
      unitPrice: '单价',
      taxRate: '税率',
      amount: '金额',
      subtotal: '小計',
      tax: '税',
      total: '总计',
      notes: '备注',
      companyInfo: '公司情報',
      phone: '电话',
      email: '邮箱',
      save: '保存',
      send: '发送',
      preview: '预览'
    }
  } as const;

  type Language = keyof typeof translations;
  const t = translations[language];

  // 通知表示
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // 計算関数
  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + item.amount, 0)
  }

  const calculateTax = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.amount * item.taxRate / 100), 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  // 請求項目操作
  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 10,
      amount: 0
    }
    setInvoiceItems([...invoiceItems, newItem])
  }

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(items => items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice
        }
        return updatedItem
      }
      return item
    }))
  }

  const removeInvoiceItem = (id: string) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(items => items.filter(item => item.id !== id))
    } else {
      showNotification('error', '最低1つの項目が必要です')
    }
  }

  // メイン機能ボタン
  const handlePreview = () => {
    if (!selectedCustomer) {
      showNotification('error', '請求先を選択してください')
      return
    }
    if (invoiceItems.some(item => !item.description || item.quantity <= 0 || item.unitPrice < 0)) {
      showNotification('error', '請求項目を正しく入力してください')
      return
    }
    setShowPreviewModal(true)
  }

  const handleSave = () => {
    if (!selectedCustomer) {
      showNotification('error', '請求先を選択してください')
      return
    }
    setShowSaveModal(true)
  }

  const confirmSave = () => {
    // 実際の保存処理をここに実装
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      number: invoiceForm.number,
      date: invoiceForm.date,
      dueDate: invoiceForm.dueDate,
      customer: selectedCustomer,
      items: invoiceItems,
      subtotal: calculateSubtotal(),
      taxAmount: calculateTax(),
      total: calculateTotal(),
      status: 'draft',
      notes: invoiceForm.notes
    }
    
    setRecentInvoices([newInvoice, ...recentInvoices])
    
    // ローカルストレージの下書きをクリア
    localStorage.removeItem('invoiceDraft');
    setLastSaved(null);
    
    setShowSaveModal(false)
    showNotification('success', '請求書を保存しました')
  }

  const handleSend = () => {
    if (!selectedCustomer) {
      showNotification('error', '請求先を選択してください')
      return
    }
    if (!selectedCustomer.email) {
      showNotification('error', '顧客のメールアドレスが設定されていません')
      return
    }
    setShowSendModal(true)
  }

  const confirmSend = () => {
    // 実際の送信処理をここに実装
    setTimeout(() => {
      setShowSendModal(false)
      showNotification('success', `${selectedCustomer?.email} に請求書を送信しました`)
      
      // 送信後は履歴に追加
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        number: invoiceForm.number,
        date: invoiceForm.date,
        dueDate: invoiceForm.dueDate,
        customer: selectedCustomer,
        items: invoiceItems,
        subtotal: calculateSubtotal(),
        taxAmount: calculateTax(),
        total: calculateTotal(),
        status: 'sent',
        notes: invoiceForm.notes
      }
      setRecentInvoices([newInvoice, ...recentInvoices])
    }, 1500)
  }

  // テンプレート機能
  const handleSaveAsTemplate = () => {
    setShowTemplateModal(true)
  }

  const confirmSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      showNotification('error', 'テンプレート名を入力してください')
      return
    }
    
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      description: `カスタムテンプレート - ${new Date().toLocaleDateString()}`,
      items: invoiceItems,
      notes: invoiceForm.notes
    }
    
    setTemplates([...templates, newTemplate])
    setNewTemplateName('')
    setShowTemplateModal(false)
    showNotification('success', 'テンプレートを保存しました')
  }

  const loadTemplate = (template: Template) => {
    setInvoiceItems(template.items.map(item => ({ ...item, id: Date.now().toString() + Math.random() })))
    setInvoiceForm(prev => ({ ...prev, notes: template.notes }))
    showNotification('success', `テンプレート「${template.name}」を読み込みました`)
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId))
    showNotification('success', 'テンプレートを削除しました')
  }

  // クイックアクション
  const copyLastInvoice = () => {
    if (recentInvoices.length > 0) {
      const lastInvoice = recentInvoices[0]
      setSelectedCustomer(lastInvoice.customer)
      setInvoiceItems(lastInvoice.items.map(item => ({ ...item, id: Date.now().toString() + Math.random() })))
      setInvoiceForm(prev => ({ 
        ...prev, 
        notes: lastInvoice.notes,
        number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
      }))
      showNotification('success', '前回の請求書をコピーしました')
    } else {
      showNotification('error', 'コピーする請求書がありません')
    }
  }

  // 履歴操作
  const downloadInvoice = (invoice: Invoice) => {
    // PDF生成・ダウンロード処理
    showNotification('success', `${invoice.number} をダウンロードしました`)
  }

  const resendInvoice = (invoice: Invoice) => {
    if (invoice.customer?.email) {
      showNotification('success', `${invoice.customer.email} に再送信しました`)
    } else {
      showNotification('error', 'メールアドレスが設定されていません')
    }
  }

  const duplicateInvoice = (invoice: Invoice) => {
    setSelectedCustomer(invoice.customer)
    setInvoiceItems(invoice.items.map(item => ({ ...item, id: Date.now().toString() + Math.random() })))
    setInvoiceForm(prev => ({ 
      ...prev, 
      notes: invoice.notes,
      number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
    }))
    setActiveTab('create')
    showNotification('success', '請求書を複製しました')
  }

  // 検索・フィルター
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredInvoices = recentInvoices.filter(invoice =>
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer?.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ''
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '下書き'
      case 'sent': return '送信済み'
      case 'paid': return '支払済み'
      case 'overdue': return '期限超過'
      default: return '不明'
    }
  }

  // 自動保存機能
  const autoSaveInvoice = useCallback(() => {
    if (!selectedCustomer) return;
    
    setIsAutoSaving(true);
    
    // ローカルストレージに下書きを保存
    const draft = {
      invoiceForm,
      selectedCustomer,
      invoiceItems,
      timestamp: new Date()
    };
    
    localStorage.setItem('invoiceDraft', JSON.stringify(draft));
    
    setTimeout(() => {
      setIsAutoSaving(false);
      setLastSaved(new Date());
    }, 500);
  }, [invoiceForm, selectedCustomer, invoiceItems]);

  // 自動保存の副作用
  useEffect(() => {
    // 30秒ごとに自動保存
    const interval = setInterval(() => {
      if (selectedCustomer) {
        autoSaveInvoice();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [selectedCustomer, autoSaveInvoice]);

  // ページ読み込み時に下書きを復元
  useEffect(() => {
    const savedDraft = localStorage.getItem('invoiceDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setInvoiceForm(draft.invoiceForm);
        setSelectedCustomer(draft.selectedCustomer);
        setInvoiceItems(draft.invoiceItems);
        setLastSaved(new Date(draft.timestamp));
      } catch (error) {
        console.error('下書きの復元に失敗しました:', error);
      }
    }
  }, []);

  const t2 = translations[language];

  // プレビュー機能の改善（署名対応）
  const generatePreviewHtml = () => {
    if (!selectedCustomer) return '';
    
    return `
      <!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; }
          .invoice-container { max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
          .company-info { }
          .invoice-title { text-align: right; }
          .invoice-title h1 { font-size: 24px; color: #3b82f6; margin: 0; }
          .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .customer-info { }
          .invoice-details { text-align: right; }
          .invoice-details div { margin-bottom: 5px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th { background-color: #f3f4f6; padding: 10px; text-align: left; border: 1px solid #d1d5db; }
          .items-table td { padding: 10px; border: 1px solid #d1d5db; }
          .totals { width: 300px; margin-left: auto; }
          .totals div { display: flex; justify-content: space-between; padding: 5px 0; }
          .total { font-weight: bold; font-size: 18px; border-top: 2px solid #000; margin-top: 10px; }
          .notes { margin-top: 30px; padding-top: 15px; border-top: 1px solid #d1d5db; }
          .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature-box { width: 45%; }
          .signature-line { border-top: 1px solid #000; margin-top: 80px; padding-top: 10px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-info">
              <h2>Ainance株式会社</h2>
              <p>東京都渋谷区1-1-1</p>
              <p>${t.phone}: 03-1234-5678</p>
              <p>${t.email}: info@ainance.co.jp</p>
            </div>
            <div class="invoice-title">
              <h1>${t.invoice}</h1>
            </div>
          </div>
          
          <div class="invoice-meta">
            <div class="customer-info">
              <h3>${t.billTo}</h3>
              <p>${selectedCustomer.company}</p>
              <p>${selectedCustomer.name}</p>
              <p>${selectedCustomer.address}</p>
              <p>${t.phone}: ${selectedCustomer.phone}</p>
              <p>${t.email}: ${selectedCustomer.email}</p>
            </div>
            <div class="invoice-details">
              <div><strong>${t.invoiceNumber}:</strong> ${invoiceForm.number}</div>
              <div><strong>${t.issueDate}:</strong> ${invoiceForm.date}</div>
              <div><strong>${t.dueDate}:</strong> ${invoiceForm.dueDate}</div>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>${t.item}</th>
                <th>${t.quantity}</th>
                <th>${t.unitPrice}</th>
                <th>${t.taxRate}</th>
                <th>${t.amount}</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceItems.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>¥${item.unitPrice.toLocaleString()}</td>
                  <td>${item.taxRate}%</td>
                  <td>¥${item.amount.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div><span>${t.subtotal}:</span> <span>¥${calculateSubtotal().toLocaleString()}</span></div>
            <div><span>${t.tax}:</span> <span>¥${calculateTax().toLocaleString()}</span></div>
            <div class="total"><span>${t.total}:</span> <span>¥${calculateTotal().toLocaleString()}</span></div>
          </div>
          
          ${invoiceForm.notes ? `<div class="notes"><h3>${t.notes}</h3><p>${invoiceForm.notes}</p></div>` : ''}
          
          <div class="signature-section">
            <div class="signature-box">
              <p>請求者署名:</p>
              ${signature ? `<img src="${signature}" style="max-width: 200px; max-height: 100px;" />` : '<div class="signature-line">署名欄</div>'}
            </div>
            <div class="signature-box">
              <p>承認者署名:</p>
              <div class="signature-line">署名欄</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // 署名機能の関数
  // 署名キャンバスの初期化
  useEffect(() => {
    if (showSignatureModal && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
      }
    }
  }, [showSignatureModal]);

  // 署名の描画処理
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    isDrawing.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  // 署名の保存
  const saveSignature = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setSignature(dataUrl);
      setShowSignatureModal(false);
      showNotification('success', '署名を保存しました');
    }
  };

  // 署名のクリア
  const clearSignature = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* 通知 */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? 
              <Check className="w-5 h-5 mr-2" /> : 
              <X className="w-5 h-5 mr-2" />
            }
            {notification.message}
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.invoice}</h1>
              <p className="text-gray-600">プロフェッショナルな請求書を簡単に作成・送信</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* 言語選択 */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'ja' | 'en' | 'zh')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
            <button 
              onClick={handlePreview}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t.preview}
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {t.save}
            </button>
            <button 
              onClick={handleSend}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              {t.send}
            </button>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                請求書作成
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                テンプレート
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                請求書履歴
              </button>
            </nav>
          </div>
        </div>

        {/* 請求書作成タブ */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* 自動保存ステータス */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isAutoSaving ? (
                      <>
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-blue-700">自動保存中...</span>
                      </>
                    ) : lastSaved ? (
                      <>
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-700">
                          最終保存: {lastSaved.toLocaleTimeString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-blue-700">自動保存が有効です</span>
                    )}
                  </div>
                  <button
                    onClick={autoSaveInvoice}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    今すぐ保存
                  </button>
                </div>
              </div>

              {/* 基本情報 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">基本情報</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">請求書番号</label>
                    <input
                      type="text"
                      value={invoiceForm.number}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, number: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">発行日</label>
                    <input
                      type="date"
                      value={invoiceForm.date}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">支払期限</label>
                    <input
                      type="date"
                      value={invoiceForm.dueDate}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 顧客情報 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">請求先</h2>
                  <button
                    onClick={() => setShowCustomerModal(true)}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    顧客選択
                  </button>
                </div>
                {selectedCustomer ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedCustomer.company}</h3>
                        <p className="text-sm text-gray-600">{selectedCustomer.name}</p>
                        <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
                        <p className="text-sm text-gray-600">法人番号: {selectedCustomer.taxNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {selectedCustomer.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">請求先を選択してください</p>
                  </div>
                )}
              </div>

              {/* 請求項目 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">請求項目</h2>
                  <button
                    onClick={addInvoiceItem}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    項目追加
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">項目</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">単価</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">税率</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invoiceItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="項目名"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateInvoiceItem(item.id, 'unitPrice', Number(e.target.value))}
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              min="0"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={item.taxRate}
                              onChange={(e) => updateInvoiceItem(item.id, 'taxRate', Number(e.target.value))}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value={0}>0%</option>
                              <option value={8}>8%</option>
                              <option value={10}>10%</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium">¥{item.amount.toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => removeInvoiceItem(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              disabled={invoiceItems.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 備考 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">備考・特記事項</h2>
                <textarea
                  value={invoiceForm.notes}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="支払い条件、納期、その他の特記事項を記載してください"
                />
              </div>
            </div>

            {/* 右側サマリー */}
            <div className="space-y-6">
              {/* 金額サマリー */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                  金額計算
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">小計</span>
                    <span className="font-medium">¥{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">消費税</span>
                    <span className="font-medium">¥{calculateTax().toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">合計</span>
                      <span className="text-xl font-bold text-blue-600">¥{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 送信オプション */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">送信オプション</h2>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={sendOptions.sendPdf}
                      onChange={(e) => setSendOptions(prev => ({ ...prev, sendPdf: e.target.checked }))}
                    />
                    <span className="text-sm">PDFで送信</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={sendOptions.sendMail}
                      onChange={(e) => setSendOptions(prev => ({ ...prev, sendMail: e.target.checked }))}
                    />
                    <span className="text-sm">郵送も併用</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={sendOptions.confirmationEmail}
                      onChange={(e) => setSendOptions(prev => ({ ...prev, confirmationEmail: e.target.checked }))}
                    />
                    <span className="text-sm">送信確認メール</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={sendOptions.reminderEmail}
                      onChange={(e) => setSendOptions(prev => ({ ...prev, reminderEmail: e.target.checked }))}
                    />
                    <span className="text-sm">支払期限リマインダー</span>
                  </label>
                </div>
              </div>

              {/* 署名 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">署名</h2>
                {signature ? (
                  <div className="text-center">
                    <img src={signature} alt="署名" className="max-w-full h-24 mx-auto mb-3" />
                    <button
                      onClick={() => {
                        setSignature(null);
                        showNotification('success', '署名をクリアしました');
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      署名をクリア
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-3">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">署名がありません</p>
                    </div>
                    <button
                      onClick={() => setShowSignatureModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      署名を追加
                    </button>
                  </div>
                )}
              </div>

              {/* クイックアクション */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">クイックアクション</h2>
                <div className="space-y-2">
                  <button 
                    onClick={copyLastInvoice}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    前回の請求書をコピー
                  </button>
                  <button 
                    onClick={handleSaveAsTemplate}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    テンプレートとして保存
                  </button>
                  <button 
                    onClick={() => {
                      setInvoiceForm(prev => ({ 
                        ...prev, 
                        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                      }))
                      showNotification('success', '支払期限を2週間後に設定しました')
                    }}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors flex items-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    支払期限を2週間後に設定
                  </button>
                  <button 
                    onClick={() => {
                      setInvoiceItems([])
                      setSelectedCustomer(null)
                      setInvoiceForm({
                        number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
                        date: new Date().toISOString().split('T')[0],
                        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        notes: ''
                      })
                      showNotification('success', 'フォームをリセットしました')
                    }}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    フォームをリセット
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* テンプレートタブ */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">請求書テンプレート</h2>
              <button
                onClick={handleSaveAsTemplate}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                新規テンプレート
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="bg-gray-100 h-32 rounded mb-3 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <p className="text-xs text-gray-500 mb-3">{template.items.length}項目</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => loadTemplate(template)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      使用
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 履歴タブ */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">請求書履歴</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="請求書番号または顧客名で検索"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  クリア
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">請求書番号</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">顧客</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">発行日</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支払期限</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {invoice.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.customer?.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ¥{invoice.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedCustomer(invoice.customer)
                              setInvoiceItems(invoice.items)
                              setInvoiceForm(prev => ({ 
                                ...prev, 
                                number: invoice.number,
                                date: invoice.date,
                                dueDate: invoice.dueDate,
                                notes: invoice.notes
                              }))
                              setActiveTab('create')
                              showNotification('success', '請求書を編集モードで開きました')
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="編集"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => downloadInvoice(invoice)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="ダウンロード"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => resendInvoice(invoice)}
                            className="text-purple-600 hover:text-purple-900 transition-colors"
                            title="再送信"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => duplicateInvoice(invoice)}
                            className="text-orange-600 hover:text-orange-900 transition-colors"
                            title="複製"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInvoices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? '検索結果が見つかりません' : '請求書履歴がありません'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 顧客選択モーダル */}
        {showCustomerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">顧客選択</h3>
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="顧客名、会社名、メールアドレスで検索"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomer(customer)
                      setShowCustomerModal(false)
                      setSearchTerm('')
                      showNotification('success', `${customer.company} を選択しました`)
                    }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{customer.company}</h4>
                        <p className="text-sm text-gray-600">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <p className="text-sm text-gray-600">{customer.phone}</p>
                      </div>
                      <div className="text-right">
                        <Building className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    検索結果が見つかりません
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setShowCustomerModal(false)
                    setSearchTerm('')
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* プレビューモーダル */}
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">請求書プレビュー</h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* 請求書プレビュー内容 */}
              <div className="border border-gray-300 p-8 bg-white">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold">請求書</h1>
                  <p className="text-sm text-gray-600 mt-2">Invoice</p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold mb-2">請求元</h3>
                    <p className="text-sm">あなたの会社名</p>
                    <p className="text-sm">〒000-0000</p>
                    <p className="text-sm">東京都渋谷区1-1-1</p>
                    <p className="text-sm">TEL: 03-0000-0000</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">請求先</h3>
                    <p className="text-sm">{selectedCustomer?.company}</p>
                    <p className="text-sm">{selectedCustomer?.name} 様</p>
                    <p className="text-sm">{selectedCustomer?.address}</p>
                    <p className="text-sm">TEL: {selectedCustomer?.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm"><span className="font-medium">請求書番号:</span> {invoiceForm.number}</p>
                    <p className="text-sm"><span className="font-medium">発行日:</span> {invoiceForm.date}</p>
                    <p className="text-sm"><span className="font-medium">支払期限:</span> {invoiceForm.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">¥{calculateTotal().toLocaleString()}</p>
                    <p className="text-sm text-gray-600">請求金額（税込）</p>
                  </div>
                </div>
                
                <table className="w-full mb-8 border-collapse border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">項目</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">数量</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">単価</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">税率</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">¥{item.unitPrice.toLocaleString()}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{item.taxRate}%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">¥{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-1">
                      <span>小計:</span>
                      <span>¥{calculateSubtotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>消費税:</span>
                      <span>¥{calculateTax().toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>合計:</span>
                        <span>¥{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {invoiceForm.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">備考</h3>
                    <p className="text-sm whitespace-pre-wrap">{invoiceForm.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  閉じる
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false)
                    handleSend()
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  送信
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 送信確認モーダル */}
        {showSendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">請求書送信</h3>
                <button
                  onClick={() => setShowSendModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">以下の宛先に請求書を送信します：</p>
                <p className="font-medium mt-2">{selectedCustomer?.company}</p>
                <p className="text-sm text-gray-600">{selectedCustomer?.email}</p>
                <p className="font-medium">金額: ¥{calculateTotal().toLocaleString()}</p>
              </div>
              <div className="mb-4">
                <h4 className="font-medium mb-2">送信オプション</h4>
                <div className="space-y-2 text-sm">
                  {sendOptions.sendPdf && <p>• PDFファイルで送信</p>}
                  {sendOptions.sendMail && <p>• 郵送も併用</p>}
                  {sendOptions.confirmationEmail && <p>• 送信確認メールを受信</p>}
                  {sendOptions.reminderEmail && <p>• 支払期限リマインダーを設定</p>}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={confirmSend}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  送信実行
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 保存確認モーダル */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">請求書保存</h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">請求書を下書きとして保存します。</p>
                <p className="font-medium mt-2">請求書番号: {invoiceForm.number}</p>
                <p className="text-sm text-gray-600">顧客: {selectedCustomer?.company}</p>
                <p className="font-medium">金額: ¥{calculateTotal().toLocaleString()}</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={confirmSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {/* テンプレート保存モーダル */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">テンプレート保存</h3>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">テンプレート名</label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: ウェブ制作標準テンプレート"
                />
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">現在の請求項目（{invoiceItems.length}件）をテンプレートとして保存します。</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowTemplateModal(false)
                    setNewTemplateName('')
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={confirmSaveTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 署名モーダル */}
        {showSignatureModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">署名</h3>
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  className="border border-gray-300 rounded-lg w-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={clearSignature}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  クリア
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => setShowSignatureModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={saveSignature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default memo(InvoiceCreation)
