// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20PaymentPermit {
    function payWithPermit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        bytes32 paymentId,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address recipient
    ) external;

    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases ``owner``'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}
