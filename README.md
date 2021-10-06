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

### Token

To run a dry-run deployment of the token contract, from project root run:

```shell
npm run deploy:token:dry-run
```

To deploy the token contract to Ethereum mainnet, from project root run:

```shell
npm run deploy:token
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

- $WGMI is the social token of Dystopia Labs, Inc. It exists on the Ethereum blockchain at [0x743b8f01e33e4d8358893a196aefa4c4e8712b37](https://etherscan.io/address/0x743b8f01e33e4d8358893a196aefa4c4e8712b37) and the maximum supply of $WGMI is 1,000,000,000.
- You can agree to lock up $WGMI for access to events and event partner services according to mutually agreed upon commercial engagement terms.
- After the lockup period has transpired, all previously locked up $WGMI tokens expire and cannot be redeemed for access to event and event partner services until a new lockup and new commercial engagement terms have been agreed upon.
- Please read the full [Terms of Service](/TERMS_OF_SERVICE.md#terms-of-service-for-wgmi). By buying or agreeing to lock up $WGMI you are agreeing to the Terms of Service.
