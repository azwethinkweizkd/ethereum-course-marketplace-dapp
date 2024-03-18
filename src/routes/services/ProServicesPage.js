import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Center, useToast } from "@chakra-ui/react";
import ProService from "../../components/pro-service/ProService";
import ethereumApiFactory from "../../ethereum/ethereumApiFactory";
import { useWallet } from "../../common/context/walletProvider";

const ProServicesPage = () => {
	const [services, setServices] = useState([]);
	const { wallet } = useWallet();
	const toast = useToast();
	console.log(services);
	const loadServices = useCallback(
		async (account) => {
			try {
				const ethereumApi = ethereumApiFactory(window.ethereum);
				const service = await ethereumApi.getServiceProvider(account);
				setServices([service]);
			} catch (err) {
				setServices([]);
				toast({
					title: "Error retrieving services",
					description:
						"There was an error retrieving your pro services. Please try again later.",
					status: "error",
					duration: 9000,
					isClosable: true,
				});
			}
		},
		[setServices, toast]
	);

	useEffect(() => {
		if (wallet?.accounts && wallet?.accounts.length > 0) {
			loadServices(wallet?.accounts[0]);
		}
	}, [loadServices, wallet?.accounts]);
	return (
		<Center py={12}>
			{services.length > 0 &&
				services.map((service) => {
					let newKey = uuidv4();
					return <ProService key={newKey} service={service} />;
				})}
		</Center>
	);
};

export default ProServicesPage;
