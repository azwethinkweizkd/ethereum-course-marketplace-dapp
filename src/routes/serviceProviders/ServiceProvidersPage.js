import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import ServiceProvider from "../../components/service-provider/ServiceProvider";
import {
	Wrap,
	AbsoluteCenter,
	HStack,
	Spinner,
	Heading,
	useToast,
} from "@chakra-ui/react";
import { useQuery } from "../shared/hooks/userQuery";
import { useWallet } from "../../common/context/walletProvider";
import ethereumApiFactory from "../../ethereum/ethereumApiFactory";
import { abi, contractAddress1 } from "../../ethereum/serviceManagerContract";
import { serviceCategoriesKeys } from "../../common/constants";

const ERRORPREFIX = "VM Exception while processing transaction: revert";

const errorFormat = (data) => {
	let errorMessage;
	if (data && data.message) {
		const { message } = data;
		errorMessage = message.replace(ERRORPREFIX, "");
	}

	return errorMessage;
};

const ServiceProvidersPage = () => {
	const [serviceProviders, setServiceProviders] = useState([]);
	const [currentBlockNumber, setCurrentBlockNumber] = useState(0);
	const [loading, setLoading] = useState(false);
	const { wallet } = useWallet();
	const ethereumApi = useRef({});
	const contractReader = useRef({});
	const eventFilter = useRef({});

	const toast = useToast();

	const query = useQuery();

	const navigate = useNavigate();
	const category = query.get("category");
	const searchCriteria = query.get("search");

	const emitNewAgreementInfo = useCallback(
		(...args) => {
			const event = args[args.length - 1];
			if (event.blockNumber <= currentBlockNumber) return;

			setLoading(false);
			navigate("/service-contracts");
		},
		[currentBlockNumber, navigate]
	);

	const updateServiceProviders = useCallback(async () => {
		let currentServiceProviders =
			await ethereumApi.current.getServiceProviders();

		if (category) {
			let decodedCategory = decodeURIComponent(category.replace(/\+/g, " "));
			const categoryKey = serviceCategoriesKeys[decodedCategory];
			currentServiceProviders = currentServiceProviders.filter(
				({ serviceCategoryKey }) => {
					return serviceCategoryKey === categoryKey;
				}
			);
		}

		if (searchCriteria) {
			currentServiceProviders = currentServiceProviders.filter((provider) => {
				const sc = searchCriteria.toLowerCase();

				return (
					provider.serviceCategory.toLowerCase().includes(sc) ||
					provider.companyName.toLowerCase().includes(sc)
				);
			});
		}

		setServiceProviders(currentServiceProviders || []);
	}, [category, searchCriteria]);

	async function updateBlockNumber() {
		const provider = ethereumApi.current.provider;
		const blockNumber = await provider.getBlockNumber();
		setCurrentBlockNumber(blockNumber);
	}

	useEffect(() => {
		if (!wallet?.accounts || !wallet?.accounts.length) return;

		try {
			ethereumApi.current = ethereumApiFactory(window.ethereum);

			contractReader.current = ethereumApi.current.getContractReader(
				contractAddress1,
				abi
			);

			updateServiceProviders();
			updateBlockNumber();

			return () =>
				contractReader.current.off(eventFilter, emitNewAgreementInfo);
		} catch (error) {
			toast({
				title: null,
				description: errorFormat(error),
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		}
	}, [wallet?.accounts, toast, updateServiceProviders, emitNewAgreementInfo]);

	async function handleContractAgreement(provider) {
		const { ownerAddress } = provider;
		if (wallet?.accounts && wallet?.accounts.length > 0) {
			const filter = contractReader.current.filters.NewAgreement(
				wallet.accounts[0],
				ownerAddress
			);

			eventFilter.current = filter;

			try {
				contractReader.current.on(eventFilter, emitNewAgreementInfo);
				setLoading(true);

				return await ethereumApi.current.createServiceAgreement(ownerAddress);
			} catch (error) {
				toast({
					title: null,
					description:
						"There was an error creating service agreement between you and the provider",
					status: "error",
					duration: 9000,
					isClosable: true,
				});
			} finally {
				setLoading(false);
			}
		}
	}

	async function handleGetAverageRating(provider) {
		const { ownerAddress } = provider;
		if (wallet?.accounts && wallet?.accounts.length > 0) {
			ethereumApi.current = ethereumApiFactory(window.ethereum);
			console.log(ethereumApi.current);
			// const filter = contractReader.current.filters.NewAgreement(
			// 	wallet.accounts[0],
			// 	ownerAddress
			// );

			// eventFilter.current = filter;

			// try {
			// 	contractReader.current.on(eventFilter, emitNewAgreementInfo);
			// 	setLoading(true);

			// 	return await ethereumApi.current.createServiceAgreement(ownerAddress);
			// } catch (error) {
			// 	toast({
			// 		title: null,
			// 		description:
			// 			"There was an error creating service agreement between you and the provider",
			// 		status: "error",
			// 		duration: 9000,
			// 		isClosable: true,
			// 	});
			// } finally {
			// 	setLoading(false);
			// }
		}
	}

	return (
		<>
			{loading ? (
				<AbsoluteCenter>
					<HStack alignContent="center">
						<Spinner
							thickness="4px"
							speed="0.65s"
							emptyColor="gray.200"
							color="blue.500"
							size="xl"
						/>
						<Heading>Creating new service agreement...</Heading>
					</HStack>
				</AbsoluteCenter>
			) : (
				<Wrap mt={12} spacing={24} justify="center">
					{serviceProviders.length > 0 &&
						serviceProviders.map((sp) => (
							<ServiceProvider
								provider={sp}
								key={uuid()}
								handleContractAgreement={handleContractAgreement}
								handleGetAverageRating={handleGetAverageRating}
								loading={loading}
							/>
						))}
				</Wrap>
			)}
		</>
	);
};

export default ServiceProvidersPage;
