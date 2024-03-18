import { ethers } from "ethers";
import {
	abi as serviceManagerAbi,
	contractAddress1 as serviceManagerContractAddress,
} from "./serviceManagerContract";
import ethersProvider from "./ethereumProvider";

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

		console.log(companyName, email, phone, serviceCost, category);

		return await contractWriter.createNewServiceProvider(
			companyName,
			email,
			phone,
			serviceCost,
			category
		);
	};

	const parseUints = (value, denomination) => {
		return ethers.utils.parseUnits(value, denomination);
	};

	return {
		createNewServiceProvider,
		parseUints,
		getContractWriter,
		getContractReader,
		provider,
		signer,
	};
};

export default ethereumApiFactory;
