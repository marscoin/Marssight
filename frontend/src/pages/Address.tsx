import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
  QrCode,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getAddress, getTransactions, getPrice } from '@/services/api'
import { formatNumber, copyToClipboard, shortenHash, timeAgo } from '@/lib/utils'

export function Address() {
  const { address } = useParams<{ address: string }>()
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [txPage, setTxPage] = useState(0)

  const { data: addressData, isLoading, error } = useQuery({
    queryKey: ['address', address],
    queryFn: () => getAddress(address!),
    enabled: !!address,
  })

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ['addressTxs', address, txPage],
    queryFn: () => getTransactions(undefined, address, txPage),
    enabled: !!address,
  })

  const { data: priceData } = useQuery({
    queryKey: ['price'],
    queryFn: getPrice,
  })

  const price = priceData?.data.quote.USD.price || 0

  const handleCopy = async () => {
    if (!address) return
    await copyToClipboard(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !addressData) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <XCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Address Not Found</h1>
        <p className="text-muted-foreground mb-4">
          This address doesn't exist or has no transactions.
        </p>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Wallet className="mr-2 h-6 w-6 text-primary" />
          Address
        </h1>
        <div className="flex items-center space-x-2">
          <code className="text-sm font-mono bg-muted px-3 py-1 rounded hidden sm:block">
            {address}
          </code>
          <code className="text-sm font-mono bg-muted px-3 py-1 rounded sm:hidden">
            {shortenHash(address || '', 10)}
          </code>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy address</TooltipContent>
          </Tooltip>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowQR(!showQR)}
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <Card>
          <CardContent className="pt-6 flex justify-center">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG value={address || ''} size={200} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="mars-gradient border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-xl font-bold">{formatNumber(addressData.balance, 8)} MARS</p>
                <p className="text-sm text-muted-foreground">${formatNumber(addressData.balance * price, 2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <ArrowDownLeft className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-xl font-bold">{formatNumber(addressData.totalReceived, 8)} MARS</p>
                <p className="text-sm text-muted-foreground">${formatNumber(addressData.totalReceived * price, 2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <ArrowUpRight className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-xl font-bold">{formatNumber(addressData.totalSent, 8)} MARS</p>
                <p className="text-sm text-muted-foreground">${formatNumber(addressData.totalSent * price, 2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <ArrowRightLeft className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-xl font-bold">{formatNumber(addressData.txApperances, 0)}</p>
                {addressData.unconfirmedTxApperances > 0 && (
                  <p className="text-sm text-yellow-500">
                    +{addressData.unconfirmedTxApperances} pending
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unconfirmed Balance */}
      {addressData.unconfirmedBalance !== 0 && (
        <Card className="border-yellow-500/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="warning">Pending</Badge>
                <span className="text-muted-foreground">Unconfirmed Balance</span>
              </div>
              <span className="font-medium">
                {addressData.unconfirmedBalance > 0 ? '+' : ''}{formatNumber(addressData.unconfirmedBalance, 8)} MARS
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : txData?.txs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions found</p>
          ) : (
            <>
              <div className="space-y-3">
                {txData?.txs.map((tx) => {
                  // Calculate if this is incoming or outgoing
                  const isIncoming = tx.vout.some(
                    (out) => out.scriptPubKey.addresses?.includes(address!)
                  )
                  const isOutgoing = tx.vin.some((inp) => inp.addr === address)

                  let amount = 0
                  tx.vout.forEach((out) => {
                    if (out.scriptPubKey.addresses?.includes(address!)) {
                      amount += out.value
                    }
                  })

                  return (
                    <Link
                      key={tx.txid}
                      to={`/tx/${tx.txid}`}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isIncoming && !isOutgoing ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          {isIncoming && !isOutgoing ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <code className="text-sm font-mono">{shortenHash(tx.txid, 12)}</code>
                          <p className="text-xs text-muted-foreground">
                            {tx.time ? timeAgo(tx.time) : 'Pending'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${isIncoming && !isOutgoing ? 'text-green-500' : 'text-red-500'}`}>
                          {isIncoming && !isOutgoing ? '+' : '-'}{formatNumber(amount, 8)} MARS
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.confirmations > 0 ? (
                            <Badge variant="outline" className="text-xs">
                              {tx.confirmations} conf
                            </Badge>
                          ) : (
                            <Badge variant="warning" className="text-xs">Pending</Badge>
                          )}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Pagination */}
              {txData && txData.pagesTotal > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTxPage(Math.max(0, txPage - 1))}
                    disabled={txPage === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {txPage + 1} of {txData.pagesTotal}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTxPage(txPage + 1)}
                    disabled={txPage >= txData.pagesTotal - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
