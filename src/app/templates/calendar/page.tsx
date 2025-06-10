'use client'

import { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

interface SiteInfo {
  id: string
  name: string
  description: string
  profileImage: string
}

interface Event {
  id: string
  siteId: string
  date: string
  title: string
  description: string
  isNotice?: boolean
  createdAt: string
}

export default function CalendarTemplate() {
  const searchParams = useSearchParams()
  const siteId = searchParams.get('site')
  
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    id: '',
    name: '',
    description: '',
    profileImage: ''
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    description: '',
    isNotice: false 
  })
  const [isLoading, setIsLoading] = useState(true)

  // 사이트 정보를 가져옵니다
  useEffect(() => {
    const fetchSiteInfo = async () => {
      if (!siteId) return
      
      try {
        const response = await fetch(`/api/site?id=${siteId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '사이트 정보를 불러오는데 실패했습니다.')
        }

        setSiteInfo(data)
      } catch (error) {
        console.error('사이트 정보를 불러오는데 실패했습니다:', error)
      }
    }
    fetchSiteInfo()
  }, [siteId])

  // 서버에서 이벤트 데이터를 가져옵니다
  useEffect(() => {
    const fetchEvents = async () => {
      if (!siteId) return
      
      try {
        const response = await fetch(`/api/events?siteId=${siteId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '이벤트를 불러오는데 실패했습니다.')
        }

        setEvents(data)
      } catch (error) {
        console.error('이벤트를 불러오는데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [siteId])

  const startDate = startOfMonth(currentDate)
  const endDate = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const dateEvents = getEventsForDate(date)
    if (dateEvents.length > 0) {
      setShowEventDetail(true)
    } else {
      setShowEventForm(true)
    }
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!siteId || !selectedDate || !newEvent.title) return

    try {
      const response = await fetch(`/api/events?siteId=${siteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          title: newEvent.title,
          description: newEvent.description,
          isNotice: newEvent.isNotice
        }),
      })
      
      if (!response.ok) {
        throw new Error('일정 추가에 실패했습니다.')
      }

      const addedEvent = await response.json()
      setEvents([...events, addedEvent])
      setNewEvent({ title: '', description: '', isNotice: false })
      setShowEventForm(false)
    } catch (error) {
      console.error('일정 추가에 실패했습니다:', error)
      alert('일정 추가에 실패했습니다.')
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!siteId) return

    try {
      const response = await fetch(`/api/events?siteId=${siteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('일정 삭제에 실패했습니다.')
      }

      setEvents(events.filter(event => event.id !== id))
      setShowEventDetail(false)
    } catch (error) {
      console.error('일정 삭제에 실패했습니다:', error)
      alert('일정 삭제에 실패했습니다.')
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
  }

  const getNotices = () => {
    return events.filter(event => event.isNotice)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* 프로필 섹션 */}
      <div className="bg-gradient-to-b from-blue-600/20 to-transparent pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 mb-4">
              <div className="w-full h-full rounded-full bg-zinc-700 overflow-hidden border-4 border-white/10">
                {siteInfo.profileImage ? (
                  <Image
                    src={siteInfo.profileImage}
                    alt="프로필 이미지"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-zinc-400 text-sm">이미지 없음</span>
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{siteInfo.name || '월 일정표'}</h1>
            <p className="text-zinc-300 text-center max-w-md">
              {siteInfo.description || '일정과 공지사항을 관리하세요.'}
            </p>
          </div>
        </div>
      </div>

      {/* 달력 섹션 */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-zinc-800 rounded-2xl p-6 shadow-xl border border-zinc-700">
          {/* 달력 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">
              {format(currentDate, 'yyyy년 M월', { locale: ko })}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                ← 이전 달
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                오늘
              </button>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                다음 달 →
              </button>
            </div>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div
                key={day}
                className="text-center text-zinc-400 font-medium py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 달력 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day: Date, idx: number) => {
              const dayEvents = getEventsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              
              return (
                <button
                  key={idx}
                  onClick={() => handleDateClick(day)}
                  className={`
                    min-h-[100px] p-2 rounded-lg border border-zinc-700
                    ${isCurrentMonth ? 'bg-zinc-800' : 'bg-zinc-800/50'}
                    ${isToday(day) ? 'ring-2 ring-blue-500' : ''}
                    hover:bg-zinc-700 transition-colors
                  `}
                >
                  <span className={`
                    text-sm font-medium block mb-1
                    ${isCurrentMonth ? 'text-white' : 'text-zinc-500'}
                    ${format(day, 'E', { locale: ko }) === '일' ? 'text-red-400' : ''}
                    ${format(day, 'E', { locale: ko }) === '토' ? 'text-blue-400' : ''}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={`
                        text-xs p-1 rounded mb-1 truncate
                        ${event.isNotice 
                          ? 'bg-yellow-500/20 text-yellow-300' 
                          : 'bg-blue-500/20 text-blue-300'
                        }
                      `}
                    >
                      {event.title}
                    </div>
                  ))}
                </button>
              )
            })}
          </div>
        </div>

        {/* 공지사항 섹션 */}
        <div className="mt-8 bg-zinc-800 rounded-2xl p-6 shadow-xl border border-zinc-700">
          <h2 className="text-xl font-bold text-white mb-4">공지사항</h2>
          <div className="space-y-4">
            {getNotices().map(notice => (
              <div
                key={notice.id}
                className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-white">{notice.title}</span>
                  <span className="text-sm text-zinc-400">
                    {format(new Date(notice.date), 'yyyy년 M월 d일', { locale: ko })}
                  </span>
                </div>
                <p className="text-zinc-300">{notice.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 일정 추가 모달 */}
        {showEventForm && selectedDate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-zinc-800 rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">
                {format(selectedDate, 'yyyy년 M월 d일', { locale: ko })} 일정 추가
              </h2>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="일정 제목"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    설명
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="일정 설명"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNotice"
                    checked={newEvent.isNotice}
                    onChange={(e) => setNewEvent({ ...newEvent, isNotice: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-zinc-900 border-zinc-700 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isNotice" className="ml-2 text-sm font-medium text-zinc-300">
                    공지사항으로 등록
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    추가
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventForm(false)
                      setNewEvent({ title: '', description: '', isNotice: false })
                    }}
                    className="flex-1 bg-zinc-700 text-white py-2 rounded-lg hover:bg-zinc-600 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 일정 상세 보기 모달 */}
        {showEventDetail && selectedDate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-zinc-800 rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">
                {format(selectedDate, 'yyyy년 M월 d일', { locale: ko })} 일정
              </h2>
              <div className="space-y-4">
                {getEventsForDate(selectedDate).map(event => (
                  <div
                    key={event.id}
                    className={`
                      p-4 rounded-xl relative
                      ${event.isNotice 
                        ? 'bg-yellow-500/10 border border-yellow-500/20' 
                        : 'bg-blue-500/10 border border-blue-500/20'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-white">{event.title}</span>
                      {event.isNotice && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                          공지
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-300 mb-4">{event.description}</p>
                    {!event.isNotice && (
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowEventForm(true)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  새 일정 추가
                </button>
                <button
                  onClick={() => setShowEventDetail(false)}
                  className="flex-1 bg-zinc-700 text-white py-2 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 