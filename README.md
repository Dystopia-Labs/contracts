# @dystopialabs/contracts

## Prerequisites

- [NodeJS](https://nodejs.org/en/)
  - v12.22.4 <=

## Installation

To install all necessary dependencies, from project root run:

```shell
npm ci
```

## Setup

Before interacting with the project, from project root run:

```shell
cp .env.example .env
```

## Compiling contracts

To compile the contracts, from project root run:

```shell
npm run compile
```

## Deploying contracts

### MerkleDistributor

To run a dry-run deployment of the merkle distributor contract, from project root run:

```shell
npm run deploy:merkle:dry-run
```

To deploy the merkle distributor contract to Ethereum mainnet, from project root run:

```shell
npm run deploy:merkle
```

#### Generating Merkle roots

To generate an example Merkle root, from project root run:

```shell
npm run generate:merkle:example
```

To generate your own Merkle root, from project root run:

```shell
npm run generate:merkle --input <path-to-claims-list-json-file>
```

#### Verifying Merkle roots

To verify the example Merkle root, from project root run:

```shell
npm run verify:merkle:example
```

To verify your own Merkle root, from project root run:

```shell
npm run verify:merkle --input <path-to-claims-list-result-json-file>
```

### Vester

To run a dry-run deployment of the vester contract, from project root run:

```shell
npm run deploy:vester:dry-run
```

To deploy the vester contract to Ethereum mainnet, from project root run:

```shell
npm run deploy:vester
```

## Testing contracts

To test the contracts, from project root run the following:

```shell
npm run test
```

# Summary of Important Terms for $WGMI

- $WGMI is the social token of Dystopia Labs, Inc. It exists on the Ethereum blockchain at [0x743b8f01e33e4d8358893a196aefa4c4e8712b37](https://etherscan.io/address/0x743b8f01e33e4d8358893a196aefa4c4e8712b37) and on the Polygon blockchain at [0x5f609496b86f5a149b3e131c3ff19f3ee7512973](https://polygonscan.com/address/0x5f609496b86f5a149b3e131c3ff19f3ee7512973). The maximum supply of $WGMI is 1,000,000,000.
- You can agree to hold $WGMI for access to Dystopia Labs' services, or lock up $WGMI for access to events and event partner services according to mutually agreed upon commercial engagement terms.
- When agreeing to lock up $WGMI, after the lockup period has ended, all previously locked up $WGMI tokens expire and cannot be redeemed for access to event and event partner services until a new lockup and new commercial engagement terms have been agreed upon.
- Please read the full [Terms of Service](/TERMS_OF_SERVICE.md#terms-of-service-for-wgmi). By buying, holding, or agreeing to lock up $WGMI you are agreeing to the Terms of Service.
