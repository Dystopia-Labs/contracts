// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

/**
 * @dev Interface of the TokenBridge HomeAMB contract.
 */
interface IHomeAMB {
    function requireToGetInformation(
        bytes32 _requestSelector,
        bytes calldata _data
    ) external returns (bytes32);
}
