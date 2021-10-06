---
description: Overview of architecture and smart contracts.
---

# Technical Overview

## Architecture Overview

| Contract     | Address                                                                                                               |
| :----------- | :-------------------------------------------------------------------------------------------------------------------- |
| Token (WGMI) | [0x743b8f01e33e4d8358893a196aefa4c4e8712b37](https://etherscan.io/address/0x743b8f01e33e4d8358893a196aefa4c4e8712b37) |

## Open-source code & vetted

All smart contract source code for the contracts can be found at [https://github.com/Dystopia-Labs/contracts](https://github.com/Dystopia-Labs/contracts).

The vesting contract is forked from the Gitcoin vesting [contract](https://github.com/gitcoinco/governance/blob/main/contracts/TreasuryVester.sol) which was audited by [ConsenSys Diligence](https://consensys.net/diligence/), and the token contract is forked from the Raid Guild token [contract](https://etherscan.io/address/0x154e35c2b0024b3e079c5c5e4fc31c979c189ccb#code#L1), which is a basic [OpenZeppelin](https://openzeppelin.com/) token implementation.

## Core Contracts

![dl-contract-diagram](https://user-images.githubusercontent.com/7537712/136303982-256012b8-99c2-4085-8c69-577d44dbe5a6.png)

### Token

The Token contract was inspired by [Raid Guild](https://etherscan.io/address/0x154e35c2b0024b3e079c5c5e4fc31c979c189ccb#code) and is a basic [OpenZeppelin](https://docs.openzeppelin.com/contracts/2.x/erc20-supply#fixed-supply) token implementation. Minor changes have been made by the Dystopia Labs team.

WGMI is deployed at [0x743b8f01e33e4d8358893a196aefa4c4e8712b37](https://etherscan.io/address/0x743b8f01e33e4d8358893a196aefa4c4e8712b37) on the Ethereum mainnet.

### Vester

The Vester contract was inspired by [Gitcoin](https://github.com/gitcoinco/governance/blob/main/contracts/TreasuryVester.sol) and [Uniswap](https://github.com/Uniswap/governance/blob/master/contracts/TreasuryVester.sol).

Each vesting contract will include a lockup period and will vest tokens linearly post-lockup over a given period of time (i.e. 6 months) to the corresponding vesting recipient.
