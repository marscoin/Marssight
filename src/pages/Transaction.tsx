import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  ArrowRight,
  ArrowRightLeft,
  Clock,
  Hash,
  Copy,
  CheckCircle,
  XCircle,
  Boxes,
  Coins,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getTransaction, getPrice } from '@/services/api'
import { formatNumber, copyToClipboard, shortenHash, timeAgo } from '@/lib/utils'

export function Transaction() {
  const { txid } = useParams<{ txid: string }>()
  const [copied, setCopied] = useState<string | null>(null)

  const { data: tx, isLoading, error } = useQuery({
    queryKey: ['transaction', txid],
    queryFn: () => getTransaction(txid!),
    enabled: !!txid,
  })

  const { data: priceData } = useQuery({
    queryKey: ['price'],
    queryFn: getPrice,
  })

  const price = priceData?.data.quote.USD.price || 0

  const handleCopy = async (text: string, key: string) => {
    await copyToClipboard(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !tx) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <XCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Transaction Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The transaction you're looking for doesn't exist or hasn't been confirmed yet.
        </p>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    )
  }

  const isCoinbase = tx.vin.length === 1 && tx.vin[0].coinbase

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <ArrowRightLeft className="mr-2 h-6 w-6 text-primary" />
          Transaction
        </h1>
        <Badge variant={tx.confirmations > 0 ? 'success' : 'warning'}>
          {tx.confirmations > 0 ? `${formatNumber(tx.confirmations, 0)} confirmations` : 'Unconfirmed'}
        </Badge>
      </div>

      {/* TX Hash */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Transaction ID</span>
            </div>
            <div className="flex items-center space-x-2">
              <code className="text-sm font-mono hidden sm:block">{tx.txid}</code>
              <code className="text-sm font-mono sm:hidden">{shortenHash(tx.txid, 10)}</code>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(tx.txid, 'txid')}
                  >
                    {copied === 'txid' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy TXID</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Coins className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Output</p>
                <p className="text-xl font-bold">{formatNumber(tx.valueOut, 8)} MARS</p>
                <p className="text-sm text-muted-foreground">${formatNumber(tx.valueOut * price, 2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Coins className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fees</p>
                <p className="text-xl font-bold">{formatNumber(tx.fees, 8)} MARS</p>
                <p className="text-sm text-muted-foreground">${formatNumber(tx.fees * price, 4)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-lg font-bold">
                  {tx.time ? timeAgo(tx.time) : 'Pending'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tx.time ? new Date(tx.time * 1000).toLocaleString() : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Block Info */}
      {tx.blockhash && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Boxes className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Included in Block</span>
              </div>
              <Link to={`/block/${tx.blockhash}`}>
                <Button variant="outline" size="sm">
                  Block #{formatNumber(tx.blockheight || 0, 0)}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inputs & Outputs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Inputs ({tx.vin.length})</span>
              {isCoinbase && <Badge variant="info">Coinbase</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isCoinbase ? (
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <Badge variant="info" className="mb-2">Newly Generated Coins</Badge>
                  <p className="text-sm text-muted-foreground">Block Reward</p>
                </div>
              ) : (
                tx.vin.map((input, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50">
                    {input.addr ? (
                      <>
                        <Link
                          to={`/address/${input.addr}`}
                          className="text-sm font-mono text-primary hover:underline break-all"
                        >
                          {input.addr}
                        </Link>
                        <div className="flex justify-between mt-2 text-sm">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-medium">{formatNumber(input.value || 0, 8)} MARS</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unknown input</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Outputs */}
        <Card>
          <CardHeader>
            <CardTitle>Outputs ({tx.vout.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tx.vout.map((output, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50">
                  {output.scriptPubKey.addresses?.[0] ? (
                    <>
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/address/${output.scriptPubKey.addresses[0]}`}
                          className="text-sm font-mono text-primary hover:underline break-all"
                        >
                          {output.scriptPubKey.addresses[0]}
                        </Link>
                        {output.spentTxId && (
                          <Badge variant="outline" className="text-xs">Spent</Badge>
                        )}
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">{formatNumber(output.value, 8)} MARS</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {output.scriptPubKey.type === 'nulldata' ? 'OP_RETURN' : output.scriptPubKey.type}
                      </span>
                      <span className="text-sm font-medium">{formatNumber(output.value, 8)} MARS</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex justify-between items-center py-2 border-b md:border-b-0 md:border-r md:pr-4">
              <span className="text-muted-foreground">Size</span>
              <span className="font-medium">{formatNumber(tx.size, 0)} bytes</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b md:border-b-0 md:border-r md:pr-4">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">{tx.version}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Locktime</span>
              <span className="font-medium">{tx.locktime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
