// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract Payment {
    function transferWithPermit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address to,
        address tokenAddress,
        uint256 amount
    ) external {
        ERC20Permit token = ERC20Permit(tokenAddress);
        token.permit(owner, spender, value, deadline, v, r, s);
        token.transferFrom(owner, to, amount);
    }
}
