import { useEffect, useState } from 'react'
import { getIndexMovers } from '../utils/api'

export default function Ticker() {
  const [items, setItems] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const json = await getIndexMovers('NIFTY')
        if (cancelled) return
        setItems(json || [])
      } catch (e) { 
        setItems([]) 
      }
    }
    load()
    const id = setInterval(load, 60_000) // refresh every 1 min
    return () => { 
      cancelled = true
      clearInterval(id) 
    }
  }, [])

  if (!items.length) return null

  const textItems = items
    .map(it => `${it.symbol || it.ticker || it.name} ${it.change || ''} (${it.changePercent || ''})`)
    .join('   •   ')

  return (
    <div className="bg-white py-2 border-b">
      <div className="container mx-auto px-4">
        <div className="ticker-wrap">
          <div className="ticker-track">
            {textItems}   {textItems}
          </div>
        </div>
      </div>
    </div>
  )
}
