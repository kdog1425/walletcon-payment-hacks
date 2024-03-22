import { ethers } from "hardhat";

async function main() {
  const name = "LisbonERC20";
  const LisbonERC20 = await ethers.getContractFactory("LisbonERC20");
  const token = await LisbonERC20.deploy(name, "LISBON");
  console.log("Token deployed to:", token.address);
}

main();
