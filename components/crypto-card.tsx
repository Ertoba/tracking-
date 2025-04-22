"use client"

import { useState, useEffect } from "react"
import type { CryptoData } from "@/types"
import { ChartModal } from "./chart-modal"

interface CryptoCardProps {
  crypto: CryptoData
}

// ლოკალურ სტორიჯში შენახული კრიპტოს ID და მოდალის მდგომარეობა
const STORAGE_KEY = "crypto_modal_state"

export function CryptoCard({ crypto }: CryptoCardProps) {
  const [showModal, setShowModal] = useState(false)

  const changeClass = crypto.price_change_percentage_24h >= 0 ? "price-up" : "price-down"
  const changeIcon = crypto.price_change_percentage_24h >= 0 ? "fa-arrow-up" : "fa-arrow-down"

  // ლოკალური სტორიჯიდან მოდალის მდგომარეობის აღდგენა
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY)
      if (savedState) {
        const { isOpen, cryptoId } = JSON.parse(savedState)
        if (isOpen && cryptoId === crypto.id) {
          setShowModal(true)
        }
      }
    } catch (error) {
      console.error("Error restoring modal state:", error)
    }
  }, [crypto.id])

  const handleClick = () => {
    setShowModal(true)
  }

  // ფასის ფორმატირება
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString("en-US", { maximumFractionDigits: 2 })
    } else if (price >= 1) {
      return price.toLocaleString("en-US", { maximumFractionDigits: 4 })
    } else if (price >= 0.01) {
      return price.toLocaleString("en-US", { maximumFractionDigits: 6 })
    } else {
      return price.toLocaleString("en-US", { maximumFractionDigits: 8 })
    }
  }

  return (
    <>
      <div className="mini-crypto-card rounded-lg p-3 cursor-pointer" onClick={handleClick}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-5 h-5 mr-2" />
            <span className="text-xs font-bold">{crypto.symbol.toUpperCase()}</span>
          </div>
          <span className="text-xs text-gray-400">#{crypto.market_cap_rank}</span>
        </div>
        <div className="text-sm font-bold mb-1">${formatPrice(crypto.current_price)}</div>
        <div className="flex items-center text-xs">
          <i className={`fas ${changeIcon} mr-1 ${changeClass}`}></i>
          <span className={changeClass}>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
        </div>
      </div>

      <ChartModal isOpen={showModal} onClose={() => setShowModal(false)} crypto={crypto} />
    </>
  )
}
