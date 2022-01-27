---
description: Overview of architecture and smart contracts.
---

# Technical Overview

## Architecture Overview

| Contract              | Address                                                                                                                  |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| Token (WGMI)          | [0x743b8f01e33e4d8358893a196aefa4c4e8712b37](https://etherscan.io/address/0x743b8f01e33e4d8358893a196aefa4c4e8712b37)    |
| Token (Polygon WGMI)  | [0x5f609496b86f5a149b3e131c3ff19f3ee7512973](https://polygonscan.com/address/0x5f609496b86f5a149b3e131c3ff19f3ee7512973) |
| Vester (1inch)        | [0xeb8b5f237f856f99c0c5826b2526042a2774af7a](https://etherscan.io/address/0xeb8b5f237f856f99c0c5826b2526042a2774af7a)    |
| Vester (Blockstacks)  | [0x258DA38949F792cB8dadA77775ca909bbcF075eD](https://etherscan.io/address/0x258DA38949F792cB8dadA77775ca909bbcF075eD)    |
| Vester (Ellipti)      | [0x52F24E4e4cc43fBdD9e7eb54F60FFA857d0A05da](https://etherscan.io/address/0x52F24E4e4cc43fBdD9e7eb54F60FFA857d0A05da)    |
| Vester (Figment)      | [0xdD3cd75d485d833491D40C441249bBC955C17fc7](https://etherscan.io/address/0xdD3cd75d485d833491D40C441249bBC955C17fc7)    |
| Vester (Harmony)      | [0xeDcc2BdE8BC6eec12BBe743255d5b026a98086a7](https://etherscan.io/address/0xeDcc2BdE8BC6eec12BBe743255d5b026a98086a7)    |
| Vester (Mask Network) | [0x9BF157c7a4Ecc4C490e5cD7b2f6976c04048F8e4](https://etherscan.io/address/0x9BF157c7a4Ecc4C490e5cD7b2f6976c04048F8e4)    |
| Vester (RAID)         | [0xc4af6Cd6aFA0a4a89dB2EdF73B62F4BdC32E6b6d](https://etherscan.io/address/0xc4af6Cd6aFA0a4a89dB2EdF73B62F4BdC32E6b6d)    |
| Vester (UMA)          | [0x1bAd2d7Cdbd78c7A9D7e7260aBcA29cbbb0485d3](https://etherscan.io/address/0x1bAd2d7Cdbd78c7A9D7e7260aBcA29cbbb0485d3)    |

## Open-source code & vetted

All smart contract source code for the contracts can be found at [https://github.com/Dystopia-Labs/contracts](https://github.com/Dystopia-Labs/contracts).

The vesting contract is forked from the Gitcoin vesting [contract](https://github.com/gitcoinco/governance/blob/main/contracts/TreasuryVester.sol) which was audited by [ConsenSys Diligence](https://consensys.net/diligence/), and the token contract is forked from the Raid Guild token [contract](https://etherscan.io/address/0x154e35c2b0024b3e079c5c5e4fc31c979c189ccb#code#L1), which is a basic [OpenZeppelin](https://openzeppelin.com/) token implementation.

## Core Contracts

![dl-contract-diagram](https://user-images.githubusercontent.com/7537712/136303982-256012b8-99c2-4085-8c69-577d44dbe5a6.png)

### Token

The Token contract was inspired by [Raid Guild](https://etherscan.io/address/0x154e35c2b0024b3e079c5c5e4fc31c979c189ccb#code) and is a basic [OpenZeppelin](https://docs.openzeppelin.com/contracts/2.x/erc20-supply#fixed-supply) token implementation. Minor changes have been made by the Dystopia Labs team.

WGMI is deployed at [0x743b8f01e33e4d8358893a196aefa4c4e8712b37](https://etherscan.io/address/0x743b8f01e33e4d8358893a196aefa4c4e8712b37) on the Ethereum mainnet and [0x5f609496b86f5a149b3e131c3ff19f3ee7512973](https://polygonscan.com/address/0x5f609496b86f5a149b3e131c3ff19f3ee7512973) on the Polygon mainnet.

### Vester

The Vester contract was inspired by [Gitcoin](https://github.com/gitcoinco/governance/blob/main/contracts/TreasuryVester.sol) and [Uniswap](https://github.com/Uniswap/governance/blob/master/contracts/TreasuryVester.sol).

Each vesting contract will include a lockup period and will vest tokens linearly post-lockup over a given period of time (i.e. 6 months) to the corresponding vesting recipient.
