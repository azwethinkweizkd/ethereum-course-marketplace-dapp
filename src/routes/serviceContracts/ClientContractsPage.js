import { useEffect, useRef } from "react";
import { useToast } from "@chakra-ui/react";
import useEthereum from "../shared/hooks/useEthereum";
import ServiceAgreementsHoc from "../../components/service-agreement-hoc.js/ServiceAgreementsHoc";
import ServiceContract from "../../components/service-contracts/ServiceContracts";
import {
	CONTRACTS,
	GENERAL_TRANSACTIONAL_ERROR,
} from "../../common/constants/";
import PropTypes from "prop-types";

const ClientContracts = ({ ...props }) => {
	const { setReload } = props;
	const ethereumApi = useEthereum();

	const toast = useToast();

	async function onDeposit(agreementAddress, funds) {
		const tx = await ethereumApi.current.depositFundsInContract(
			agreementAddress,
			{
				value: ethereumApi.current.parseEther(funds),
			}
		);

		const receipt = await tx.wait();
		if (receipt.status) {
			setReload(true);
		} else {
			toast({
				title: null,
				description: GENERAL_TRANSACTIONAL_ERROR,
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		}
	}

	async function onRefund(agreementAddress) {
		const tx = await ethereumApi.current.depositFundsInContract(
			agreementAddress
		);

		const receipt = await tx.wait();
		if (receipt.status) {
			setReload(true);
		} else {
			toast({
				title: null,
				description: GENERAL_TRANSACTIONAL_ERROR,
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		}
	}

	async function onApproval(agreementAddress, approval) {
		return await ethereumApi.current.updateClientApprovalStatus(
			agreementAddress,
			approval
		);
	}

	async function onRating(agreementAddress, rating) {
		return await ethereumApi.current.rateServiceProvider(
			agreementAddress,
			rating
		);
	}

	return (
		<ServiceContract
			{...props}
			onRating={onRating}
			onApproval={onApproval}
			onRefund={onRefund}
			onDeposit={onDeposit}
		/>
	);
};

ClientContracts.propTypes = {
	setReload: PropTypes.func.isRequired,
};

const ClientContractsPage = ServiceAgreementsHoc(ClientContracts, CONTRACTS);

export default ClientContractsPage;
