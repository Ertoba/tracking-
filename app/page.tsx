"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { CryptoCard } from "@/components/crypto-card"
import { MarketStats } from "@/components/market-stats"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { CryptoData } from "@/types"
import { fetchCryptoData } from "@/lib/api"

export default function Home() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [filteredData, setFilteredData] = useState<CryptoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("market_cap")

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

  useEffect(() => {
    const loadCryptoData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchCryptoData()
        setCryptoData(data)
        setFilteredData(data)
      } catch (error) {
        console.error("Error fetching crypto data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCryptoData()

    // Refresh data every 60 seconds
    const refreshInterval = setInterval(loadCryptoData, 60000)

    return () => clearInterval(refreshInterval)
  }, [])

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
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 title-blue">კრიპტოვალუტების კურსი</h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto neon-text-pink">
            ნახეთ ყველა პოპულარული კრიპტოვალუტის ფასი რეალურ დროში
          </p>
        </section>

        {/* Search and Filter */}
        <section className="mb-8">
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

        {/* Crypto Grid */}
        <section className="mb-12 scanline">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="crypto-grid">
              {filteredData.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
            </div>
          )}
        </section>

        {/* Market Stats */}
        <MarketStats cryptoData={cryptoData} isLoading={isLoading} />
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
              <a href="https://crypt.ge" className="neon-text-blue hover:text-neon-pink transition">
                <i className="fab fa-telegram text-xl"></i>
              </a>
              <a href="https://crypt.ge" className="neon-text-blue hover:text-neon-pink transition">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="https://crypt.ge" className="neon-text-blue hover:text-neon-pink transition">
                <i className="fab fa-github text-xl"></i>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm neon-text-blue">
            <p>კრიპტო ფორუმი. ყველა უფლება დაცულია.</p>
            <p className="mt-2">მონაცემები Coingecko –დან</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
