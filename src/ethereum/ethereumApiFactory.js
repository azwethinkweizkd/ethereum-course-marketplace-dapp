import { ethers } from "ethers";
import {
	abi as serviceManagerAbi,
	contractAddress1 as serviceManagerContractAddress,
} from "./serviceManagerContract";
import ethersProvider from "./ethereumProvider";
import { serviceCategories } from "../common/constants";

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
		provider,
		signer,
	};
};

export default ethereumApiFactory;
