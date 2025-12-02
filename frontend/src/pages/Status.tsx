import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  Server,
  Database,
  Network,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Wifi,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { getSyncStatus, getStatus, getPeerStatus } from '@/services/api'
import { formatNumber, timeAgo } from '@/lib/utils'

// Simple Progress component since we haven't created it yet
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-muted rounded-full h-2.5">
      <div
        className="bg-primary h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  )
}

export function Status() {
  const { data: syncStatus, isLoading: syncLoading, refetch: refetchSync } = useQuery({
    queryKey: ['syncStatus'],
    queryFn: getSyncStatus,
    refetchInterval: 5000,
  })

  const { data: statusInfo, isLoading: statusLoading } = useQuery({
    queryKey: ['statusInfo'],
    queryFn: () => getStatus('getInfo'),
    refetchInterval: 30000,
  })

  const { data: peerStatus, isLoading: peerLoading } = useQuery({
    queryKey: ['peerStatus'],
    queryFn: getPeerStatus,
    refetchInterval: 10000,
  })

  const isLoading = syncLoading || statusLoading || peerLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const info = statusInfo?.info

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Activity className="mr-2 h-6 w-6 text-primary" />
          Network Status
        </h1>
        <Badge
          variant={syncStatus?.status === 'finished' ? 'success' : syncStatus?.status === 'error' ? 'destructive' : 'warning'}
          className="flex items-center"
        >
          {syncStatus?.status === 'finished' ? (
            <CheckCircle className="mr-1 h-3 w-3" />
          ) : syncStatus?.status === 'error' ? (
            <XCircle className="mr-1 h-3 w-3" />
          ) : (
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
          )}
          {syncStatus?.status || 'Unknown'}
        </Badge>
      </div>

      {/* Sync Progress */}
      {syncStatus?.status === 'syncing' && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="mr-2 h-5 w-5 animate-spin text-primary" />
              Blockchain Sync in Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{syncStatus.syncPercentage.toFixed(2)}%</span>
            </div>
            <ProgressBar value={syncStatus.syncPercentage} />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Synced Blocks</span>
                <p className="font-medium">{formatNumber(syncStatus.height, 0)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Blocks</span>
                <p className="font-medium">{formatNumber(syncStatus.blockChainHeight, 0)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Sync Type</span>
                <p className="font-medium">{syncStatus.type}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Started</span>
                <p className="font-medium">{timeAgo(syncStatus.startTs / 1000)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Block Height */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Block Height</p>
                <p className="text-2xl font-bold">
                  {syncStatus ? formatNumber(syncStatus.height, 0) : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connections */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Network className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Connections</p>
                <p className="text-2xl font-bold">{info?.connections || '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* P2P Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${peerStatus?.connected ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                <Wifi className={`h-5 w-5 ${peerStatus?.connected ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">P2P Sync</p>
                <p className="text-lg font-bold">
                  {peerStatus?.connected ? 'Connected' : 'Disconnected'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {peerStatus?.host}:{peerStatus?.port}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Activity className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Difficulty</p>
                <p className="text-lg font-bold">{info?.difficulty ? formatNumber(info.difficulty, 4) : '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Server className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Node Version</p>
                <p className="text-lg font-bold">{info?.subversion || '—'}</p>
                <p className="text-xs text-muted-foreground">
                  Protocol: {info?.protocolversion || '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Network className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="text-lg font-bold capitalize">{info?.network || 'Mainnet'}</p>
                <p className="text-xs text-muted-foreground">
                  Relay Fee: {info?.relayfee || '—'} MARS
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      {info && (
        <Card>
          <CardHeader>
            <CardTitle>Node Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Time Offset</span>
                  <span className="font-medium">{info.timeoffset}s</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Proxy</span>
                  <span className="font-medium">{info.proxy || 'None'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Testnet</span>
                  <Badge variant={info.testnet ? 'warning' : 'success'}>
                    {info.testnet ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">{info.version}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Local Services</span>
                  <code className="text-xs">{info.localservices}</code>
                </div>
                {info.errors && (
                  <div className="py-2">
                    <span className="text-muted-foreground block mb-1">Errors</span>
                    <p className="text-sm text-destructive">{info.errors}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
