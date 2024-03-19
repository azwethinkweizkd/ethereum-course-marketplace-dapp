import { ethers } from "ethers";
import {
	abi as serviceManagerAbi,
	contractAddress1 as serviceManagerContractAddress,
} from "./serviceManagerContract";
import ethersProvider from "./ethereumProvider";
import {
	serviceCategories,
	agreementStatuses,
	clientApprovalStatuses,
} from "../common/constants";
import { abi as serviceAgreementAbi } from "./serviceAgreementContract";

const ethereumApiFactory = (web3Provider) => {
	const { getContractReader, getContractWriter, provider, signer } =
		ethersProvider(web3Provider);
	const createNewServiceProvider = async (
		companyName,
		email,
		phone,
		serviceCost,
		category
	) => {
		const contractWriter = getContractWriter(
			serviceManagerContractAddress,
			serviceManagerAbi
		);

		return await contractWriter.createNewServiceProvider(
			companyName,
			email,
			phone,
			serviceCost,
			category
		);
	};

	const getServiceProvider = async (account) => {
		const contractReader = getContractReader(
			serviceManagerContractAddress,
			serviceManagerAbi
		);

		const [
			ownerAddress,
			companyName,
			email,
			phone,
			serviceCost,
			serviceCategory,
		] = await contractReader.getServiceProvider(account);

		return getFormattedServiceProvider(
			ownerAddress,
			companyName,
			email,
			phone,
			serviceCost,
			serviceCategory
		);
	};

	const getServiceProviders = async () => {
		const contractReader = getContractReader(
			serviceManagerContractAddress,
			serviceManagerAbi
		);

		const serviceProviders = await contractReader.getServiceProviders();

		const formatterServiceProviders = serviceProviders.map((sp) => {
			const [
				ownerAddress,
				companyName,
				email,
				phone,
				serviceCost,
				serviceCategory,
			] = sp;

			return getFormattedServiceProvider(
				ownerAddress,
				companyName,
				email,
				phone,
				serviceCost,
				serviceCategory
			);
		});

		return formatterServiceProviders;
	};

	const createServiceAgreement = async (providerAddress) => {
		const contract = getContractWriter(
			serviceManagerContractAddress,
			serviceManagerAbi
		);

		return await contract.createServiceAgreement(providerAddress);
	};

	const getClientServiceAgreements = async (address) => {
		const contract = getContractReader(
			serviceManagerContractAddress,
			serviceManagerAbi
		);

		return await contract.getClientServiceAgreements(address);
	};

	const getProviderServiceAgreements = async (address) => {
		const contract = getContractReader(
			serviceManagerContractAddress,
			serviceManagerAbi
		);

		return await contract.getProviderServiceAgreements(address);
	};

	const getServiceAgreementDetails = async (address) => {
		const contract = getContractReader(address, serviceAgreementAbi);

		const [
			clientAddress,
			providerAddress,
			contractBalance,
			agreementStatus,
			clientApprovalStatus,
			clientRating,
			agreementFulfilledOrNullified,
			termsAmount,
		] = await contract.getAgreementDetails();

		return {
			agreementAddress: address,
			clientAddress,
			providerAddress,
			contractBalance: ethers.utils.formatUnits(contractBalance, "ether"),
			agreementStatus: agreementStatuses[agreementStatus],
			agreementStatusKey: agreementStatus,
			clientApprovalStatus: clientApprovalStatuses[clientApprovalStatus],
			clientApprovalStatusKey: clientApprovalStatus,
			clientRating,
			agreementFulfilledOrNullified,
			termsAmount: ethers.utils.formatUnits(termsAmount, "ether"),
		};
	};

	const parseUints = (value, denomination) => {
		return ethers.utils.parseUnits(value, denomination);
	};

	const getFormattedServiceProvider = (
		ownerAddress,
		companyName,
		email,
		phone,
		serviceCost,
		serviceCategory
	) => {
		return {
			ownerAddress,
			companyName,
			email,
			phone: phone ? getPhoneMask(phone) : "(000)000-0000",
			serviceCost: ethers.utils.formatUnits(serviceCost, "ether"),
			serviceCategory: serviceCategories[serviceCategory],
			serviceCategoryKey: serviceCategory,
		};
	};

	const getPhoneMask = (phone) => {
		if (!phone) return;
		const phoneReg = phone.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

		return !phoneReg[1] || !phoneReg[2] || !phoneReg[3]
			? phoneReg[1]
			: `(${phoneReg[1]}) ${phoneReg[2]}${
					phoneReg[3] ? "-" + phoneReg[3] : ""
			  }`;
	};

	return {
		createNewServiceProvider,
		parseUints,
		getContractWriter,
		getContractReader,
		getServiceProvider,
		getServiceProviders,
		createServiceAgreement,
		getClientServiceAgreements,
		getProviderServiceAgreements,
		getServiceAgreementDetails,
		provider,
		signer,
	};
};

export default ethereumApiFactory;
