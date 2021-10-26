import { ethers } from "hardhat";
// TODO: import generated merkle root json file
import { merkleRoot } from "./exampleClaimsListResult.json";
import { MerkleDistributor__factory } from "../typechain";

const tokenAddress = "0x743b8f01E33E4d8358893a196aefa4C4E8712b37";

async function deployMerkleDistributor() {
  const MERKLE_DISTRIBUTOR = "MerkleDistributor";
  const MerkleDistributor = <MerkleDistributor__factory>(
    await ethers.getContractFactory(MERKLE_DISTRIBUTOR)
  );

  // deploy merkle distributor contract
  console.log(`\nDeploying ${MERKLE_DISTRIBUTOR}...`);

  const merkleDistributor = await MerkleDistributor.deploy(
    tokenAddress,
    merkleRoot
    // { gasPrice: ethers.utils.parseUnits("100", "gwei") }
  );
  await merkleDistributor.deployed();

  console.log(`\nMerkle root: ${merkleRoot}`);
  console.log(`Merkle Distributor's token address: ${tokenAddress}`);

  console.log(
    `\n${MERKLE_DISTRIBUTOR} deployed to: ${merkleDistributor.address}.`
  );
  console.log(
    `Transaction: https://etherscan.io/tx/${merkleDistributor.deployTransaction.hash}.`
  );
}

deployMerkleDistributor()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
