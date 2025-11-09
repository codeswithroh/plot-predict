# Somnia Predict 🎯

A decentralized prediction market platform built on Somnia Testnet, enabling users to trade on the outcomes of real-world events using STT tokens.

## 🌟 Features

- **Binary Prediction Markets** - Trade on Yes/No outcomes
- **Somnia Integration** - Native STT token support
- **🔴 Real-time Streams** - Live bet tracking with Somnia Streams SDK
- **⚡ WebSocket Updates** - Instant market updates without polling
- **🔔 Live Notifications** - Real-time alerts for market events
- **User Dashboard** - Complete betting history and statistics
- **Comments System** - Market discussions and community engagement
- **Admin Controls** - Market creation and resolution tools
- **Responsive Design** - Mobile-first UI with dark theme

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Somnia Testnet, Solidity Smart Contracts
- **Wallet**: RainbowKit + wagmi (EVM compatibility)
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **UI Components**: Radix UI, Lucide Icons

## 🔗 Links

- **Network**: Somnia Testnet (Chain ID: 50312 / 0xc488)
- **Token**: STT (Somnia Test Token)
- **RPC**: https://dream-rpc.somnia.network
- **Explorer**: https://shannon-explorer.somnia.network/
- **Contract**: `0x5B9AC17b8b24b0B0b0eeA6Ea334e70435226Dc74`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- STT tokens (get from Somnia testnet faucet)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd somnia-predict
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Configure your environment variables
```

4. **Run development server**
```bash
npm run dev
```

5. **Open application**
```
http://localhost:3000
```

### Environment Variables
```env
# Somnia Testnet
NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5B9AC17b8b24b0B0b0eeA6Ea334e70435226Dc74
NEXT_PUBLIC_ADMIN_ADDRESS=0x71197e7a1CA5A2cb2AD82432B924F69B1E3dB123

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your_project_id>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 Usage

### For Users
1. **Connect Wallet** - Use MetaMask or any Web3 wallet
2. **Browse Markets** - Explore active prediction markets
3. **Place Bets** - Stake STT on Yes/No outcomes
4. **Track Performance** - View your betting history
5. **Claim Winnings** - Collect rewards from winning bets
6. **Join Discussions** - Comment on markets

### For Admins
1. **Create Markets** - Set up new prediction markets
2. **Manage Markets** - Pause/resume market activity
3. **Resolve Markets** - Determine winning outcomes
4. **Monitor Activity** - Track platform statistics

## 🏗️ Smart Contract

### Contract Details
- **Address**: `0x5B9AC17b8b24b0B0b0eeA6Ea334e70435226Dc74`
- **Network**: Somnia Testnet
- **Platform Fee**: 2.5%
- **Min Bet**: 0.1 STT
- **Max Bet**: 1000 STT

### Available Scripts
```bash
# Contract deployment
npm run deploy:testnet

# Market management
npm run create-btc-market
npm run create-eth-market
npm run resolve-market

# Testing
npm run create-test-user
npm run fund-test-user
npm run place-test-bet
npm run claim-test-winnings

# Full test flow
npm run test-full-flow
```

## 🗄️ Database Schema

The application uses Supabase for storing:
- **Bet Activities** - All betting transactions and history
- **Comments** - Market discussions and user interactions
- **User Statistics** - Performance metrics and analytics

Run the SQL schema:
```sql
-- Execute supabase-schema.sql in your Supabase SQL Editor
```

## 🎨 Architecture

See [diagrams.md](./diagrams.md) for detailed system architecture and flow diagrams.

## 🛠️ Development

### Project Structure
```
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── providers/          # Context providers
│   └── types/              # TypeScript definitions
├── contracts/              # Solidity smart contracts
├── scripts/               # Deployment and utility scripts
└── public/               # Static assets
```

### Key Components
- **Market Cards** - Display market information
- **Bet Dialog** - Handle bet placement with validation
- **Activity Feed** - Show real-time betting activity
- **Comments System** - Enable market discussions
- **Admin Dashboard** - Market management tools

## 🔐 Security

- **Smart Contract Audited** - Comprehensive security review
- **Input Validation** - Client and server-side validation
- **Rate Limiting** - API protection against abuse
- **Wallet Security** - Non-custodial, user-controlled funds
- **Region Restrictions** - Compliance with local regulations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Somnia Team** - For the robust blockchain infrastructure
- **RainbowKit** - For excellent wallet connection UX
- **Supabase** - For reliable database and real-time features
- **Vercel** - For deployment and hosting

## 📞 Support

- **Documentation**: [Learn Page](http://localhost:3000/learn)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Community**: [Discord/Telegram]

---

**Built with ❤️ for the Somnia ecosystem**
