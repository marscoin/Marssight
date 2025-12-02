import { io, Socket } from 'socket.io-client'
import type { SocketBlock, SocketTransaction } from '../types'

type EventCallback<T> = (data: T) => void

class SocketService {
  private socket: Socket | null = null
  private blockCallbacks: Set<EventCallback<SocketBlock>> = new Set()
  private txCallbacks: Set<EventCallback<SocketTransaction>> = new Set()
  private connectCallbacks: Set<EventCallback<void>> = new Set()
  private disconnectCallbacks: Set<EventCallback<void>> = new Set()

  connect(url?: string) {
    if (this.socket?.connected) return

    const socketUrl = url || import.meta.env.VITE_SOCKET_URL || window.location.origin

    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })

    this.socket.on('connect', () => {
      console.log('Socket connected')
      this.connectCallbacks.forEach((cb) => cb())

      // Subscribe to events
      this.socket?.emit('subscribe', 'inv')
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
      this.disconnectCallbacks.forEach((cb) => cb())
    })

    this.socket.on('block', (data: SocketBlock) => {
      console.log('New block:', data)
      this.blockCallbacks.forEach((cb) => cb(data))
    })

    this.socket.on('tx', (data: SocketTransaction) => {
      console.log('New transaction:', data)
      this.txCallbacks.forEach((cb) => cb(data))
    })

    this.socket.on('error', (error: Error) => {
      console.error('Socket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  onBlock(callback: EventCallback<SocketBlock>) {
    this.blockCallbacks.add(callback)
    return () => this.blockCallbacks.delete(callback)
  }

  onTransaction(callback: EventCallback<SocketTransaction>) {
    this.txCallbacks.add(callback)
    return () => this.txCallbacks.delete(callback)
  }

  onConnect(callback: EventCallback<void>) {
    this.connectCallbacks.add(callback)
    return () => this.connectCallbacks.delete(callback)
  }

  onDisconnect(callback: EventCallback<void>) {
    this.disconnectCallbacks.add(callback)
    return () => this.disconnectCallbacks.delete(callback)
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  // Subscribe to specific address updates
  subscribeToAddress(address: string) {
    this.socket?.emit('subscribe', address)
  }

  unsubscribeFromAddress(address: string) {
    this.socket?.emit('unsubscribe', address)
  }
}

export const socketService = new SocketService()
