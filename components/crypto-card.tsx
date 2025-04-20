"use client"

import { useState } from "react"
import type { CryptoData } from "@/types"
import { formatNumber } from "@/lib/utils"

interface CryptoCardProps {
  crypto: CryptoData
}

export function CryptoCard({ crypto }: CryptoCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const changeClass = crypto.price_change_percentage_24h >= 0 ? "price-up" : "price-down"
  const changeIcon = crypto.price_change_percentage_24h >= 0 ? "fa-arrow-up" : "fa-arrow-down"

  const handleClick = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div className="neon-card rounded-lg p-6 glow-effect cursor-pointer" onClick={handleClick}>
      <div className="flex justify-between items-start mb-4">
        <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-10 h-10" />
        <span className="text-sm bg-black bg-opacity-50 px-2 py-1 rounded neon-text-blue">
          {crypto.symbol.toUpperCase()}
        </span>
      </div>
      <div className="text-2xl font-bold mb-2 cyber-font price-bg rounded-lg px-3 py-1">
        ${crypto.current_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
      </div>
      <div className="flex items-center mb-4">
        <i className={`fas ${changeIcon} mr-1 ${changeClass}`}></i>
        <span className={changeClass}>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
      </div>
      <div className="text-sm neon-text-blue">
        ბაზრის კაპიტალი: <span className="text-white">{formatNumber(crypto.market_cap)}</span>
      </div>
      <div className="text-sm neon-text-blue mt-1">
        მოცულობა: <span className="text-white">{formatNumber(crypto.total_volume)}</span>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-neon-blue">
          <div className="text-sm neon-text-blue">
            რანგი: <span className="text-white">#{crypto.market_cap_rank}</span>
          </div>
          <div className="text-sm neon-text-blue mt-1">
            24სთ მაღალი: <span className="text-white">${crypto.high_24h.toLocaleString("en-US")}</span>
          </div>
          <div className="text-sm neon-text-blue mt-1">
            24სთ დაბალი: <span className="text-white">${crypto.low_24h.toLocaleString("en-US")}</span>
          </div>
          <div className="text-sm neon-text-blue mt-1">
            ბრუნვაში:{" "}
            <span className="text-white">
              {crypto.circulating_supply.toLocaleString("en-US")} {crypto.symbol.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
