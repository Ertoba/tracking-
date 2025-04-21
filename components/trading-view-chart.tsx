"use client"

import { useEffect, useRef, useState } from "react"

interface TradingViewChartProps {
  symbol: string
  interval: string
  theme?: "light" | "dark"
  height?: number
  isVisible: boolean
  onError?: () => void
}

declare global {
  interface Window {
    TradingView: any
  }
}

export function TradingViewChart({
  symbol,
  interval,
  theme = "dark",
  height = 400,
  isVisible,
  onError,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)
  const [chartError, setChartError] = useState(false)
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load TradingView script
  useEffect(() => {
    if (!document.getElementById("tradingview-widget-script") && !scriptLoaded && !scriptError) {
      const script = document.createElement("script")
      script.id = "tradingview-widget-script"
      script.src = "https://s3.tradingview.com/tv.js"
      script.async = true

      script.onload = () => {
        setScriptLoaded(true)
      }

      script.onerror = () => {
        console.error("Failed to load TradingView script")
        setScriptError(true)
        if (onError) onError()
      }

      document.head.appendChild(script)
    }

    return () => {
      // Clean up widget when component unmounts
      if (widgetRef.current) {
        try {
          // Some cleanup if needed
        } catch (e) {
          console.error("Error cleaning up TradingView widget:", e)
        }
      }

      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
    }
  }, [scriptLoaded, scriptError, onError])

  // Create widget when script is loaded and component is visible
  useEffect(() => {
    // Reset chart error state on new attempt
    setChartError(false)

    // Only create widget when it's visible, the script is loaded, and TradingView is available
    if (isVisible && containerRef.current && scriptLoaded && window.TradingView) {
      try {
        // Format symbol for TradingView (e.g., "bitcoin" -> "BINANCE:BTCUSDT")
        const formattedSymbol = formatSymbolForTradingView(symbol)

        // Create new widget with a unique container ID
        const containerId = `tradingview-widget-${symbol}-${interval}-${Date.now()}`
        containerRef.current.id = containerId

        // Set a timeout to detect if chart fails to load
        loadTimeoutRef.current = setTimeout(() => {
          // Check if chart is still loading
          const chartElement = document.querySelector(`#${containerId} iframe`)
          if (!chartElement || chartElement.clientHeight < 100) {
            console.error("Chart failed to load properly")
            setChartError(true)
            if (onError) onError()
          }
        }, 5000)

        // Create new widget
        widgetRef.current = new window.TradingView.widget({
          container_id: containerId,
          symbol: formattedSymbol,
          interval: interval,
          timezone: "exchange",
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#0d0221",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          height: height,
          width: "100%",
          studies: [],
          show_popup_button: false,
          popup_width: "1000",
          popup_height: "650",
          hide_volume: false,
          backgroundColor: "rgba(13, 2, 33, 0.7)",
          gridColor: "rgba(255, 255, 255, 0.05)",
          allow_symbol_change: false,
          hide_side_toolbar: true,
          enabled_features: ["move_logo_to_main_pane"],
          disabled_features: [
            "header_symbol_search",
            "header_compare",
            "header_settings",
            "left_toolbar",
            "use_localstorage_for_settings",
          ],
          autosize: true,
          loading_screen: { backgroundColor: "#0d0221", foregroundColor: "#05d9e8" },
        })
      } catch (error) {
        console.error("Error creating TradingView widget:", error)
        setChartError(true)
        if (onError) onError()
      }
    }
  }, [symbol, interval, theme, height, isVisible, scriptLoaded, onError])

  // Function to format crypto symbol for TradingView
  const formatSymbolForTradingView = (cryptoSymbol: string): string => {
    // Common mappings for popular cryptocurrencies
    const symbolMap: Record<string, string> = {
      bitcoin: "BINANCE:BTCUSDT",
      ethereum: "BINANCE:ETHUSDT",
      ripple: "BINANCE:XRPUSDT",
      litecoin: "BINANCE:LTCUSDT",
      cardano: "BINANCE:ADAUSDT",
      polkadot: "BINANCE:DOTUSDT",
      dogecoin: "BINANCE:DOGEUSDT",
      solana: "BINANCE:SOLUSDT",
      tether: "BINANCE:USDTUSDC",
      binancecoin: "BINANCE:BNBUSDT",
      "usd-coin": "BINANCE:USDCUSDT",
      xrp: "BINANCE:XRPUSDT",
      "binance-usd": "BINANCE:BUSDUSDT",
      "avalanche-2": "BINANCE:AVAXUSDT",
      "matic-network": "BINANCE:MATICUSDT",
      "shiba-inu": "BINANCE:SHIBUSDT",
      dai: "BINANCE:DAIUSDT",
      tron: "BINANCE:TRXUSDT",
      uniswap: "BINANCE:UNIUSDT",
      // დამატებითი კრიპტოვალუტები
      "bitcoin-cash": "BINANCE:BCHUSDT",
      chainlink: "BINANCE:LINKUSDT",
      stellar: "BINANCE:XLMUSDT",
      cosmos: "BINANCE:ATOMUSDT",
      algorand: "BINANCE:ALGOUSDT",
      filecoin: "BINANCE:FILUSDT",
      vechain: "BINANCE:VETUSDT",
      "theta-token": "BINANCE:THETAUSDT",
      aave: "BINANCE:AAVEUSDT",
      monero: "BINANCE:XMRUSDT",
      eos: "BINANCE:EOSUSDT",
      neo: "BINANCE:NEOUSDT",
      iota: "BINANCE:IOTAUSDT",
      dash: "BINANCE:DASHUSDT",
      maker: "BINANCE:MKRUSDT",
      "compound-governance-token": "BINANCE:COMPUSDT",
      zcash: "BINANCE:ZECUSDT",
      decentraland: "BINANCE:MANAUSDT",
      "the-sandbox": "BINANCE:SANDUSDT",
      "axie-infinity": "BINANCE:AXSUSDT",
    }

    // თუ სიმბოლო არსებობს რუკაში, დავაბრუნოთ შესაბამისი ფორმატი
    if (symbolMap[cryptoSymbol.toLowerCase()]) {
      return symbolMap[cryptoSymbol.toLowerCase()]
    }

    // თუ არ არსებობს, ვცადოთ სხვადასხვა ფორმატები
    const formats = [
      `BINANCE:${cryptoSymbol.toUpperCase()}USDT`,
      `COINBASE:${cryptoSymbol.toUpperCase()}USD`,
      `KRAKEN:${cryptoSymbol.toUpperCase()}USD`,
      `BITSTAMP:${cryptoSymbol.toUpperCase()}USD`,
    ]

    // დავაბრუნოთ პირველი ფორმატი (BINANCE)
    return formats[0]
  }

  // Fallback content if script fails to load or chart has error
  if (scriptError || chartError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg p-4">
        <div className="text-center">
          <p className="text-red-400 mb-2">ჩარტის ჩატვირთვა ვერ მოხერხდა</p>
          <p className="text-gray-400 text-sm mb-4">გთხოვთ, შეამოწმოთ ინტერნეტ კავშირი და სცადოთ თავიდან</p>
          <button onClick={onError} className="px-4 py-2 bg-blue-900 hover:bg-blue-800 rounded-lg text-white">
            <i className="fas fa-sync-alt mr-2"></i> თავიდან ცდა
          </button>
        </div>
      </div>
    )
  }

  return <div ref={containerRef} className="w-full h-full" />
}
