import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X, Rocket, Activity, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { search } from '@/services/api'

interface HeaderProps {
  isConnected: boolean
  price?: number
  priceChange24h?: number
}

export function Header({ isConnected, price, priceChange24h }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const result = await search(searchQuery)
      switch (result.type) {
        case 'block':
        case 'height':
          navigate(`/block/${result.result}`)
          break
        case 'tx':
          navigate(`/tx/${result.result}`)
          break
        case 'address':
          navigate(`/address/${result.result}`)
          break
        default:
          // Show error or navigate to search results page
          alert('Not found')
      }
      setSearchQuery('')
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-6">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl hidden sm:inline-block">Marssight</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="text-foreground/60 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/blocks" className="text-foreground/60 hover:text-foreground transition-colors">
            Blocks
          </Link>
          <Link to="/markets" className="text-foreground/60 hover:text-foreground transition-colors">
            Markets
          </Link>
          <Link to="/status" className="text-foreground/60 hover:text-foreground transition-colors">
            Status
          </Link>
          <a
            href="https://www.marscoin.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            Marscoin.org
          </a>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 mx-4 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search block, tx, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
              disabled={isSearching}
            />
          </div>
        </form>

        {/* Right side - Price & Status */}
        <div className="hidden lg:flex items-center space-x-4">
          {price && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">${price.toFixed(4)}</span>
              {priceChange24h !== undefined && (
                <Badge variant={priceChange24h >= 0 ? 'success' : 'destructive'}>
                  {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                </Badge>
              )}
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Activity className={cn(
              "h-4 w-4",
              isConnected ? "text-green-500" : "text-red-500"
            )} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/blocks"
              className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blocks
            </Link>
            <Link
              to="/markets"
              className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Markets
            </Link>
            <Link
              to="/status"
              className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Status
            </Link>
            <a
              href="https://www.marscoin.org"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
            >
              Marscoin.org
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
