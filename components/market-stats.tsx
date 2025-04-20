import type { CryptoData } from "@/types"
import { formatNumber } from "@/lib/utils"

interface MarketStatsProps {
  cryptoData: CryptoData[]
  isLoading: boolean
}

export function MarketStats({ cryptoData, isLoading }: MarketStatsProps) {
  // Calculate total market cap
  const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.market_cap, 0)

  // Calculate total volume
  const totalVolume = cryptoData.reduce((sum, crypto) => sum + crypto.total_volume, 0)

  // Calculate market cap change percentage (weighted average)
  const marketCapChange =
    cryptoData.length > 0
      ? cryptoData.reduce((sum, crypto) => sum + crypto.market_cap_change_percentage_24h * crypto.market_cap, 0) /
        totalMarketCap
      : 0

  // Calculate volume change (we don't have this data from the API, so we'll use a placeholder)
  const volumeChange = -1.56

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold mb-6 neon-text-blue cyber-font">ბაზრის სტატისტიკა</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="neon-card rounded-lg p-6 glow-effect">
          <div className="flex items-center space-x-3 mb-4">
            <i className="fas fa-chart-line text-2xl neon-text-green"></i>
            <h4 className="text-xl font-bold neon-text-blue">საერთო კაპიტალიზაცია</h4>
          </div>
          {isLoading ? (
            <div className="h-8 w-40 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <>
              <div className="text-3xl font-bold cyber-font">{formatNumber(totalMarketCap)}</div>
              <div className="mt-2 text-sm neon-text-pink">
                ბოლო 24 საათში{" "}
                <span className={marketCapChange >= 0 ? "price-up" : "price-down"}>
                  {marketCapChange >= 0 ? "+" : ""}
                  {marketCapChange.toFixed(2)}%
                </span>
              </div>
            </>
          )}
        </div>
        <div className="neon-card rounded-lg p-6 glow-effect">
          <div className="flex items-center space-x-3 mb-4">
            <i className="fas fa-exchange-alt text-2xl neon-text-blue"></i>
            <h4 className="text-xl font-bold neon-text-blue">ტრანზაქციების მოცულობა</h4>
          </div>
          {isLoading ? (
            <div className="h-8 w-40 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <>
              <div className="text-3xl font-bold cyber-font">{formatNumber(totalVolume)}</div>
              <div className="mt-2 text-sm neon-text-pink">
                ბოლო 24 საათში{" "}
                <span className={volumeChange >= 0 ? "price-up" : "price-down"}>
                  {volumeChange >= 0 ? "+" : ""}
                  {Math.abs(volumeChange).toFixed(2)}%
                </span>
              </div>
            </>
          )}
        </div>
        <div className="neon-card rounded-lg p-6 glow-effect">
          <div className="flex items-center space-x-3 mb-4">
            <i className="fas fa-coins text-2xl neon-text-purple"></i>
            <h4 className="text-xl font-bold neon-text-blue">აქტიური აქტივები</h4>
          </div>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <>
              <div className="text-3xl font-bold cyber-font">{cryptoData.length}</div>
              <div className="mt-2 text-sm neon-text-pink">
                ტოპ კრიპტოვალუტები <span className="price-up">ბაზარზე</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
