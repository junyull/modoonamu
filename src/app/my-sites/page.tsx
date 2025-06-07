'use client'

export default function MySitesPage() {
  // 임시 데이터
  const sites = [
    {
      id: 1,
      name: "우리 가게 방명록",
      description: "우리 가게를 방문해주신 고객님들의 소중한 한마디를 남겨주세요.",
      template: "guestbook",
      url: "/sites/1"
    },
    {
      id: 2,
      name: "우리 교회 일정표",
      description: "교회의 주요 일정과 행사를 공유합니다.",
      template: "schedule",
      url: "/sites/2"
    }
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white text-center">내 사이트 목록</h2>
      
      <div className="grid gap-4">
        {sites.map(site => (
          <div 
            key={site.id}
            className="bg-zinc-800 rounded-2xl border border-zinc-700 p-6 hover:bg-zinc-700/50 transition-colors"
          >
            <h3 className="text-xl font-bold text-white mb-2">{site.name}</h3>
            <p className="text-zinc-300 mb-4">{site.description}</p>
            <div className="flex gap-3">
              <a 
                href={site.url} 
                target="_blank"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                사이트 보기
              </a>
              <button 
                className="bg-zinc-700 text-white px-4 py-2 rounded-lg hover:bg-zinc-600 transition-colors text-sm"
              >
                수정하기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 