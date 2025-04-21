"use client"

import { useEffect, useState, useRef } from "react"
import type { CryptoData } from "@/types"
import { LoadingSpinner } from "./loading-spinner"
import { TradingViewChart } from "./trading-view-chart"

interface ChartModalProps {
  isOpen: boolean
  onClose: () => void
  crypto: CryptoData | null
}

type TimeInterval = {
  label: string
  tvInterval: string
}

// ლოკალურ სტორიჯში შენახული კრიპტოს ID და მოდალის მდგომარეობა
const STORAGE_KEY = "crypto_modal_state"

export function ChartModal({ isOpen, onClose, crypto }: ChartModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>({ label: "1 დღე", tvInterval: "D" })
  const modalRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [chartKey, setChartKey] = useState(Date.now()) // უნიკალური გასაღები ჩარტის გადატვირთვისთვის

  const timeIntervals: TimeInterval[] = [
    { label: "5 წთ", tvInterval: "5" },
    { label: "15 წთ", tvInterval: "15" },
    { label: "30 წთ", tvInterval: "30" },
    { label: "1 სთ", tvInterval: "60" },
    { label: "2 სთ", tvInterval: "120" },
    { label: "4 სთ", tvInterval: "240" },
    { label: "8 სთ", tvInterval: "480" },
    { label: "12 სთ", tvInterval: "720" },
    { label: "1 დღე", tvInterval: "D" },
    { label: "3 დღე", tvInterval: "3D" },
    { label: "1 კვირა", tvInterval: "W" },
    { label: "2 კვირა", tvInterval: "2W" },
    { label: "1 თვე", tvInterval: "M" },
    { label: "3 თვე", tvInterval: "3M" },
    { label: "1 წელი", tvInterval: "12M" },
  ]

  // მოდალის მდგომარეობის შენახვა ლოკალურ სტორიჯში
  useEffect(() => {
    if (isOpen && crypto) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isOpen: true,
          cryptoId: crypto.id,
          interval: selectedInterval.tvInterval,
        }),
      )
    } else if (!isOpen) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [isOpen, crypto, selectedInterval])

  // ჩარტის გადატვირთვა ინტერვალის ცვლილებისას
  useEffect(() => {
    if (isOpen && isVisible) {
      setChartKey(Date.now())
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [selectedInterval, isOpen, isVisible])

  // მოდალის გახსნა/დახურვის ეფექტები
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsVisible(true)
        setTimeout(() => {
          setIsLoading(false)
        }, 1500)
      }, 300)
    } else {
      setIsVisible(false)
      setIsLoading(true)
    }
  }, [isOpen])

  // გარე კლიკის დამუშავება
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden"
      // Prevent touch events on the background
      document.body.style.touchAction = "none"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      // Restore body scrolling when modal is closed
      document.body.style.overflow = ""
      // Restore touch events
      document.body.style.touchAction = ""
    }
  }, [isOpen, onClose])

  // ჩარტის ხელახლა ჩატვირთვა
  const handleRetryChart = () => {
    setIsLoading(true)
    setChartKey(Date.now())
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-end justify-center"
      style={{ touchAction: isOpen ? "none" : "auto" }}
    >
      <div
        ref={modalRef}
        className={`bg-gradient-to-b from-[#0d0221] to-[#1a0842] rounded-t-2xl shadow-2xl transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } slide-up-modal mirror-effect`}
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 -5px 25px rgba(5, 217, 232, 0.3)",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width: "100%",
          maxWidth: "1200px", // დესკტოპზე მაქსიმალური სიგანე
          margin: "0 auto",
        }}
      >
        {/* ზედა ნაწილი ლოგოთი და დახურვის ღილაკით */}
        <div className="flex-none border-b border-neon-blue border-opacity-30">
          <div className="flex items-center justify-between p-4">
            {/* ლოგო და კრიპტოს სახელი */}
            <div className="flex items-center space-x-3">
              {crypto && (
                <>
                  <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <h3 className="text-lg font-bold neon-text-blue">{crypto.name}</h3>
                    <p className="text-xs text-gray-300">{crypto.symbol.toUpperCase()}</p>
                  </div>
                </>
              )}
            </div>

            {/* დახურვის ღილაკი */}
            <button
              onClick={onClose}
              className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="დახურვა"
            >
              <i className="fas fa-times neon-text-pink text-lg"></i>
            </button>
          </div>

          {/* დროის ინტერვალის არჩევანი */}
          <div className="p-3 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {timeIntervals.map((interval) => (
                <button
                  key={interval.label}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedInterval.label === interval.label
                      ? "bg-neon-blue bg-opacity-30 text-white border border-neon-blue"
                      : "bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedInterval(interval)}
                >
                  {interval.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* გადახვევადი შიგთავსი */}
        <div className="flex-1 overflow-y-auto p-4 chart-scroll-container">
          {/* ფასის ინფორმაცია */}
          {crypto && (
            <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400">მიმდინარე ფასი</p>
                <p className="text-lg font-bold">${crypto.current_price.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400">24სთ ცვლილება</p>
                <p
                  className={`text-lg font-bold ${
                    crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400">24სთ მაღალი</p>
                <p className="text-lg font-bold">${crypto.high_24h.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400">24სთ დაბალი</p>
                <p className="text-lg font-bold">${crypto.low_24h.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* ჩარტი */}
          <div className="relative rounded-lg overflow-hidden mb-6 chart-container">
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : crypto ? (
              <div className="h-[400px] relative">
                <TradingViewChart
                  key={chartKey}
                  symbol={crypto.id}
                  interval={selectedInterval.tvInterval}
                  theme="dark"
                  height={400}
                  isVisible={isVisible}
                  onError={handleRetryChart}
                />
                <button
                  onClick={handleRetryChart}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 p-2 rounded-full hover:bg-gray-700 transition-colors"
                  title="ჩარტის განახლება"
                >
                  <i className="fas fa-sync-alt text-neon-blue"></i>
                </button>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-400">მონაცემები ვერ ჩაიტვირთა</div>
            )}
          </div>

          {/* დამატებითი საბაზრო მონაცემები */}
          {crypto && (
            <div className="space-y-6">
              <div className="bg-gray-800 bg-opacity-30 rounded-lg p-4 mirror-card">
                <h4 className="text-lg font-bold mb-3 neon-text-blue">ბაზრის მონაცემები</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">ბაზრის კაპიტალიზაცია</p>
                    <p className="text-md font-bold">${crypto.market_cap.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">24სთ მოცულობა</p>
                    <p className="text-md font-bold">${crypto.total_volume.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">ბრუნვაში</p>
                    <p className="text-md font-bold">
                      {crypto.circulating_supply.toLocaleString()} {crypto.symbol.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">მაქსიმალური რაოდენობა</p>
                    <p className="text-md font-bold">
                      {crypto.max_supply ? crypto.max_supply.toLocaleString() : "∞"} {crypto.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 bg-opacity-30 rounded-lg p-4 mirror-card">
                <h4 className="text-lg font-bold mb-3 neon-text-blue">ისტორიული მაჩვენებლები</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">ისტორიული მაქსიმუმი</p>
                    <p className="text-md font-bold">${crypto.ath.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(crypto.ath_date).toLocaleDateString("ka-GE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">ისტორიული მინიმუმი</p>
                    <p className="text-md font-bold">${crypto.atl.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(crypto.atl_date).toLocaleDateString("ka-GE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
