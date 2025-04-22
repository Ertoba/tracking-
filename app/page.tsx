"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { CryptoCard } from "@/components/crypto-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Pagination } from "@/components/pagination"
import type { CryptoData } from "@/types"
import { fetchCryptoData } from "@/lib/api"
import { generateMockData } from "@/lib/mock-data"

export default function Home() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [filteredData, setFilteredData] = useState<CryptoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("market_cap")
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5) // 5 გვერდი, თითოეულზე 100 კრიპტოვალუტა
  const [isMockData, setIsMockData] = useState(false)
  const perPage = 100

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString("ka-GE", { hour12: false })
      setCurrentTime(timeString)
    }

    const timeInterval = setInterval(updateTime, 1000)
    updateTime()

    return () => clearInterval(timeInterval)
  }, [])

  // Update the loadCryptoData function to handle errors better
  const loadCryptoData = useCallback(async (page: number) => {
    setIsLoading(true)
    setError(null)
    setIsMockData(false)

    try {
      console.log(`Loading crypto data for page ${page}`)
      let data: CryptoData[] = []

      try {
        // Try to fetch real data
        data = await fetchCryptoData(page, perPage)
        console.log(`Successfully loaded ${data.length} crypto items`)
      } catch (apiError) {
        console.error("All API attempts failed, using mock data:", apiError)
        // If all API attempts fail, use mock data
        data = generateMockData(page, perPage)
        setIsMockData(true)
        if (apiError.toString().includes("429") || apiError.toString().includes("Rate limit")) {
          setError("გაფრთხილება: API-ის მოთხოვნების ლიმიტი ამოიწურა. გამოყენებულია მოდელირებული მონაცემები.")
        } else {
          setError("გაფრთხილება: გამოყენებულია მოდელირებული მონაცემები. რეალური მონაცემების ჩატვირთვა ვერ მოხერხდა.")
        }
      }

      if (data && data.length > 0) {
        setCryptoData(data)
        setFilteredData(data)
        setLastUpdated(new Date())
      } else {
        console.error("Received empty data")
        // If we got empty data, use mock data as fallback
        const mockData = generateMockData(page, perPage)
        setCryptoData(mockData)
        setFilteredData(mockData)
        setIsMockData(true)
        setError("გაფრთხილება: გამოყენებულია მოდელირებული მონაცემები. მიღებულია ცარიელი მონაცემები.")
      }
    } catch (error) {
      console.error("Critical error in loadCryptoData:", error)
      // Last resort - use mock data
      const mockData = generateMockData(page, perPage)
      setCryptoData(mockData)
      setFilteredData(mockData)
      setIsMockData(true)
      setError("გაფრთხილება: გამოყენებულია მოდელირებული მონაცემები. კრიტიკული შეცდომა მონაცემების ჩატვირთვისას.")
    } finally {
      setIsLoading(false)
      setLastUpdated(new Date())
    }
  }, [])

  useEffect(() => {
    loadCryptoData(currentPage)

    // Refresh data every 2 minutes if not using mock data
    const refreshInterval = setInterval(() => {
      if (!isMockData) {
        loadCryptoData(currentPage)
      }
    }, 120000)

    return () => clearInterval(refreshInterval)
  }, [loadCryptoData, currentPage, isMockData])

  useEffect(() => {
    let result = [...cryptoData]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "market_cap":
        result.sort((a, b) => b.market_cap - a.market_cap)
        break
      case "price":
        result.sort((a, b) => b.current_price - a.current_price)
        break
      case "volume":
        result.sort((a, b) => b.total_volume - a.total_volume)
        break
      case "change":
        result.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        break
    }

    setFilteredData(result)
  }, [cryptoData, searchTerm, sortBy])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  const handleRefresh = () => {
    loadCryptoData(currentPage)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <div className="grid-bg min-h-screen">
      {/* Header */}
      <header className="border-b border-neon-blue py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-coins text-3xl neon-text-blue"></i>
            <h1 className="text-2xl sm:text-3xl font-bold title-blue">კრიპტო-ნეონ</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <span className="text-sm neon-text-blue">რეალურ დროში</span>
              <div className="text-lg cyber-font">{currentTime}</div>
            </div>
            <a href="https://crypt.ge" target="_blank" rel="noopener noreferrer" className="forum-button">
              ფორუმი
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Removed the specified text */}
        <section className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 title-blue"></h2>
          {lastUpdated && (
            <p className="text-sm text-gray-400 mt-2">
              ბოლო განახლება: {lastUpdated.toLocaleTimeString("ka-GE")}
              <button
                onClick={handleRefresh}
                className="ml-2 text-neon-blue hover:text-neon-pink transition-colors"
                disabled={isLoading}
                aria-label="განახლება"
              >
                <i className={`fas fa-sync-alt ${isLoading ? "animate-spin" : ""}`}></i>
              </button>
            </p>
          )}
        </section>

        {/* Search and Filter */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                id="search-crypto"
                placeholder="მოძებნეთ კრიპტოვალუტა..."
                className="w-full cyber-input rounded-lg glow-effect"
                value={searchTerm}
                onChange={handleSearch}
              />
              <i className="fas fa-search absolute right-3 top-3 neon-text-blue"></i>
            </div>
            <select id="sort-by" className="cyber-input rounded-lg glow-effect" value={sortBy} onChange={handleSort}>
              <option value="market_cap">ბაზრის კაპიტალიზაცია</option>
              <option value="price">ფასი</option>
              <option value="volume">ტრანზაქციების მოცულობა</option>
              <option value="change">ცვლილება (%)</option>
            </select>
          </div>
        </section>

        {/* Pagination - Top */}
        <section className="mb-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>

        {/* Error message */}
        {error && (
          <div
            className={`mb-8 p-4 ${isMockData ? "bg-yellow-900 bg-opacity-30 border border-yellow-500" : "bg-red-900 bg-opacity-30 border border-red-500"} rounded-lg text-center`}
          >
            <p className={isMockData ? "text-yellow-300" : "text-red-300"}>
              {error.includes("Rate limit")
                ? "API-ის მოთხოვნების ლიმიტი ამოიწურა. გამოყენებულია მოდელირებული მონაცემები."
                : error}
            </p>
            <p className="text-gray-400 text-sm mt-2 mb-3">
              {error.includes("Rate limit")
                ? "გთხოვთ, დაელოდოთ რამდენიმე წუთს და სცადოთ თავიდან."
                : "გთხოვთ, შეამოწმოთ ინტერნეტ კავშირი და სცადოთ თავიდან."}
            </p>
            <button
              onClick={handleRefresh}
              className={`px-4 py-2 ${isMockData ? "bg-yellow-800 hover:bg-yellow-700" : "bg-red-800 hover:bg-red-700"} rounded-lg text-white`}
            >
              სცადეთ თავიდან
            </button>
          </div>
        )}

        {/* Crypto Grid */}
        <section className="mb-8 scanline">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredData.length > 0 ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
              id="crypto-grid"
            >
              {filteredData.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl neon-text-blue">კრიპტოვალუტები ვერ მოიძებნა</p>
              {searchTerm && (
                <p className="mt-2 text-gray-400">
                  სცადეთ სხვა საძიებო სიტყვა ან{" "}
                  <button onClick={() => setSearchTerm("")} className="text-neon-pink hover:underline">
                    გაასუფთავეთ ძიება
                  </button>
                </p>
              )}
            </div>
          )}
        </section>

        {/* Pagination - Bottom */}
        <section className="mb-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>

        {/* Market Stats section removed as requested */}
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-blue py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold title-blue">კრიპტო-ნეონ</h2>
              <p className="text-sm neon-text-blue">რეალურ დროში კრიპტოვალუტების მონიტორინგი</p>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://t.me/cryptge"
                target="_blank"
                rel="noopener noreferrer"
                className="neon-text-blue hover:text-neon-pink transition"
              >
                <i className="fab fa-telegram text-xl"></i>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm neon-text-blue">
            <p>© 2025 კრიპტო ფორუმი. ყველა უფლება დაცულია.</p>
            <p className="mt-2">
              {isMockData ? "გამოყენებულია მოდელირებული მონაცემები" : "მონაცემები CoinGecko API-დან"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
