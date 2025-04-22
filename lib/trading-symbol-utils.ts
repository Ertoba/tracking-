// Common cryptocurrency name to ticker symbol mapping
const coinNameToSymbol: Record<string, string> = {
  // Major cryptocurrencies
  bitcoin: "BTC",
  ethereum: "ETH",
  ripple: "XRP",
  litecoin: "LTC",
  "bitcoin-cash": "BCH",
  cardano: "ADA",
  polkadot: "DOT",
  stellar: "XLM",
  chainlink: "LINK",
  binancecoin: "BNB",
  tether: "USDT",
  monero: "XMR",
  dogecoin: "DOGE",
  tron: "TRX",
  eos: "EOS",
  cosmos: "ATOM",
  iota: "IOTA",
  vechain: "VET",
  theta: "THETA",
  neo: "NEO",
  aave: "AAVE",
  maker: "MKR",
  compound: "COMP",
  uniswap: "UNI",
  solana: "SOL",
  avalanche: "AVAX",
  polygon: "MATIC",
  algorand: "ALGO",
  filecoin: "FIL",
  tezos: "XTZ",
  dash: "DASH",
  zcash: "ZEC",
  decred: "DCR",
  kusama: "KSM",
  near: "NEAR",
  fantom: "FTM",
  harmony: "ONE",
  elrond: "EGLD",
  waves: "WAVES",
  "hedera-hashgraph": "HBAR",
  "the-graph": "GRT",
  sushiswap: "SUSHI",
  pancakeswap: "CAKE",
  terra: "LUNA",
  chiliz: "CHZ",
  enjin: "ENJ",
  decentraland: "MANA",
  "the-sandbox": "SAND",
  "axie-infinity": "AXS",
  "shiba-inu": "SHIB",
  "usd-coin": "USDC",
  dai: "DAI",
  "wrapped-bitcoin": "WBTC",
  "binance-usd": "BUSD",
  "true-usd": "TUSD",
  "paxos-standard": "PAX",
  "huobi-token": "HT",
  "ftx-token": "FTT",
  "kucoin-token": "KCS",
  okb: "OKB",
  "crypto-com-chain": "CRO",
  "leo-token": "LEO",
  quant: "QNT",
  "internet-computer": "ICP",
  flow: "FLOW",
  "theta-fuel": "TFUEL",
  "basic-attention-token": "BAT",
  "0x": "ZRX",
  loopring: "LRC",
  "kyber-network": "KNC",
  "synthetix-network-token": "SNX",
  "yearn-finance": "YFI",
  "curve-dao-token": "CRV",
  balancer: "BAL",
  bancor: "BNT",
  ren: "REN",
  "reserve-rights": "RSR",
  numeraire: "NMR",
  uma: "UMA",
  thorchain: "RUNE",
  kava: "KAVA",
  "nervos-network": "CKB",
  icon: "ICX",
  ontology: "ONT",
  qtum: "QTUM",
  zilliqa: "ZIL",
  ravencoin: "RVN",
  horizen: "ZEN",
  "bitcoin-gold": "BTG",
  "bitcoin-diamond": "BCD",
  "bitcoin-sv": "BSV",
  "ethereum-classic": "ETC",
  "omg-network": "OMG",
  augur: "REP",
  status: "SNT",
  golem: "GLM",
  aragon: "ANT",
  district0x: "DNT",
  civic: "CVC",
  storj: "STORJ",
  siacoin: "SC",
  digibyte: "DGB",
  verge: "XVG",
  nano: "NANO",
  steem: "STEEM",
  hive: "HIVE",
  wax: "WAXP",
  stratis: "STRAX",
  ardor: "ARDR",
  komodo: "KMD",
  ark: "ARK",
  lisk: "LSK",
  nem: "XEM",
  iost: "IOST",
  holo: "HOT",
  grin: "GRIN",
  beam: "BEAM",
  mina: "MINA",
  helium: "HNT",
  arweave: "AR",
  celo: "CELO",
  "terra-luna": "LUNA",
  "terra-luna-classic": "LUNC",
  apecoin: "APE",
  stepn: "GMT",
  optimism: "OP",
  arbitrum: "ARB",
  "immutable-x": "IMX",
  "render-token": "RNDR",
  "fetch-ai": "FET",
  "conflux-network": "CFX",
  "mask-network": "MASK",
  gala: "GALA",
  "injective-protocol": "INJ",
  sui: "SUI",
  aptos: "APT",
  starknet: "STRK",
  "sei-network": "SEI",
  celestia: "TIA",
  mantle: "MNT",
  base: "BASE",
  blast: "BLAST",
  zksync: "ZKS",
  scroll: "SCRL",
  linea: "LINEA",
  "manta-network": "MANTA",
  taiko: "TAIKO",
  mode: "MODE",
  metis: "METIS",
  zkfair: "ZKF",
  pepe: "PEPE",
  bonk: "BONK",
  floki: "FLOKI",
  worldcoin: "WLD",
  "friend-tech": "FT",
  jupiter: "JUP",
  jito: "JTO",
  "pyth-network": "PYTH",
  raydium: "RAY",
  serum: "SRM",
  solend: "SLND",
  marinade: "MNDE",
  "kamino-finance": "KMNO",
  "drift-protocol": "DRIFT",
  "mango-markets": "MNGO",
  orca: "ORCA",
  "star-atlas": "ATLAS",
  "star-atlas-dao": "POLIS",
  samoyedcoin: "SAMO",
  bonfida: "FIDA",
  "step-finance": "STEP",
  solanium: "SLIM",
  "solrise-finance": "SLRS",
  "mercurial-finance": "MER",
  saber: "SBR",
  "sunny-aggregator": "SUNNY",
  "parrot-protocol": "PRT",
  "port-finance": "PORT",
  "solape-finance": "SOLAPE",
  wormhole: "W",
  allbridge: "ABR",
  "lido-dao": "LDO",
  "rocket-pool": "RPL",
  frax: "FRAX",
  "frax-share": "FXS",
  "frax-ether": "FRXETH",
  "staked-frax-ether": "SFRXETH",
  "staked-ether": "STETH",
  "wrapped-staked-ether": "WSTETH",
  "rocket-pool-eth": "RETH",
  "coinbase-wrapped-staked-eth": "CBETH",
  "frax-ether": "FRXETH",
  "staked-frax-ether": "SFRXETH",
  stakewise: "SWISE",
  "stakewise-eth2": "SETH2",
  "stakewise-reward-eth2": "RETH2",
  ankr: "ANKR",
  "ankr-staked-eth": "ANKRAETH",
  "liquid-staking-derivative": "LSD",
  pendle: "PENDLE",
  stride: "STRD",
  dydx: "DYDX",
  gmx: "GMX",
  "gains-network": "GNS",
  "vela-exchange": "VELA",
  "level-finance": "LVL",
  hyperliquid: "HLP",
  synthetix: "SNX",
  "perpetual-protocol": "PERP",
  cap: "CAP",
  kwenta: "KWENTA",
  "lyra-finance": "LYRA",
  thales: "THALES",
  "polynomial-protocol": "POLY",
  dopex: "DPX",
  "jones-dao": "JONES",
  premia: "PREMIA",
  opyn: "OSQTH",
  "ribbon-finance": "RBN",
  friktion: "FRK",
  "zeta-markets": "ZETA",
  "rage-trade": "RAGE",
  "vertex-protocol": "VRTX",
  aevo: "AEVO",
  ordinals: "ORDI",
  "bitcoin-cats": "CATS",
  runes: "RUNE",
  atomicals: "ATOM",
  stamps: "STAMP",
  "taproot-wizards": "WIZARD",
  bitmap: "BITMAP",
  doginals: "DOGI",
  ethscriptions: "ETHSCRIPTIONS",
  ethena: "ENA",
  pyusd: "PYUSD",
  "first-digital-usd": "FDUSD",
  "euro-coin": "EUROC",
  "pax-gold": "PAXG",
  "tether-gold": "XAUT",
  "wrapped-bitcoin": "WBTC",
  "wrapped-ethereum": "WETH",
  "wrapped-solana": "WSOL",
  "wrapped-avalanche": "WAVAX",
  "wrapped-fantom": "WFTM",
  "wrapped-matic": "WMATIC",
  "wrapped-near": "WNEAR",
  "wrapped-tron": "WTRX",
  "wrapped-hbar": "WHBAR",
  "wrapped-celo": "WCELO",
  "wrapped-kava": "WKAVA",
  "wrapped-oasis": "WROSE",
  "wrapped-harmony": "WONE",
  "wrapped-elrond": "WEGLD",
  "wrapped-icon": "WICX",
  "wrapped-ontology": "WONT",
  "wrapped-qtum": "WQTUM",
  "wrapped-zilliqa": "WZIL",
  "wrapped-cosmos": "WATOM",
  "wrapped-polkadot": "WDOT",
  "wrapped-kusama": "WKSM",
  "wrapped-algorand": "WALGO",
  "wrapped-tezos": "WXTZ",
  "wrapped-filecoin": "WFIL",
  "wrapped-flow": "WFLOW",
  "wrapped-iota": "WMIOTA",
  "wrapped-theta": "WTHETA",
  "wrapped-neo": "WNEO",
  "wrapped-vechain": "WVET",
  "wrapped-waves": "WWAVES",
  "wrapped-dash": "WDASH",
  "wrapped-zcash": "WZEC",
  "wrapped-decred": "WDCR",
  "wrapped-eos": "WEOS",
  "wrapped-stellar": "WXLM",
  "wrapped-cardano": "WADA",
  "wrapped-ripple": "WXRP",
  "wrapped-litecoin": "WLTC",
  "wrapped-bitcoin-cash": "WBCH",
  "wrapped-ethereum-classic": "WETC",
  "wrapped-monero": "WXMR",
  "wrapped-dogecoin": "WDOGE",
  "wrapped-tron": "WTRX",
  "wrapped-chainlink": "WLINK",
  "wrapped-uniswap": "WUNI",
  "wrapped-aave": "WAAVE",
  "wrapped-maker": "WMKR",
  "wrapped-compound": "WCOMP",
  "wrapped-synthetix": "WSNX",
  "wrapped-yearn-finance": "WYFI",
  "wrapped-curve-dao-token": "WCRV",
  "wrapped-balancer": "WBAL",
  "wrapped-bancor": "WBNT",
  "wrapped-ren": "WREN",
  "wrapped-uma": "WUMA",
  "wrapped-thorchain": "WRUNE",
  "wrapped-kava": "WKAVA",
  "wrapped-nervos-network": "WCKB",
  "wrapped-icon": "WICX",
  "wrapped-ontology": "WONT",
  "wrapped-qtum": "WQTUM",
  "wrapped-zilliqa": "WZIL",
  "wrapped-ravencoin": "WRVN",
  "wrapped-horizen": "WZEN",
  "wrapped-bitcoin-gold": "WBTG",
  "wrapped-bitcoin-diamond": "WBCD",
  "wrapped-bitcoin-sv": "WBSV",
  "wrapped-omg-network": "WOMG",
  "wrapped-augur": "WREP",
  "wrapped-status": "WSNT",
  "wrapped-golem": "WGLM",
  "wrapped-aragon": "WANT",
  "wrapped-district0x": "WDNT",
  "wrapped-civic": "WCVC",
  "wrapped-storj": "WSTORJ",
  "wrapped-siacoin": "WSC",
  "wrapped-digibyte": "WDGB",
  "wrapped-verge": "WXVG",
  "wrapped-nano": "WNANO",
  "wrapped-steem": "WSTEEM",
  "wrapped-hive": "WHIVE",
  "wrapped-wax": "WWAXP",
  "wrapped-stratis": "WSTRAX",
  "wrapped-ardor": "WARDR",
  "wrapped-komodo": "WKMD",
  "wrapped-ark": "WARK",
  "wrapped-lisk": "WLSK",
  "wrapped-nem": "WXEM",
  "wrapped-iost": "WIOST",
  "wrapped-holo": "WHOT",
  "wrapped-grin": "WGRIN",
  "wrapped-beam": "WBEAM",
  "wrapped-mina": "WMINA",
  "wrapped-helium": "WHNT",
  "wrapped-arweave": "WAR",
  "wrapped-celo": "WCELO",
  "wrapped-terra-luna": "WLUNA",
  "wrapped-terra-luna-classic": "WLUNC",
  "wrapped-apecoin": "WAPE",
  "wrapped-stepn": "WGMT",
  "wrapped-optimism": "WOP",
  "wrapped-arbitrum": "WARB",
  "wrapped-immutable-x": "WIMX",
  "wrapped-render-token": "WRNDR",
  "wrapped-fetch-ai": "WFET",
  "wrapped-conflux-network": "WCFX",
  "wrapped-mask-network": "WMASK",
  "wrapped-gala": "WGALA",
  "wrapped-injective-protocol": "WINJ",
  "wrapped-sui": "WSUI",
  "wrapped-aptos": "WAPT",
  "wrapped-starknet": "WSTRK",
  "wrapped-sei-network": "WSEI",
  "wrapped-celestia": "WTIA",
  "wrapped-mantle": "WMNT",
  "wrapped-base": "WBASE",
  "wrapped-blast": "WBLAST",
  "wrapped-zksync": "WZKS",
  "wrapped-scroll": "WSCRL",
  "wrapped-linea": "WLINEA",
  "wrapped-manta-network": "WMANTA",
  "wrapped-taiko": "WTAIKO",
  "wrapped-mode": "WMODE",
  "wrapped-metis": "WMETIS",
  "wrapped-zkfair": "WZKF",
  "wrapped-pepe": "WPEPE",
  "wrapped-bonk": "WBONK",
  "wrapped-floki": "WFLOKI",
  "wrapped-worldcoin": "WWLD",
  "wrapped-friend-tech": "WFT",
  "wrapped-jupiter": "WJUP",
  "wrapped-jito": "WJTO",
  "wrapped-pyth-network": "WPYTH",
  "wrapped-raydium": "WRAY",
  "wrapped-serum": "WSRM",
  "wrapped-solend": "WSLND",
  "wrapped-marinade": "WMNDE",
  "wrapped-kamino-finance": "WKMNO",
  "wrapped-drift-protocol": "WDRIFT",
  "wrapped-mango-markets": "WMNGO",
  "wrapped-orca": "WORCA",
  "wrapped-star-atlas": "WATLAS",
  "wrapped-star-atlas-dao": "WPOLIS",
  "wrapped-samoyedcoin": "WSAMO",
  "wrapped-bonfida": "WFIDA",
  "wrapped-step-finance": "WSTEP",
  "wrapped-solanium": "WSLIM",
  "wrapped-solrise-finance": "WSLRS",
  "wrapped-mercurial-finance": "WMER",
  "wrapped-saber": "WSBR",
  "wrapped-sunny-aggregator": "WSUNNY",
  "wrapped-parrot-protocol": "WPRT",
  "wrapped-port-finance": "WPORT",
  "wrapped-solape-finance": "WSOLAPE",
  "wrapped-wormhole": "WW",
  "wrapped-allbridge": "WABR",
  "wrapped-lido-dao": "WLDO",
  "wrapped-rocket-pool": "WRPL",
  "wrapped-frax": "WFRAX",
  "wrapped-frax-share": "WFXS",
  "wrapped-frax-ether": "WFRXETH",
  "wrapped-staked-frax-ether": "WSFRXETH",
  "wrapped-staked-ether": "WSTETH",
  "wrapped-wrapped-staked-ether": "WWSTETH",
  "wrapped-rocket-pool-eth": "WRETH",
  "wrapped-coinbase-wrapped-staked-eth": "WCBETH",
  "wrapped-frax-ether": "WFRXETH",
  "wrapped-staked-frax-ether": "WSFRXETH",
  "wrapped-stakewise": "WSWISE",
  "wrapped-stakewise-eth2": "WSETH2",
  "wrapped-stakewise-reward-eth2": "WRETH2",
  "wrapped-ankr": "WANKR",
  "wrapped-ankr-staked-eth": "WANKRAETH",
  "wrapped-liquid-staking-derivative": "WLSD",
  "wrapped-pendle": "WPENDLE",
  "wrapped-stride": "WSTRD",
  "wrapped-dydx": "WDYDX",
  "wrapped-gmx": "WGMX",
  "wrapped-gains-network": "WGNS",
  "wrapped-vela-exchange": "WVELA",
  "wrapped-level-finance": "WLVL",
  "wrapped-hyperliquid": "WHLP",
  "wrapped-synthetix": "WSNX",
  "wrapped-perpetual-protocol": "WPERP",
  "wrapped-cap": "WCAP",
  "wrapped-kwenta": "WKWENTA",
  "wrapped-lyra-finance": "WLYRA",
  "wrapped-thales": "WTHALES",
  "wrapped-polynomial-protocol": "WPOLY",
  "wrapped-dopex": "WDPX",
  "wrapped-jones-dao": "WJONES",
  "wrapped-premia": "WPREMIA",
  "wrapped-opyn": "WOSQTH",
  "wrapped-ribbon-finance": "WRBN",
  "wrapped-friktion": "WFRK",
  "wrapped-zeta-markets": "WZETA",
  "wrapped-rage-trade": "WRAGE",
  "wrapped-vertex-protocol": "WVRTX",
  "wrapped-aevo": "WAEVO",
  "wrapped-ordinals": "WORDI",
  "wrapped-bitcoin-cats": "WCATS",
  "wrapped-runes": "WRUNE",
  "wrapped-atomicals": "WATOM",
  "wrapped-stamps": "WSTAMP",
  "wrapped-taproot-wizards": "WWIZARD",
  "wrapped-bitmap": "WBITMAP",
  "wrapped-doginals": "WDOGI",
  "wrapped-ethscriptions": "WETHSCRIPTIONS",
  "wrapped-ethena": "WENA",
  "wrapped-pyusd": "WPYUSD",
  "wrapped-first-digital-usd": "WFDUSD",
  "wrapped-euro-coin": "WEUROC",
  "wrapped-pax-gold": "WPAXG",
  "wrapped-tether-gold": "WXAUT",
}

// Common quote currencies
const quoteCurrencies = [
  "USD",
  "USDT",
  "USDC",
  "BUSD",
  "DAI",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "KRW",
  "BTC",
  "ETH",
  "BNB",
]

// Exchanges to check in order of preference
const exchanges = [
  "BINANCE",
  "COINBASE",
  "KRAKEN",
  "BITFINEX",
  "KUCOIN",
  "HUOBI",
  "BYBIT",
  "OKEX",
  "GEMINI",
  "BITSTAMP",
]

// Function to get symbol mapping for TradingView
export function getTradingViewSymbol(cryptoId: string): string {
  // Handle standard trading pair format (BTC/USDT)
  if (cryptoId.includes("/")) {
    const [base, quote] = cryptoId.split("/")
    if (base && quote) {
      return `BINANCE:${base.toUpperCase()}${quote.toUpperCase()}`
    }
  }

  // If it's already a ticker symbol (3-5 chars, all uppercase)
  if (/^[A-Z0-9]{2,5}$/.test(cryptoId)) {
    return `BINANCE:${cryptoId}USDT`
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
    // Add more common mappings here
  }

  // Check if we have a direct mapping
  if (symbolMap[cryptoId.toLowerCase()]) {
    return `BINANCE:${symbolMap[cryptoId.toLowerCase()]}`
  }

  // If it's USDT, use USDC pair
  if (cryptoId.toUpperCase() === "USDT" || cryptoId.toUpperCase() === "TETHER") {
    return "BINANCE:USDTUSDC"
  }

  // Try to get symbol from our comprehensive mapping
  const symbol = coinNameToSymbol[cryptoId.toLowerCase()]
  if (symbol) {
    return `BINANCE:${symbol}USDT`
  }

  // Try to extract symbol from cryptoId (for CoinGecko IDs)
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

/**
 * Handles a single coin name and returns a TradingView symbol
 * @param coin - The coin name or symbol
 * @returns A valid TradingView symbol
 */
function handleSingleCoin(coin: string): string {
  const symbol = getSymbolFromCoin(coin)
  if (!symbol) return "BINANCE:BTCUSDT"

  // Default to USDT pair
  return `BINANCE:${symbol}USDT`
}

/**
 * Gets the ticker symbol from a coin name
 * @param coin - The coin name or symbol
 * @returns The ticker symbol or null if not found
 */
function getSymbolFromCoin(coin: string): string | null {
  const normalizedCoin = coin.toLowerCase().trim()

  // Check if it's already a symbol (3-5 characters, all uppercase)
  if (/^[A-Za-z0-9]{2,5}$/.test(coin)) {
    return coin.toUpperCase()
  }

  // Check in our mapping
  if (coinNameToSymbol[normalizedCoin]) {
    return coinNameToSymbol[normalizedCoin]
  }

  // Try to extract from hyphenated names
  if (normalizedCoin.includes("-")) {
    const parts = normalizedCoin.split("-")
    // Use the first part as the symbol
    return parts[0].toUpperCase()
  }

  // If all else fails, just uppercase the first 3-4 chars
  if (normalizedCoin.length >= 3) {
    return normalizedCoin.substring(0, Math.min(4, normalizedCoin.length)).toUpperCase()
  }

  return null
}

/**
 * Checks if a trading pair exists on a specific exchange
 * In a real implementation, this would check against an API or database
 * @param exchange - The exchange name
 * @param symbol - The trading pair symbol
 * @returns True if the pair exists on the exchange
 */
function pairExistsOnExchange(exchange: string, symbol: string): boolean {
  // In a real implementation, this would check against an API or database
  // For now, we'll just return true for common  this would check against an API or database
  // For now, we'll just return true for common pairs
  return true
}

/**
 * Validates if a symbol is a valid trading pair
 * @param symbol - The trading pair symbol
 * @returns True if the symbol is valid
 */
function isValidTradingPair(symbol: string): boolean {
  // Check if the symbol follows the expected format
  if (!symbol || symbol.length < 5) return false

  // Extract base and quote from the symbol
  const baseLength = symbol.length - 4 // Assuming quote is 4 chars like USDT
  const base = symbol.substring(0, baseLength)
  const quote = symbol.substring(baseLength)

  // Check if quote is a known currency
  return quoteCurrencies.some((q) => q.toUpperCase() === quote)
}

/**
 * Gets all available exchanges for a trading pair
 * @param symbol - The trading pair symbol
 * @returns Array of exchanges that support the pair
 */
export function getAvailableExchanges(symbol: string): string[] {
  if (!isValidTradingPair(symbol)) return []

  // In a real implementation, this would check each exchange
  // For now, we'll just return the top exchanges
  return exchanges.filter((exchange) => pairExistsOnExchange(exchange, symbol))
}
