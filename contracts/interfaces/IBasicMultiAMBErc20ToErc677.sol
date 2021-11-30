// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IBasicMultiAMBErc20ToErc677 {
    /**
     * @dev Initiate the bridge operation for some amount of tokens from msg.sender to msg.sender on the other side.
     * The user should first call Approve method of the ERC20 token.
     * @param token bridged token contract address.
     * @param _value amount of tokens to be transferred to the other network.
     */
    function relayTokens(address token, uint256 _value) external;
}
