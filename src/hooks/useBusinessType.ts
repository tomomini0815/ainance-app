import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

interface BusinessType {
  _id: string
  user_id: string
  business_type: 'individual' | 'corporation'
  company_name: string
  tax_number: string
  address: string
  phone: string
  email: string
  representative_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ダミーデータ
const dummyBusinessTypes: BusinessType[] = [
  {
    _id: '1',
    user_id: 'user_1234567890',
    business_type: 'individual',
    company_name: '',
    tax_number: '',
    address: '東京都渋谷区1-1-1',
    phone: '03-1234-5678',
    email: 'user@example.com',
    representative_name: '',
    is_active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    _id: '2',
    user_id: 'user_1234567890',
    business_type: 'corporation',
    company_name: '株式会社Ainance',
    tax_number: 'T1234567890123',
    address: '東京都港区2-2-2',
    phone: '03-9876-5432',
    email: 'corp@example.com',
    representative_name: '山田太郎',
    is_active: false,
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z'
  }
]

export const useBusinessType = (userId?: string) => {
  const [currentBusinessType, setCurrentBusinessType] = useState<BusinessType | null>(null)
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([])
  const [loading, setLoading] = useState(true)

  // 現在アクティブな業態形態を取得
  const fetchCurrentBusinessType = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      // ダミーデータからアクティブな業態形態を取得
      const activeBusinessType = dummyBusinessTypes.find(bt => bt.user_id === userId && bt.is_active) || null
      setCurrentBusinessType(activeBusinessType)
    } catch (error) {
      console.error('業態形態の取得に失敗しました:', error)
      toast.error('業態形態の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [userId])

  // ユーザーの全業態形態を取得
  const fetchAllBusinessTypes = useCallback(async () => {
    if (!userId) return

    try {
      // ダミーデータからユーザーの業態形態を取得
      const userBusinessTypes = dummyBusinessTypes.filter(bt => bt.user_id === userId)
      setBusinessTypes(userBusinessTypes)
    } catch (error) {
      console.error('業態形態リストの取得に失敗しました:', error)
    }
  }, [userId])

  // 業態形態を作成
  const createBusinessType = async (data: Omit<BusinessType, '_id' | 'user_id' | 'is_active' | 'created_at' | 'updated_at'>) => {
    if (!userId) {
      toast.error('ユーザーIDが必要です')
      return null
    }

    try {
      // 新しい業態形態を作成（ダミーデータ）
      const newBusinessType: BusinessType = {
        _id: (dummyBusinessTypes.length + 1).toString(),
        user_id: userId,
        ...data,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setCurrentBusinessType(newBusinessType)
      await fetchAllBusinessTypes()
      toast.success('業態形態を作成しました')
      return newBusinessType
    } catch (error) {
      console.error('業態形態の作成に失敗しました:', error)
      toast.error('業態形態の作成に失敗しました')
      return null
    }
  }

  // 業態形態を切り替え
  const switchBusinessType = async (businessTypeId: string) => {
    try {
      // 選択した業態形態をアクティブにする（ダミーデータ）
      const selectedBusinessType = dummyBusinessTypes.find(bt => bt._id === businessTypeId)
      if (selectedBusinessType) {
        setCurrentBusinessType(selectedBusinessType)
        toast.success('業態形態を切り替えました')
        
        // ページをリロードして新しい業態形態を反映
        window.location.reload()
      }
    } catch (error) {
      console.error('業態形態の切り替えに失敗しました:', error)
      toast.error('業態形態の切り替えに失敗しました')
    }
  }

  // 業態形態を更新
  const updateBusinessType = async (businessTypeId: string, updates: Partial<BusinessType>) => {
    try {
      // 業態形態を更新（ダミーデータ）
      const updatedBusinessType = dummyBusinessTypes.find(bt => bt._id === businessTypeId)
      if (updatedBusinessType) {
        Object.assign(updatedBusinessType, updates, { updated_at: new Date().toISOString() })
        
        if (currentBusinessType?._id === businessTypeId) {
          setCurrentBusinessType(updatedBusinessType)
        }
        
        await fetchAllBusinessTypes()
        toast.success('業態形態を更新しました')
        return updatedBusinessType
      }
      return null
    } catch (error) {
      console.error('業態形態の更新に失敗しました:', error)
      toast.error('業態形態の更新に失敗しました')
      return null
    }
  }

  // 業態形態を削除
  const deleteBusinessType = async (businessTypeId: string) => {
    try {
      // 業態形態を削除（ダミーデータ）
      const businessTypeIndex = dummyBusinessTypes.findIndex(bt => bt._id === businessTypeId)
      if (businessTypeIndex !== -1) {
        dummyBusinessTypes.splice(businessTypeIndex, 1)
        
        if (currentBusinessType?._id === businessTypeId) {
          setCurrentBusinessType(null)
        }
        
        await fetchAllBusinessTypes()
        toast.success('業態形態を削除しました')
      }
    } catch (error) {
      console.error('業態形態の削除に失敗しました:', error)
      toast.error('業態形態の削除に失敗しました')
    }
  }

  useEffect(() => {
    if (userId) {
      fetchCurrentBusinessType()
      fetchAllBusinessTypes()
    }
  }, [fetchCurrentBusinessType, fetchAllBusinessTypes])

  return {
    currentBusinessType,
    businessTypes,
    loading,
    createBusinessType,
    switchBusinessType,
    updateBusinessType,
    deleteBusinessType,
    refetch: fetchCurrentBusinessType
  }
}