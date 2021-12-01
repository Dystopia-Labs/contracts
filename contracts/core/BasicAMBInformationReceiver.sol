// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./AMBInformationReceiverStorage.sol";
import "../interfaces/IAMBInformationReceiver.sol";

/**
 * @title BasicAMBInformationReceiver
 * @dev Basic implementation of an AMBInformationReceiver contract.
 * Used to receive TokenBridge AMB information requests from the Home chain to the Foreign chain.
 */
abstract contract BasicAMBInformationReceiver is
    IAMBInformationReceiver,
    AMBInformationReceiverStorage
{
    function onInformationReceived(
        bytes32 _messageId,
        bool _status,
        bytes memory _result
    ) external override {
        require(msg.sender == address(bridge));
        if (_status) {
            _onResultReceived(_messageId, _result);
        }
        status[_messageId] = _status ? Status.Ok : Status.Failed;
    }

    function _onResultReceived(bytes32 _messageId, bytes memory _result)
        internal
        virtual;
}
