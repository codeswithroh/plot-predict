# SomniaPredict - System Architecture Diagrams

This document contains Mermaid diagrams illustrating the system architecture, user flows, and data relationships in SomniaPredict with Somnia Streams SDK integration.

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        UI[User Interface]
        Hooks[React Hooks]
        StreamsHook[useMarketStream]
        LiveComponents[Live Components]
        Components[UI Components]
    end
    
    subgraph "Somnia Streams SDK"
        StreamsProvider[SomniaStreamsProvider]
        SDK[Streams SDK]
        WebSocket[WebSocket Connection]
    end
    
    subgraph "Blockchain Layer"
        Contract[PredictionMarket Contract]
        Wallet[Web3 Wallet]
        Somnia[Somnia Testnet]
        Events[Contract Events]
    end
    
    subgraph "Database Layer"
        Supabase[(Supabase PostgreSQL)]
        BetActivities[Bet Activities Table]
        Comments[Comments Table]
    end
    
    subgraph "External Services"
        WalletConnect[WalletConnect]
        Explorer[Somnia Explorer]
        RPC[Somnia RPC]
    end
    
    UI --> Hooks
    UI --> LiveComponents
    Hooks --> Contract
    StreamsHook --> SDK
    SDK --> WebSocket
    WebSocket --> Events
    Events --> Contract
    Contract --> Somnia
    Wallet --> WalletConnect
    Contract --> RPC
    Hooks --> Supabase
    StreamsProvider --> SDK
    LiveComponents --> StreamsHook
    Supabase --> BetActivities
    Supabase --> Comments
    UI --> Explorer
    
    style StreamsProvider fill:#9b87f5
    style SDK fill:#7c3aed
    style WebSocket fill:#a78bfa
    style LiveComponents fill:#9b87f5
```

## 🔄 User Betting Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Wallet
    participant Contract
    participant Supabase
    participant Explorer
    
    User->>Frontend: Browse Markets
    Frontend->>Contract: Fetch Market Data
    Contract-->>Frontend: Market Information
    
    User->>Frontend: Click "Place Bet"
    Frontend->>Frontend: Validate Bet Amount
    Frontend->>Wallet: Request Transaction
    Wallet->>User: Sign Transaction
    User-->>Wallet: Approve
    
    Wallet->>Contract: Submit Bet Transaction
    Contract->>Contract: Validate & Process Bet
    Contract-->>Wallet: Transaction Hash
    
    Frontend->>Contract: Wait for Confirmation
    Contract-->>Frontend: Transaction Confirmed
    
    Frontend->>Supabase: Record Bet Activity
    Supabase-->>Frontend: Activity Saved
    
    Frontend->>Frontend: Show Success Modal
    Frontend->>Explorer: Link to Transaction
```

## 🎯 Market Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created: Admin creates market
    Created --> Active: Market goes live
    Active --> Active: Users place bets
    Active --> Paused: Admin pauses (optional)
    Paused --> Active: Admin resumes
    Active --> Ended: End time reached
    Ended --> Resolved: Admin resolves outcome
    Resolved --> [*]: Users claim winnings
    
    note right of Active
        Users can:
        - Place bets
        - View activity
        - Comment
    end note
    
    note right of Resolved
        Users can:
        - Claim winnings
        - View final results
    end note
```

## 💰 Payout Calculation Flow

```mermaid
flowchart TD
    Start([Market Resolved]) --> GetPool[Get Total Pool]
    GetPool --> CalcFee[Calculate Platform Fee<br/>2.5% of total pool]
    CalcFee --> GetWinners[Get Winning Side Total]
    GetWinners --> CalcReward[Reward Pool = Total - Fee]
    
    CalcReward --> ForEach{For Each Winner}
    ForEach --> CalcShare[User Share = User Bet / Total Winning Bets]
    CalcShare --> CalcPayout[User Payout = Share × Reward Pool]
    CalcPayout --> SendPayout[Send Payout to User]
    SendPayout --> ForEach
    
    ForEach --> End([All Payouts Complete])
    
    style CalcFee fill:#ff9999
    style CalcPayout fill:#99ff99
    style SendPayout fill:#9999ff
```

## 🗄️ Database Schema

```mermaid
erDiagram
    BET_ACTIVITIES {
        uuid id PK
        text market_id
        text user_address
        integer option
        text amount
        text shares
        text tx_hash UK
        text market_title
        text option_a
        text option_b
        timestamp created_at
    }
    
    COMMENTS {
        uuid id PK
        text market_id
        text user_address
        text content
        timestamp created_at
        timestamp updated_at
    }
    
    BET_ACTIVITIES ||--o{ COMMENTS : "market_id"
```

## 🔴 Somnia Streams Live Updates Flow

```mermaid
flowchart TD
    Start([User Opens App]) --> InitSDK[Initialize Somnia Streams SDK]
    InitSDK --> CreateClient[Create Public Client]
    CreateClient --> ConnectWS[Connect WebSocket]
    
    ConnectWS --> Subscribe{Subscribe to Events}
    Subscribe --> BetEvent[BetPlaced Events]
    Subscribe --> ResolveEvent[MarketResolved Events]
    Subscribe --> CreateEvent[MarketCreated Events]
    
    BetEvent --> OnBet[onBetPlaced Handler]
    ResolveEvent --> OnResolve[onMarketResolved Handler]
    CreateEvent --> OnCreate[onMarketCreated Handler]
    
    OnBet --> UpdateUI1[Update Activity Feed]
    OnBet --> UpdateStats[Update Live Stats]
    OnBet --> RefetchData[Refetch Market Data]
    
    OnResolve --> ShowNotif[Show Toast Notification]
    OnResolve --> UpdateStatus[Update Market Status]
    
    OnCreate --> NewMarketNotif[New Market Notification]
    
    UpdateUI1 --> Animate[Animate UI Changes]
    UpdateStats --> FlashBadge[Flash LIVE Badge]
    
    Animate --> End([Real-time UI Updated])
    FlashBadge --> End
    ShowNotif --> End
    NewMarketNotif --> End
    
    style ConnectWS fill:#9b87f5
    style OnBet fill:#7c3aed
    style OnResolve fill:#a78bfa
    style UpdateUI1 fill:#9b87f5
```

## 🔐 Authentication & Authorization Flow

```mermaid
flowchart TD
    User[User Visits Site] --> Region{Check Region}
    Region -->|Restricted| Block[Show Restriction Modal]
    Region -->|Allowed| Connect[Connect Wallet Button]
    
    Connect --> Wallet{Wallet Connected?}
    Wallet -->|No| WalletConnect[WalletConnect Modal]
    WalletConnect --> Sign[Sign Connection]
    Sign --> Verify[Verify Signature]
    
    Wallet -->|Yes| CheckNetwork{Correct Network?}
    CheckNetwork -->|No| Switch[Switch to Somnia Testnet]
    CheckNetwork -->|Yes| Access[Full App Access]
    
    Verify --> Access
    Switch --> Access
    
    Access --> Features[Available Features]
    Features --> PlaceBets[Place Bets]
    Features --> ViewHistory[View History]
    Features --> Comment[Comment on Markets]
    
    Block --> End[Access Denied]
    
    style Block fill:#ff9999
    style Access fill:#99ff99
    style Features fill:#9999ff
```

## 📊 Component Architecture

```mermaid
graph TD
    App[App Layout] --> Header[Header Component]
    App --> Main[Main Content]
    App --> Footer[Footer Component]
    
    Header --> WalletButton[Wallet Button]
    Header --> Navigation[Navigation Links]
    
    Main --> Markets[Markets Page]
    Main --> MarketDetail[Market Detail Page]
    Main --> Dashboard[Dashboard Pages]
    
    Markets --> MarketCard[Market Card]
    MarketCard --> CountdownTimer[Countdown Timer]
    
    MarketDetail --> BetDialog[Bet Dialog]
    MarketDetail --> ActivityFeed[Activity Feed]
    MarketDetail --> Comments[Comments Section]
    MarketDetail --> MyBets[My Bets]
    
    BetDialog --> ValidationLogic[Validation Logic]
    BetDialog --> SuccessModal[Success Modal]
    
    Dashboard --> MyBetsPage[My Bets Page]
    Dashboard --> CreateMarket[Create Market]
    
    subgraph "Shared Components"
        Button[Button]
        Input[Input]
        Modal[Modal]
        Card[Card]
    end
    
    BetDialog --> Button
    BetDialog --> Input
    BetDialog --> Modal
    MarketCard --> Card
```

## 🔄 Real-time Data Flow with Somnia Streams

```mermaid
sequenceDiagram
    participant User1
    participant Frontend1
    participant User2
    participant Frontend2
    participant StreamsSDK
    participant Contract
    participant Supabase
    
    Note over Frontend1,Frontend2: Both users subscribe to market streams
    Frontend1->>StreamsSDK: Subscribe to Market Events
    Frontend2->>StreamsSDK: Subscribe to Market Events
    StreamsSDK-->>Frontend1: WebSocket Connected
    StreamsSDK-->>Frontend2: WebSocket Connected
    
    User1->>Frontend1: Place Bet
    Frontend1->>Contract: Submit Transaction
    Contract->>Contract: Emit BetPlaced Event
    Contract-->>Frontend1: Transaction Confirmed
    
    Contract->>StreamsSDK: Event Broadcast
    StreamsSDK-->>Frontend1: Real-time Event
    StreamsSDK-->>Frontend2: Real-time Event
    
    Frontend1->>Frontend1: Update UI Instantly
    Frontend2->>Frontend2: Update UI Instantly
    
    Frontend1->>Supabase: Record Bet Activity
    Supabase-->>Frontend1: Activity Saved
    
    Note over Frontend1,Frontend2: No polling needed - instant updates via WebSocket
    
    User2->>Frontend2: Add Comment
    Frontend2->>Supabase: Save Comment
    Supabase-->>Frontend2: Comment Saved
    
    Frontend1->>Supabase: Fetch Comments
    Supabase-->>Frontend1: New Comment
    Frontend1->>User1: Update Comments
```

## 🎨 UI State Management

```mermaid
stateDiagram-v2
    [*] --> Loading: App Starts
    Loading --> Connected: Wallet Connected
    Loading --> Disconnected: No Wallet
    
    Disconnected --> Connecting: User Clicks Connect
    Connecting --> Connected: Connection Success
    Connecting --> Disconnected: Connection Failed
    
    Connected --> Trading: Browse Markets
    Trading --> BettingDialog: Click Place Bet
    BettingDialog --> Confirming: Submit Transaction
    Confirming --> Success: Transaction Confirmed
    Confirming --> Error: Transaction Failed
    
    Success --> Trading: Continue Trading
    Error --> BettingDialog: Retry
    
    Trading --> MyBets: View History
    MyBets --> Trading: Back to Markets
    
    Connected --> Disconnected: Wallet Disconnected
```

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        Dev[Local Development]
        DevDB[(Local Supabase)]
        TestNet[Somnia Testnet]
        StreamsTest[Streams SDK Testing]
    end
    
    subgraph "Production"
        Vercel[Vercel Hosting]
        ProdDB[(Supabase Production)]
        MainNet[Somnia Mainnet]
        StreamsProd[Streams SDK Production]
    end
    
    subgraph "CI/CD"
        GitHub[GitHub Repository]
        Actions[GitHub Actions]
        Deploy[Auto Deploy]
    end
    
    Dev --> GitHub
    GitHub --> Actions
    Actions --> Deploy
    Deploy --> Vercel
    
    Vercel --> ProdDB
    Vercel --> MainNet
    
    Dev --> DevDB
    Dev --> TestNet
    
    style Vercel fill:#99ff99
    style ProdDB fill:#9999ff
    style MainNet fill:#ff9999
```

## 🎯 Somnia Streams Integration Architecture

```mermaid
graph LR
    subgraph "React Components"
        MarketDetail[Market Detail Page]
        LiveFeed[Live Activity Feed]
        LiveStats[Live Stats Component]
    end
    
    subgraph "Custom Hooks"
        useMarketStream[useMarketStream Hook]
        useLiveNotif[useLiveNotifications Hook]
    end
    
    subgraph "Somnia Streams SDK"
        Provider[SomniaStreamsProvider]
        SDK[Streams SDK Instance]
        Subscription[Event Subscription]
    end
    
    subgraph "Blockchain Events"
        BetPlaced[BetPlaced Event]
        MarketResolved[MarketResolved Event]
        MarketCreated[MarketCreated Event]
    end
    
    MarketDetail --> LiveFeed
    MarketDetail --> LiveStats
    LiveFeed --> useMarketStream
    LiveStats --> useMarketStream
    useLiveNotif --> useMarketStream
    
    useMarketStream --> Provider
    Provider --> SDK
    SDK --> Subscription
    
    Subscription -.WebSocket.-> BetPlaced
    Subscription -.WebSocket.-> MarketResolved
    Subscription -.WebSocket.-> MarketCreated
    
    BetPlaced -.Callback.-> useMarketStream
    MarketResolved -.Callback.-> useMarketStream
    MarketCreated -.Callback.-> useMarketStream
    
    style Provider fill:#9b87f5
    style SDK fill:#7c3aed
    style Subscription fill:#a78bfa
    style useMarketStream fill:#9b87f5
```

---

*These diagrams provide a comprehensive overview of the SomniaPredict system architecture, real-time data flows with Somnia Streams SDK, and component relationships. They serve as documentation for developers and stakeholders to understand the platform's technical implementation with WebSocket-based live updates.*