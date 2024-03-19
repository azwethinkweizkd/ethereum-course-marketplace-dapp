import { useEffect, useState } from "react";
import {
	AbsoluteCenter,
	Box,
	Button,
	Divider,
	HStack,
	Heading,
	Card,
	CardBody,
	Flex,
	Spinner,
	Text,
	Tag,
	VStack,
	useToast,
} from "@chakra-ui/react";
import { Icon, PhoneIcon, AtSignIcon } from "@chakra-ui/icons";
import { FaEthereum } from "react-icons/fa";
import { CLIENT_APPROVED } from "../../common/constants";
// import {
// 	clientApprovalButtonColor,
// 	contractStatusColor,
// } from "../../../lib/utilities";

const ServiceContract = ({
	agreement,
	onApproval,
	onRating,
	onDeposit,
	onRefund,
}) => {
	const {
		provider,
		agreementAddress,
		clientRating,
		agreementStatus,
		clientApprovalStatusKey,
		agreementFulfilledOrNullified,
		contractBalance,
		agreementStatusKey,
	} = agreement;

	const {
		companyName,
		email,
		phone,
		serviceCategory,
		serviceCategoryKey,
		serviceCost,
	} = provider;

	const [currentRating, setCurrentRating] = useState(clientRating);
	const [submitting, setSubmitting] = useState(false);
	const [approval, setApproval] = useState(clientApprovalStatusKey);
	const [contractStatusLabelColor, setContractStatusLabelColor] =
		useState("grey");
	const [approvalButtonColor, setApprovalButtonColor] = useState("grey");
	const [disapprovalButtonColor, setDisapprovalButtonColor] = useState("grey");

	const toast = useToast();

	useEffect(() => {
		setApproval(clientApprovalStatusKey);
		// const statusColor = contractStatusColor[agreementStatusKey];
		// setContractStatusLabelColor(statusColor);
	}, [agreementStatusKey, clientApprovalStatusKey]);

	useEffect(() => {
		// const { approvalColor, disapprovalColor } =
		// 	clientApprovalButtonColor[approval];
		// setApprovalButtonColor(approvalColor);
		// setDisapprovalButtonColor(disapprovalColor);
	}, [approval]);

	async function onHandlingApproval() {
		setSubmitting(true);
		try {
			const tx = await onApproval(agreementAddress, CLIENT_APPROVED);
			const receipt = await tx.wait();

			if (receipt.status) setApproval(CLIENT_APPROVED);
		} catch (error) {
			toast({
				title: null,
				description:
					"There was an error approving your service contract agreement",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		} finally {
			setSubmitting(false);
		}
	}

	async function onHandlingDeposit() {
		setSubmitting(true);

		try {
			await onDeposit(agreementAddress, serviceCost);
		} catch (error) {
			toast({
				title: null,
				description: "There was an error attempting to deposit funds",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		} finally {
			setSubmitting(false);
		}
	}

	async function onHandlingRefund() {
		setSubmitting(true);

		try {
			await onRefund(agreementAddress);
		} catch (error) {
			toast({
				title: null,
				description: "There was an error refunding the balance",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<>
			{submitting ? (
				<AbsoluteCenter>
					<HStack alignContent="center">
						<Spinner
							thickness="4px"
							speed="0.65s"
							emptyColor="gray.200"
							color="blue.500"
							size="xl"
						/>
						<Heading>Creating contract</Heading>
					</HStack>
				</AbsoluteCenter>
			) : (
				<Box>
					<Card>
						<CardBody>
							<Flex gap={4} align="center" justify="center">
								<VStack textAlign="center">
									<Heading as="h5">{companyName}</Heading>
									<Text>{serviceCategory}</Text>
								</VStack>

								<VStack textAlign="center">
									<HStack alignContent="center">
										<AtSignIcon />
										<Text>{email}</Text>
									</HStack>
									<Divider />
									<HStack alignContent="center">
										<PhoneIcon />
										<Text>{phone}</Text>
									</HStack>
								</VStack>

								<VStack textAlign="center">
									<Heading as="h5">Service Status</Heading>
									<Tag color={contractStatusLabelColor}>{agreementStatus}</Tag>
								</VStack>

								<VStack textAlign="center">
									<Heading as="h5">Service Cost</Heading>
									<Tag>
										<Icon as={FaEthereum} />
										{serviceCost}
									</Tag>
								</VStack>

								<VStack textAlign="center">
									<Heading as="h5">Balance</Heading>
									<Tag>{contractBalance}</Tag>
								</VStack>

								{!agreementFulfilledOrNullified && agreementStatus !== 3 && (
									<HStack textAlign="center">
										<Button
											colorScheme="cyan"
											variant="solid"
											onClick={onHandlingDeposit}
											disabled={agreementFulfilledOrNullified}>
											Deposit
										</Button>
									</HStack>
								)}
								{!agreementFulfilledOrNullified && agreementStatus === 3 && (
									<HStack textAlign="center" colorScheme="pink">
										<Button
											onClick={onHandlingRefund}
											disabled={agreementFulfilledOrNullified}>
											Refund
										</Button>
									</HStack>
								)}
							</Flex>
						</CardBody>
					</Card>
				</Box>
			)}
		</>
	);
};

export default ServiceContract;
