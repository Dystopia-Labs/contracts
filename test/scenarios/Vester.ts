import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";

import {
  Token,
  Token__factory,
  Vester,
  Vester__factory,
} from "../../typechain";

describe("Vester", async () => {
  let deployer: SignerWithAddress,
    dystopiaLabsGnosisSafe: SignerWithAddress,
    random: SignerWithAddress,
    token: Token,
    vester: Vester,
    vestingBegin: BigNumber,
    vestingCliff: BigNumber,
    vestingEnd: BigNumber,
    vestingRecipient: SignerWithAddress;

  const dystopiaLabsGnosisSafeAddress =
    "0x3A184b6f604d5bb98d224367641D62d8ca8C072d";
  const initialTokenSupply = ethers.utils.parseUnits("1000000000", "ether"); // 1 billion tokens
  const vestingAmount = ethers.utils.parseUnits("1000000", "ether"); // 1 million tokens

  beforeEach("deploy treasury vesting contract", async () => {
    [deployer, random, vestingRecipient] = await ethers.getSigners();

    dystopiaLabsGnosisSafe = await ethers.getSigner(
      dystopiaLabsGnosisSafeAddress
    );

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [dystopiaLabsGnosisSafeAddress],
    });

    await network.provider.send("hardhat_setBalance", [
      dystopiaLabsGnosisSafeAddress,
      "0x56bc75e2d63100000", // 100 ETH
    ]);

    const Token = <Token__factory>await ethers.getContractFactory("Token");
    token = await Token.deploy(initialTokenSupply);

    expect(await token.balanceOf(dystopiaLabsGnosisSafe.address)).to.eq(
      initialTokenSupply
    );

    const { timestamp: now } = await ethers.provider.getBlock("latest");

    vestingBegin = ethers.BigNumber.from(now).add(
      ethers.BigNumber.from("31536000").mul(3)
    ); // 3 year lockup period
    vestingCliff = vestingBegin; // no cliff
    vestingEnd = vestingCliff.add(ethers.BigNumber.from("31536000").div(2)); // 3 1/2 years

    const Vester = <Vester__factory>await ethers.getContractFactory("Vester");
    vester = await Vester.deploy(
      vestingRecipient.address,
      token.address,
      vestingAmount,
      vestingBegin,
      vestingCliff,
      vestingEnd
    );

    // fund the treasury
    token = token.connect(dystopiaLabsGnosisSafe);

    await token.transfer(vester.address, vestingAmount);

    expect(await token.balanceOf(vester.address)).to.eq(vestingAmount);
  });

  it("setRecipient:fail", async () => {
    await expect(vester.setRecipient(deployer.address)).to.be.revertedWith(
      "V5"
    );

    await expect(vester.setRecipient(random.address)).to.be.revertedWith("V5");
  });

  it("claim:fail", async () => {
    await expect(vester.claim()).to.be.revertedWith("V4");

    await ethers.provider.send("evm_mine", [
      (await ethers.provider.getBlock("latest")).timestamp + 60,
    ]);

    await expect(vester.claim()).to.be.revertedWith("V4");
  });

  it("claim:~half", async () => {
    await ethers.provider.send("evm_mine", [
      vestingBegin.add(vestingEnd.sub(vestingBegin).div("2")).toNumber(),
    ]);

    await vester.claim();

    const balance = await token.balanceOf(vestingRecipient.address);

    expect(
      vestingAmount
        .div(2)
        .sub(balance)
        .abs()
        .lte(vestingAmount.div("2").div("10000"))
    ).to.be.true;
  });

  it("claim:all", async () => {
    await ethers.provider.send("evm_mine", [vestingEnd.toNumber()]);

    await vester.claim();

    const balance = await token.balanceOf(vestingRecipient.address);

    expect(balance).to.be.eq(vestingAmount);
  });
});
