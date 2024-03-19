import { ethers } from "hardhat";
import { v4 } from "uuid";

async function main() {
  // Setup
  const [deployer, merchant, customer] = await ethers.getSigners();
  const chainId = await customer.getChainId();

  console.log("Deployer address:", deployer.address);
  console.log("Merchant address:", merchant.address);
  console.log("Recipient address:", customer.address);

  const name = "LisbonERC20";
  const LisbonERC20 = await ethers.getContractFactory("LisbonERC20");
  const token = await LisbonERC20.deploy(name, "LISBON");
  console.log("Token deployed to:", token.address);

  const amountToMint = ethers.utils.parseEther("1000");
  await token.connect(deployer).mint(customer.address, amountToMint);

  const transferAmount = amountToMint.div(2);

  // Permit Signing
  const uuid = v4();
  const paymentId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(uuid));

  const nonce = await token.nonces(customer.address);
  const deadline = ethers.constants.MaxUint256;
  const permit = {
    owner: ethers.utils.getAddress(customer.address),
    spender: ethers.utils.getAddress(merchant.address),
    value: transferAmount,
    nonce,
    deadline,
    paymentId,
  };
  console.log("Permit", permit);

  const permitSignature = await customer._signTypedData(
    {
      name,
      version: "1",
      chainId,
      verifyingContract: token.address,
    },
    {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
        { name: "paymentId", type: "bytes32" },
      ],
    },
    permit
  );
  console.log("Permit signed by customer", permitSignature);

  // Use Permit and Transfer
  const { v, r, s } = ethers.utils.splitSignature(permitSignature);
  const txn = await token.payWithPermit(
    permit.owner,
    permit.spender,
    permit.value,
    permit.deadline,
    permit.paymentId,
    v,
    r,
    s,
    merchant.address
  );
  console.log("Transaction Hash", txn.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
