import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  PricePerformanceChart,
  SupplyChart,
  MarketStatsCard,
} from '@/components/charts/PriceChart'
import { getPrice } from '@/services/api'
import { formatNumber } from '@/lib/utils'

export function Markets() {
  const { data: priceData, isLoading, error } = useQuery({
    queryKey: ['price'],
    queryFn: getPrice,
    refetchInterval: 60000,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-20 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !priceData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Failed to load price data. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { data } = priceData
  const quote = data.quote.USD

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Market Data
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time Marscoin market statistics and price performance
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          Last updated: {new Date(quote.last_updated).toLocaleTimeString()}
        </Badge>
      </div>

      {/* Price Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="mars-gradient border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MARS Price</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${quote.price.toFixed(4)}</div>
            <div className="flex items-center gap-2 mt-1">
              {quote.percent_change_24h >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <Badge variant={quote.percent_change_24h >= 0 ? 'success' : 'destructive'}>
                {quote.percent_change_24h >= 0 ? '+' : ''}
                {quote.percent_change_24h.toFixed(2)}% (24h)
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatNumber(quote.market_cap, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rank #{data.cmc_rank} on CoinMarketCap
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatNumber(quote.volume_24h, 0)}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={quote.volume_change_24h >= 0 ? 'success' : 'destructive'}
                className="text-xs"
              >
                {quote.volume_change_24h >= 0 ? '+' : ''}
                {quote.volume_change_24h.toFixed(2)}%
              </Badge>
              <span className="text-xs text-muted-foreground">vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Circulating Supply</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.circulating_supply, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((data.circulating_supply / data.max_supply) * 100).toFixed(2)}% of max supply
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PricePerformanceChart priceData={priceData} />
        <SupplyChart priceData={priceData} />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        <MarketStatsCard priceData={priceData} />

        {/* Token Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Token Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{data.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Symbol</span>
                <span className="font-medium">{data.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date Added</span>
                <span className="font-medium">
                  {new Date(data.date_added).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={data.is_active ? 'success' : 'destructive'}>
                  {data.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag.replace(/-/g, ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* External Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">External Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://coinmarketcap.com/currencies/marscoin/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              CoinMarketCap
            </a>
            <a
              href="https://www.coingecko.com/en/coins/marscoin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              CoinGecko
            </a>
            <a
              href="https://finance.yahoo.com/quote/MARS-USD/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              Yahoo Finance
            </a>
            <a
              href="https://www.marscoin.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
            >
              Marscoin.org
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
