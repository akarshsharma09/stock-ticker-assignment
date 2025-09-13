export const API_BASE = 'https://portal.tradebrains.in/api/assignment'

// 🔍 Search Stocks
export async function searchStocks(keyword, length = 10) {
  const url = `${API_BASE}/search?keyword=${encodeURIComponent(keyword)}&length=${length}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Search API error')
  return res.json()
}

// 📈 Get Stock Prices
export async function getStockPrices(symbol, { days = 30, type = 'INTRADAY', limit = 60 } = {}) {
  const url = `${API_BASE}/stock/${encodeURIComponent(symbol)}/prices?days=${days}&type=${type}&limit=${limit}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Prices API error')
  return res.json()
}

// 📊 Get Index Movers (Ticker Data)
export async function getIndexMovers(index = 'NIFTY') {
  const url = `${API_BASE}/index/${encodeURIComponent(index)}/movers/`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Ticker API error')
  return res.json()
}
