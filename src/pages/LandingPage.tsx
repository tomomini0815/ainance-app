import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {Calculator, FileText, BarChart3, MessageSquare, Zap, Shield, Clock, Users, CheckCircle, ArrowRight, Star, TrendingUp, Smartphone, Globe, ChevronRight, Play, Mail, Phone, MapPin, Menu, X} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const LandingPage: React.FC = () => {
  const { isAuthenticated, signIn } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  // ログイン状態が変化したときにダッシュボードにリダイレクト
  useEffect(() => {
    if (isAuthenticated && location.pathname !== '/dashboard') {
      // ユーザーが認証されていて、現在のパスがダッシュボードでない場合のみリダイレクト
      window.location.href = '/dashboard'
    }
  }, [isAuthenticated, location.pathname])

  const features = [
    {
      icon: <Calculator className="w-8 h-8 text-blue-600" />,
      title: 'スマートレシート処理',
      description: 'AIが自動でレシートを読み取り、経費を分類。手作業の時間を90%削減。',
      benefit: '時間削減',
      details: [
        '画像認識技術で自動読み取り',
        'クラウド保存でいつでもアクセス',
        '複数通貨対応'
      ]
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      title: 'プロ級請求書作成',
      description: '美しいテンプレートで請求書を瞬時に作成。自動送信・リマインダー機能付き。',
      benefit: '効率化',
      details: [
        '50種類以上のテンプレート',
        '自動送信・リマインダー',
        '電子署名対応'
      ]
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: 'リアルタイム経営分析',
      description: 'キャッシュフローや収益性を視覚的に分析。データドリブンな意思決定をサポート。',
      benefit: '洞察力',
      details: [
        'リアルタイムダッシュボード',
        'カスタムレポート作成',
        '予測分析機能'
      ]
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-orange-600" />,
      title: 'CHAT-TO-BOOK',
      description: 'チャットで帳簿作成。複雑な仕訳も自然言語で簡単入力。',
      benefit: '簡単操作',
      details: [
        '自然言語処理AI',
        '音声入力対応',
        'マルチデバイス対応'
      ]
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: '事業変換支援',
      description: '個人事業主から法人化まで、事業形態の変更をスムーズにサポート。',
      benefit: '成長支援',
      details: [
        '法人化シミュレーション',
        '税務署届出支援',
        '専門家マッチング'
      ]
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: 'セキュア統合',
      description: '銀行・会計ソフトとの安全な連携。エンタープライズ級のセキュリティ。',
      benefit: '安全性',
      details: [
        '256bit暗号化',
        '二段階認証対応',
        'GDPR準拠'
      ]
    }
  ]

  const testimonials = [
    {
      name: '田中太郎',
      company: 'デザイン事務所経営',
      content: 'レシート処理が劇的に楽になりました。月末の経理作業が1日から2時間に短縮！',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: '佐藤花子',
      company: 'フリーランス講師',
      content: 'CHAT-TO-BOOKが革命的。複雑な仕訳も「今日の交通費3000円」って入力するだけ。',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: '鈴木一郎',
      company: 'IT系スタートアップCEO',
      content: '法人化の手続きが想像以上にスムーズでした。Ainanceのサポートは本当に頼りになります。',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ]

  const pricingPlans = [
    {
      name: 'スターター',
      price: '¥980',
      period: '/月',
      description: '個人事業主・フリーランス向け',
      features: [
        'レシート処理 月50件',
        '請求書作成 月10件',
        '基本的な経営分析',
        'CHAT-TO-BOOK',
        'メールサポート'
      ],
      popular: false,
      cta: '14日間無料トライアル'
    },
    {
      name: 'プロフェッショナル',
      price: '¥2,980',
      period: '/月',
      description: '中小企業・成長中の事業者向け',
      features: [
        'レシート処理 無制限',
        '請求書作成 無制限',
        '高度な経営分析',
        'CHAT-TO-BOOK',
        '事業変換支援',
        '銀行連携',
        '優先サポート'
      ],
      popular: true,
      cta: '14日間無料トライアル'
    },
    {
      name: 'エンタープライズ',
      price: 'お見積り',
      period: '',
      description: '大企業・複数拠点向け',
      features: [
        'すべての機能',
        '専用サポート',
        'カスタム統合',
        'オンサイト導入支援',
        'SLA保証',
        '専任コンサルタント'
      ],
      popular: false,
      cta: 'お問い合わせ'
    }
  ]

  const faqs = [
    {
      question: 'データは安全ですか？',
      answer: 'はい、すべてのデータは256bit SSL暗号化で保護されており、定期的なセキュリティ監査を実施しています。'
    },
    {
      question: '会計ソフトと連携できますか？',
      answer: 'はい、freee、マネーフォワード、弥生会計など主要な会計ソフトとの連携に対応しています。'
    },
    {
      question: '無料トライアルはどのように利用できますか？',
      answer: 'プラン選択後、クレジットカード情報なしで14日間無料でお試しいただけます。'
    },
    {
      question: 'サポートはありますか？',
      answer: 'すべてのプランでメールサポートを提供。プロフェッショナル以上では電話サポートも可能です。'
    }
  ]

  const stats = [
    { number: '10,000+', label: '利用者数' },
    { number: '500万+', label: '処理レシート数' },
    { number: '95%', label: '時間削減率' },
    { number: '99.9%', label: 'アップタイム' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // メール登録処理
    console.log('メール登録:', email)
    alert('ありがとうございます！登録が完了しました。')
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Ainance</h1>
              <span className="ml-2 text-sm text-gray-500 hidden sm:block">AI経理プラットフォーム</span>
            </div>
            
            {/* デスクトップナビゲーション */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">機能</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">料金</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">お客様の声</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">お問い合わせ</a>
            </nav>
            
            {/* モバイルメニューボタン */}
            <button 
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* モバイルナビゲーション */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setIsMenuOpen(false)}>機能</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setIsMenuOpen(false)}>料金</a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setIsMenuOpen(false)}>お客様の声</a>
                <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setIsMenuOpen(false)}>FAQ</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setIsMenuOpen(false)}>お問い合わせ</a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                AIで経理を<br />
                <span className="text-blue-600">スマートに</span> 自動化
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                レシート読み取り、請求書作成、経営分析までをAIが自動処理。<br />
                経理業務の90%を削減し、経営に集中できます。
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={signIn}
                  className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  今すぐ始める
                </button>
                <button className="flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300">
                  <Play className="w-5 h-5 mr-2 text-blue-600" />
                  デモを見る
                </button>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" alt="ユーザー" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" alt="ユーザー" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" alt="ユーザー" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">10,000+</span> の経営者が利用中
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-3">
                <img 
                  src="https://images.pexels.com/photos/1597515/pexels-photo-1597515.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Ainance ダッシュボード" 
                  className="rounded-lg w-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 transform -rotate-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">AI処理完了</p>
                    <p className="text-xs text-gray-500">レシート自動分類</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 機能セクション */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              経理業務を<br />
              <span className="text-blue-600">すべて自動化</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AinanceはAI技術を活用して、面倒な経理作業をすべて自動化します。<br />
              これからの経営を、スマートに。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-sm text-blue-600 font-medium">
                  <span>{feature.benefit}</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 統計セクション */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <p className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</p>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* お客様の声セクション */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ご利用者の<br />
              <span className="text-blue-600">声</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              実際にAinanceをご利用いただいている経営者の声をご紹介します。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金セクション */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ご利用料金
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              すべてのプランで14日間の無料トライアルをご利用いただけます。<br />
              ご購入前にすべての機能をお試しください。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-gray-50 rounded-xl p-8 relative ${
                  plan.popular ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    おすすめ
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQセクション */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              よくある<br />
              <span className="text-blue-600">質問</span>
            </h2>
            <p className="text-xl text-gray-600">
              Ainanceについてのよくある質問をご紹介します。
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* お問い合わせセクション */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  今すぐ<br />
                  <span className="text-blue-600">お問い合わせ</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  導入に関するご質問やデモのご希望など、<br />
                  お気軽にお問い合わせください。
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-6 h-6 text-blue-600 mr-3" />
                    <span className="text-gray-600">info@ainance.co.jp</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 text-blue-600 mr-3" />
                    <span className="text-gray-600">03-1234-5678</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                    <span className="text-gray-600">東京都渋谷区1-1-1</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      メールアドレス
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    送信
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Ainance</h3>
              <p className="text-gray-400">
                AIで経理をスマートに自動化する<br />
                次世代経理プラットフォーム
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">製品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">機能</a></li>
                <li><a href="#" className="hover:text-white transition-colors">料金</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ダウンロード</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">会社情報</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">会社概要</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ニュース</a></li>
                <li><a href="#" className="hover:text-white transition-colors">採用情報</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">ヘルプセンター</a></li>
                <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">利用規約</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ainance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage