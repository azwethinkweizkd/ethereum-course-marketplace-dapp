import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import ServiceAgreementsHoc from "../../components/service-agreement-hoc.js/ServiceAgreementsHoc";
import { CONTRACTS } from "../../common/constants/index";
import ethereumApiFactory from "../../ethereum/ethereumApiFactory";

const ClientContracts = ({ ...props }) => {
	const ethereumApi = useRef({});

	useEffect(() => {
		if (!window || !window.ethereum) return;
		ethereumApi.current = ethereumApiFactory(window.ethereum);
	}, []);

	return <Box></Box>;
};

const ClientContractsPage = ServiceAgreementsHoc(ClientContracts, CONTRACTS);

export default ClientContractsPage;
