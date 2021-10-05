// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import {IERC20} from "../interfaces/IERC20.sol";

/**
 * Vester Error Codes
 * V1: vesting start time (_vestingBegin) must be set greater than or equal to current block time
 * V2: vesting cliff must be set greater than or equal to vesting start time (_vestingBegin)
 * V3: vesting end time (_vestingEnd) must be set greater than vesting cliff
 * V4: cannot call claim, the current block time must be greater than or equal to the vesting cliff period
 * V5: setRecipient can only be called by the current set recipient
 */

/**
 * @title Vester
 */

contract Vester {
    address public recipient;
    address public immutable token;

    uint256 public lastUpdate;

    uint256 public immutable vestingAmount;
    uint256 public immutable vestingBegin;
    uint256 public immutable vestingCliff;
    uint256 public immutable vestingEnd;

    constructor(
        address _recipient,
        address _token,
        uint256 _vestingAmount,
        uint256 _vestingBegin,
        uint256 _vestingCliff,
        uint256 _vestingEnd
    ) {
        require(_vestingBegin >= block.timestamp, "V1");
        require(_vestingCliff >= _vestingBegin, "V2");
        require(_vestingEnd > _vestingCliff, "V3");

        recipient = _recipient;
        token = _token;

        vestingAmount = _vestingAmount;
        vestingBegin = _vestingBegin;
        vestingCliff = _vestingCliff;
        vestingEnd = _vestingEnd;

        lastUpdate = _vestingBegin;
    }

    function claim() public {
        require(block.timestamp >= vestingCliff, "V4");

        uint256 amount;
        uint256 _vestingEnd = vestingEnd;

        if (block.timestamp >= _vestingEnd) {
            amount = IERC20(token).balanceOf(address(this));
        } else {
            amount =
                (vestingAmount * (block.timestamp - lastUpdate)) /
                (_vestingEnd - vestingBegin);
            lastUpdate = block.timestamp;
        }

        IERC20(token).transfer(recipient, amount);
    }

    function setRecipient(address _recipient) public {
        require(msg.sender == recipient, "V5");

        recipient = _recipient;
    }
}
