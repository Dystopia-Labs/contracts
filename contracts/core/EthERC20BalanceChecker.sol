// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./BasicAMBInformationReceiver.sol";
import "./BasicMetaTransaction.sol";
import "../interfaces/IERC20.sol";

/**
 * @title EthERC20BalanceChecker
 * @dev Used to check the balance of an ERC20 token for a given address on Ethereum mainnet.
 * Intended to be deployed and called from an L2 sidechain using a TokenBridge AMB.
 */
contract EthERC20BalanceChecker is
    BasicAMBInformationReceiver,
    BasicMetaTransaction
{
    constructor(IHomeAMB _bridge) AMBInformationReceiverStorage(_bridge) {}

    function requestBalanceOf(IERC20 _token, address _owner) external {
        bytes memory method = abi.encodeWithSelector(
            IERC20(address(0)).balanceOf.selector,
            _owner
        );
        bytes memory data = abi.encode(_token, method);
        _sendRemoteEthCall(data, _token, _owner);
    }

    function _onResultReceived(bytes32 _messageId, bytes memory _result)
        internal
        override
    {
        bytes memory unwrapped = _unwrap(_result);
        require(unwrapped.length == 32);
        response[_messageId].expirationTimestamp = block.timestamp + 24 hours;
        response[_messageId].tokenBalance = abi.decode(unwrapped, (uint256));
    }

    function _sendRemoteEthCall(
        bytes memory _data,
        IERC20 _token,
        address _owner
    ) private {
        bytes32 selector = keccak256("eth_call(address,bytes)");
        lastMessageId = bridge.requireToGetInformation(selector, _data);
        response[lastMessageId].status = Status.Pending;
        response[lastMessageId].tokenAddress = address(_token);
        response[lastMessageId].tokenOwner = _owner;
    }

    function _unwrap(bytes memory _result)
        private
        pure
        returns (bytes memory unwrapped_response)
    {
        unwrapped_response = abi.decode(_result, (bytes));
    }
}
