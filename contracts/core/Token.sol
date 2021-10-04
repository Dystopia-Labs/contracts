// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import {ERC20} from "./ERC20.sol";

/**
 * @title Token
 */

contract Token is ERC20 {
    constructor(uint256 initialSupply) ERC20(unicode"WGMI 🤝", "WGMI") {
        _mint(0x3A184b6f604d5bb98d224367641D62d8ca8C072d, initialSupply);
    }
}
