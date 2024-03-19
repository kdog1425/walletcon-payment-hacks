// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20PaymentPermit.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract ERC20PaymentPermit is ERC20, IERC20PaymentPermit, EIP712 {
    using Counters for Counters.Counter;
    mapping(address => Counters.Counter) private _nonces;

    // solhint-disable-next-line var-name-mixedcase
    bytes32 private constant _PERMIT_TYPEHASH =
        keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline,bytes32 paymentId)"
        );

    // solhint-disable-next-line var-name-mixedcase
    bytes32 private _PERMIT_TYPEHASH_DEPRECATED_SLOT;

    constructor(string memory name) EIP712(name, "1") {}

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
    ) external override {
        require(
            block.timestamp <= deadline,
            "ERC20PaymentPermit: expired deadline"
        );

        bytes32 structHash = keccak256(
            abi.encode(
                _PERMIT_TYPEHASH,
                owner,
                spender,
                value,
                _useNonce(owner),
                deadline,
                paymentId
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(hash, v, r, s);
        require(signer == owner, "ERC20PaymentPermit: invalid signature");

        _approve(owner, spender, value);
        _transfer(owner, recipient, value);
    }

    function nonces(
        address owner
    ) public view virtual override returns (uint256) {
        return _nonces[owner].current();
    }

    // solhint-disable-next-line var-name-mixedcase
    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
        return _domainSeparatorV4();
    }

    function _useNonce(
        address owner
    ) internal virtual returns (uint256 current) {
        Counters.Counter storage nonce = _nonces[owner];
        current = nonce.current();
        nonce.increment();
    }
}
