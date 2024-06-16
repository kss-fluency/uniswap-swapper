// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC20Swapper} from "./interfaces/ERC20Swapper.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract UniswapSwapper is OwnableUpgradeable, ERC20Swapper {

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializes the contract
     */
    function initialize() public initializer {
        __Context_init();
        __Ownable_init();
    }

    function swapEtherToToken(address token, uint minAmount) public payable returns (uint) {
        return 0;
    }

    uint256[48] private __gap;
}