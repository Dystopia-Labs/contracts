import { ethers } from "hardhat";
import { Vester__factory } from "../typechain";

const tokenAddress = "0x743b8f01E33E4d8358893a196aefa4C4E8712b37";
const vestingAmount = ethers.utils.parseUnits("1000000", "ether"); // 1 million tokens
// TODO: input vesting recipient address
const vestingRecipientAddress = "0x0000000000000000000000000000000000000000";

async function deployVester() {
  const VESTER = "Vester";
  const Vester = <Vester__factory>await ethers.getContractFactory(VESTER);

  // deploy vesting contract
  console.log(`\nDeploying ${VESTER}...`);

  // TODO: use timestamp from agreed upon block
  const { timestamp: now } = await ethers.provider.getBlock("latest");

  const vestingBegin = ethers.BigNumber.from(now).add(
    ethers.BigNumber.from("31536000").mul(3)
  ); // 3 year lockup period
  const vestingCliff = vestingBegin; // no cliff
  const vestingEnd = vestingCliff.add(ethers.BigNumber.from("31536000").div(2)); // 3 1/2 years

  const vester = await Vester.deploy(
    vestingRecipientAddress,
    tokenAddress,
    vestingAmount,
    vestingBegin,
    vestingCliff,
    vestingEnd
  );
  await vester.deployed();

  console.log(`\nVesting recipient: ${vestingRecipientAddress}`);
  console.log(`Vesting token address: ${tokenAddress}`);
  console.log(`Vesting amount: ${vestingAmount.div(BigInt(1e18)).toString()}`);
  console.log(`Vesting timestamp (in seconds): ${vestingBegin}`);
  console.log(`Vesting cliff timestamp (in seconds): ${vestingCliff}`);
  console.log(`Vesting completion timestamp (in seconds): ${vestingEnd}`);

  console.log(`\n${VESTER} deployed to: ${vester.address}.`);
  console.log(
    `Transaction: https://etherscan.io/tx/${vester.deployTransaction.hash}.`
  );
}

deployVester()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
