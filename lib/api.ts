import type { CryptoData } from "@/types"
import { generateMockData } from "./mock-data"

// კეშირების მექანიზმი
const CACHE_DURATION = 60000 // 1 წუთი კეშირება

export async function fetchCryptoData(page = 1, perPage = 100): Promise<CryptoData[]> {
  console.log(`Attempting to fetch crypto data for page ${page}`)

  // თუ გვაქვს კეშირებული მონაცემები და ისინი ჯერ კიდევ ვალიდურია, დავაბრუნოთ
  const now = Date.now()
  const cacheKey = `crypto_data_page_${page}`
  let cachedPageData = null

  try {
    if (typeof sessionStorage !== "undefined") {
      cachedPageData = sessionStorage.getItem(cacheKey)
    }
  } catch (e) {
    console.warn("Error accessing sessionStorage:", e)
  }

  if (cachedPageData) {
    try {
      const parsed = JSON.parse(cachedPageData)
      if (now - parsed.timestamp < CACHE_DURATION) {
        console.log(`Using cached crypto data for page ${page}`)
        return parsed.data
      } else {
        console.log(`Cached data expired for page ${page}`)
      }
    } catch (e) {
      console.error("Error parsing cached data:", e)
    }
  }

  // ჯერ ვცადოთ კეშიდან მოძველებული მონაცემების მიღება, თუ ფეჩი ჩავარდება
  const getExpiredCache = () => {
    if (cachedPageData) {
      try {
        console.log("Using expired cached data as fallback")
        return JSON.parse(cachedPageData).data
      } catch (e) {
        console.error("Error parsing expired cached data:", e)
      }
    }
    return null
  }

  // Use our new CoinGecko API route
  try {
    console.log(`Fetching crypto data from CoinGecko API for page ${page}`)

    const response = await fetch(`/api/coingecko?vs_currency=usd&per_page=${perPage}&page=${page}`, {
      cache: "no-store",
    })

    // Handle rate limiting (429) specifically
    if (response.status === 429) {
      console.warn("Rate limit exceeded, using fallback data")

      // Try to use expired cache first
      const expiredCache = getExpiredCache()
      if (expiredCache) {
        return expiredCache
      }

      // If no cache, use mock data
      console.log("No cached data available, using mock data")
      return generateMockData(page, perPage)
    }

    if (response.ok) {
      const responseData = await response.json()

      // Check if the API returned mock data flag
      if (responseData.isMockData) {
        console.log("API returned mock data flag, using mock data")
        return generateMockData(page, perPage)
      }

      if (!Array.isArray(responseData)) {
        throw new Error("Invalid data format from API")
      }

      // Map CoinGecko data to our expected format
      const data = responseData.map((coin: any) => {
        return {
          id: coin.id,
          symbol: coin.symbol.toLowerCase(),
          name: coin.name,
          image: coin.image,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          market_cap_rank: coin.market_cap_rank,
          total_volume: coin.total_volume,
          high_24h: coin.high_24h,
          low_24h: coin.low_24h,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
          circulating_supply: coin.circulating_supply,
          total_supply: coin.total_supply,
          max_supply: coin.max_supply,
          ath: coin.ath,
          ath_change_percentage: coin.ath_change_percentage,
          ath_date: coin.ath_date,
          atl: coin.atl,
          atl_change_percentage: coin.atl_change_percentage,
          atl_date: coin.atl_date,
          last_updated: coin.last_updated,
        }
      })

      console.log(`Successfully processed ${data.length} coins from CoinGecko API`)

      // შევინახოთ მონაცემები კეშში
      try {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }))
        }
      } catch (e) {
        console.warn("Error saving to sessionStorage:", e)
      }

      return data
    }

    throw new Error(`API returned status ${response.status}`)
  } catch (error) {
    console.error("Error fetching from CoinGecko API:", error)

    // თუ გვაქვს კეშირებული მონაცემები, დავაბრუნოთ ისინი მიუხედავად ვადის გასვლისა
    const expiredCache = getExpiredCache()
    if (expiredCache) {
      console.log("Using expired cache as last resort")
      return expiredCache
    }

    // თუ ყველაფერი ჩავარდა, დავაბრუნოთ მოდელირებული მონაცემები
    console.log("API failed, generating mock data")
    return generateMockData(page, perPage)
  }
}

// ფუნქცია ყველა გვერდის მონაცემების მისაღებად
export async function fetchAllCryptoData(totalPages = 5, perPage = 100): Promise<CryptoData[]> {
  try {
    const allData: CryptoData[] = []

    // პარალელური მოთხოვნები ყველა გვერდისთვის
    const promises = Array.from({ length: totalPages }, (_, i) => fetchCryptoData(i + 1, perPage))

    const results = await Promise.all(promises)

    // შედეგების გაერთიანება
    results.forEach((pageData) => {
      allData.push(...pageData)
    })

    return allData
  } catch (error) {
    console.error("Error fetching all crypto data:", error)
    return []
  }
}
