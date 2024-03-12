// SPDX-License-Identifier: PRIVATE
pragma solidity ^0.8.4;
contract ServiceAgreement {
    address client;
    address provider;
    uint256 termsAmount;
    constructor(
        address _client, 
        address _provider, 
        uint256 _termsAmount
    ) {
        client = _client;
        provider = _provider;
        termsAmount = _termsAmount;
    }
}