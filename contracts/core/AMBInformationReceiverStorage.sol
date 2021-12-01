// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "../interfaces/IHomeAMB.sol";

/**
 * @title AMBInformationReceiverStorage
 * @dev Storage contract for a TokenBridge AMBInformationReceiver contract.
 */
contract AMBInformationReceiverStorage {
    IHomeAMB public immutable bridge;

    enum Status {
        Failed,
        Ok,
        Pending,
        Unknown
    }

    mapping(bytes32 => Status) public status;
    bytes32 public lastMessageId;

    constructor(IHomeAMB _bridge) {
        bridge = _bridge;
    }
}
