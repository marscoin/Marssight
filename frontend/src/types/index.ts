// Block types
export interface Block {
  hash: string
  height: number
  confirmations: number
  size: number
  time: number
  txlength: number
  poolInfo?: {
    poolName: string
    url: string
  }
  previousblockhash?: string
  nextblockhash?: string
  merkleroot: string
  difficulty: number
  bits: string
  version: number
  nonce: number
  reward: number
  isMainChain: boolean
  tx: string[]
}

export interface BlockSummary {
  hash: string
  height: number
  time: number
  txlength: number
  size: number
  poolInfo?: {
    poolName: string
    url: string
  }
}

// Transaction types
export interface Transaction {
  txid: string
  version: number
  locktime: number
  size: number
  blockhash?: string
  blockheight?: number
  blocktime?: number
  confirmations: number
  time: number
  valueOut: number
  valueIn: number
  fees: number
  vin: TransactionInput[]
  vout: TransactionOutput[]
}

export interface TransactionInput {
  txid?: string
  vout?: number
  scriptSig?: {
    hex: string
    asm: string
  }
  sequence: number
  n: number
  addr?: string
  value?: number
  coinbase?: string
}

export interface TransactionOutput {
  value: number
  n: number
  scriptPubKey: {
    hex: string
    asm: string
    addresses?: string[]
    type: string
  }
  spentTxId?: string
  spentIndex?: number
  spentHeight?: number
}

export interface TransactionSummary {
  txid: string
  valueOut: number
  fees: number
  time?: number
}

// Address types
export interface Address {
  addrStr: string
  balance: number
  balanceSat: number
  totalReceived: number
  totalReceivedSat: number
  totalSent: number
  totalSentSat: number
  unconfirmedBalance: number
  unconfirmedBalanceSat: number
  unconfirmedTxApperances: number
  txApperances: number
  transactions: string[]
}

// Status types
export interface SyncStatus {
  status: 'syncing' | 'finished' | 'error'
  blockChainHeight: number
  syncPercentage: number
  height: number
  error: string | null
  type: string
  startTs: number
  endTs: number | null
}

export interface StatusInfo {
  info: {
    version: number
    protocolversion: number
    blocks: number
    timeoffset: number
    connections: number
    proxy: string
    difficulty: number
    testnet: boolean
    relayfee: number
    errors: string
    network: string
    subversion: string
    localservices: string
  }
}

export interface PeerStatus {
  connected: boolean
  host: string
  port: string
}

// Price types
export interface PriceData {
  status: {
    timestamp: string
    error_code: number
    error_message: string | null
    elapsed: number
    credit_count: number
    notice: string | null
  }
  data: {
    id: number
    name: string
    symbol: string
    slug: string
    num_market_pairs: number
    date_added: string
    tags: string[]
    max_supply: number
    circulating_supply: number
    total_supply: number
    is_active: number
    infinite_supply: boolean
    cmc_rank: number
    is_fiat: number
    self_reported_circulating_supply: number
    self_reported_market_cap: number
    last_updated: string
    quote: {
      USD: {
        price: number
        volume_24h: number
        volume_change_24h: number
        percent_change_1h: number
        percent_change_24h: number
        percent_change_7d: number
        percent_change_30d: number
        percent_change_60d: number
        percent_change_90d: number
        market_cap: number
        market_cap_dominance: number
        fully_diluted_market_cap: number
        last_updated: string
      }
    }
  }
}

// WebSocket event types
export interface SocketBlock {
  hash: string
  height: number
  time: number
  txlength: number
  size: number
  poolInfo?: {
    poolName: string
    url: string
  }
}

export interface SocketTransaction {
  txid: string
  valueOut: number
  fees: number
}
