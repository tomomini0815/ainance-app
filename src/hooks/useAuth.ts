import { useState, useEffect, useCallback, useRef } from 'react'

interface User {
  projectId: string
  userId: string
  email: string
  userName: string
  userRole: 'ADMIN' | 'USER'
  createdTime: string
  accessToken: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    // ローカルストレージからユーザー情報を取得
    const savedUser = localStorage.getItem('ainanceUser')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [loading, setLoading] = useState(true)
  const userRef = useRef<User | null>(user)
  const initialized = useRef(false)
  const initTimeout = useRef<any>(null)

  // userの変更をuserRefに反映
  useEffect(() => {
    userRef.current = user
  }, [user])

  // 認証状態を安定化させるためのコールバック
  const checkSession = useCallback(() => {
    // 既に初期化済みの場合は処理をスキップ
    if (initialized.current) return
    
    // ローカルストレージに保存されたユーザー情報があればそれを使用
    const savedUser = localStorage.getItem('ainanceUser')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        // 既に同じユーザーが設定されている場合は更新しない
        if (!userRef.current || userRef.current.userId !== parsedUser.userId) {
          setUser(parsedUser)
        }
        initialized.current = true
        setLoading(false)
        // タイムアウトをクリア
        if (initTimeout.current) {
          clearTimeout(initTimeout.current)
        }
        return
      } catch (e) {
        // パースエラーの場合は無視
        localStorage.removeItem('ainanceUser')
      }
    }
    
    // ユーザーがいない場合はnullを設定
    if (userRef.current !== null) {
      localStorage.removeItem('ainanceUser')
      setUser(null)
    }
    initialized.current = true
    setLoading(false)
    // タイムアウトをクリア
    if (initTimeout.current) {
      clearTimeout(initTimeout.current)
    }
  }, [])

  useEffect(() => {
    checkSession()
    
    // 5秒後に強制的にローディングを終了するタイムアウトを設定
    initTimeout.current = setTimeout(() => {
      if (!initialized.current) {
        initialized.current = true
        setLoading(false)
        console.warn('認証状態の初期化がタイムアウトしました')
      }
    }, 5000)
    
    // クリーンアップ関数
    return () => {
      if (initTimeout.current) {
        clearTimeout(initTimeout.current)
      }
    }
  }, [checkSession])

  const signIn = async () => {
    try {
      setLoading(true)
      // ダミーユーザーでログイン
      const dummyUser: User = {
        projectId: 'p364423076073435136',
        userId: 'user_' + Date.now(),
        email: 'demo@example.com',
        userName: 'デモユーザー',
        userRole: 'USER',
        createdTime: new Date().toISOString(),
        accessToken: 'dummy_token_' + Date.now()
      }
      
      setUser(dummyUser)
      localStorage.setItem('ainanceUser', JSON.stringify(dummyUser))
      setLoading(false)
    } catch (error) {
      console.error('ログインに失敗しました:', error)
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setUser(null)
      localStorage.removeItem('ainanceUser')
    } catch (error) {
      console.error('ログアウトに失敗しました:', error)
      // ログアウトが失敗しても、ローカルの状態はクリアする
      setUser(null)
      localStorage.removeItem('ainanceUser')
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    userRole: user?.userRole,
    loading,
    signIn,
    signOut
  }
}