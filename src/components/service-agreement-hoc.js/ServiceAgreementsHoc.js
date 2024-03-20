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
import useEthereum from "../../routes/shared/hooks/useEthereum";
import Placeholder from "../placeholder/Placeholder";
import ethereumApiFactory from "../../ethereum/ethereumApiFactory";
import { useWallet } from "../../common/context/walletProvider";
import { AGREEMENTS, CONTRACTS } from "../../common/constants";
import PropTypes from "prop-types";
import { uniqueId } from "lodash";

function ServiceAgreementsHoc(ContextComponent, context) {
	function ServiceAgreementsPage() {
		const [activeServiceAgreements, setActiveServiceAgreements] = useState([]);
		const [closedServiceAgreements, setClosedServiceAgreements] = useState([]);
		const [serviceAgreements, setServiceAgreements] = useState([]);
		const [reload, setReload] = useState(false);

		const ethereumApi = useEthereum();

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

			setServiceAgreements(addresses);
		}, [wallet?.accounts, ethereumApi]);

		const getServiceAgreementDetails = useCallback(
			async (addresses) => {
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
			},
			[ethereumApi]
		);

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
		}, [getServiceAgreementDetails, serviceAgreements, toast]);

		const panes = [
			{
				menuItem: (
					<Tab
						key="active"
						fontSize="lg"
						fontWeight="700"
						backgroundColor="white">
						Active
						<Tag
							variant="solid"
							colorScheme="teal"
							rounded="full"
							textAlign="center"
							py={2.5}
							px={4}
							mx={2}
							fontSize="lg"
							fontWeight="700">
							{activeServiceAgreements.length}
						</Tag>
					</Tab>
				),
				render: () => (
					<TabPanel key="active" _active={true}>
						{activeServiceAgreements.length ? (
							activeServiceAgreements.map((sa) => (
								<ContextComponent
									setReload={setReload}
									agreement={sa}
									key={uniqueId}
								/>
							))
						) : (
							<Placeholder state="open" />
						)}
					</TabPanel>
				),
			},
			{
				menuItem: (
					<Tab
						key="closed"
						fontSize="lg"
						fontWeight="700"
						backgroundColor="white">
						Closed
						<Tag
							variant="solid"
							colorScheme="teal"
							rounded="full"
							textAlign="center"
							py={2.5}
							px={4}
							mx={2}
							fontSize="lg"
							fontWeight="700">
							{closedServiceAgreements.length}
						</Tag>
					</Tab>
				),
				render: () => (
					<TabPanel key="closed">
						{closedServiceAgreements.length ? (
							closedServiceAgreements.map((sa) => (
								<ContextComponent
									setReload={setReload}
									agreement={sa}
									key={uniqueId}
								/>
							))
						) : (
							<Placeholder state="closed" />
						)}
					</TabPanel>
				),
			},
		];

		return (
			<Box width="75%" mx="auto" mt={12}>
				<Tabs variant="enclosed">
					<TabList>{panes.map((pane) => pane.menuItem)}</TabList>
					<TabPanels>{panes.map((pane) => pane.render())}</TabPanels>
				</Tabs>
			</Box>
		);
	}

	return ServiceAgreementsPage;
}

ServiceAgreementsHoc.propTypes = {
	ContextComponent: PropTypes.func.isRequired,
	context: PropTypes.string.isRequired,
};

export default ServiceAgreementsHoc;
