"use strict";

const { serviceProvider1, serviceProvider2 } = require("./testAccounts");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ServiceManager", async () => {
    let ServiceManager, provider, client, instance;

    before(async () => {
        ServiceManager = await ethers.getContractFactory("ServiceManager");
    });

    beforeEach(async () => {
        [provider, client] = await ethers.getSigners();
        instance = await ServiceManager.deploy();
        await instance.deployed();
    });

    describe("Service Providers", async () => {
        it("should allow for storing and retrieving a new service provider", async () => {
            const sptx = await instance
                .connect(provider)
                .createNewServiceProvider(
                    serviceProvider1.companyName,
                    serviceProvider1.email,
                    serviceProvider1.phone,
                    serviceProvider1.serviceAmount,
                    serviceProvider1.serviceCategory
                );
            const receipt = await sptx.wait();
            expect(receipt.status).to.equal(1);
        });
    });
});
