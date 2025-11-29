const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
  if (!factoryAddress) throw new Error("NEXT_PUBLIC_FACTORY_ADDRESS env required");

  const Factory = await hre.ethers.getContractFactory("MarketFactory");
  const factory = Factory.attach(factoryAddress);

  const question = process.env.MARKET_QUESTION || "Will the main character reveal their identity in Episode 5?";
  const imageUrl = process.env.MARKET_IMAGE_URL || "";
  const lockTime = Number(process.env.MARKET_LOCK_TIME || (Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60));

  console.log("Creating market...", { question, imageUrl, lockTime });
  const tx = await factory.createMarket(question, imageUrl, lockTime);
  const receipt = await tx.wait();

  const evt = receipt.events?.find(e => e.event === "MarketCreated");
  const marketId = evt?.args?.marketId?.toString();
  const marketAddress = evt?.args?.market;

  console.log("\n✅ Market created:", { marketId, marketAddress });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
