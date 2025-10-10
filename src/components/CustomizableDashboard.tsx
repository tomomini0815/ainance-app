import React, { useState, useEffect, memo } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { X, Settings, Plus, Move } from 'lucide-react'
import RevenueChart from './RevenueChart'
import ExpenseChart from './ExpenseChart'
import TransactionTable from './TransactionTable'
import AITransactionTable from './AITransactionTable'

// ダッシュボードウィジェットの型定義
interface Widget {
  id: string
  type: 'revenueChart' | 'expenseChart' | 'transactionTable' | 'aiTransactionTable' | 'custom'
  title: string
  content?: React.ReactNode
}

// プロップスの型定義
interface CustomizableDashboardProps {
  onWidgetAdd?: () => void
  onWidgetRemove?: (id: string) => void
}

const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({ 
  onWidgetAdd, 
  onWidgetRemove 
}) => {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets')
    return savedWidgets ? JSON.parse(savedWidgets) : [
      { id: '1', type: 'revenueChart', title: '売上推移' },
      { id: '2', type: 'expenseChart', title: '支出内訳' },
      { id: '3', type: 'transactionTable', title: '最近の取引' },
      { id: '4', type: 'aiTransactionTable', title: 'AI処理された取引' }
    ]
  })

  const [isEditing, setIsEditing] = useState(false)

  // ウィジェットの変更をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets))
  }, [widgets])

  // ウィジェットをレンダリング
  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'revenueChart':
        return <RevenueChart />
      case 'expenseChart':
        return <ExpenseChart />
      case 'transactionTable':
        return <TransactionTable />
      case 'aiTransactionTable':
        return <AITransactionTable />
      default:
        return widget.content || <div>カスタムコンテンツ</div>
    }
  }

  // ウィジェットのドラッグ＆ドロップ処理
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newWidgets = Array.from(widgets)
    const [removed] = newWidgets.splice(result.source.index, 1)
    newWidgets.splice(result.destination.index, 0, removed)

    setWidgets(newWidgets)
  }

  // ウィジェットを追加
  const addWidget = () => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: 'custom',
      title: '新しいウィジェット'
    }
    setWidgets([...widgets, newWidget])
    onWidgetAdd?.()
  }

  // ウィジェットを削除
  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id))
    onWidgetRemove?.(id)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* ダッシュボードヘッダー */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">カスタマイズ可能なダッシュボード</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <Settings className="w-4 h-4 mr-1" />
            {isEditing ? '完了' : '編集'}
          </button>
          <button
            onClick={addWidget}
            className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            ウィジェット追加
          </button>
        </div>
      </div>

      {/* ダッシュボードコンテンツ */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets" direction="horizontal">
          {(provided: any) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {widgets.map((widget, index) => (
                  <Draggable 
                    key={widget.id} 
                    draggableId={widget.id} 
                    index={index}
                    isDragDisabled={!isEditing}
                  >
                    {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white rounded-lg border border-gray-200 shadow-sm ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        {/* ウィジェットヘッダー */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                          <div className="flex items-center">
                            {isEditing && (
                              <div 
                                {...provided.dragHandleProps}
                                className="mr-2 cursor-move text-gray-400 hover:text-gray-600"
                              >
                                <Move className="w-4 h-4" />
                              </div>
                            )}
                            <h3 className="font-medium text-gray-900">{widget.title}</h3>
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => removeWidget(widget.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        {/* ウィジェットコンテンツ */}
                        <div className="p-4">
                          {renderWidget(widget)}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default memo(CustomizableDashboard)