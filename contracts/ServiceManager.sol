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

    event RegisteredServiceProvider(address indexed owner);

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

        emit RegisteredServiceProvider(msg.sender);
    }

    function getServiceProvider(address _address) external view returns (ServiceProvider memory) {
        require(serviceProvidersIndexes.length > 0, "No service providers");
        require(serviceProvidersIndexes[serviceProviders[_address].index] == _address, "Service provider does not exist");
        return serviceProviders[_address];
    }

    function getServiceProviders() external view returns (ServiceProvider[] memory) {
    ServiceProvider[] memory validServiceProviders = new ServiceProvider[](serviceProvidersIndexes.length);

    for(uint256 i = 0; i < serviceProvidersIndexes.length; i++) {
        address currentAddress = serviceProvidersIndexes[i];
        validServiceProviders[i] = serviceProviders[currentAddress];
    }

    return validServiceProviders;
    }
}
