"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { loadTradingViewScript } from "@/lib/tradingview-loader"
import { getTradingViewSymbol } from "@/lib/trading-symbol-utils"

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
  const [initAttempts, setInitAttempts] = useState(0)
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxAttempts = 3

  // Generate a unique container ID for this instance
  const containerId = useRef(`tradingview-widget-${symbol}-${interval}-${Date.now()}`)

  // Load TradingView script
  useEffect(() => {
    if (!scriptLoaded && !scriptError) {
      loadTradingViewScript()
        .then(() => {
          console.log("TradingView script loaded successfully")
          setScriptLoaded(true)
        })
        .catch((error) => {
          console.error("Failed to load TradingView script:", error)
          setScriptError(true)
          if (onError) onError()
        })
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
    }
  }, [scriptLoaded, scriptError, onError])

  // Clean up widget when visibility changes or component unmounts
  useEffect(() => {
    if (!isVisible && widgetRef.current) {
      console.log("Modal closed or hidden, cleaning up TradingView widget")
      widgetRef.current = null
    }

    return () => {
      // Clean up widget when component unmounts
      if (widgetRef.current) {
        try {
          console.log("Component unmounting, cleaning up TradingView widget")
          widgetRef.current = null
        } catch (e) {
          console.error("Error cleaning up TradingView widget:", e)
        }
      }
    }
  }, [isVisible])

  // Initialize chart with retry mechanism
  const initializeChart = useCallback(() => {
    // Don't initialize if not visible or widget already exists
    if (!isVisible || !containerRef.current || !scriptLoaded || !window.TradingView) {
      console.log("Cannot initialize chart: conditions not met", {
        isVisible,
        hasContainer: !!containerRef.current,
        scriptLoaded,
        hasTradingView: typeof window !== "undefined" && !!window.TradingView,
      })
      return false
    }

    // If widget already exists, don't reinitialize
    if (widgetRef.current) {
      console.log("Widget already exists, skipping initialization")
      return true
    }

    try {
      console.log(`Initializing chart for ${symbol}, attempt ${initAttempts + 1}/${maxAttempts}`)

      // Format symbol for TradingView using our utility
      let formattedSymbol
      try {
        // Use the symbol directly if it's already a ticker symbol (like BTC, ETH)
        if (symbol.length <= 5 && symbol === symbol.toUpperCase()) {
          formattedSymbol = `BINANCE:${symbol}USDT`
        } else {
          // Otherwise, convert from coin ID to ticker symbol
          formattedSymbol = getTradingViewSymbol(symbol)
        }
        console.log(`Formatted symbol: ${formattedSymbol}`)
      } catch (error) {
        console.error("Error formatting symbol:", error)
        formattedSymbol = "BINANCE:BTCUSDT" // Default fallback
      }

      // Ensure container has proper dimensions
      if (containerRef.current.clientWidth === 0 || containerRef.current.clientHeight === 0) {
        console.warn("Chart container has zero dimensions, retrying...")
        return false
      }

      // Set container ID if not already set
      if (!containerRef.current.id) {
        containerRef.current.id = containerId.current
      }

      console.log(`Creating widget with container ID: ${containerRef.current.id}`)

      // Create new widget
      try {
        widgetRef.current = new window.TradingView.widget({
          container_id: containerRef.current.id,
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
        return false
      }

      // Set a timeout to detect if chart fails to load
      loadTimeoutRef.current = setTimeout(() => {
        // Check if chart is still loading
        const chartElement = document.querySelector(`#${containerRef.current?.id} iframe`)
        if (!chartElement || chartElement.clientHeight < 100) {
          console.error("Chart failed to load properly")
          setChartError(true)
          if (onError) onError()
        }
      }, 5000)

      return true
    } catch (error) {
      console.error("Error creating TradingView widget:", error)
      setChartError(true)
      if (onError) onError()
      return false
    }
  }, [symbol, interval, theme, height, isVisible, scriptLoaded, initAttempts, maxAttempts, onError])

  // Create widget when script is loaded and component is visible
  useEffect(() => {
    // Reset chart error state on new attempt
    setChartError(false)

    if (isVisible && scriptLoaded && initAttempts < maxAttempts && !widgetRef.current) {
      // Add a small delay to ensure the modal is fully visible and sized
      const timer = setTimeout(() => {
        const success = initializeChart()

        if (!success && initAttempts < maxAttempts - 1) {
          console.log(`Chart initialization failed, retrying... (${initAttempts + 1}/${maxAttempts})`)
          setInitAttempts((prev) => prev + 1)
        } else if (!success) {
          console.error("Max chart initialization attempts reached")
          setChartError(true)
          if (onError) onError()
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isVisible, scriptLoaded, initAttempts, maxAttempts, initializeChart, onError])

  // Reset attempts when symbol or interval changes
  useEffect(() => {
    setInitAttempts(0)
    setChartError(false)

    // Generate a new container ID when symbol or interval changes
    containerId.current = `tradingview-widget-${symbol}-${interval}-${Date.now()}`

    // Reset widget reference to force reinitialization
    widgetRef.current = null

    if (containerRef.current) {
      containerRef.current.id = containerId.current
    }
  }, [symbol, interval])

  // Fallback content if script fails to load or chart has error
  if (scriptError || chartError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg p-4">
        <div className="text-center">
          <p className="text-red-400 mb-2">ჩარტის ჩატვირთვა ვერ მოხერხდა</p>
          <p className="text-gray-400 text-sm mb-4">გთხოვთ, შეამოწმოთ ინტერნეტ კავშირი და სცადოთ თავიდან</p>
          <button
            onClick={() => {
              setChartError(false)
              setInitAttempts(0)
              widgetRef.current = null
              if (onError) onError()
            }}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 rounded-lg text-white"
          >
            <i className="fas fa-sync-alt mr-2"></i> თავიდან ცდა
          </button>
        </div>
      </div>
    )
  }

  // Loading state
  if (!scriptLoaded || !isVisible) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg p-4">
        <div className="text-center">
          <div className="loading-spinner-inner mb-4"></div>
          <p className="text-gray-400">ჩარტი იტვირთება...</p>
        </div>
      </div>
    )
  }

  return <div ref={containerRef} id={containerId.current} className="w-full h-full" />
}
