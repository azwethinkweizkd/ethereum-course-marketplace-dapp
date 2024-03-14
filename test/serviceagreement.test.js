"use strict";

const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("ServiceAgreement", async () => {
    let ServiceAgreement, instance, tx, owner, provider, client;
    const cost = BigNumber.from(10);

    const SHOULDNOTREACH = "If you got here, we're in trouble";
    //WorkStatus
    const NOTSTARTED = BigNumber.from(0);
    const STARTED = BigNumber.from(1);
    const COMPLETED = BigNumber.from(2);
    const WILLNOTCOMPLETE = BigNumber.from(3);

    before(async () => {
        ServiceAgreement = await ethers.getContractFactory("ServiceAgreement");
    });

    beforeEach(async () => {
        [provider, client] = await ethers.getSigners();

        instance = await ServiceAgreement.deploy(
            client.address,
            provider.address,
            cost
        );
    });

    it("agreement status can be updated to all other phases", async () => {
        await instance.connect(provider).updateServiceState(STARTED);
        expect(await instance.agreementStatus()).to.equal(STARTED);

        await instance.connect(provider).updateServiceState(COMPLETED);
        expect(await instance.agreementStatus()).to.equal(COMPLETED);

        await instance.connect(provider).updateServiceState(WILLNOTCOMPLETE);
        expect(await instance.agreementStatus()).to.equal(WILLNOTCOMPLETE);
    });

    it("agreement status can only be updated by provider", async () => {
        try {
            await instance.connect(client).updateServiceState(STARTED);
            throw SHOULDNOTREACH;
        } catch (error) {
            expect(
                error.message.includes(
                    "Only the service provider can call this."
                )
            ).to.equal(true);
        }
    });
});
