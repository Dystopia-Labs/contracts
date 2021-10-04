import { ethers } from "hardhat";
import { Token__factory } from "../typechain";

const initialTokenSupply = ethers.utils.parseUnits("1000000000", "ether"); // 1 billion tokens

async function deployToken() {
  const TOKEN = "Token";
  const Token = <Token__factory>await ethers.getContractFactory(TOKEN);

  // deploy token contract
  console.log(`\nDeploying ${TOKEN}...`);

  const token = await Token.deploy(initialTokenSupply);
  await token.deployed();

  console.log(`${TOKEN} deployed to: ${token.address}.`);
  console.log(
    `Transaction: https://etherscan.io/tx/${token.deployTransaction.hash}.`
  );
}

deployToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
