// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import {IERC20} from "../interfaces/IERC20.sol";
import {IMerkleDistributor} from "../interfaces/IMerkleDistributor.sol";
import {BitMaps} from "../libraries/BitMaps.sol";
import {MerkleProof} from "../libraries/MerkleProof.sol";

/**
 * MerkleDistributor Error Codes
 * M1: cannot claim a drop that has already been claimed
 * M2: cannot process claim, merkle proof is invalid
 * M3: token transfer failed, claim is valid
 */

/**
 * @title MerkleDistributor
 */
contract MerkleDistributor is IMerkleDistributor {
    using BitMaps for BitMaps.BitMap;

    BitMaps.BitMap private claimedBitMap;

    address public immutable override token;
    bytes32 public immutable override merkleRoot;

    constructor(address _token, bytes32 _merkleRoot) {
        token = _token;
        merkleRoot = _merkleRoot;
    }

    function claim(
        uint256 index,
        address account,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external override {
        require(!isClaimed(index), "M1");

        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(index, account, amount));
        require(MerkleProof._verify(merkleProof, merkleRoot, node), "M2");

        // Mark it claimed and send the token.
        claimedBitMap._set(index);
        require(IERC20(token).transfer(account, amount), "M3");

        emit Claimed(account, amount, index);
    }

    function isClaimed(uint256 index) public view override returns (bool) {
        return claimedBitMap._get(index);
    }
}
