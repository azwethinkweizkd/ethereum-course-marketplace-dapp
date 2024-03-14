// SPDX-License-Identifier: PRIVATE
pragma solidity ^0.8.4;
contract ServiceAgreement {
    address client;
    address provider;
    uint256 termsAmount;
    WorkStatus public agreementStatus;
    constructor(
        address _client, 
        address _provider, 
        uint256 _termsAmount
    ) {
        client = _client;
        provider = _provider;
        termsAmount = _termsAmount;
        agreementStatus= WorkStatus.NotStarted;
    }

    modifier providerOnly() {
        require(msg.sender == provider, "Only the service provider can call this.");
        _;
    }

    enum WorkStatus {
        NotStarted,
        Started,
        Completed,
        WillNotComplete
    }

    event ServiceStatusUpdate (
        address indexed agreementAddress,
        WorkStatus agreementStatus
    );

    function updateServiceState(WorkStatus _status) external providerOnly {
        agreementStatus = _status;

        emit ServiceStatusUpdate(address(this), agreementStatus);
    }
}