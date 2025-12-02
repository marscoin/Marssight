import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Starfield } from '@/components/effects/Starfield'
import { socketService } from '@/services/socket'
import { getPrice } from '@/services/api'
import { TooltipProvider } from '@/components/ui/tooltip'

export function MainLayout() {
  const [isConnected, setIsConnected] = useState(false)
  const [price, setPrice] = useState<number | undefined>()
  const [priceChange24h, setPriceChange24h] = useState<number | undefined>()

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect()

    const unsubConnect = socketService.onConnect(() => {
      setIsConnected(true)
    })

    const unsubDisconnect = socketService.onDisconnect(() => {
      setIsConnected(false)
    })

    // Fetch price data
    const fetchPrice = async () => {
      try {
        const data = await getPrice()
        setPrice(data.data.quote.USD.price)
        setPriceChange24h(data.data.quote.USD.percent_change_24h)
      } catch (error) {
        console.error('Failed to fetch price:', error)
      }
    }

    fetchPrice()
    const priceInterval = setInterval(fetchPrice, 60000) // Update every minute

    return () => {
      unsubConnect()
      unsubDisconnect()
      socketService.disconnect()
      clearInterval(priceInterval)
    }
  }, [])

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col relative">
        <Starfield />
        <Header
          isConnected={isConnected}
          price={price}
          priceChange24h={priceChange24h}
        />
        <main className="flex-1 container py-8 relative z-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  )
}
