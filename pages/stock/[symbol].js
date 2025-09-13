import Head from 'next/head'
import { getStockPrices } from '../../utils/api'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { useEffect, useState } from 'react'
import Ticker from '../../components/Ticker'

export default function StockPage({ symbol, priceData, error }) {
  const [favorites, setFavorites] = useState([])

  // ⭐ Favorites load
  useEffect(() => {
    try {
      const raw = localStorage.getItem('favorites') || '[]'
      setFavorites(JSON.parse(raw))
    } catch (e) {
      setFavorites([])
    }
  }, [])

  const isFav = favorites.includes(symbol)

  function toggleFav() {
    const cur = new Set(favorites)
    if (cur.has(symbol)) cur.delete(symbol)
    else cur.add(symbol)
    const arr = Array.from(cur)
    setFavorites(arr)
    localStorage.setItem('favorites', JSON.stringify(arr))
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  // 📊 Prepare chart data
  const labels = priceData?.map(p => p.time || p.date) || []
  const values = priceData?.map(p => Number(p.close ?? p.price ?? p.value ?? 0)) || []

  // ✅ Latest Price & % Change
  const latest = priceData?.[priceData.length - 1]
  const prev = priceData?.[priceData.length - 2]
  const latestPrice = latest ? (latest.close ?? latest.price ?? latest.value ?? '-') : '-'
  const prevPrice = prev ? (prev.close ?? prev.price ?? prev.value ?? latestPrice) : latestPrice
  const change = latestPrice && prevPrice ? (latestPrice - prevPrice).toFixed(2) : null
  const changePercent = latestPrice && prevPrice ? ((change / prevPrice) * 100).toFixed(2) : null

  const data = {
    labels,
    datasets: [
      {
        label: `${symbol} price`,
        data: values,
        borderColor: "rgba(37, 99, 235, 1)",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.2,
        fill: true,
      },
    ],
  }

  return (
    <div>
      <Head>
        <title>{symbol} — Stock details</title>
        <meta name="keywords" content={`${symbol}, stock, shares, finance`} />
        <meta name="description" content={`Price history and details for ${symbol}`} />
      </Head>

      {/* 🔝 Top Ticker */}
      <Ticker />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{symbol}</h1>
            {latestPrice !== '-' && (
              <p className="mt-1 text-lg">
                ₹{latestPrice}{' '}
                {change && (
                  <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {change >= 0 ? '+' : ''}{change} ({changePercent}%)
                  </span>
                )}
              </p>
            )}
          </div>
          <button
            onClick={toggleFav}
            className="px-3 py-1 rounded-md border hover:bg-slate-50"
          >
            {isFav ? '★ Favorited' : '☆ Add to favorites'}
          </button>
        </div>

        <section className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Price chart</h2>
          {values.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <div className="spinner" />
            </div>
          ) : (
            <Line data={data} />
          )}
        </section>
      </main>
    </div>
  )
}

// 🔥 Server-side fetch
export async function getServerSideProps(context) {
  const symbol = context.params.symbol
  try {
    const priceJson = await getStockPrices(symbol, { days: 7, type: 'INTRADAY', limit: 100 })
    const priceData = priceJson?.data || priceJson || []
    return { props: { symbol, priceData } }
  } catch (e) {
    return { props: { symbol, error: 'Could not fetch price data.' } }
  }
}
