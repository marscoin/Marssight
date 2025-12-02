import { Rocket, Github, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="font-bold">Marssight</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Blockchain explorer for Marscoin - the cryptocurrency designed for Mars colonization.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.marscoin.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center"
                >
                  Marscoin.org <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://miningpoolstats.stream/marscoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center"
                >
                  Mining Pools <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.marscoin.org/exchanges"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center"
                >
                  Exchanges <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://sync.marscoin.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center"
                >
                  Chain Snapshots <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Technical */}
          <div>
            <h4 className="font-semibold mb-4">Technical</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Algorithm: Scrypt</li>
              <li>Merged Mining: Yes</li>
              <li>Difficulty: ASERT</li>
              <li>Block Time: ~2 min</li>
            </ul>
          </div>

          {/* API & Source */}
          <div>
            <h4 className="font-semibold mb-4">Developers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/api-docs"
                  className="text-muted-foreground hover:text-foreground"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/marscoin/Marssight-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center"
                >
                  <Github className="mr-1 h-4 w-4" /> Marssight API
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/marscoin/marscoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center"
                >
                  <Github className="mr-1 h-4 w-4" /> Marscoin Core
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Marscoin Foundation. Built with ❤️ for Mars.</p>
          <p className="mt-2 md:mt-0">
            "Wake up and do something that excites you" - Elon Musk
          </p>
        </div>
      </div>
    </footer>
  )
}
