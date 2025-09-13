import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { searchStocks } from '../utils/api'

export default function SearchBar() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const timer = useRef(null)

  useEffect(() => {
    if (!q) { 
      setResults([]) 
      return 
    }
    setLoading(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        const data = await searchStocks(q, 10)
        setResults(data || [])
      } catch (e) {
        setResults([])
      } finally { 
        setLoading(false) 
      }
    }, 300)

    return () => clearTimeout(timer.current)
  }, [q])

  function onSelect(item) {
    const sym = item?.symbol || item?.ticker || item?.code || item?.id
    if (!sym) return
    setQ('')
    setResults([])
    router.push(`/stock/${encodeURIComponent(sym)}`)
  }

  return (
    <div className="relative w-full max-w-lg">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search stocks (e.g. RELIANCE)..."
        className="w-full p-3 rounded-lg shadow-sm border border-slate-200 bg-white"
      />
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="spinner" />
        </div>
      )}
      {results?.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow z-50 max-h-64 overflow-auto">
          {results.map((r, i) => (
            <li 
              key={i} 
              onClick={() => onSelect(r)} 
              className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex justify-between"
            >
              <div>
                <div className="font-medium">{r.name || r.title || r.symbol || r.ticker}</div>
                <div className="text-sm text-slate-500">{r.symbol || r.ticker || r.id}</div>
              </div>
              <div className="text-sm text-slate-500">{r.exchange || ''}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
