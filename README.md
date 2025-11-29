# PlotPredict • Web‑Series Plot Markets (Monad)

A minimal, modular prediction market for web‑series plot outcomes, deployed on Monad. Users stake native MON on YES/NO outcomes before the lock time and claim pro‑rata rewards after admin resolution.

## 🌟 Features

- **Binary Markets** – YES/NO pari‑mutuel pool per market
- **Native MON Escrow** – 1 MON = 1 share
- **Modular Contracts** – Factory, Market, ERC1155 PositionToken
- **Protocol Fee** – Sent to treasury on resolution
- **Admin Resolution** – Suited for plot outcomes post episode release
- **Clean Frontend Hooks** – Events and simple read helpers

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, wagmi/RainbowKit
- **Blockchain**: Monad (EVM), Solidity (OZ libraries)
- **Storage**: Supabase (comments/activity) – optional

## 🔗 Network

- **Chain**: Monad (testnet or devnet)
- **Native token**: MON
- Provide your RPC/Explorer when deploying.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Wallet (EVM, e.g., MetaMask)
- MON test tokens

### Install
```bash
npm install
```

### Dev server
```bash
npm run dev
# open http://localhost:3000
```

### Environment Variables
```env
# Monad RPC
NEXT_PUBLIC_RPC_URL=<monad_rpc_url>

# Deployed contracts (filled post deploy)
NEXT_PUBLIC_FACTORY_ADDRESS=<address>
NEXT_PUBLIC_POSITION_TOKEN_ADDRESS=<address>

# WalletConnect (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your_project_id>

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

## 📱 Usage

### Users
1. Connect wallet
2. Browse markets and place YES/NO with MON
3. After resolution, claim winnings

### Admins
1. Create market (question, imageUrl, lockTime)
2. Lock (optional) then resolve to YES/NO
3. Fees route to treasury automatically

## 🏗️ Smart Contracts

Contracts in `contracts/`:

- **`MarketFactory.sol`** – Deploys markets; stores config (`treasury`, `feeBps`); owns a single `PositionToken` and grants `MINTER_ROLE` to new markets. Events: `MarketCreated`, `ConfigUpdated`.
- **`Market.sol`** – Per-market contract (native MON escrow). Functions: `placeYes`, `placeNo`, `lockMarket`, `resolveYes`, `resolveNo`, `claim`, `getInfo`. Events: `BetPlaced`, `MarketLocked`, `Resolved`, `Claimed`.
- **`PositionToken.sol`** – ERC1155 positions across all markets. YES id = `marketId*2+1`, NO id = `marketId*2+2`.

### Deploy (Hardhat)

Update your deploy script to:
1. Deploy `MarketFactory(admin, treasury, feeBps, erc1155BaseUri)`
2. Read `positionToken()` address if needed (constructor creates it)
3. (Optional) Call `createMarket(question, imageUrl, lockTime)`

Example parameters:
- `admin` = your EOA (gets `DEFAULT_ADMIN_ROLE` and `CONFIG_ROLE`)
- `treasury` = fee recipient
- `feeBps` = e.g. 250 (2.5%)
- `erc1155BaseUri` = `""` or `https://cdn.example.com/{id}.json`

## 🔌 Frontend Integration

- **Discovery**: listen to `MarketFactory.MarketCreated` to index markets.
- **Balances**: `PositionToken.balanceOf(user, id)` where `idYes = marketId*2+1`, `idNo = marketId*2+2`.
- **Reads**: `Market.getInfo()` returns market metadata, totals, and state.
- **Actions**: `placeYes()` / `placeNo()` send MON; `claim()` after resolution.
- **Config**: store `FACTORY_ADDRESS` (and `POSITION_TOKEN_ADDRESS`) in env.

## 🎨 Project Structure

```
├── contracts/              # Solidity: MarketFactory, Market, PositionToken
├── scripts/                # Hardhat scripts (deploy, create market)
├── src/                    # Next.js app
└── public/                 # Assets
```

## 🧪 Testing (suggested)

- Unit test lifecycle: bet → lock → resolve → claim
- Edge cases: zero winners, fee math, re-entrancy, lock enforcement

## 🔐 Notes

- Contracts use OZ libraries; keep roles limited to admin accounts.
- v1 uses admin resolution (no external oracle). Add disputes/voting in v2.

## 🤝 Contributing

PRs welcome. Keep changes minimal and focused.

## 📄 License

MIT

## 📞 Support

- Issues: open a GitHub issue in this repo

---

Built for fast iterations. Keep it simple and ship.
