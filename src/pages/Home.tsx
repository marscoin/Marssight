import { useEffect, useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Boxes,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Zap,
  ExternalLink,
  Sparkles,
  Globe,
  Rocket,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PricePerformanceChart } from '@/components/charts/PriceChart'
import { MarsGlobe, MarsGlobeFallback } from '@/components/effects/MarsGlobe'
import { getLatestBlocks, getSyncStatus, getPrice } from '@/services/api'
import { socketService } from '@/services/socket'
import { timeAgo, formatNumber, formatBytes, shortenHash } from '@/lib/utils'
import type { BlockSummary, SocketBlock, SocketTransaction } from '@/types'

export function Home() {
  const [realtimeBlocks, setRealtimeBlocks] = useState<BlockSummary[]>([])
  const [realtimeTxs, setRealtimeTxs] = useState<{ txid: string; valueOut: number; fees: number }[]>([])

  const { data: blocks, isLoading: blocksLoading } = useQuery({
    queryKey: ['latestBlocks'],
    queryFn: () => getLatestBlocks(10),
    refetchInterval: 30000,
  })

  const { data: syncStatus } = useQuery({
    queryKey: ['syncStatus'],
    queryFn: getSyncStatus,
    refetchInterval: 10000,
  })

  const { data: priceData } = useQuery({
    queryKey: ['price'],
    queryFn: getPrice,
    refetchInterval: 60000,
  })

  useEffect(() => {
    const unsubBlock = socketService.onBlock((block: SocketBlock) => {
      setRealtimeBlocks((prev) => [block as BlockSummary, ...prev.slice(0, 9)])
    })

    const unsubTx = socketService.onTransaction((tx: SocketTransaction) => {
      setRealtimeTxs((prev) => [tx, ...prev.slice(0, 19)])
    })

    return () => {
      unsubBlock()
      unsubTx()
    }
  }, [])

  const displayBlocks = realtimeBlocks.length > 0
    ? [...realtimeBlocks, ...(blocks || [])].slice(0, 10)
    : blocks || []

  const price = priceData?.data?.quote?.USD?.price || 0
  const priceChange = priceData?.data?.quote?.USD?.percent_change_24h || 0
  const volume24h = priceData?.data?.quote?.USD?.volume_24h || 0
  const marketCap = priceData?.data?.quote?.USD?.fully_diluted_market_cap || 0

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative mars-hero-gradient rounded-3xl p-8 md:p-12 overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/70">The Bitcoin of Mars</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="number-glow">Marscoin<sup className="text-lg md:text-xl align-super">®</sup></span>
              <br />
              <span className="text-white/60 text-2xl md:text-3xl font-normal">Blockchain Explorer</span>
            </h1>
            <p className="text-lg text-white/50 max-w-xl mb-8">
              Explore the blockchain built for Mars. Track transactions, monitor blocks,
              and witness the future of Martian finance.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/markets">
                <Button className="btn-mars px-6 py-3 text-lg font-semibold rounded-xl">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  View Markets
                </Button>
              </Link>
              <a href="https://www.marscoin.org" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="px-6 py-3 text-lg rounded-xl border-white/20 hover:bg-white/5">
                  <Globe className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* Mars Planet Visual - 3D Globe */}
          <div className="relative">
            <Suspense fallback={<MarsGlobeFallback className="w-[220px] h-[220px]" />}>
              <MarsGlobe size={220} />
            </Suspense>
            <div className="absolute -bottom-4 -right-4 px-4 py-2 glass-card rounded-xl">
              <div className="text-xs text-white/50">Current Price</div>
              <div className="text-2xl font-bold number-glow">${price.toFixed(4)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Price Card - Primary */}
        <Card className="stat-card-primary rounded-2xl overflow-hidden">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/60 font-medium">MARS Price</span>
              <div className="p-2 rounded-lg bg-white/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold number-glow mb-2">${price.toFixed(4)}</div>
            <div className="flex items-center gap-2">
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${priceChange >= 0 ? 'price-up' : 'price-down'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
              <span className="text-xs text-white/40">24h</span>
            </div>
          </CardContent>
        </Card>

        {/* Block Height */}
        <Card className="glass-card rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/60 font-medium">Block Height</span>
              <div className="p-2 rounded-lg bg-primary/10">
                <Boxes className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">
              {syncStatus?.height ? formatNumber(syncStatus.height, 0) : '—'}
            </div>
            <div className="flex items-center gap-2">
              {syncStatus?.status === 'syncing' ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-sm text-white/60">
                    Syncing: {syncStatus.syncPercentage.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm text-white/60">Fully synced</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 24h Volume */}
        <Card className="glass-card rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/60 font-medium">24h Volume</span>
              <div className="p-2 rounded-lg bg-primary/10">
                <ArrowRightLeft className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">${formatNumber(volume24h, 0)}</div>
            <span className="text-sm text-white/40">Trading volume</span>
          </CardContent>
        </Card>

        {/* Market Cap */}
        <Card className="glass-card rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/60 font-medium">Market Cap</span>
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">${formatNumber(marketCap, 0)}</div>
            <span className="text-sm text-white/40">Fully diluted</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Latest Blocks - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="glass-card rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center text-xl section-title">
                <Boxes className="mr-3 h-5 w-5 text-primary" />
                Latest Blocks
              </CardTitle>
              <Link to="/blocks">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View all <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {blocksLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <Skeleton className="h-10 w-10 rounded-lg skeleton-glow" />
                    <div className="flex-1 ml-4 space-y-2">
                      <Skeleton className="h-4 w-20 skeleton-glow" />
                      <Skeleton className="h-3 w-16 skeleton-glow" />
                    </div>
                    <Skeleton className="h-4 w-24 skeleton-glow" />
                  </div>
                ))
              ) : displayBlocks.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <Boxes className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Waiting for blocks...</p>
                </div>
              ) : (
                displayBlocks.map((block, index) => (
                  <Link
                    key={block.hash}
                    to={`/block/${block.hash}`}
                    className={`flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 ${index === 0 && realtimeBlocks.length > 0 ? 'block-new mars-glow' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary">
                        <Boxes className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">#{formatNumber(block.height, 0)}</div>
                        <div className="text-sm text-white/40">{timeAgo(block.time)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{block.txlength} txs</div>
                      <div className="text-sm text-white/40">{formatBytes(block.size)}</div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* About Marscoin */}
          <Card className="glass-card rounded-2xl overflow-hidden mars-glow">
            <CardContent className="p-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src="https://www.marscoin.org/img/marscoin-img/marscoin960.png"
                    alt="Marscoin"
                    className="w-20 h-20 float"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Marscoin</h3>
              <p className="text-sm text-center text-white/50 mb-4">
                Since 2014, the cryptocurrency designed for pioneering
                the future settlement of Mars.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge className="badge-glow-orange bg-primary/20 text-primary border-primary/30">Scrypt</Badge>
                <Badge className="badge-glow-green bg-green-500/20 text-green-400 border-green-500/30">Merged Mining</Badge>
                <Badge className="badge-glow-orange bg-yellow-500/20 text-yellow-400 border-yellow-500/30">ASERT</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Live Transactions */}
          <Card className="glass-card rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <ArrowRightLeft className="mr-2 h-5 w-5 text-primary" />
                Live Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {realtimeTxs.length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    <Rocket className="h-8 w-8 mx-auto mb-2 opacity-30 animate-bounce" />
                    <p className="text-sm">Waiting for transactions...</p>
                  </div>
                ) : (
                  realtimeTxs.map((tx, index) => (
                    <Link
                      key={tx.txid}
                      to={`/tx/${tx.txid}`}
                      className={`block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all ${index === 0 ? 'tx-enter' : ''}`}
                    >
                      <div className="font-mono text-xs text-white/70 truncate">{shortenHash(tx.txid, 12)}</div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-primary font-medium">{tx.valueOut.toFixed(4)} MARS</span>
                        <span className="text-white/40">${(tx.valueOut * price).toFixed(2)}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Price Performance Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center section-title">
              <TrendingUp className="mr-3 h-5 w-5 text-primary" />
              Price Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PricePerformanceChart priceData={priceData} />
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl flex flex-col items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Explore Market Data</h3>
            <p className="text-white/50 mb-6 max-w-sm">
              View detailed market statistics, supply distribution, historical performance, and more
            </p>
            <Link to="/markets">
              <Button className="btn-mars px-8 py-3 rounded-xl font-semibold">
                View Markets <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
