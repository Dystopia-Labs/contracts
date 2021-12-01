// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

/**
 * BasicMetaTransaction Error Codes
 * B1: cannot execute meta transaction, signer and signature do not match
 * B2: cannot execute meta transaction, function call was not successful
 * B3: cannot verify signature, signature invalid
 */

/**
 * @title BasicMetaTransaction
 * @dev Fork of Biconomy's implementation of basic meta transactions
 * https://github.com/bcnmy/metatx-standard/blob/d9639914fa623d1f50f0ecad8c5c127a0fd4d5b0/src/contracts/BasicMetaTransaction.sol
 */
contract BasicMetaTransaction {
    mapping(address => uint256) private nonces;

    event MetaTransactionExecuted(
        address userAddress,
        address payable relayerAddress,
        bytes functionSignature
    );

    /**
     * Main function to be called when user wants to execute meta transaction.
     * The actual function to be called should be passed as param with name functionSignature
     * Here the basic signature recovery is being used. Signature is expected to be generated using
     * personal_sign method.
     * @param userAddress Address of user trying to do meta transaction
     * @param functionSignature Signature of the actual function to be called via meta transaction
     * @param sigR R part of the signature
     * @param sigS S part of the signature
     * @param sigV V part of the signature
     */
    function executeMetaTransaction(
        address userAddress,
        bytes memory functionSignature,
        bytes32 sigR,
        bytes32 sigS,
        uint8 sigV
    ) public payable returns (bytes memory) {
        require(
            _verify(
                userAddress,
                nonces[userAddress],
                _getChainID(),
                functionSignature,
                sigR,
                sigS,
                sigV
            ),
            "B1"
        );
        nonces[userAddress] = nonces[userAddress]++;

        // Append userAddress at the end to extract it from calling context
        (bool success, bytes memory returnData) = address(this).call(
            abi.encodePacked(functionSignature, userAddress)
        );

        require(success, "B2");

        emit MetaTransactionExecuted(
            userAddress,
            payable(msg.sender),
            functionSignature
        );
        return returnData;
    }

    function getNonce(address user) external view returns (uint256 nonce) {
        nonce = nonces[user];
    }

    function _getChainID() private view returns (uint256 id) {
        assembly {
            id := chainid()
        }
    }

    function _msgSender() internal view virtual returns (address sender) {
        if (msg.sender == address(this)) {
            bytes memory array = msg.data;
            uint256 index = msg.data.length;
            assembly {
                // Load the 32 bytes word from memory with the address on the lower 20 bytes, and mask those.
                sender := and(
                    mload(add(array, index)),
                    0xffffffffffffffffffffffffffffffffffffffff
                )
            }
        } else {
            return msg.sender;
        }
    }

    // Builds a prefixed hash to mimic the behavior of eth_sign.
    function _prefixed(bytes32 hash) private pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    function _verify(
        address owner,
        uint256 nonce,
        uint256 chainID,
        bytes memory functionSignature,
        bytes32 sigR,
        bytes32 sigS,
        uint8 sigV
    ) private view returns (bool) {
        bytes32 hash = _prefixed(
            keccak256(abi.encodePacked(nonce, this, chainID, functionSignature))
        );
        address signer = ecrecover(hash, sigV, sigR, sigS);
        require(signer != address(0), "B3");
        return (owner == signer);
    }
}
