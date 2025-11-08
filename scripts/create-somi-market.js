const hre = require("hardhat");

async function main() {
  console.log("🚀 Creating SOMI $1 Market...");

  const contractAddress = "0x5B9AC17b8b24b0B0b0eeA6Ea334e70435226Dc74";
  
  // Get the contract instance
  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.attach(contractAddress);

  // Market details
  const title = "Will SOMI reach $1.00 by December 31, 2025?";
  const description = "SOMI is the native token of the Somnia blockchain ecosystem. This market predicts whether SOMI will reach or exceed $1.00 USD by the end of December 2025. Resolution will be based on major exchange prices (CoinGecko, CoinMarketCap average) at 23:59 UTC on December 31, 2025.";
  const optionA = "Yes - SOMI ≥ $1.00";
  const optionB = "No - SOMI < $1.00";
  const category = 5; // Crypto category
  
  // End time: December 31, 2025, 23:59 UTC
  const endDate = new Date("2025-12-31T23:59:00Z");
  const endTime = Math.floor(endDate.getTime() / 1000);
  
  const minBet = hre.ethers.utils.parseEther("0.1"); // 0.1 STT minimum
  const maxBet = hre.ethers.utils.parseEther("100.0"); // 100 STT maximum
  const imageUrl = "/somnia.webp";

  console.log("📋 Market Details:");
  console.log("Title:", title);
  console.log("End Date:", endDate.toISOString());
  console.log("Min Bet:", hre.ethers.utils.formatEther(minBet), "STT");
  console.log("Max Bet:", hre.ethers.utils.formatEther(maxBet), "STT");
  console.log("Image:", imageUrl);
  
  try {
    console.log("📤 Creating SOMI market...");
    
    const tx = await predictionMarket.createMarket(
      title,
      description,
      optionA,
      optionB,
      category,
      endTime,
      minBet,
      maxBet,
      imageUrl
    );

    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();
    
    console.log("✅ SOMI Market created successfully!");
    console.log("📝 Transaction hash:", tx.hash);
    console.log("⛽ Gas used:", receipt.gasUsed.toString());
    
    // Get the market ID from events
    const marketCreatedEvent = receipt.events?.find(e => e.event === 'MarketCreated');
    if (marketCreatedEvent) {
      const marketId = marketCreatedEvent.args?.marketId;
      console.log("🆔 Market ID:", marketId.toString());
      console.log("🔗 View market at: http://localhost:3000/markets/" + marketId.toString());
    }

  } catch (error) {
    console.error("❌ SOMI Market creation failed:", error);
    
    if (error.message.includes("End time must be in the future")) {
      console.log("💡 Tip: Make sure the end date is in the future");
    }
    if (error.message.includes("Ownable: caller is not the owner")) {
      console.log("💡 Tip: Make sure you're using the owner wallet");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
