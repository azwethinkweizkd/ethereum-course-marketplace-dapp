"use strict";

const { ethers, waffle } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("ServiceAgreement", () => {
	let ServiceAgreement, instance, tx, owner, provider, client;
	const cost = BigNumber.from(10);
	const SHOULDNOTREACH = "If you got here, we're in trouble";

	//WorkStatus
	const NOTSTARTED = BigNumber.from(0);
	const STARTED = BigNumber.from(1);
	const COMPLETED = BigNumber.from(2);
	const WILLNOTCOMPLETE = BigNumber.from(3);

	//ClientApprovalStatus
	const WAITINGFORAPPROVAL = BigNumber.from(0);
	const APPROVED = BigNumber.from(1);
	const UNAPPROVED = BigNumber.from(2);

	//Rating
	const UNRATED = BigNumber.from(0);
	const ONESTAR = BigNumber.from(1);
	const TWOSTAR = BigNumber.from(2);
	const THREESTAR = BigNumber.from(3);
	const FOURSTAR = BigNumber.from(4);
	const FIVESTAR = BigNumber.from(5);

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

		tx = await instance.deployed();
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
				error.message.includes("Only the service provider can call this.")
			).to.equal(true);
		}
	});

	it("will allow client to approve or disapprove a service", async () => {
		await instance.connect(provider).updateServiceState(COMPLETED);
		expect(await instance.clientApprovalStatus()).to.equal(WAITINGFORAPPROVAL);

		await instance.connect(client).updateClientApprovalStatus(APPROVED);
		expect(await instance.clientApprovalStatus()).to.equal(APPROVED);

		await instance.connect(client).updateClientApprovalStatus(UNAPPROVED);
		expect(await instance.clientApprovalStatus()).to.equal(UNAPPROVED);
	});
	it("will only let the client update the approval status of a service", async () => {
		try {
			await instance.connect(provider).updateClientApprovalStatus(APPROVED);
			throw SHOULDNOTREACH;
		} catch (error) {
			expect(error.message.includes("Only the client can call this.")).to.equal(
				true
			);
		}
	});
	it("won't allow a client to approve or disapprove a service until it is completed", async () => {
		try {
			await instance.connect(client).updateClientApprovalStatus(APPROVED);
			throw SHOULDNOTREACH;
		} catch (error) {
			expect(
				error.message.includes(
					"The contract has not been marked as completed by the service provider"
				)
			);
		}
	});

	it("will allow a client to issue a provider rating of 1 to 5 stars", async () => {
		expect(await instance.clientRating()).to.equal(UNRATED);

		await instance.connect(client).rateServiceProvider(ONESTAR);
		expect(await instance.clientRating()).to.equal(ONESTAR);

		await instance.connect(client).rateServiceProvider(TWOSTAR);
		expect(await instance.clientRating()).to.equal(TWOSTAR);

		await instance.connect(client).rateServiceProvider(THREESTAR);
		expect(await instance.clientRating()).to.equal(THREESTAR);

		await instance.connect(client).rateServiceProvider(FOURSTAR);
		expect(await instance.clientRating()).to.equal(FOURSTAR);

		await instance.connect(client).rateServiceProvider(FIVESTAR);
		expect(await instance.clientRating()).to.equal(FIVESTAR);
	});

	it("will allow client to deposit funds", async () => {
		let balance;
		const deployedTx = await tx.deployTransaction.wait();
		const waffleProvider = waffle.provider;

		balance = await waffleProvider.getBalance(deployedTx.contractAddress);
		expect(balance).to.equal(BigNumber.from(0));

		await instance.connect(client).deposit({ value: cost });
		balance = await waffleProvider.getBalance(deployedTx.contractAddress);
		expect(balance).to.equal(cost);
	});

	it("it initialized with a correct default values and can provide the serive agreement details", async () => {
		const details = await instance.getAgreementDetails();
		expect(await details[0]).to.equal(client.address);
		expect(await details[1]).to.equal(provider.address);
		expect(await details[2]).to.equal(BigNumber.from(0));
		expect(await details[3]).to.equal(NOTSTARTED);
		expect(await details[4]).to.equal(WAITINGFORAPPROVAL);
		expect(await details[5]).to.equal(UNRATED);
		expect(await details[6]).to.be.false;
		expect(await details[7]).to.equal(cost);
	});

	it("can transfer funds to provider with approved and completed agreement", async () => {
		await instance.connect(provider).updateServiceState(COMPLETED);
		await instance.connect(client).updateClientApprovalStatus(APPROVED);

		let balance;
		[, , balance] = await instance.getAgreementDetails();
		expect(balance).to.equal(BigNumber.from(0));

		await instance.connect(client).deposit({ value: cost });
		[, , balance] = await instance.getAgreementDetails();
		expect(balance).to.equal(cost);

		await instance.connect(provider).transferFundsToProvider();
		[, , balance] = await instance.getAgreementDetails();
		expect(balance).to.equal(BigNumber.from(0));
	});
	it("will raise a funds transferred event", async () => {
		await instance.connect(provider).updateServiceState(COMPLETED);
		await instance.connect(client).updateClientApprovalStatus(APPROVED);
		await instance.connect(client).deposit({ value: cost });

		const clientRating = await instance.clientRating();
		const clientApprovalStatus = await instance.clientApprovalStatus();
		const agreementStatus = await instance.agreementStatus();

		expect(await instance.connect(provider).transferFundsToProvider())
			.to.emit(instance, "AgreementFulfilled")
			.withArgs(
				instance.address,
				clientRating,
				clientApprovalStatus,
				agreementStatus
			);
	});
	it("won't allow a transfer of funds to the provider unless issued by provider", async () => {
		try {
			await instance.connect(client).transferFundsToProvider();
			throw SHOULDNOTREACH;
		} catch (error) {
			expect(error.message.includes("Only the service provider can call this."))
				.to.be.true;
		}
	});
	it("won't allow a transfer of funds to the provider without the correct smart contract balance", async () => {
		try {
			await instance.connect(provider).transferFundsToProvider();
			throw SHOULDNOTREACH;
		} catch (error) {
			expect(
				error.message.includes("Contract balance requirement has not been met")
			).to.be.true;
		}
	});
	it("won't allow a transfer of funds to the provider without service completed", async () => {
		await instance.connect(client).deposit({ value: cost });
		try {
			await instance.connect(provider).transferFundsToProvider();
			throw SHOULDNOTREACH;
		} catch (error) {
			expect(error.message.includes("Service was not completed or approved")).to
				.be.true;
		}
	});
	it("won't allow a transfer of funds to the provider without service approved", async () => {
		await instance.connect(provider).updateServiceState(COMPLETED);
		await instance.connect(client).deposit({ value: cost });
		try {
			await instance.connect(provider).transferFundsToProvider();
			throw SHOULDNOTREACH;
		} catch (error) {
			expect(error.message.includes("Service was not completed or approved")).to
				.be.true;
		}
	});
	it("won't allow a transfer of funds to the provider if the agreement has already been fulfilled", async () => {
		await instance.connect(provider).updateServiceState(COMPLETED);
		await instance.connect(client).updateClientApprovalStatus(APPROVED);
		await instance.connect(client).deposit({ value: cost });
		await instance.connect(provider).transferFundsToProvider();

		try {
			await instance.connect(provider).transferFundsToProvider();
			throw SHOULDNOTREACH;
		} catch (error) {
			expect(
				error.message.includes(
					"This agreement has already been fulfilled or nullified"
				)
			).to.be.true;
		}
	});

	it("will issue a refund if work will not be completed", async () => {
		await instance.connect(client).deposit({ value: cost });
		await instance.connect(provider).updateServiceState(WILLNOTCOMPLETE);

		let balance;
		[, , balance] = await instance.getAgreementDetails();
		expect(balance).to.equal(cost);

		expect(await instance.connect(client).refund()).to.emit(
			instance,
			"AgreementFulfilled"
		);

		[, , balance] = await instance.getAgreementDetails();
		expect(balance).to.equal(BigNumber.from(0));
	});
	it("refund can only be requested by client", async () => {
		try {
			await instance.connect(provider).refund();
			throw SHOULDNOTREACH;
		} catch (error) {
			expect(error.message.includes("Only the client can call this.")).to.be
				.true;
		}
	});
	it("won't allow a refund to the client if the agreement has already been fulfilled", async () => {
		await instance.connect(client).deposit({ value: cost });
		await instance.connect(provider).updateServiceState(WILLNOTCOMPLETE);
		await instance.connect(client).refund();

		try {
			await instance.connect(client).refund();
			throw SHOULDNOTREACH;
		} catch (error) {
			expect(
				error.message.includes(
					"This agreement has already been fulfilled or nullified"
				)
			).to.be.true;
		}
	});

	it("won't allow a refund to the client if agreement status is not set to Will Not Complete", async () => {
		await instance.connect(client).deposit({ value: cost });
		await instance.connect(provider).updateServiceState(STARTED);

		try {
			await instance.connect(client).refund();
			throw SHOULDNOTREACH;
		} catch (error) {
			expect(
				error.message.includes(
					"The agreement has not been marked as Will Not Complete"
				)
			).to.be.true;
		}
	});

	it("won't allow a refund to the client if contract balance is wrong", async () => {
		await instance.connect(provider).updateServiceState(WILLNOTCOMPLETE);
		try {
			await instance.connect(client).refund();
			throw SHOULDNOTREACH;
		} catch (error) {
			expect(error.message.includes("There is no funds to refund")).to.be.true;
		}
	});
});
