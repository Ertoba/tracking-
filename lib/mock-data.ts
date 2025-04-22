export function generateMockData(page = 1, perPage = 100) {
  console.log(`Generating mock data for page ${page} as last resort`)

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
    // დამატებითი მოდელირებული მონაცემები
  ]

  // გენერირება 500 მოდელირებული კრიპტოვალუტისთვის
  const allMockCoins = Array.from({ length: 500 }, (_, i) => {
    if (i < mockCoins.length) {
      return mockCoins[i]
    }
    return {
      id: `mock-coin-${i + 1}`,
      symbol: `mc${i + 1}`,
      name: `Mock Coin ${i + 1}`,
    }
  })

  // პაგინაციის გათვალისწინება
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  const pageCoins = allMockCoins.slice(startIndex, endIndex)

  return pageCoins.map((coin, index) => {
    const basePrice = index === 0 ? 50000 : index === 1 ? 3000 : 1000 / (index + 1)
    const changePercent = Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)
    const rank = startIndex + index + 1

    return {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: `/placeholder.svg?height=32&width=32`,
      current_price: basePrice,
      market_cap: basePrice * 1000000 * (500 - rank),
      market_cap_rank: rank,
      total_volume: basePrice * 500000 * (250 - Math.min(rank, 249)),
      high_24h: basePrice * (1 + Math.abs(changePercent) / 100),
      low_24h: basePrice * (1 - Math.abs(changePercent) / 100),
      price_change_percentage_24h: changePercent,
      market_cap_change_percentage_24h: changePercent,
      circulating_supply: 1000000 * (500 - rank),
      total_supply: 1000000 * (550 - rank),
      max_supply: rank < 250 ? 1000000 * (600 - rank) : null,
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
