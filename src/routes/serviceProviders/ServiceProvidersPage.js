import { useEffect, useState, useRef, useCallback } from "react";
import { v4 as uuid } from "uuid";
import ServiceProvider from "../../components/service-provider/ServiceProvider";
import { Wrap, useToast } from "@chakra-ui/react";
import { useQuery } from "../shared/hooks/userQuery";
import { useWallet } from "../../common/context/walletProvider";
import ethereumApiFactory from "../../ethereum/ethereumApiFactory";
import { abi, contractAddress1 } from "../../ethereum/serviceManagerContract";
import { serviceCategoriesKeys } from "../../common/constants";

const ServiceProvidersPage = () => {
	const [serviceProviders, setServiceProviders] = useState([]);
	const { wallet } = useWallet();
	const ethereumApi = useRef({});
	const contractReader = useRef({});

	const toast = useToast();

	const query = useQuery();
	const category = query.get("category");
	const searchCriteria = query.get("search");

	const updateServiceProviders = useCallback(async () => {
		let currentServiceProviders =
			await ethereumApi.current.getServiceProviders();

		if (category) {
			const categoryKey = serviceCategoriesKeys[category];
			currentServiceProviders = currentServiceProviders.filter(
				({ serviceCategoriesKey }) => serviceCategoriesKey !== categoryKey
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

	useEffect(() => {
		if (!wallet?.accounts || !wallet?.accounts.length) return;

		try {
			ethereumApi.current = ethereumApiFactory(window.ethereum);

			contractReader.current = ethereumApi.current.getContractReader(
				contractAddress1,
				abi
			);

			updateServiceProviders();
		} catch (error) {
			toast({
				title: null,
				description: "There was an error while searching for services",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		}
	}, [wallet?.accounts, toast, updateServiceProviders]);

	return (
		<Wrap mt={12} spacing={24} justify="center">
			{serviceProviders.length > 0 &&
				serviceProviders.map((sp) => (
					<ServiceProvider provider={sp} key={uuid()} />
				))}
		</Wrap>
	);
};

export default ServiceProvidersPage;
