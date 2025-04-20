import type { CryptoData } from "@/types"

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

export async function fetchCryptoData(): Promise<CryptoData[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h&locale=en`,
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return []
  }
}
