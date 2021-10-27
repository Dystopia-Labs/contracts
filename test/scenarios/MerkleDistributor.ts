import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";

import BalanceTree from "../../scripts/lib/balanceTree";
import { parseBalanceMap } from "../../scripts/lib/parseBalanceMap";
import {
  MerkleDistributor,
  MerkleDistributor__factory,
  Token,
  Token__factory,
} from "../../typechain";

const { parseUnits } = ethers.utils;

const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

describe("MerkleDistributor", () => {
  let deployer: SignerWithAddress,
    dystopiaLabsGnosisSafe: SignerWithAddress,
    MerkleDistributor: MerkleDistributor__factory,
    merkleDistributor: MerkleDistributor,
    random: SignerWithAddress,
    token: Token,
    wallets: SignerWithAddress[];

  const dystopiaLabsGnosisSafeAddress =
    "0x3A184b6f604d5bb98d224367641D62d8ca8C072d";
  const initialTokenSupply = parseUnits("1000000000", "ether"); // 1 billion tokens

  beforeEach("deploy token contract", async () => {
    wallets = await ethers.getSigners();
    [deployer, random] = wallets;

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
    token = token.connect(dystopiaLabsGnosisSafe);

    expect(await token.balanceOf(dystopiaLabsGnosisSafe.address)).to.eq(
      initialTokenSupply
    );

    MerkleDistributor = <MerkleDistributor__factory>(
      await ethers.getContractFactory("MerkleDistributor")
    );

    // const MerkleDistributor = <MerkleDistributor__factory>(
    //   await ethers.getContractFactory("MerkleDistributor")
    // );
    // merkleDistributor = await MerkleDistributor.deploy(
    //   token.address,
    //   merkleRoot
    // );

    // await token.transfer(
    //   merkleDistributor.address,
    //   merkleDistributionTokenTotal
    // );

    // expect(await token.balanceOf(merkleDistributor.address)).to.eq(
    //   merkleDistributionTokenTotal
    // );
  });

  describe("#token", () => {
    it("returns the token address", async () => {
      merkleDistributor = await MerkleDistributor.deploy(
        token.address,
        ZERO_BYTES32
      );

      expect(await merkleDistributor.token()).to.eq(token.address);
    });
  });

  describe("#merkleRoot", () => {
    it("returns the zero merkle root", async () => {
      merkleDistributor = await MerkleDistributor.deploy(
        token.address,
        ZERO_BYTES32
      );

      expect(await merkleDistributor.merkleRoot()).to.eq(ZERO_BYTES32);
    });
  });

  describe("#claim", () => {
    it("fails for empty proof", async () => {
      merkleDistributor = await MerkleDistributor.deploy(
        token.address,
        ZERO_BYTES32
      );

      await expect(
        merkleDistributor.claim(0, deployer.address, 10, [])
      ).to.be.revertedWith("M2");
    });

    it("fails for invalid index", async () => {
      merkleDistributor = await MerkleDistributor.deploy(
        token.address,
        ZERO_BYTES32
      );

      await expect(
        merkleDistributor.claim(10, deployer.address, 10, [])
      ).to.be.revertedWith("M2");
    });

    describe("two account tree", () => {
      let tree: BalanceTree;

      beforeEach("deploy", async () => {
        tree = new BalanceTree([
          {
            account: deployer.address,
            amount: parseUnits(BigNumber.from(100).toString(), "ether"),
          },
          {
            account: random.address,
            amount: parseUnits(BigNumber.from(101).toString(), "ether"),
          },
        ]);

        merkleDistributor = await MerkleDistributor.deploy(
          token.address,
          tree.getHexRoot()
        );

        await token.transfer(
          merkleDistributor.address,
          parseUnits(BigNumber.from(201).toString(), "ether")
        );
      });

      it("successful claim", async () => {
        let claimAmount = parseUnits(BigNumber.from(100).toString(), "ether");
        const proof0 = tree.getProof(0, deployer.address, claimAmount);

        await expect(
          merkleDistributor.claim(0, deployer.address, claimAmount, proof0)
        )
          .to.emit(merkleDistributor, "Claimed")
          .withArgs(deployer.address, claimAmount, 0);

        claimAmount = parseUnits(BigNumber.from(101).toString(), "ether");
        const proof1 = tree.getProof(1, random.address, claimAmount);

        await expect(
          merkleDistributor.claim(1, random.address, claimAmount, proof1)
        )
          .to.emit(merkleDistributor, "Claimed")
          .withArgs(random.address, claimAmount, 1);
      });

      it("transfers the token", async () => {
        const claimAmount = parseUnits(BigNumber.from(100).toString(), "ether");
        const proof0 = tree.getProof(0, deployer.address, claimAmount);

        expect(await token.balanceOf(deployer.address)).to.eq(0);

        await merkleDistributor.claim(0, deployer.address, claimAmount, proof0);

        expect(await token.balanceOf(deployer.address)).to.eq(claimAmount);
      });

      it("must have enough to transfer", async () => {
        tree = new BalanceTree([
          {
            account: deployer.address,
            amount: parseUnits(BigNumber.from(100).toString(), "ether"),
          },
        ]);

        merkleDistributor = await MerkleDistributor.deploy(
          token.address,
          tree.getHexRoot()
        );

        await token.transfer(
          merkleDistributor.address,
          parseUnits(BigNumber.from(99).toString(), "ether")
        );

        const claimAmount = parseUnits(BigNumber.from(100).toString(), "ether");
        const proof0 = tree.getProof(0, deployer.address, claimAmount);

        await expect(
          merkleDistributor.claim(0, deployer.address, claimAmount, proof0)
        ).to.be.revertedWith("E10");
      });

      it("sets #isClaimed", async () => {
        const claimAmount = parseUnits(BigNumber.from(100).toString(), "ether");
        const proof0 = tree.getProof(0, deployer.address, claimAmount);

        expect(await merkleDistributor.isClaimed(0)).to.eq(false);
        expect(await merkleDistributor.isClaimed(1)).to.eq(false);

        await merkleDistributor.claim(0, deployer.address, claimAmount, proof0);

        expect(await merkleDistributor.isClaimed(0)).to.eq(true);
        expect(await merkleDistributor.isClaimed(1)).to.eq(false);
      });

      it("cannot allow two claims", async () => {
        const claimAmount = parseUnits(BigNumber.from(100).toString(), "ether");
        const proof0 = tree.getProof(0, deployer.address, claimAmount);

        await merkleDistributor.claim(0, deployer.address, claimAmount, proof0);

        await expect(
          merkleDistributor.claim(0, deployer.address, claimAmount, proof0)
        ).to.be.revertedWith("M1");
      });

      it("cannot claim more than once: 0 and then 1", async () => {
        const firstClaimAmount = parseUnits(
          BigNumber.from(100).toString(),
          "ether"
        );

        await merkleDistributor.claim(
          0,
          deployer.address,
          firstClaimAmount,
          tree.getProof(0, deployer.address, firstClaimAmount)
        );

        const secondClaimAmount = parseUnits(
          BigNumber.from(101).toString(),
          "ether"
        );

        await merkleDistributor.claim(
          1,
          random.address,
          secondClaimAmount,
          tree.getProof(1, random.address, secondClaimAmount)
        );

        await expect(
          merkleDistributor.claim(
            0,
            deployer.address,
            firstClaimAmount,
            tree.getProof(0, deployer.address, firstClaimAmount)
          )
        ).to.be.revertedWith("M1");
      });

      it("cannot claim more than once: 1 and then 0", async () => {
        const firstClaimAmount = parseUnits(
          BigNumber.from(101).toString(),
          "ether"
        );

        await merkleDistributor.claim(
          1,
          random.address,
          firstClaimAmount,
          tree.getProof(1, random.address, firstClaimAmount)
        );

        const secondClaimAmount = parseUnits(
          BigNumber.from(100).toString(),
          "ether"
        );

        await merkleDistributor.claim(
          0,
          deployer.address,
          secondClaimAmount,
          tree.getProof(0, deployer.address, secondClaimAmount)
        );

        await expect(
          merkleDistributor.claim(
            1,
            random.address,
            firstClaimAmount,
            tree.getProof(1, random.address, firstClaimAmount)
          )
        ).to.be.revertedWith("M1");
      });

      it("cannot claim for address other than proof", async () => {
        const firstClaimAmount = parseUnits(
          BigNumber.from(100).toString(),
          "ether"
        );
        const proof0 = tree.getProof(0, deployer.address, firstClaimAmount);
        const secondClaimAmount = parseUnits(
          BigNumber.from(101).toString(),
          "ether"
        );

        await expect(
          merkleDistributor.claim(1, random.address, secondClaimAmount, proof0)
        ).to.be.revertedWith("M2");
      });

      it("cannot claim more than proof", async () => {
        const firstClaimAmount = parseUnits(
          BigNumber.from(100).toString(),
          "ether"
        );
        const secondClaimAmount = parseUnits(
          BigNumber.from(101).toString(),
          "ether"
        );
        const proof0 = tree.getProof(0, deployer.address, firstClaimAmount);

        await expect(
          merkleDistributor.claim(
            0,
            deployer.address,
            secondClaimAmount,
            proof0
          )
        ).to.be.revertedWith("M2");
      });

      it("gas", async () => {
        const claimAmount = parseUnits(BigNumber.from(100).toString(), "ether");
        const proof = tree.getProof(0, deployer.address, claimAmount);
        const tx = await merkleDistributor.claim(
          0,
          deployer.address,
          claimAmount,
          proof
        );
        const receipt = await tx.wait();
        expect(receipt.gasUsed).to.eq(81144);
      });
    });

    describe("larger tree", () => {
      let tree: BalanceTree;

      beforeEach("deploy", async () => {
        tree = new BalanceTree(
          wallets.map((wallet, ix) => {
            return {
              account: wallet.address,
              amount: parseUnits(BigNumber.from(ix + 1).toString(), "ether"),
            };
          })
        );

        merkleDistributor = await MerkleDistributor.deploy(
          token.address,
          tree.getHexRoot()
        );

        await token.transfer(
          merkleDistributor.address,
          parseUnits(BigNumber.from(201).toString(), "ether")
        );
      });

      it("claim index 4", async () => {
        const claimAmount = parseUnits(BigNumber.from(5).toString(), "ether");
        const proof = tree.getProof(4, wallets[4].address, claimAmount);

        await expect(
          merkleDistributor.claim(4, wallets[4].address, claimAmount, proof)
        )
          .to.emit(merkleDistributor, "Claimed")
          .withArgs(wallets[4].address, claimAmount, 4);
      });

      it("claim index 9", async () => {
        const claimAmount = parseUnits(BigNumber.from(10).toString(), "ether");
        const proof = tree.getProof(9, wallets[9].address, claimAmount);

        await expect(
          merkleDistributor.claim(9, wallets[9].address, claimAmount, proof)
        )
          .to.emit(merkleDistributor, "Claimed")
          .withArgs(wallets[9].address, claimAmount, 9);
      });

      it("gas", async () => {
        const claimAmount = parseUnits(BigNumber.from(10).toString(), "ether");
        const proof = tree.getProof(9, wallets[9].address, claimAmount);

        const tx = await merkleDistributor.claim(
          9,
          wallets[9].address,
          claimAmount,
          proof
        );
        const receipt = await tx.wait();
        expect(receipt.gasUsed).to.eq(84694);
      });

      it("gas second down about 15k", async () => {
        let claimAmount = parseUnits(BigNumber.from(1).toString(), "ether");

        await merkleDistributor.claim(
          0,
          wallets[0].address,
          claimAmount,
          tree.getProof(0, wallets[0].address, claimAmount)
        );

        claimAmount = parseUnits(BigNumber.from(2).toString(), "ether");

        const tx = await merkleDistributor.claim(
          1,
          wallets[1].address,
          claimAmount,
          tree.getProof(1, wallets[1].address, claimAmount)
        );
        const receipt = await tx.wait();
        expect(receipt.gasUsed).to.eq(65809);
      });
    });

    describe("realistic size tree", () => {
      let tree: BalanceTree;
      const NUM_LEAVES = 100_000;
      const NUM_SAMPLES = 25;
      const claimAmount = parseUnits(BigNumber.from(100).toString(), "ether");
      const elements: { account: string; amount: BigNumber }[] = [];

      beforeEach("pack tree", function () {
        this.timeout(50000);

        for (let i = 0; i < NUM_LEAVES; i++) {
          const node = { account: deployer.address, amount: claimAmount };
          elements.push(node);
        }

        tree = new BalanceTree(elements);
      });

      it("proof verification works", () => {
        const root = Buffer.from(tree.getHexRoot().slice(2), "hex");

        for (let i = 0; i < NUM_LEAVES; i += NUM_LEAVES / NUM_SAMPLES) {
          const proof = tree
            .getProof(i, deployer.address, claimAmount)
            .map((el) => Buffer.from(el.slice(2), "hex"));
          const validProof = BalanceTree.verifyProof(
            i,
            deployer.address,
            claimAmount,
            proof,
            root
          );
          expect(validProof).to.be.true;
        }
      });

      beforeEach("deploy", async () => {
        merkleDistributor = await MerkleDistributor.deploy(
          token.address,
          tree.getHexRoot()
        );

        await token.transfer(merkleDistributor.address, initialTokenSupply);
      });

      it("gas", async () => {
        const proof = tree.getProof(50000, deployer.address, claimAmount);

        const tx = await merkleDistributor.claim(
          50000,
          deployer.address,
          claimAmount,
          proof
        );
        const receipt = await tx.wait();
        expect(receipt.gasUsed).to.eq(96207);
      });

      it("gas deeper node", async () => {
        const proof = tree.getProof(90000, deployer.address, claimAmount);

        const tx = await merkleDistributor.claim(
          90000,
          deployer.address,
          claimAmount,
          proof
        );
        const receipt = await tx.wait();
        expect(receipt.gasUsed).to.eq(97087);
      });

      it("gas average random distribution", async () => {
        let total: BigNumber = BigNumber.from(0);
        let count = 0;

        for (let i = 0; i < NUM_LEAVES; i += NUM_LEAVES / NUM_SAMPLES) {
          const proof = tree.getProof(i, deployer.address, claimAmount);

          const tx = await merkleDistributor.claim(
            i,
            deployer.address,
            claimAmount,
            proof
          );
          const receipt = await tx.wait();
          total = total.add(receipt.gasUsed);
          count++;
        }

        const average = total.div(count);
        expect(average).to.eq(80696);
      });

      // this is what we gas golfed by packing the bitmap
      it("gas average first 25", async () => {
        let total: BigNumber = BigNumber.from(0);
        let count = 0;
        for (let i = 0; i < 25; i++) {
          const proof = tree.getProof(i, deployer.address, claimAmount);

          const tx = await merkleDistributor.claim(
            i,
            deployer.address,
            claimAmount,
            proof
          );
          const receipt = await tx.wait();
          total = total.add(receipt.gasUsed);
          count++;
        }

        const average = total.div(count);
        expect(average).to.eq(64272);
      });

      it("no double claims in random distribution", async () => {
        for (
          let i = 0;
          i < 25;
          i += Math.floor(Math.random() * (NUM_LEAVES / NUM_SAMPLES))
        ) {
          const proof = tree.getProof(i, deployer.address, claimAmount);

          await merkleDistributor.claim(
            i,
            deployer.address,
            claimAmount,
            proof
          );
          await expect(
            merkleDistributor.claim(i, deployer.address, claimAmount, proof)
          ).to.be.revertedWith("M1");
        }
      });
    });
  });

  describe("parseBalanceMap", () => {
    let claims: {
      [account: string]: {
        index: number;
        amount: string;
        proof: string[];
      };
    };

    beforeEach("deploy", async () => {
      const {
        claims: innerClaims,
        merkleRoot,
        tokenTotal,
      } = parseBalanceMap({
        [wallets[2].address]: 250,
        [random.address]: 300,
        [deployer.address]: 200,
      });

      expect(tokenTotal).to.eq("0x02ee"); // 750
      claims = innerClaims;
      merkleDistributor = await MerkleDistributor.deploy(
        token.address,
        merkleRoot
      );

      await token.transfer(merkleDistributor.address, tokenTotal);
    });

    it("check the proofs is as expected", () => {
      expect(claims).to.deep.eq({
        [wallets[2].address]: {
          index: 0,
          amount: "0xfa",
          proof: [
            "0x0c9bcaca2a1013557ef7f348b514ab8a8cd6c7051b69e46b1681a2aff22f4a88",
          ],
        },
        [random.address]: {
          index: 1,
          amount: "0x012c",
          proof: [
            "0xc86fd316fa3e7b83c2665b5ccb63771e78abcc0429e0105c91dde37cb9b857a4",
            "0xf3c5acb53398e1d11dcaa74e37acc33d228f5da944fbdea9a918684074a21cdb",
          ],
        },
        [deployer.address]: {
          index: 2,
          amount: "0xc8",
          proof: [
            "0x0782528e118c4350a2465fbeabec5e72fff06991a29f21c08d37a0d275e38ddd",
            "0xf3c5acb53398e1d11dcaa74e37acc33d228f5da944fbdea9a918684074a21cdb",
          ],
        },
      });
    });

    it("all claims work exactly once", async () => {
      for (const account in claims) {
        const claim = claims[account];

        await expect(
          merkleDistributor.claim(
            claim.index,
            account,
            claim.amount,
            claim.proof
          )
        )
          .to.emit(merkleDistributor, "Claimed")
          .withArgs(account, claim.amount, claim.index);

        await expect(
          merkleDistributor.claim(
            claim.index,
            account,
            claim.amount,
            claim.proof
          )
        ).to.be.revertedWith("M1");
      }
      expect(await token.balanceOf(merkleDistributor.address)).to.eq(0);
    });
  });
});
