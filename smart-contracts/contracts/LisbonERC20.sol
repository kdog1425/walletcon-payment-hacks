// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ERC20PaymentPermit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LisbonERC20 is ERC20PaymentPermit, Ownable {
    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) ERC20PaymentPermit(name) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
