import type { CryptoData } from "@/types"

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"
const FALLBACK_API_URL = "https://api.coincap.io/v2" // ალტერნატიული API

// კეშირების მექანიზმი
let cachedData: CryptoData[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 60000 // 1 წუთი კეშირება

export async function fetchCryptoData(): Promise<CryptoData[]> {
  // თუ გვაქვს კეშირებული მონაცემები და ისინი ჯერ კიდევ ვალიდურია, დავაბრუნოთ
  const now = Date.now()
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    console.log("Using cached crypto data")
    return cachedData
  }

  try {
    // პირველი მცდელობა CoinGecko API-ით
    const response = await fetchWithTimeout(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h&locale=en`,
      { timeout: 5000 },
    )

    if (response.ok) {
      const data = await response.json()
      // შევინახოთ მონაცემები კეშში
      cachedData = data
      lastFetchTime = now
      return data
    }

    // თუ პირველი API არ მუშაობს, ვცადოთ ალტერნატიული API
    console.log("CoinGecko API failed, trying fallback API...")
    return await fetchFromFallbackApi()
  } catch (error) {
    console.error("Error fetching from CoinGecko:", error)

    // ვცადოთ ალტერნატიული API
    try {
      return await fetchFromFallbackApi()
    } catch (fallbackError) {
      console.error("Fallback API also failed:", fallbackError)

      // თუ გვაქვს კეშირებული მონაცემები, დავაბრუნოთ ისინი მიუხედავად ვადის გასვლისა
      if (cachedData) {
        console.log("Using expired cached data as last resort")
        return cachedData
      }

      // თუ ყველაფერი ჩავარდა, დავაბრუნოთ მოდელირებული მონაცემები
      return generateMockData()
    }
  }
}

// ფუნქცია timeout-ით fetch-ისთვის
async function fetchWithTimeout(url: string, options: { timeout?: number } = {}) {
  const { timeout = 8000 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

// ალტერნატიული API-დან მონაცემების მიღება
async function fetchFromFallbackApi(): Promise<CryptoData[]> {
  const response = await fetchWithTimeout(`${FALLBACK_API_URL}/assets?limit=100`, { timeout: 5000 })

  if (!response.ok) {
    throw new Error(`Fallback API request failed with status ${response.status}`)
  }

  const data = await response.json()

  // CoinCap API-ის მონაცემების გარდაქმნა CryptoData ფორმატში
  return data.data.map((coin: any) => {
    const priceUsd = Number.parseFloat(coin.priceUsd)
    const changePercent24Hr = Number.parseFloat(coin.changePercent24Hr)

    return {
      id: coin.id,
      symbol: coin.symbol.toLowerCase(),
      name: coin.name,
      image: `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
      current_price: priceUsd,
      market_cap: Number.parseFloat(coin.marketCapUsd),
      market_cap_rank: Number.parseInt(coin.rank),
      total_volume: Number.parseFloat(coin.volumeUsd24Hr),
      high_24h: priceUsd * (1 + Math.abs(changePercent24Hr) / 100),
      low_24h: priceUsd * (1 - Math.abs(changePercent24Hr) / 100),
      price_change_percentage_24h: changePercent24Hr,
      market_cap_change_percentage_24h: changePercent24Hr,
      circulating_supply: Number.parseFloat(coin.supply),
      total_supply: Number.parseFloat(coin.maxSupply) || Number.parseFloat(coin.supply),
      max_supply: Number.parseFloat(coin.maxSupply) || null,
      ath: priceUsd * 1.5, // მიახლოებითი მნიშვნელობა
      ath_change_percentage: -20,
      ath_date: new Date().toISOString(),
      atl: priceUsd * 0.5, // მიახლოებითი მნიშვნელობა
      atl_change_percentage: 100,
      atl_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      last_updated: new Date().toISOString(),
    }
  })
}

// მოდელირებული მონაცემების გენერირება, თუ ორივე API ჩავარდა
function generateMockData(): CryptoData[] {
  console.log("Generating mock data as last resort")

  const mockCoins = [
    { id: "bitcoin", symbol: "btc", name: "Bitcoin" },
    { id: "ethereum", symbol: "eth", name: "Ethereum" },
    { id: "tether", symbol: "usdt", name: "Tether" },
    { id: "binancecoin", symbol: "bnb", name: "Binance Coin" },
    { id: "ripple", symbol: "xrp", name: "XRP" },
    { id: "cardano", symbol: "ada", name: "Cardano" },
    { id: "solana", symbol: "sol", name: "Solana" },
    { id: "polkadot", symbol: "dot", name: "Polkadot" },
    { id: "dogecoin", symbol: "doge", name: "Dogecoin" },
    { id: "avalanche-2", symbol: "avax", name: "Avalanche" },
  ]

  return mockCoins.map((coin, index) => {
    const basePrice = index === 0 ? 50000 : index === 1 ? 3000 : 1000 / (index + 1)
    const changePercent = Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)

    return {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: `/placeholder.svg?height=32&width=32`,
      current_price: basePrice,
      market_cap: basePrice * 1000000 * (100 - index),
      market_cap_rank: index + 1,
      total_volume: basePrice * 500000 * (50 - index),
      high_24h: basePrice * (1 + Math.abs(changePercent) / 100),
      low_24h: basePrice * (1 - Math.abs(changePercent) / 100),
      price_change_percentage_24h: changePercent,
      market_cap_change_percentage_24h: changePercent,
      circulating_supply: 1000000 * (100 - index),
      total_supply: 1000000 * (120 - index),
      max_supply: index < 5 ? 1000000 * (150 - index) : null,
      ath: basePrice * 1.5,
      ath_change_percentage: -20,
      ath_date: new Date().toISOString(),
      atl: basePrice * 0.5,
      atl_change_percentage: 100,
      atl_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      last_updated: new Date().toISOString(),
    }
  })
}
