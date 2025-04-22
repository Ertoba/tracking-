// Helper module for loading and managing TradingView script
let scriptPromise: Promise<boolean> | null = null

export function loadTradingViewScript(): Promise<boolean> {
  if (scriptPromise) {
    return scriptPromise
  }

  scriptPromise = new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.getElementById("tradingview-widget-script")) {
      console.log("TradingView script already exists in DOM")
      if (window.TradingView) {
        console.log("TradingView global object exists")
        resolve(true)
        return
      }
    }

    console.log("Loading TradingView script...")
    const script = document.createElement("script")
    script.id = "tradingview-widget-script"
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true

    script.onload = () => {
      console.log("TradingView script loaded successfully")
      resolve(true)
    }

    script.onerror = (error) => {
      console.error("Failed to load TradingView script:", error)
      scriptPromise = null // Reset so we can try again
      reject(new Error("Failed to load TradingView script"))
    }

    document.head.appendChild(script)
  })

  return scriptPromise
}

// Function to check if TradingView is ready
export function isTradingViewReady(): boolean {
  return typeof window !== "undefined" && !!window.TradingView
}

// Function to get symbol mapping for TradingView
export function getTradingViewSymbol(cryptoId: string): string {
  // Handle standard trading pair format (BTC/USDT)
  if (cryptoId.includes("/")) {
    const [base, quote] = cryptoId.split("/")
    if (base && quote) {
      return `BINANCE:${base.toUpperCase()}${quote.toUpperCase()}`
    }
  }

  // Common mappings for popular cryptocurrencies
  const symbolMap: Record<string, string> = {
    bitcoin: "BTCUSDT",
    ethereum: "ETHUSDT",
    ripple: "XRPUSDT",
    litecoin: "LTCUSDT",
    cardano: "ADAUSDT",
    polkadot: "DOTUSDT",
    dogecoin: "DOGEUSDT",
    solana: "SOLUSDT",
    tether: "USDTUSDC",
    binancecoin: "BNBUSDT",
    "usd-coin": "USDCUSDT",
    xrp: "XRPUSDT",
    "binance-usd": "BUSDUSDT",
    "avalanche-2": "AVAXUSDT",
    "matic-network": "MATICUSDT",
    "shiba-inu": "SHIBUSDT",
  }

  // Check if we have a direct mapping
  if (symbolMap[cryptoId.toLowerCase()]) {
    return `BINANCE:${symbolMap[cryptoId.toLowerCase()]}`
  }

  // If it's USDT, use USDC pair
  if (cryptoId.toUpperCase() === "USDT" || cryptoId.toUpperCase() === "TETHER") {
    return "BINANCE:USDTUSDC"
  }

  // Try to extract symbol from cryptoId (for CoinGecko/CoinCap IDs)
  // This handles cases like "bitcoin" -> "BTC"
  try {
    // If cryptoId contains a hyphen, it might be a compound name
    if (cryptoId.includes("-")) {
      const parts = cryptoId.split("-")
      // Use the first part as the symbol
      const symbol = parts[0].toUpperCase()
      return `BINANCE:${symbol}USDT`
    }

    // For simple IDs, just use the ID directly
    return `BINANCE:${cryptoId.toUpperCase()}USDT`
  } catch (e) {
    console.error("Error formatting symbol:", e)
    // Default fallback
    return "BINANCE:BTCUSDT"
  }
}
