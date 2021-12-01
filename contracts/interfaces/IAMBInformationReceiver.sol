// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

/**
 * @dev Interface of the TokenBridge AMBInformationReceiver contract.
 */
interface IAMBInformationReceiver {
    function onInformationReceived(
        bytes32 messageId,
        bool status,
        bytes calldata result
    ) external;
}
