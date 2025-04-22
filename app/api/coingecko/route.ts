import { NextResponse } from "next/server"

// Simple in-memory cache
const CACHE: Record<string, { data: any; timestamp: number }> = {}
const CACHE_DURATION = 120 * 1000 // 2 minutes

// Rate limiting
const RATE_LIMIT_RESET = 60 * 1000 // 60 seconds
let lastRequestTime = 0
let requestCount = 0
const MAX_REQUESTS_PER_MINUTE = 10 // CoinGecko allows more requests than CoinCap

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const page = url.searchParams.get("page") || "1"
    const perPage = url.searchParams.get("per_page") || "100"
    const vsCurrency = url.searchParams.get("vs_currency") || "usd"

    // Create cache key
    const cacheKey = `coingecko_${vsCurrency}_${page}_${perPage}`

    // Check cache first
    if (CACHE[cacheKey] && Date.now() - CACHE[cacheKey].timestamp < CACHE_DURATION) {
      console.log("Serving from cache:", cacheKey)
      return NextResponse.json(CACHE[cacheKey].data)
    }

    // Check rate limit
    const now = Date.now()
    if (now - lastRequestTime > RATE_LIMIT_RESET) {
      // Reset counter after the rate limit window
      requestCount = 0
      lastRequestTime = now
    }

    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      console.log("Rate limit exceeded, serving from cache or returning error")

      // If we have cached data (even if expired), use it
      if (CACHE[cacheKey]) {
        return NextResponse.json(CACHE[cacheKey].data)
      }

      // Otherwise return a 429 error that our client can handle
      return NextResponse.json({ error: "Rate limit exceeded", isMockData: true }, { status: 429 })
    }

    // Increment request counter
    requestCount++
    lastRequestTime = now

    // Construct the CoinGecko API URL
    const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`

    // Fetch data from CoinGecko API with retry logic
    const response = await fetchWithRetry(apiUrl)

    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`CoinGecko API returned status ${response.status}`)
    }

    // Parse the response
    const data = await response.json()

    // Cache the result
    CACHE[cacheKey] = {
      data,
      timestamp: Date.now(),
    }

    // Return the data
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from CoinGecko:", error)

    // Try to serve from cache even if expired
    const url = new URL(request.url)
    const page = url.searchParams.get("page") || "1"
    const perPage = url.searchParams.get("per_page") || "100"
    const vsCurrency = url.searchParams.get("vs_currency") || "usd"
    const cacheKey = `coingecko_${vsCurrency}_${page}_${perPage}`

    if (CACHE[cacheKey]) {
      console.log("Serving expired cache due to error")
      return NextResponse.json(CACHE[cacheKey].data)
    }

    return NextResponse.json({ error: "Failed to fetch CoinGecko", isMockData: true }, { status: 500 })
  }
}

// Fetch with retry and exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  initialDelay = 1000,
): Promise<Response> {
  let lastError: Error | null = null
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`API fetch attempt ${attempt + 1}/${maxRetries + 1} for ${url}`)

      const response = await fetch(url, {
        ...options,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      })

      // If we get a 429, wait and retry
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After")
        const waitTime = retryAfter ? Number.parseInt(retryAfter) * 1000 : delay

        console.log(`Rate limited. Waiting ${waitTime}ms before retry...`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))

        // Increase delay for next attempt (exponential backoff)
        delay *= 2
        continue
      }

      return response
    } catch (error) {
      lastError = error as Error
      console.warn(`Attempt ${attempt + 1} failed:`, error)

      if (attempt < maxRetries) {
        // Wait before next retry with exponential backoff
        console.log(`Waiting ${delay}ms before retry...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2
      }
    }
  }

  throw lastError || new Error("Failed to fetch after retries")
}
