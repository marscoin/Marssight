# Marssight - Marscoin® Blockchain Explorer

<div align="center">

![Marssight](https://img.shields.io/badge/Marscoin-Blockchain%20Explorer-orange?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-24+-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**The official blockchain explorer for Marscoin® - the cryptocurrency designed for Mars colonization**

[Live Explorer](https://explore1.marscoin.org) • [Marscoin.org](https://www.marscoin.org) • [API Documentation](#api-endpoints)

</div>

---

## Screenshot

![Marssight Explorer](docs/images/hero.png)

---

## Overview

Marssight is a modern, open-source blockchain explorer for the Marscoin network. Built with a beautiful space-themed UI featuring a 3D rotating Mars globe, real-time block updates, and comprehensive blockchain data visualization.

### Features

- **3D Mars Globe** - Interactive Three.js rendered Mars with real NASA texture
- **Real-time Updates** - WebSocket-powered live block and transaction feeds
- **Modern UI** - Glassmorphism design with space-themed aesthetics
- **Full API** - Complete REST API for blockchain data
- **Price Integration** - Live Marscoin price data from CoinMarketCap
- **Responsive** - Mobile-friendly design
- **Fast Sync** - Optimized RPC-based blockchain synchronization

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite 7** for blazing fast builds
- **Tailwind CSS v4** for styling
- **Three.js** with React Three Fiber for 3D graphics
- **React Query** for data fetching
- **Lucide React** for icons

### Backend
- **Node.js 24** (pure JavaScript modules)
- **Express.js** REST API
- **LevelDB** for indexed blockchain data
- **Socket.IO** for real-time updates

## Prerequisites

- **Node.js 24+** - Required for ES modules and modern JavaScript features
- **npm 11+** - Comes with Node.js 24
- **Marscoin Core** - Running full node with RPC enabled

### Marscoin Node Configuration

Ensure your `~/.marscoin/marscoin.conf` has:

```conf
rpcuser=marscoinrpc
rpcpassword=your_secure_password
rpcport=9981
rpcallowip=127.0.0.1
txindex=1
```

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/novalis78/marssightup.git
cd marssightup
```

### 2. Install dependencies

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Start the backend API

```bash
INSIGHT_NETWORK=livenet \
BITCOIND_PASS=your_rpc_password \
INSIGHT_FORCE_RPC_SYNC=true \
node node_modules/Litesight-bitcore-api/insight.js
```

### 4. Start the frontend (in another terminal)

```bash
cd frontend
npm run dev
```

### 5. Open your browser

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4005

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `INSIGHT_NETWORK` | Network mode (`livenet` or `testnet`) | `testnet` |
| `INSIGHT_PORT` | API server port | `4005` (livenet), `4006` (testnet) |
| `BITCOIND_USER` | RPC username | `marscoinrpc` |
| `BITCOIND_PASS` | RPC password | - |
| `BITCOIND_HOST` | RPC host | `127.0.0.1` |
| `BITCOIND_PORT` | RPC port | `9981` (livenet), `18338` (testnet) |
| `INSIGHT_FORCE_RPC_SYNC` | Force RPC sync mode | `false` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `/api` (proxied) |

## API Endpoints

### Blocks

```
GET /api/block/:hash          # Get block by hash
GET /api/block-index/:height  # Get block hash by height
GET /api/blocks               # Get blocks list
```

### Transactions

```
GET /api/tx/:txid             # Get transaction by ID
GET /api/txs                  # Get transactions list
GET /api/rawtx/:txid          # Get raw transaction
```

### Addresses

```
GET /api/addr/:address        # Get address info
GET /api/addr/:address/utxo   # Get address UTXOs
GET /api/addr/:address/balance # Get address balance
```

### Status

```
GET /api/sync                 # Get sync status
GET /api/status               # Get node status
GET /api/peer                 # Get peer info
```

## Development

### Frontend Development

```bash
cd frontend
npm run dev     # Start dev server with hot reload
npm run build   # Build for production
npm run lint    # Run ESLint
```

### Project Structure

```
marssightup/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom hooks
│   │   └── lib/              # Utilities
│   └── public/               # Static assets
├── node_modules/
│   └── Litesight-bitcore-api/ # Backend API
├── docs/
│   └── images/               # Documentation images
└── README.md
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## About Marscoin®

Marscoin is a cryptocurrency designed for the future settlement of Mars. Established in 2014, it serves as a testbed for blockchain technology that could facilitate Martian commerce and governance.

- **Algorithm**: Scrypt
- **Block Time**: ~2 minutes
- **Merged Mining**: Yes (with Litecoin)
- **Difficulty**: ASERT (Aserti3-2d)

Learn more at [marscoin.org](https://www.marscoin.org)

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for Mars

*"Wake up and do something that excites you" - Elon Musk*

</div>
