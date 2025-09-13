import Head from 'next/head'
import SearchBar from '../components/SearchBar'
import Ticker from '../components/Ticker'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Stock Ticker — Assignment</title>
        <meta name="description" content="Search and view stock details and price graph" />
      </Head>

      {/* 🔝 Top Scrolling Ticker */}
      <Ticker />

      <main className="container mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl font-semibold mb-4">📈 Stock Ticker App</h1>
        <p className="mb-6 text-slate-600">
          Search a stock and view detailed price data with a simple graph.
        </p>

        {/* 🔍 Search Input */}
        <SearchBar />

        {/* Info Sections */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="font-medium">How it works</h2>
            <ul className="mt-3 text-sm text-slate-600 list-disc ml-5">
              <li>Type a stock name or symbol into the search box.</li>
              <li>Select a result to navigate to a details page.</li>
              <li>Details page shows SEO meta tags and a price graph.</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="font-medium">Notes</h2>
            <p className="text-sm text-slate-600 mt-2">
              This app uses the assignment endpoints hosted at 
              <code> portal.tradebrains.in </code> to fetch search results, ticker and price data.
            </p>
          </div>
        </section>
      </main>

      {/* 🔻 Footer */}
      <footer className="bg-slate-100 text-center py-4 border-t">
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} Built by{" "}
          <a
            href="https://akarshcodes.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Akarsh.codes
          </a>
        </p>
      </footer>
    </div>
  )
}
