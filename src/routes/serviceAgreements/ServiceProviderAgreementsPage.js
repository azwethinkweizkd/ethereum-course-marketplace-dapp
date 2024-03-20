import { useToast } from "@chakra-ui/react";
import useEthereum from "../shared/hooks/useEthereum";
import ServiceAgreementsHoc from "../../components/service-agreement-hoc.js/ServiceAgreementsHoc";
import {
	AGREEMENTS,
	GENERAL_TRANSACTIONAL_ERROR,
} from "../../common/constants";
import ServiceAgreement from "../../components/service-agreement/ServiceAgreement";
import PropTypes from "prop-types";

const ServiceProviderAgreements = ({ ...props }) => {
	const { setReload } = props;
	const ethereumApi = useEthereum();

	const toast = useToast();

	async function onStatusChange(agreementAddress, status) {
		return await ethereumApi.current.updateServiceStatus(
			agreementAddress,
			status
		);
	}

	async function onPaymentRequest(agreementAddress) {
		const tx = await ethereumApi.current.transferFundsToProvider(
			agreementAddress
		);

		const receipt = await tx.wait();

		if (receipt.status) {
			setReload(true);
		} else {
			toast({
				title: null,
				description: GENERAL_TRANSACTIONAL_ERROR,
				message: "error",
				duration: 9000,
				isClosable: true,
			});
		}
	}

	return (
		<ServiceAgreement
			{...props}
			onStatusChange={onStatusChange}
			onPaymentRequest={onPaymentRequest}
		/>
	);
};

const ServiceProviderAgreementsPage = ServiceAgreementsHoc(
	ServiceProviderAgreements,
	AGREEMENTS
);

ServiceProviderAgreements.propTypes = {
	setReload: PropTypes.func.isRequired,
};

export default ServiceProviderAgreementsPage;
