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

        it("emits an event including provider address on creation of a new serive provider", async () => {
            expect(
                await instance
                    .connect(provider)
                    .createNewServiceProvider(
                        serviceProvider1.companyName,
                        serviceProvider1.email,
                        serviceProvider1.phone,
                        serviceProvider1.serviceAmount,
                        serviceProvider1.serviceCategory
                    )
            )
                .to.emit(instance, "RegisteredServiceProvider")
                .withArgs(provider.address);
        });

        it("should allow for retrieving a single service provider", async () => {
            await instance
                .connect(provider)
                .createNewServiceProvider(
                    serviceProvider1.companyName,
                    serviceProvider1.email,
                    serviceProvider1.phone,
                    serviceProvider1.serviceAmount,
                    serviceProvider1.serviceCategory
                );

            const [
                retrieved,
                companyName,
                email,
                phone,
                serviceAmount,
                serviceCategory,
                index
            ] = await instance.getServiceProvider(provider.address);

            expect(retrieved).to.equal(provider.address);
            expect(companyName).to.be.equal(serviceProvider1.companyName);
            expect(email).to.be.equal(serviceProvider1.email);
            expect(phone).to.be.equal(serviceProvider1.phone);
            expect(serviceCategory).to.be.equal(
                serviceProvider1.serviceCategory
            );
            expect(serviceAmount).to.be.equal(serviceProvider1.serviceAmount);
            expect(index).to.be.equal(0);
        });

        it("should allow for retrieving multiple service providers", async () => {
            await instance
                .connect(provider)
                .createNewServiceProvider(
                    serviceProvider1.companyName,
                    serviceProvider1.email,
                    serviceProvider1.phone,
                    serviceProvider1.serviceAmount,
                    serviceProvider1.serviceCategory
                );

            await instance
                .connect(provider)
                .createNewServiceProvider(
                    serviceProvider2.companyName,
                    serviceProvider2.email,
                    serviceProvider2.phone,
                    serviceProvider2.serviceAmount,
                    serviceProvider2.serviceCategory
                );

            const value = await instance.getServiceProviders();
            expect(value.length).to.equal(2);
        });
    });

    describe("Service Provider Errors", async () => {
        it("should return error when there is no service providers", async () => {
            try {
                await instance.getServiceProvider(provider.address);
            } catch (err) {
                expect(err.message.includes("No service providers")).to.equal(
                    true
                );
            }
        });

        it("Should return error when a service provider address doesn't exist", async () => {
            try {
                await instance
                    .connect(provider)
                    .createNewServiceProvider(
                        serviceProvider1.companyName,
                        serviceProvider1.email,
                        serviceProvider1.phone,
                        serviceProvider1.serviceAmount,
                        serviceProvider1.serviceCategory
                    );

                await instance.getServiceProvider(client.address);
            } catch (error) {
                expect(
                    error.message.includes("Service provider does not exist")
                ).to.equal(true);
            }
        });

        it("Get service providers will return empty array if there are no service providers", async () => {
            const value = await instance.getServiceProviders();

            expect(value.length).to.equal(0);
        });
    });
});
