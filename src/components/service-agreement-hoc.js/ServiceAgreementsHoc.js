import { useState, useEffect, useRef, useCallback } from "react";
import {
	Box,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Tag,
	useToast,
} from "@chakra-ui/react";
import ethereumApiFactory from "../../ethereum/ethereumApiFactory";
import { useWallet } from "../../common/context/walletProvider";
import { AGREEMENTS, CONTRACTS } from "../../common/constants";

function ServiceAgreementsHoc(ContextComponent, context) {
	function ServiceAgreementsPage() {
		const [activeServiceAgreements, setActiveServiceAgreements] = useState([]);
		const [closedServiceAgreements, setClosedServiceAgreements] = useState([]);
		const [serviceAgreements, setServiceAgreements] = useState([]);
		const [reload, setReload] = useState(false);

		const ethereumApi = useRef({});

		const toast = useToast();

		const { wallet } = useWallet();

		const getServiceAgreementsAddress = useCallback(async () => {
			let addresses = [];

			switch (context) {
				case CONTRACTS:
					addresses = await ethereumApi.current.getClientServiceAgreements(
						wallet?.accounts[0]
					);
					break;

				case AGREEMENTS:
					addresses = await ethereumApi.current.getProviderServiceAgreements(
						wallet?.accounts[0]
					);
					break;
				default:
					console.error("Unsupported context:", context);
					break;
			}
			setReload(true);
			setServiceAgreements(addresses);
		}, [wallet?.accounts]);

		const getServiceAgreementDetails = useCallback(async (addresses) => {
			const serviceAgreements = [];

			for (let i = 0; i < addresses.length; i++) {
				const sa = await ethereumApi.current.getServiceAgreementDetails(
					addresses[i]
				);

				if (!sa) continue;
				const provider = await ethereumApi.current.getServiceProvider(
					sa.providerAddress
				);

				const serviceAgreement = { provider, ...sa };
				serviceAgreements.push(serviceAgreement);
			}

			return serviceAgreements;
		}, []);

		function sortServiceAgreements(serviceAgreements) {
			if (!serviceAgreements.length) return;

			const activeServiceAgreements = serviceAgreements.filter(
				(sa) => !sa.agreementFulfilledOrNullified
			);

			setActiveServiceAgreements(activeServiceAgreements);

			const closedServiceAgreements = serviceAgreements.filter(
				(sa) => sa.agreementFulfilledOrNullified
			);

			setClosedServiceAgreements(closedServiceAgreements);
		}

		useEffect(() => {
			if (!window || !window.ethereum) return;

			ethereumApi.current = ethereumApiFactory(window.ethereum);
		});

		useEffect(() => {
			setActiveServiceAgreements([]);
			setClosedServiceAgreements([]);

			if (!wallet?.accounts || !wallet?.accounts.length) return;

			getServiceAgreementsAddress();
		}, [wallet?.accounts, getServiceAgreementsAddress, reload]);

		useEffect(() => {
			getServiceAgreementDetails(serviceAgreements)
				.then((serviceAgreements) => {
					sortServiceAgreements(serviceAgreements);
				})
				.catch((err) => {
					toast({
						title: null,
						description:
							"There was an error acquiring any service agreements. Please try again later",
						status: "error",
						duration: 9000,
						isClosable: true,
					});
				});
		});

		const panes = [
			{
				menuItem: (
					<Tab key="active">
						Active
						<Tag variant="solid" colorScheme="teal" rounded="full">
							{activeServiceAgreements.length}
						</Tag>
					</Tab>
				),
				render: () => <TabPanel key="active" _active={true}></TabPanel>,
			},
			{
				menuItem: (
					<Tab key="closed">
						Closed
						<Tag variant="solid" colorScheme="teal" rounded="full">
							{closedServiceAgreements.length}
						</Tag>
					</Tab>
				),
				render: () => <TabPanel key="closed"></TabPanel>,
			},
		];

		return (
			<Box width="75%" mx="auto" mt={12}>
				<Tabs>
					<TabList>{panes.map((pane) => pane.menuItem)}</TabList>
					<TabPanels>{panes.map((pane) => pane.render())}</TabPanels>
				</Tabs>
			</Box>
		);
	}

	return ServiceAgreementsPage;
}

export default ServiceAgreementsHoc;
