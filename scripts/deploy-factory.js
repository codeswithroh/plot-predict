const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const network = hre.network.name;
  console.log(`\n🚀 Deploying MarketFactory to ${network}...`);

  const admin = (await hre.ethers.getSigners())[0];
  console.log("Deployer:", await admin.getAddress());

  const treasury = process.env.TREASURY_ADDRESS;
  const feeBps = Number(process.env.FEE_BPS || 250);
  const erc1155BaseUri = process.env.ERC1155_BASE_URI || "";

  if (!treasury) throw new Error("TREASURY_ADDRESS env is required");
  if (Number.isNaN(feeBps)) throw new Error("FEE_BPS must be a number");

  const Factory = await hre.ethers.getContractFactory("MarketFactory");
  const factory = await Factory.deploy(await admin.getAddress(), treasury, feeBps, erc1155BaseUri);
  await factory.deployed();

  console.log("\n✅ MarketFactory deployed:", factory.address);
  const positionTokenAddress = await factory.positionToken();
  console.log("🧾 PositionToken:", positionTokenAddress);

  console.log("\nAdd to .env:");
  console.log(`NEXT_PUBLIC_FACTORY_ADDRESS=${factory.address}`);
  console.log(`NEXT_PUBLIC_POSITION_TOKEN_ADDRESS=${positionTokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Deployment failed:", err);
    process.exit(1);
  });
