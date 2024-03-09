// SPDX-License-Identifier: PRIVATE

pragma solidity ^0.8.4;

contract ServiceManager {
    mapping(address => ServiceProvider) private serviceProviders;
    address[] private serviceProvidersIndexes;
    enum ServiceCategory {
        DogWalking,
        Painting,
        Plumbing,
        Electrical,
        GeneralContractor
    }

    struct ServiceProvider {
        address owner;
        string companyName;
        string email;
        string phone;
        uint256 serviceAmount;
        ServiceCategory serviceCategory;
        uint256 index;
    }

    function createNewServiceProvider(
        string memory _companyName, 
        string memory _email, 
        string memory _phone, 
        uint256 _serviceAmount,
        ServiceCategory _serviceCategory
        ) external {
        serviceProvidersIndexes.push(msg.sender);
        serviceProviders[msg.sender] = ServiceProvider({
            owner: msg.sender,
            companyName: _companyName,
            email: _email,
            phone: _phone,
            serviceAmount: _serviceAmount,
            serviceCategory: _serviceCategory,
            index: serviceProvidersIndexes.length - 1
        });
    }

    function getServiceProviders() external view returns (string[] memory) {

    }
}
