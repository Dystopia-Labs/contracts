import { ethers } from "hardhat";
import { EthERC20BalanceChecker__factory } from "../typechain";

const xDaiToEthHomeAMBContractAddress =
  "0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59";

export async function deployEthERC20BalanceChecker(): Promise<void> {
  const ETH_ERC20_BALANCE_CHECKER = "EthERC20BalanceChecker";
  const EthERC20BalanceChecker = <EthERC20BalanceChecker__factory>(
    await ethers.getContractFactory(ETH_ERC20_BALANCE_CHECKER)
  );

  // deploy EthERC20BalanceChecker contract
  console.log(`\nDeploying ${ETH_ERC20_BALANCE_CHECKER}...`);

  const ethErc20BalanceChecker = await EthERC20BalanceChecker.deploy(
    xDaiToEthHomeAMBContractAddress
  );
  await ethErc20BalanceChecker.deployed();

  console.log(
    `${ETH_ERC20_BALANCE_CHECKER} deployed to: ${ethErc20BalanceChecker.address}.`
  );
  console.log(
    `Transaction: https://blockscout.com/xdai/mainnet/tx/${ethErc20BalanceChecker.deployTransaction.hash}.`
  );
}

deployEthERC20BalanceChecker()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
