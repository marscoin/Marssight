import type {
  Block,
  BlockSummary,
  Transaction,
  Address,
  SyncStatus,
  StatusInfo,
  PeerStatus,
  PriceData,
} from '../types'

const API_BASE = import.meta.env.VITE_API_URL || '/api'
const PRICE_API = '/price-api/json/'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Block APIs
export async function getBlocks(
  limit: number = 10,
  since?: string
): Promise<{ blocks: BlockSummary[]; length: number; pagination: { current: string; next: string; prev: string } }> {
  const params = new URLSearchParams({ limit: limit.toString() })
  if (since) params.append('blockDate', since)
  return fetchJson(`${API_BASE}/blocks?${params}`)
}

export async function getBlock(hashOrHeight: string): Promise<Block> {
  return fetchJson(`${API_BASE}/block/${hashOrHeight}`)
}

export async function getBlockHash(height: number): Promise<{ blockHash: string }> {
  return fetchJson(`${API_BASE}/block-index/${height}`)
}

export async function getLatestBlocks(count: number = 10): Promise<BlockSummary[]> {
  // First try the normal blocks endpoint
  const result = await getBlocks(count)
  if (result.blocks.length > 0) {
    return result.blocks
  }

  // During sync, blocks endpoint returns empty - fetch by height instead
  try {
    const syncStatus = await getSyncStatus()
    if (!syncStatus.height || syncStatus.height < 1) {
      return []
    }

    const blocks: BlockSummary[] = []
    for (let i = 0; i < count && syncStatus.height - i > 0; i++) {
      try {
        const { blockHash } = await getBlockHash(syncStatus.height - i)
        const block = await getBlock(blockHash)
        blocks.push({
          hash: block.hash,
          height: block.height,
          time: block.time,
          txlength: block.nTx || block.tx?.length || 0,
          size: block.size,
          poolInfo: block.poolInfo,
        })
      } catch {
        break // Stop if we can't fetch more blocks
      }
    }
    return blocks
  } catch {
    return []
  }
}

// Transaction APIs
export async function getTransaction(txid: string): Promise<Transaction> {
  return fetchJson(`${API_BASE}/tx/${txid}`)
}

export async function getTransactions(
  blockHash?: string,
  address?: string,
  page: number = 0
): Promise<{ pagesTotal: number; txs: Transaction[] }> {
  const params = new URLSearchParams({ pageNum: page.toString() })
  if (blockHash) params.append('block', blockHash)
  if (address) params.append('address', address)
  return fetchJson(`${API_BASE}/txs?${params}`)
}

export async function getRawTransaction(txid: string): Promise<{ rawtx: string }> {
  return fetchJson(`${API_BASE}/rawtx/${txid}`)
}

// Address APIs
export async function getAddress(address: string): Promise<Address> {
  return fetchJson(`${API_BASE}/addr/${address}`)
}

export async function getAddressBalance(address: string): Promise<number> {
  return fetchJson(`${API_BASE}/addr/${address}/balance`)
}

export async function getAddressUtxos(
  address: string
): Promise<Array<{ txid: string; vout: number; satoshis: number; height: number; confirmations: number }>> {
  return fetchJson(`${API_BASE}/addr/${address}/utxo`)
}

// Status APIs
export async function getSyncStatus(): Promise<SyncStatus> {
  return fetchJson(`${API_BASE}/sync`)
}

export async function getStatus(query?: string): Promise<StatusInfo> {
  const params = query ? `?q=${query}` : ''
  return fetchJson(`${API_BASE}/status${params}`)
}

export async function getPeerStatus(): Promise<PeerStatus> {
  return fetchJson(`${API_BASE}/peer`)
}

// Price API
export async function getPrice(): Promise<PriceData> {
  const response = await fetchJson<{ status: PriceData['status']; data: { [key: string]: PriceData['data'] } }>(PRICE_API)
  // The API returns data keyed by coin ID (154 for Marscoin)
  const coinData = Object.values(response.data)[0]
  return {
    status: response.status,
    data: coinData,
  }
}

// Search - determines if input is block hash, tx hash, address, or block height
export async function search(
  query: string
): Promise<{ type: 'block' | 'tx' | 'address' | 'height' | 'unknown'; result: string }> {
  const trimmed = query.trim()

  // Check if it's a block height (number)
  if (/^\d+$/.test(trimmed)) {
    try {
      const { blockHash } = await getBlockHash(parseInt(trimmed, 10))
      return { type: 'height', result: blockHash }
    } catch {
      return { type: 'unknown', result: trimmed }
    }
  }

  // Check if it's a Marscoin address (starts with M)
  if (/^M[a-zA-Z0-9]{25,34}$/.test(trimmed)) {
    return { type: 'address', result: trimmed }
  }

  // Could be a block hash or tx hash (64 hex chars)
  if (/^[a-fA-F0-9]{64}$/.test(trimmed)) {
    // Try block first
    try {
      await getBlock(trimmed)
      return { type: 'block', result: trimmed }
    } catch {
      // Try transaction
      try {
        await getTransaction(trimmed)
        return { type: 'tx', result: trimmed }
      } catch {
        return { type: 'unknown', result: trimmed }
      }
    }
  }

  return { type: 'unknown', result: trimmed }
}
