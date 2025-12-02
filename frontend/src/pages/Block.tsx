import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  Boxes,
  Clock,
  Hash,
  Cpu,
  HardDrive,
  Copy,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getBlock, getTransactions } from '@/services/api'
import { formatNumber, formatBytes, copyToClipboard, shortenHash, timeAgo } from '@/lib/utils'
import { useState } from 'react'

export function Block() {
  const { hashOrHeight } = useParams<{ hashOrHeight: string }>()
  const [copied, setCopied] = useState<string | null>(null)

  const { data: block, isLoading, error } = useQuery({
    queryKey: ['block', hashOrHeight],
    queryFn: () => getBlock(hashOrHeight!),
    enabled: !!hashOrHeight,
  })

  const { data: txData } = useQuery({
    queryKey: ['blockTxs', block?.hash],
    queryFn: () => getTransactions(block?.hash),
    enabled: !!block?.hash,
  })

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

  if (error || !block) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <XCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Block Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The block you're looking for doesn't exist or hasn't been synced yet.
        </p>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {block.previousblockhash && (
            <Link to={`/block/${block.previousblockhash}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </Link>
          )}
          <h1 className="text-2xl font-bold flex items-center">
            <Boxes className="mr-2 h-6 w-6 text-primary" />
            Block #{formatNumber(block.height, 0)}
          </h1>
          {block.nextblockhash && (
            <Link to={`/block/${block.nextblockhash}`}>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {block.isMainChain ? (
            <Badge variant="success">
              <CheckCircle className="mr-1 h-3 w-3" />
              Mainchain
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="mr-1 h-3 w-3" />
              Orphaned
            </Badge>
          )}
        </div>
      </div>

      {/* Block Hash */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Block Hash</span>
            </div>
            <div className="flex items-center space-x-2">
              <code className="text-sm font-mono hidden sm:block">{block.hash}</code>
              <code className="text-sm font-mono sm:hidden">{shortenHash(block.hash, 10)}</code>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(block.hash, 'hash')}
                  >
                    {copied === 'hash' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy hash</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Transactions</span>
              <span className="font-medium">{block.tx.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Height</span>
              <span className="font-medium">{formatNumber(block.height, 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Block Reward</span>
              <span className="font-medium">{block.reward} MARS</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Timestamp</span>
              <div className="text-right">
                <div className="font-medium">
                  {new Date(block.time * 1000).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">{timeAgo(block.time)}</div>
              </div>
            </div>
            {block.poolInfo && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Mined by</span>
                <a
                  href={block.poolInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {block.poolInfo.poolName}
                </a>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Merkle Root</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs font-mono">{shortenHash(block.merkleroot, 8)}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCopy(block.merkleroot, 'merkle')}
                >
                  {copied === 'merkle' ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Difficulty</span>
              <span className="font-medium">{formatNumber(block.difficulty, 8)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Bits</span>
              <code className="text-sm font-mono">{block.bits}</code>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Size</span>
              <span className="font-medium">{formatBytes(block.size)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Version</span>
              <code className="text-sm font-mono">{block.version}</code>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Nonce</span>
              <span className="font-medium">{formatNumber(block.nonce, 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Confirmations</span>
              <Badge variant={block.confirmations > 6 ? 'success' : 'warning'}>
                {formatNumber(block.confirmations, 0)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({block.tx.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {block.tx.slice(0, 20).map((txid, index) => (
              <Link
                key={txid}
                to={`/tx/${txid}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-muted-foreground w-8">#{index}</div>
                  <code className="text-sm font-mono hidden sm:block">{txid}</code>
                  <code className="text-sm font-mono sm:hidden">{shortenHash(txid, 12)}</code>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            {block.tx.length > 20 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                Showing 20 of {block.tx.length} transactions
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
