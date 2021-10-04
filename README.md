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

### Token contract

To run a dry-run deployment of the token contract, from project root run:

```shell
npm run deploy:token:dry-run
```

To deploy the token contract to Ethereum mainnet, from project root run:

```shell
npm run deploy:token
```
